import { Component, inject, computed } from '@angular/core';
import { Footer } from '../../shared/components/footer/footer';
import { CartService, CartItem } from '../../shared/modles/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [Footer, CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],   // ✅ should be styleUrls (array), not styleUrl
})
export class Cart {
  private cartService = inject(CartService);

  // Get cart items from service
  cartItems = this.cartService.items;
  totalItems = this.cartService.totalItems;
  totalPrice = this.cartService.totalPrice;

  // Check if cart is empty
  isEmpty = computed(() => this.cartItems().length === 0);

  // Update item quantity
  updateQuantity(id: string, quantity: number) {
    this.cartService.updateCartItemQuantity(id, quantity);
  }

  // Remove item from cart
  removeFromCart(id: string) {
    this.cartService.removeFromCart(id);
  }

  // Clear entire cart
  clearCart() {
    const items = this.cartItems();
    items.forEach((it) => this.cartService.removeFromCart(it.id));
  }

  // Increment quantity
  incrementQuantity(id: string) {
    const item = this.cartItems().find(item => item.id === id);
    if (item) {
      this.updateQuantity(id, item.quantity + 1);
    }
  }

  // Decrement quantity
  decrementQuantity(id: string) {
    const item = this.cartItems().find(item => item.id === id);
    if (item && item.quantity > 1) {
      this.updateQuantity(id, item.quantity - 1);
    }
  }
}