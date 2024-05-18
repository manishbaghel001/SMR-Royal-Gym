import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/database';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
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

  packageId = [
    { name: '1 Months', code: 1 },
    { name: '3 Months', code: 3 },
    { name: '6 Months', code: 6 },
    { name: '1 Year', code: 12 }
  ];
  removeImageHide: boolean = false;
  pendingFeeUsers: any;

  feeDate: Date | undefined;
  dojDate: Date | undefined;
  uid: any;
  selectedFile: File | null = null;
  showLoader: boolean = false;
  searchValue: string | undefined;
  loading: boolean = true;

  @ViewChild('userForm') userForm!: NgForm;

  constructor(private dataService: DataService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.reset()
  }

  removeFile(uid) {
    this.dataService.removeImage(uid);
    this.removeImageHide = false
  }

  edit(product) {
    this.feeDate = new Date(this.convertToDate(product['feedate']))
    this.dojDate = new Date(this.convertToDate(product['doj']))

    product = { ...product, package: this.packageId.find((id => id['name'] == product['package'])) };
    this.userdata = product

    this.removeImageHide = true;
    this.visible = true;
    this.selectedFile = null;
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
        this.dataService.removeImage(uid)
        this.dataService.deleteData(uid)
        this.showLoader = false
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      reject: () => {
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
  reset() {
    this.showLoader = true
    this.loading = true;
    this.dataService.getData()
      .subscribe(data => {
        this.users = data;
        this.users.forEach(ele => {
          ele['package'] = this.packageId.find((id => id['code'] == ele['package']))['name'];
        });
        this.pendingFeeUsers = this.users.filter(object => object.culprit);
        this.loading = false;
        this.showLoader = false;
      });
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
  }

  cancel() {
    this.visible = false
    this.userForm.resetForm();
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

  getUniqueImageUrl(uid: string): string {
    const timestamp = new Date().getTime();
    return `https://firebasestorage.googleapis.com/v0/b/srm-royal-gym.appspot.com/o/${uid}?alt=media&amp;token=70e5f4a4-0df3-4679-80af-1d981835a671&amp;t=${timestamp}`;
  }

  addUser(product) {
    this.showLoader = true;
    if (this.userdata['uid']) {
      this.uid = this.userdata['uid']
    } else {
      this.uid = uuidv4()
    }

    product['package'] = product['package']['code'];

    const feeDateObject = new Date(this.feeDate);
    const dojDataObject = new Date(this.dojDate);
    const nextDateObject = new Date(this.feeDate);
    nextDateObject.setMonth(feeDateObject.getMonth() + product.package);

    product = {
      ...product, uid: this.uid, nextFeeDate: this.convertToStrDate(nextDateObject),
      doj: this.convertToStrDate(dojDataObject), feedate: this.convertToStrDate(feeDateObject),
      culprit: this.isPastOrToday(this.convertToStrDate(nextDateObject))
    }
    this.dataService.setData(product.uid, product);

    if (this.selectedFile != null) {
      this.dataService.uploadImage(this.selectedFile, this.uid).subscribe(
        status => {
          if (status === 'completed') {
            this.reset()
            this.visible = false
            this.userForm.resetForm();
            this.showLoader = false
          }
        },
        error => {
          console.error('Upload failed:', error);
          alert('Image upload failed!');
        }
      );

    } else {
      this.reset()
      this.visible = false
      this.userForm.resetForm();
      this.showLoader = false;
    }
  }

  allUser() {
    this.userTableHdn = true;
  }

  feePendindUser() {
    this.userTableHdn = false;
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

}