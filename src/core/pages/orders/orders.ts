import { Component,signal } from '@angular/core';
import { Footer } from '../footer/footer';
@Component({
  selector: 'app-orders',
  imports: [Footer],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
medicines = signal([
    { id: 'med1', name: 'Fever Med', price: 5, image: '/images/paramedicine.avif', quantity: 1 },
    { id: 'med2', name: 'Aspirin', price: 3, image: '/images/hospital.avif', quantity: 1 },
    { id: 'med3', name: 'Cough Syrup', price: 8, image: '/images/Syurp.jpg', quantity: 1 },
    { id: 'med4', name: 'Vitamin C', price: 12, image: '/images/tablets.jpg', quantity: 1 },
    { id: 'med1', name: 'Fever Med', price: 5, image: '/images/paramedicine.avif', quantity: 1 },
    { id: 'med2', name: 'Aspirin', price: 3, image: '/images/hospital.avif', quantity: 1 },
    { id: 'med3', name: 'Cough Syrup', price: 8, image: '/images/Syurp.jpg', quantity: 1 },
    { id: 'med4', name: 'Vitamin C', price: 12, image: '/images/tablets.jpg', quantity: 1 }

  ]);

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
}
