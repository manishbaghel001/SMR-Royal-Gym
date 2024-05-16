import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss', '../../../assets/src/style.min.css']
})
export class MainscreenComponent {

  constructor(private authService: AuthService, private router: Router) { }
  admin() {
    this.router.navigate(['/admin'])
  }
}
