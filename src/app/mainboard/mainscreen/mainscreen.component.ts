import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss', '../../../assets/src/style.min.css']
})
export class MainscreenComponent {

  constructor(private el: ElementRef, private router: Router) { }
  activeMenuItem: string | null = null;
  menuOpen = false;
  admin() {
    this.router.navigate(['/admin'])
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
