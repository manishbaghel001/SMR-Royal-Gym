import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../assets/src/style.min.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  @ViewChild('loginForm') loginForm!: NgForm;

  display = 'none';
  displayVerify = 'none';
  email: string = '';
  async ngOnInit() { }

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
      this.authService.forgotPassword(this.email).then((res) => {
        this.displayVerify = 'flex';
        this.display = 'none';
      })
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
      this.authService.signIn(item['email'], item['password']);
    }
  }

}
