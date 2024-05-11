import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SRM Royal Gym';
  showLoader: boolean = false
  constructor(private authService: AuthService) {
    this.authService.getLoaderValue().subscribe(value => {
      this.showLoader = value;
    });
  }
}
