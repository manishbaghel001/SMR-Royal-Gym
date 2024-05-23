import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NetworkStatusService } from 'src/app/services/networkstatus.service';
import { MessageService } from 'primeng/api';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../assets/src/style.min.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService, private networkStatusService: NetworkStatusService) { }

  @ViewChild('loginForm') loginForm!: NgForm;

  display = 'none';
  displayVerify = 'none';
  email: string = '';
  async ngOnInit() { }

  isOnline(): Observable<boolean> {
    return this.networkStatusService.isOnline
  }

  forgotPass() {
    this.display = 'flex'
  }

  closePopup() {
    this.display = 'none'
  }

  verified() {
    this.display = 'none';
    this.displayVerify = 'none';
  }

  forgotPasswordMail() {
    if (this.email == '') {
      alert('Please enter your email.')
    }
    else {
      this.authService.setLoaderValue(true)
      this.isOnline().pipe(
        switchMap(isOnline => {
          if (!isOnline) {
            this.authService.setLoaderValue(false)
            this.messageService.add({ severity: 'error', summary: 'Network Error', detail: 'Internet connection lost' });
            return [];
          } else {
            return this.authService.forgotPassword(this.email)
          }
        }))
        .subscribe({
          next: (results) => {
            this.displayVerify = 'flex';
            this.display = 'none';
            this.authService.setLoaderValue(false)
          },
          error: (error) => {
            this.authService.setLoaderValue(false)
            console.error('Operation failed', error);
            alert('Operation failed');
          },
          complete: () => {
            this.displayVerify = 'flex';
            this.display = 'none';
            this.authService.setLoaderValue(false)
          },
        });
    }
  }

  mainScreen() {
    this.router.navigate(['/main'])
  }

  login(item: any) {
    if (!this.loginForm.valid) {
      alert('Please enter your email and password')
    }
    else {
      this.authService.setLoaderValue(true)
      this.isOnline().pipe(
        switchMap(isOnline => {
          if (!isOnline) {
            this.authService.setLoaderValue(false)
            this.messageService.add({ severity: 'error', summary: 'Network Error', detail: 'Internet connection lost' });
            return [];
          } else {
            return this.authService.signIn(item['email'], item['password']);
          }
        })
      ).subscribe({
        next: (results) => {
          this.authService.setLoaderValue(false)
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
    }
  }

}
