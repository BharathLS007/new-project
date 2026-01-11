import { Injectable, signal, computed } from '@angular/core';

export interface Medicine {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  // Computed properties for cart totals
  items = computed(() => this.cartItems());
  totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  totalPrice = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );

  addToCart(medicine: Medicine) {
    const existingItemIndex = this.cartItems().findIndex(
      (item) => item.id === medicine.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      this.cartItems.update((items) => {
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + medicine.quantity,
        };
        return updatedItems;
      });
    } else {
      // Add new item to cart
      this.cartItems.update((items) => [
        ...items,
        {
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          image: medicine.image,
          quantity: medicine.quantity,
        },
      ]);
    }
  }

  removeFromCart(id: string) {
    this.cartItems.update((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  updateCartItemQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    this.cartItems.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }
}