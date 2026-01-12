import { Component, signal, inject,NgModule } from '@angular/core';
import { Footer } from "../footer/footer";
import { CartService, Medicine } from '../../Models/cart.service';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [Footer, RouterLink,CommonModule],
})
export class Home {
  private cartService = inject(CartService);
  medicines = signal([
    { id: 'med1', name: 'Fever Med', price: 5, image: '/images/paramedicine.avif', quantity: 1 },
    { id: 'med2', name: 'Aspirin', price: 3, image: '/images/tablets.jpg', quantity: 1 },
    { id: 'med3', name: 'Cough Syrup', price: 8, image: '/images/Syurp.jpg', quantity: 1 },
    { id: 'med4', name: 'Vitamin C tablet', price: 12, image: '/images/tablets.jpg', quantity: 1 },
    { id: 'med5', name: 'Fever Med', price: 5, image: '/images/paramedicine.avif', quantity: 1 },
    { id: 'med6', name: 'Aspirin', price: 3, image: '/images/tablets.jpg', quantity: 1 },
    { id: 'med7', name: 'Cough Syrup', price: 8, image: '/images/Syurp.jpg', quantity: 1 },
    { id: 'med8', name: 'Vitamin C tablet', price: 12, image: '/images/tablets.jpg', quantity: 1 }
  ]
  );
 banners = [
    { img: '/images/tablets.jpg', title: 'Buy Medicines Online', subtitle: 'Fast & Secure Delivery' },
    { img: '/images/paramedicine.avif', title: 'Health Products', subtitle: 'Best Deals on Vitamins' },
    { img: '/images/Syurp.jpg', title: 'Order Now', subtitle: 'Track Your Orders Easily' }
  ];

  currentIndex = 0;
  // Touch / drag state
  private touchStartX: number | null = null;
  private touchCurrentX: number | null = null;
  private isDragging = false;

  // Next slide
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }

  // Previous slide
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  }

  // Auto slide every 5 seconds
  constructor() {
    setInterval(() => this.next(), 5000);
  }

  // Touch handlers for mobile
  onTouchStart(event: TouchEvent) {
    this.isDragging = true;
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging || this.touchStartX === null) return;
    this.touchCurrentX = event.touches[0].clientX;
  }

  onTouchEnd(_event: TouchEvent) {
    if (!this.isDragging || this.touchStartX === null || this.touchCurrentX === null) {
      this.resetTouch();
      return;
    }
    const dx = this.touchCurrentX - this.touchStartX;
    if (dx > 50) {
      this.prev();
    } else if (dx < -50) {
      this.next();
    }
    this.resetTouch();
  }

  // Mouse drag handlers for desktop
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.touchStartX = event.clientX;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || this.touchStartX === null) return;
    this.touchCurrentX = event.clientX;
  }

  onMouseUp(_event: MouseEvent) {
    if (!this.isDragging) return;
    if (this.touchStartX === null || this.touchCurrentX === null) {
      this.resetTouch();
      return;
    }
    const dx = this.touchCurrentX - this.touchStartX;
    if (dx > 50) {
      this.prev();
    } else if (dx < -50) {
      this.next();
    }
    this.resetTouch();
  }

  onMouseLeave(_event: MouseEvent) {
    // if user drags out of container, finalize
    if (this.isDragging) this.onMouseUp(_event as any);
  }

  private resetTouch() {
    this.isDragging = false;
    this.touchStartX = null;
    this.touchCurrentX = null;
  }

  updateQuantity(id: string, change: number) {
    this.medicines.update(items => {
      return items.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          // Return updated object (preventing negative quantities)
          return { ...item, quantity: newQty >= 0 ? newQty : 0 };
        }
        return item;
      });
    });
  }

  addToCart(medicine: Medicine) {
    this.cartService.addToCart(medicine);
    // Optional: Show success message or feedback
    console.log(`${medicine.name} added to cart!`);
  }

  offerImage = '/images/discount.png';


}
