import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AppConfig } from 'src/config';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss', '../../../assets/src/style.min.css']
})
export class MainscreenComponent {

  constructor(private el: ElementRef, private router: Router, private authService: AuthService, private http: HttpClient) { }
  activeMenuItem: string | null = null;
  menuOpen = false;

  isNavbarCollapsed: boolean = false;
  @ViewChild('connectForm') connectForm!: NgForm;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  admin() {
    this.router.navigate(['/admin'])
  }

  connect(item: any) {
    if (!this.connectForm.valid) {
      alert('Please enter your details')
    }
    else {
      this.authService.setLoaderValue(true)
      this.http.post(AppConfig.apiUrl + '/api/mailer/', item)
        .subscribe({
          next: (response) => {
            if (response['status']) {
              this.authService.setLoaderValue(false)
              alert('Email sent successfully')
            }
          },
          error: error => {
            this.authService.setLoaderValue(false)
            alert('Email sending failed')
          }
        });
    }
  }

  scrollTo(section: string): void {
    const element = this.el.nativeElement.querySelector(`#${section}`);

    if (element) {
      this.activeMenuItem = section;
      const yOffset = this.menuOpen ? -285 : -11;
      const xOffset = -60;
      window.scrollTo({ top: element.offsetTop + yOffset + xOffset, behavior: 'smooth' });
    }
  }
}
