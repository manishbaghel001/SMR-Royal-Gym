import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrl: './adminboard.component.css'
})

export class AdminboardComponent implements OnInit {
  mode = true
  constructor(private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
  }

  logout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to logout from portal?',
      header: 'Logout Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.authService.logout()
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Logout Confirm' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

}