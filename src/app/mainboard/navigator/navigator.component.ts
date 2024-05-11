import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent {
  constructor(private el: ElementRef, private router: Router) { }

  menuOpen = false;
  mode = true;
  menuItems = [
    { label: 'Home', link: 'footer' },
    { label: 'Personal Information', link: 'personal' },
    { label: 'Education', link: 'education' },
    { label: 'Work Experience', link: 'experience' },
    { label: 'Professional Skills', link: 'skills' },
    { label: 'Contacts', link: 'contact' },
    { label: 'Admin', link: 'login' },
  ];

  activeMenuItem: string | null = null;

  darkMode() {

  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

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
