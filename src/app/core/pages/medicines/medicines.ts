import { Component ,computed,signal} from '@angular/core';
 import { Footer } from "../../shared/components/footer/footer";
@Component({
  selector: 'app-medicines',
  imports: [Footer],
  templateUrl: './medicines.html',
  styleUrl: './medicines.css',
})
export class Medicines {

}


@Component({
selector: 'app-medlist', imports: [Footer], templateUrl: './medlist.html', styleUrl: './medlist.css',
})
export class Medlist { medicines = signal([
{ id: 'med1', name: 'Fever Med', price: 5, image: '/images/paramedicine.avif', quantity: 1 },
{ id: 'med2', name: 'Aspirin', price: 3, image: '/images/tablets.jpg', quantity: 1 },
{ id: 'med3', name: 'Cough Syrup', price: 8, image: '/images/Syurp.jpg', quantity: 1 },
{ id: 'med4', name: 'Vitamin C tablet', price: 12, image: '/images/tablets.jpg', quantity: 1 },
{ id: 'med5', name: 'Fever Med', price: 5, image: '/images/paramedicine.avif', quantity: 1 },
{ id: 'med6', name: 'Aspirin', price: 3, image: '/images/tablets.jpg', quantity: 1 },
{ id: 'med7', name: 'Cough Syrup', price: 8, image: '/images/Syurp.jpg', quantity: 1 },
 
{ id: 'med8', name: 'Vitamin C tablet', price: 12, image: '/images/tablets.jpg', quantity: 1 }

]);

updateQuantity(id: string, change: number) { this.medicines.update(items => {
return items.map(item => { if (item.id === id) {
const newQty = item.quantity + change;
// Return updated object (preventing negative quantities) return { ...item, quantity: newQty >= 0 ? newQty : 0 };
}
return item;
});
});
}
searchQuery = signal('');

filteredMedicines = computed(() => {
const query = this.searchQuery().toLowerCase(); return this.medicines().filter(med =>
med.name.toLowerCase().includes(query)
);
});

onSearchInput(event: Event) {
const target = event.target as HTMLInputElement; this.searchQuery.set(target.value);
}

onSearch() {
// Search is handled automatically by the computed signal
// This method can be used for additional search logic if needed
}
}
