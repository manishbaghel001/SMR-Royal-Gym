import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  constructor(private authService: AuthService) { }
  email: string = '';

  forgotPasswordMail() {
    this.authService.forgotPassword(this.email)
  }

}
