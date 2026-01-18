import { Component, inject, signal, effect } from '@angular/core';
import { Footer } from '../footer/footer';
import { CartService } from '../../Models/cart.service';
import { ShippingAddressComponent, Address } from './shipping-address/shipping-address';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [Footer, CommonModule, ReactiveFormsModule, RouterLink, FormsModule, ShippingAddressComponent],
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

  currentStep = 1;
  isOrdered = false;
  orderNumber = '';
  selectedPaymentMethod = 'Credit Card';
  estimatedDeliveryDate = this.getEstimatedDelivery();

  // Address management
  savedAddresses = signal<Address[]>([]);
  selectedAddress = signal<Address | null>(null);

  constructor() {
    // Load saved addresses from localStorage
    this.loadAddresses();
  }

  loadAddresses(): void {
    const saved = localStorage.getItem('userAddresses');
    if (saved) {
      this.savedAddresses.set(JSON.parse(saved));
    }
  }

  saveAddressesToStorage(): void {
    localStorage.setItem('userAddresses', JSON.stringify(this.savedAddresses()));
  }

  onAddressSelected(address: Address): void {
    this.selectedAddress.set(address);
  }

  onAddressAdded(address: Address): void {
    const addresses = this.savedAddresses();
    const existingIndex = addresses.findIndex(a => a.id === address.id);
    
    if (existingIndex >= 0) {
      addresses[existingIndex] = address;
    } else {
      addresses.push(address);
    }
    
    this.savedAddresses.set([...addresses]);
    this.saveAddressesToStorage();
    this.selectedAddress.set(address);
  }

  onAddressDeleted(id: string): void {
    const filtered = this.savedAddresses().filter(a => a.id !== id);
    this.savedAddresses.set(filtered);
    this.saveAddressesToStorage();
    
    if (this.selectedAddress()?.id === id) {
      this.selectedAddress.set(filtered.length > 0 ? filtered[0] : null);
    }
  }

  isAddressComplete(): boolean {
    return this.selectedAddress() !== null && this.cartItems().length > 0;
  }

  getEstimatedDelivery(): string {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.isAddressComplete()) {
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.currentStep = 3;
    } else if (this.currentStep === 3) {
      this.currentStep = 4;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  placeOrder(): void {
    if (this.cartItems().length === 0) return;
    if (!this.selectedAddress()) {
      alert('Please select a shipping address');
      return;
    }

    const address = this.selectedAddress();
    console.log('Placing order with address:', address);
    console.log('Payment method:', this.selectedPaymentMethod);

    this.orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    this.cartService.clearCart();
    this.isOrdered = true;

    setTimeout(() => this.router.navigate(['/orders']), 2000);
  }
}
