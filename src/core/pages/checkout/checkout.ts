import { Component, inject, computed } from '@angular/core';
import { Footer } from '../footer/footer';
import { CartService } from '../../Models/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [Footer, CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private cartService = inject(CartService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  cartItems = this.cartService.items;
  totalItems = this.cartService.totalItems;
  totalPrice = this.cartService.totalPrice;

  shippingForm = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-()\s]{7,20}$/)]],
  });

  isOrdered = false;

  placeOrder() {
    if (this.cartItems().length === 0) return;
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }
    const shipping = this.shippingForm.value;
    console.log('Placing order with shipping:', shipping);
    this.cartService.clearCart();
    this.isOrdered = true;
    setTimeout(() => this.router.navigate(['/orders']), 1200);
  }
}
