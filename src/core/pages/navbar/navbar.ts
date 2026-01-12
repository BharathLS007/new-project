import { Component, HostListener, inject } from '@angular/core';
import { RouterLink ,RouterLinkActive  } from "@angular/router";
import { CommonModule } from '@angular/common';
import { CartService } from '../../Models/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink,RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
 menuOpen = false;
 isScrolled = false;
 cartService = inject(CartService);

@HostListener('window:scroll', [])
 onWindowScroll() {
  this.isScrolled = window.scrollY > 50;
 }
 toggleMenu() {
  this.menuOpen = !this.menuOpen;
 }
 closeMenu() {
    this.menuOpen = false;
  }
}
