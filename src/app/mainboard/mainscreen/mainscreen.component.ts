import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NetworkStatusService } from 'src/app/services/networkstatus.service';
import { AppConfig } from 'src/config';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss', '../../../assets/src/style.min.css']
})
export class MainscreenComponent {

  constructor(private el: ElementRef, private router: Router, private authService: AuthService, private http: HttpClient, private messageService: MessageService, private networkStatusService: NetworkStatusService) { }
  activeMenuItem: string | null = null;
  menuOpen = false;

  isNavbarCollapsed: boolean = false;
  @ViewChild('connectForm') connectForm!: NgForm;
  currentIndex = 0;
  currentIndexTest = 0;
  connectSub: Subscription;

  items = [
    { src: '../../../assets/carousel-1.jpg', alt: 'Image 1', title: 'Best Gym In Town', subtitle: 'Gym & Fitness Center' },
    { src: '../../../assets/carousel-2.jpg', alt: 'Image 2', title: 'Get Body In Shape', subtitle: 'Gym & Fitness Center' }
  ];

  itemsTest = [
    { src: '../../../assets/testimonial-1.png', alt: 'Image 1', name: 'Muhammad PK', prof: 'Local Guide', desc: 'SMR Royal Gym in Doddathoguru, Electronic City is a great place to get fit and stay healthy. The gym has a wide variety of equipment, from free weights to cardio machines.' },
    { src: '../../../assets/testimonial-2.png', alt: 'Image 2', name: 'Pranav Vardhan', prof: 'Software Developer', desc: 'The best gym around the area. The space is a bit small but it has most of the equipments needed. The trainers are good and friendly.' },
    { src: '../../../assets/testimonial-3.png', alt: 'Image 2', name: 'Megha Murali', prof: 'Lawyer', desc: 'Its a really good gym.i got personal training from Murali.he is a good trainer.i had a great transformation.thank you to Murali & team..keep up the good work!' },
  ];

  ngOnDestroy() {
    if (this.connectSub) {
      this.connectSub.unsubscribe();
    }
  }

  onKeyPress(event: KeyboardEvent) {
    const char = String.fromCharCode(event.charCode);
    const isNumeric = char !== '' && !isNaN(Number(char));

    // Allow backspace, delete, tab, arrows, and escape keys
    const allowedKeys = [8, 46, 9, 37, 38, 39, 40, 27];

    if (!isNumeric && !allowedKeys.includes(event.charCode)) {
      event.preventDefault(); // Prevent non-numeric characters from being entered
    }
  }

  isOnline(): Observable<boolean> {
    return this.networkStatusService.isOnline
  }


  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  admin() {
    this.authService.setLoaderValue(false)
    this.router.navigate(['/admin'])
  }

  connect(form: any) {
    if (!this.connectForm.valid) {
      alert('Please enter your details')
    }
    else {
      this.authService.setLoaderValue(true)
      this.connectSub = this.isOnline().pipe(
        switchMap(isOnline => {
          if (!isOnline) {
            this.authService.setLoaderValue(false)
            this.messageService.add({ severity: 'error', summary: 'Network Error', detail: 'Internet connection lost' });
            return [];
          } else {
            this.http.post(AppConfig.apiUrl + '/api/mailer/', form)
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
            return []
          }
        })
      ).subscribe({
        next: (response) => {
          if (response['status']) {
            this.authService.setLoaderValue(false)
            alert('Email sent successfully')
          }
        },
        error: (error) => {
          this.authService.setLoaderValue(false)
          alert('Email sending failed')
        },
        complete: () => {
          this.authService.setLoaderValue(false)
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
