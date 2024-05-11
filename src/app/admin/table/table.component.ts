import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/database';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})

export class TableComponent implements OnInit {
  users: any;
  first = 0;
  rows = 10;

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

}