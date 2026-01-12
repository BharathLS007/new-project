import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Footer } from '../footer/footer';
@Component({
  selector: 'app-contactus',
  imports: [Footer, ReactiveFormsModule, CommonModule],
  templateUrl: './contactus.html',
  styleUrl: './contactus.css',
})
export class Contactus {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  isInvalid(control: string): boolean {
    const field = this.contactForm.get(control);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Contact Form Data:', this.contactForm.value);
      alert('Message sent successfully!');
      this.contactForm.reset();
    }
  }
}
