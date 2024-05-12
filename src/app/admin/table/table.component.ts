import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/database';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { FileUploadEvent } from 'primeng/fileupload';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})

export class TableComponent implements OnInit {
  users: any;
  first = 0;
  rows = 10;

  mode: true
  userdata: any = {
    aadhar: '',
    address: '',
    advance: '',
    doj: '',
    fee: '',
    id: '',
    name: '',
    phone: '',
    uid: ''
  };
  uid: any;
  visible: boolean = false;
  packageId = [
    { name: '1 Months', code: '1 Months' },
    { name: '3 Months', code: '3 Months' },
    { name: '6 Months', code: '6 Months' },
    { name: '1 Year', code: '1 Year' }
  ];

  @ViewChild('userForm') userForm!: NgForm;
  imageUrl: string;

  constructor(private authService: AuthService, private dataService: DataService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.authService.setLoaderValue(true)
    this.dataService.getData()
      .subscribe(data => {
        this.users = data;
        this.authService.setLoaderValue(false)
      });
  }

  onEdit(uid) {
    this.authService.setLoaderValue(true)
    let user = this.users.find(user => user.uid === uid)
    this.dataService.setData(uid, user)
    this.authService.setLoaderValue(false)
  }

  edit(product) {
    console.log(product, "klklkll");
    this.userdata = product

    this.visible = true
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
        this.authService.setLoaderValue(true)
        this.dataService.deleteData(uid)
        this.authService.setLoaderValue(false)
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
    this.authService.setLoaderValue(true)
    this.dataService.getData()
      .subscribe(data => {
        this.users = data;
        this.authService.setLoaderValue(false)
      });
  }

  newUser() {
    this.visible = true;
  }

  cancel() {
    this.visible = false
    this.userForm.resetForm();
  }

  addUser(userdata) {
    this.authService.setLoaderValue(true)
    userdata['package'] = userdata['package']['name']
    userdata = { ...userdata, uid: this.uid }
    this.userdata = userdata
    this.dataService.setData(userdata.uid, userdata)
    this.visible = false
    this.userForm.resetForm();
    this.authService.setLoaderValue(false)
  }

  newUser1() {
    this.dataService.getImageUrl(this.uid)
      .subscribe(url => {
        this.imageUrl = url;
      });
  }

  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uid = uuidv4()
      this.dataService.uploadImage(file, this.uid);
    }
  }

}