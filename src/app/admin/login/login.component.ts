import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  @ViewChild('loginForm') loginForm!: NgForm;
  passwordToggle: boolean = false
  phoneNumber: any;
  displayPhoneModal: string = 'none'

  async ngOnInit() {

  }

  openModal() {
    this.displayPhoneModal = 'flex'
  }
  closeModal() {
    this.displayPhoneModal = 'none'
  }
  login(item: any) {
    if (!this.loginForm.valid) {
      alert('Please enter your email and password')
    }
    else {
      this.authService.signIn(item['email'], item['password']);
      // this.authService.register(item['email'], item['password']);
    }
  }

  forgotPass() {
    this.router.navigate(['/forgot-password'])
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    if (passwordInput['type'] === "password") {
      passwordInput['type'] = "text";
      this.passwordToggle = false;
    } else {
      passwordInput['type'] = "password";
      this.passwordToggle = true;
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
  }

  signInWithGithub() {
    this.authService.signInWithGithub()
  }

}
