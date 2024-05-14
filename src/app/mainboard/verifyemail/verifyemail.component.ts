import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent {
  email: string | null = null;
  constructor(private authService: AuthService) {
    this.email = history.state.email
  }

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.email = user['email'];
      } else {
        this.email = this.email
      }
    })
  }
}
