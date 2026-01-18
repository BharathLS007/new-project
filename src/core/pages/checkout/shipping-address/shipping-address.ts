import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault?: boolean;
}

@Component({
  selector: 'app-shipping-address',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping-address.html',
  styleUrl: './shipping-address.css',
})
export class ShippingAddressComponent {
  private fb = inject(FormBuilder);

  savedAddresses = input<Address[]>([]);
  selectedAddress = input<Address | null>(null);
  
  addressSelected = output<Address>();
  addressAdded = output<Address>();
  addressDeleted = output<string>();

  showForm = false;
  editingId: string | null = null;

  addressForm = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-()\s]{7,20}$/)]],
    isDefault: [false],
  });

  selectAddress(addr: Address): void {
    this.addressSelected.emit(addr);
    this.showForm = false;
  }

  openForm(addr?: Address): void {
    if (addr) {
      this.editingId = addr.id;
      this.addressForm.patchValue(addr);
    } else {
      this.editingId = null;
      this.addressForm.reset({ isDefault: false });
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.addressForm.reset({ isDefault: false });
  }

  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const formValue = this.addressForm.value;
    const newAddress: Address = {
      id: this.editingId || 'addr-' + Date.now(),
      name: formValue.name || '',
      address: formValue.address || '',
      city: formValue.city || '',
      phone: formValue.phone || '',
      isDefault: formValue.isDefault || false,
    };

    this.addressAdded.emit(newAddress);
    this.closeForm();
    this.selectAddress(newAddress);
  }

  deleteAddress(id: string): void {
    this.addressDeleted.emit(id);
  }

  getAddressPreview(addr: Address): string {
    return `${addr.name}, ${addr.address}, ${addr.city}`;
  }
}
