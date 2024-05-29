import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/database';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Observable, Subscription, forkJoin, switchMap } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NetworkStatusService } from 'src/app/services/networkstatus.service';
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponent implements OnInit {
  users: any;
  first = 0;
  rows = 10;
  userdata: any = {};

  visible: boolean = false;
  userTableHdn: boolean = false;
  updateBtnHdn: boolean = false;
  editMode: boolean = false

  packageId = [
    { name: '1 Months', code: 1 },
    { name: '3 Months', code: 3 },
    { name: '6 Months', code: 6 },
    { name: '1 Year', code: 12 }
  ];
  removeImageHide: boolean = false;
  feeDate: Date | undefined;
  dojDate: Date | undefined;
  uid: any;
  selectedFile: File | null = null;
  showLoader: boolean = false;
  searchValue: string | undefined;
  loading: boolean = true;
  imageUploaded: boolean = false;
  fileUpload: any;
  removeImage: Subscription;
  forkJoin: Subscription;
  getData: Subscription;
  forkJoinAddUser: Subscription;
  selectedProducts: [];
  cols: any[];
  pendingCols: any[];

  exportColumns: any[];
  exportPendingColumns: any[];

  @ViewChild('userForm') userForm!: NgForm;

  dateTime = new Date();

  constructor(private imageCompress: NgxImageCompressService, private dataService: DataService, private confirmationService: ConfirmationService, private messageService: MessageService, private networkStatusService: NetworkStatusService) {
    this.dateTime.setDate(this.dateTime.getDate());
  }

  ngOnDestroy() {
    if (this.removeImage) {
      this.removeImage.unsubscribe();
    }
    if (this.forkJoin) {
      this.forkJoin.unsubscribe();
    }
    if (this.getData) {
      this.getData.unsubscribe();
    }
    if (this.forkJoinAddUser) {
      this.forkJoinAddUser.unsubscribe();
    }
  }

  exportPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4');
    const storage = getStorage();

    const imageDataPromises = this.users.map(user => {
      const storageRef = ref(storage, user.photo);
      return getDownloadURL(storageRef).then(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            try {
              const imageDataURL = canvas.toDataURL('image/jpeg');
              resolve(imageDataURL);
            } catch (error) {
              console.error('Failed to get image data URL:', error);
              resolve(null);
            }
          };
          img.onerror = () => {
            console.error('Image failed to load:', user.photo);
            reject(new Error('Image failed to load'));
          };
        });
      }).catch(error => {
        console.error('Failed to get download URL:', error);
        return null;
      });
    });

    Promise.all(imageDataPromises).then(imageData => {
      // let gh = "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      // doc.addImage(gh, 'JPEG', 10, doc.internal.pageSize.height - 40, 30, 30);
      doc.setFontSize(5);
      autoTable(doc, {
        startY: 20,
        columns: this.userTableHdn ? this.exportColumns : this.exportPendingColumns,
        body: this.users.map((user, index) => ({
          ...user,
          photo: imageData[index] || 'data:image/jpeg;base64,...',
        })),
      });
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      let date = mm + '-' + dd + '-' + yyyy;
      if (this.userTableHdn) {
        doc.save('Pending_Fee_Clients_' + date + '.pdf');
      } else {
        doc.save('All_Clients_' + date + '.pdf');
      }
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  }

  // exportExcel() {
  //   import("xlsx").then(xlsx => {
  //     const worksheet = xlsx.utils.json_to_sheet(this.users);
  //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     this.saveAsExcelFile(excelBuffer, "products");
  //   });
  // }

  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   let EXCEL_EXTENSION = '.xlsx';
  //   const data: Blob = new Blob([buffer], {
  //     type: EXCEL_TYPE
  //   });
  //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  // }

  isOnline(): Observable<boolean> {
    return this.networkStatusService.isOnline
  }

  ngOnInit(): void {
    this.reset();
    this.cols = [
      { field: "id", header: "ID No" },
      { field: "name", header: "Name" },
      { field: "phone", header: "Phone Number" },
      { field: "aadhar", header: "Aadhar Card" },
      { field: "address", header: "Address" },
      { field: "doj", header: "Date of Joining" },
      { field: "advance", header: "Advance" },
      { field: "fee", header: "Fee" },
      // {
      //   field: 'photo',
      //   header: 'Photo',
      // },
    ];

    this.pendingCols = [
      { field: "id", header: "ID No" },
      { field: "name", header: "Name" },
      { field: "phone", header: "Phone Number" },
      { field: "feedate", header: "Fee Date" },
      { field: "package", header: "Package" },
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));

    this.exportPendingColumns = this.pendingCols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  reset(): void {
    this.showLoader = true
    this.loading = true;
    this.getData = this.isOnline().pipe(
      switchMap(isOnline => {
        if (!isOnline) {
          this.messageService.add({ severity: 'error', summary: 'Network Error', detail: 'Internet connection lost' });
          this.showLoader = false;
          return [];
        } else {
          return this.dataService.getData();
        }
      })
    ).
      subscribe({
        next: (data) => {
          this.users = data;
          this.users.forEach(ele => {
            ele['package'] = this.packageId.find((id => id['code'] == ele['package']))['name'];
          });
          if (!this.userTableHdn) {
            this.users = this.users.filter(object => object.culprit);
          }
          this.loading = false;
          this.showLoader = false;
        },
        error: (error) => {
          this.showLoader = false;
          console.log(error, "Fetch Data failed");
          alert('Getting issues while fetching data.')
        }
      });
  }

  removeFile() {
    this.removeImageHide = false;
    this.selectedFile = null;
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  edit(product) {
    this.feeDate = new Date(this.convertToDate(product['feedate']))
    this.dojDate = new Date(this.convertToDate(product['doj']))
    this.editMode = !this.userTableHdn;

    product = { ...product, package: this.packageId.find((id => id['name'] == product['package'])) };
    this.userdata = product

    this.removeImageHide = true;
    this.visible = true;
    this.selectedFile = null;
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  delete(event: Event, uid) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.showLoader = true

        this.forkJoin = this.isOnline().pipe(
          switchMap(isOnline => {
            if (!isOnline) {
              this.messageService.add({ severity: 'error', summary: 'Network Error', detail: 'Internet connection lost' });
              this.showLoader = false;
              return [];
            } else {
              return forkJoin({
                deleteData: this.dataService.deleteData(uid),
                removeImage: this.dataService.removeImage(uid)
              })
            }
          })
        )
          .subscribe({
            next: (results) => {
              this.messageService.add({ severity: 'error', summary: 'Confirmed', detail: 'Record deleted' });
            },
            error: (error) => {
              this.showLoader = false;
              console.error('Operation failed', error);
              alert('Operation failed');
            },
            complete: () => {
              this.showLoader = false;
            }
          });
      },
      reject: () => {
        this.showLoader = false;
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

  getSeverity(product: string) {
    switch (product['id']) {
      case '8900':
        return 'success';
      case '9':
        return 'warning';
      case '0':
        return 'danger';
    }
    return null
  }

  pageChange(event) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.users ? this.first === this.users.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.users ? this.first === 0 : true;
  }

  newUser() {
    this.userdata = {};
    this.visible = true;
    this.updateBtnHdn = true;
    this.feeDate = undefined;
    this.dojDate = undefined;
    this.removeImageHide = false;
    this.selectedFile = null;
    this.uid = undefined;
    this.editMode = false;
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  cancel() {
    this.visible = false
    this.selectedFile = null;
    this.userForm.resetForm();
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  convertToDate(inputDateString) {
    const [day, month, year] = inputDateString.split('/').map(Number);
    const fullYear = year + 2000;
    const dateObject = new Date(fullYear, month - 1, day);
    const formattedDateString = dateObject.toString();
    return formattedDateString
  }

  isPastOrToday(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    const givenDate = new Date(year + 2000, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today >= givenDate;
  }

  convertToStrDate(dateObject) {
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = String(dateObject.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  compressFile(image: File, uid) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (event) => {
      const imageDataUrl = event.target.result as string;

      this.compressImage(imageDataUrl, image.name, uid);
    };
  }

  compressImage(imageDataUrl: string, fileName: string, uid) {
    const quality = 50;
    const maxWidth = 800;
    const maxHeight = 800;

    this.imageCompress.compressFile(imageDataUrl, -1, quality, quality, maxWidth, maxHeight).then(
      async (result: string) => {
        let compressedFile = this.dataURLtoFile(result, fileName);
        while (compressedFile.size > 100 * 1024) {
          result = await this.imageCompress.compressFile(result, -1, quality / 2, quality / 2, maxWidth, maxHeight);
          compressedFile = this.dataURLtoFile(result, fileName);
        }
        this.selectedFile = compressedFile
        if (!this.imageUploaded && this.selectedFile != null) {
          this.dataService.uploadImage(this.selectedFile, uid)
        }
      }
    );
  }

  dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  addUser(product) {

    if (!this.userForm.valid) {
      alert('Please fill the form completly.')
      return;
    }
    else if (this.selectedFile == null && !this.removeImageHide) {
      this.showLoader = false;
      alert("Please select image.")
      return;
    }
    if (this.userdata['uid']) {
      this.uid = this.userdata['uid']
    } else {
      this.uid = uuidv4()
    }

    if (this.uid) {
      this.showLoader = true;

      product['package'] = product['package']['code'];

      const feeDateObject = new Date(this.feeDate);
      const dojDataObject = new Date(this.dojDate);
      const nextDateObject = new Date(this.feeDate);
      nextDateObject.setMonth(feeDateObject.getMonth() + product.package);

      const timestamp = new Date().getTime();
      let photoUrl = 'https://firebasestorage.googleapis.com/v0/b/srm-royal-gym.appspot.com/o/' + this.uid + '?alt=media&amp;token=70e5f4a4-0df3-4679-80af-1d981835a671&amp;t=' + timestamp

      product = {
        ...product, uid: this.uid, photo: photoUrl, nextFeeDate: this.convertToStrDate(nextDateObject),
        doj: this.convertToStrDate(dojDataObject), feedate: this.convertToStrDate(feeDateObject),
        culprit: this.isPastOrToday(this.convertToStrDate(nextDateObject))
      }

      if (this.selectedFile != null && !this.imageUploaded) {
        this.compressFile(this.selectedFile, this.uid)
      }

      setTimeout(() => {
        this.forkJoinAddUser = this.isOnline().pipe(
          switchMap(isOnline => {
            if (!isOnline) {
              this.messageService.add({ severity: 'error', summary: 'Network Error', detail: 'Internet connection lost' });
              this.showLoader = false;
              return [];
            } else {
              return this.dataService.setData(this.uid, product)
            }
          })
        )
          .subscribe({
            next: (results) => {
              if (this.userdata['uid']) {
                if (this.userdata['culprit'] != product['culprit']) {
                  if (product['culprit'] == false) {
                    this.messageService.add({ severity: 'success', summary: 'Confirm Fee', detail: 'Fee paid for this client' });
                  }
                  else if (product['culprit'] == true) {
                    this.messageService.add({ severity: 'warn', summary: 'Fee Update', detail: 'Fee pending for this client' });
                  }
                } else {
                  this.messageService.add({ severity: 'info', summary: 'Client Updated', detail: 'Client Details Updated' });
                }
              }
              else {
                this.messageService.add({ severity: 'info', summary: 'Client Added', detail: 'New Client Added' });
              }
              this.selectedFile = null;
              this.visible = false;
              if (this.fileUpload) {
                this.fileUpload.clear();
              }
              this.userForm.resetForm();
              this.showLoader = false;
            },
            error: (error) => {
              this.showLoader = false;
              console.error('Client add failed!', error);
              alert('Client add failed!');
            }
          });
      }, 2000);

    }
  }

  allUser() {
    this.userTableHdn = true;
    this.reset()
  }

  feePendindUser() {
    this.userTableHdn = false;
    this.users = this.users.filter(object => object.culprit);
  }

  onFileSelect(event: any, fileUpload) {
    this.selectedFile = event.currentFiles.length != 0 ? event.currentFiles[0] : null;
    this.fileUpload = fileUpload
  }

}