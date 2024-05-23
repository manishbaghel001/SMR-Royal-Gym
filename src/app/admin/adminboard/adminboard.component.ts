import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { NetworkStatusService } from 'src/app/services/networkstatus.service';

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrl: './adminboard.component.css'
})

export class AdminboardComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService, private networkStatusService: NetworkStatusService) { }

  ngOnInit() {
    this.authService.setLoaderValue(false)
  }

  isOnline(): Observable<boolean> {
    return this.networkStatusService.isOnline
  }

  mainScreen() {
    this.router.navigate(['/main'])
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
        this.authService.setLoaderValue(true)
        this.isOnline().pipe(
          switchMap(isOnline => {
            if (!isOnline) {
              this.authService.setLoaderValue(false)
              this.messageService.add({ severity: 'error', summary: 'Network Error', detail: 'Internet connection lost' });
              return [];
            } else {
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Logout Confirm' });
              return this.authService.logout()
            }
          })
        ).subscribe({
          next: (results) => {
          },
          error: (error) => {
            this.authService.setLoaderValue(false)
            console.error('Operation failed', error);
            alert('Operation failed');
          },
          complete: () => {
            this.authService.setLoaderValue(false)
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

}