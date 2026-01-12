import { Component, inject, computed } from '@angular/core';
import { Footer } from '../footer/footer';
import { CartService } from '../../Models/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [Footer, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private cartService = inject(CartService);
  private router = inject(Router);

  cartItems = this.cartService.items;
  totalItems = this.cartService.totalItems;
  totalPrice = this.cartService.totalPrice;

  isOrdered = false;

  placeOrder() {
    if (this.cartItems().length === 0) return;
    // In a real app we'd call an API here. For now clear cart and show confirmation.
    this.cartService.clearCart();
    this.isOrdered = true;
    // Optionally navigate to orders page after a short delay
    setTimeout(() => this.router.navigate(['/orders']), 1200);
  }
}
