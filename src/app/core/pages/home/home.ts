import { Component,signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home { medicines = signal([
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

updateQuantity(id: string, change: number) { this.medicines.update(items => {
return items.map(item => { if (item.id === id) {
const newQty = item.quantity + change;
// Return updated object (preventing negative quantities) return { ...item, quantity: newQty >= 0 ? newQty : 0 };
}
return item;
});
});
}

offerImage ='/images/discount.png';

}
