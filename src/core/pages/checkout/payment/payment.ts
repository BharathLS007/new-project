import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethod } from '../../../Models/order.model';
import { OrderService } from '../../../Models/order.service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class PaymentComponent {
  private orderService = inject(OrderService);

  paymentMethods = input<PaymentMethod[]>([]);
  selectedPaymentMethod = input<string>('COD');
  totalAmount = input<number>(0);

  paymentMethodSelected = output<string>();
  paymentCompleted = output<{ method: string; transactionId: string }>();

  processingPayment = signal(false);
  paymentError = signal('');

  selectPaymentMethod(methodId: string): void {
    this.paymentMethodSelected.emit(methodId);
  }

  processPayment(methodId: string): void {
    if (methodId === 'COD') {
      // Cash on Delivery - Process immediately
      this.processCOD();
    } else if (methodId === 'RAZORPAY') {
      // Razorpay - Simulate payment
      this.processRazorpay();
    } else {
      // Other payment methods
      this.processOtherPayment(methodId);
    }
  }

  private processCOD(): void {
    this.processingPayment.set(true);
    this.paymentError.set('');

    // Simulate processing
    setTimeout(() => {
      const transactionId = 'COD-' + Date.now();
      this.processingPayment.set(false);
      this.paymentCompleted.emit({
        method: 'COD',
        transactionId,
      });
    }, 1500);
  }

  private processRazorpay(): void {
    this.processingPayment.set(true);
    this.paymentError.set('');

    // In real implementation, this would integrate with Razorpay API
    // For now, we simulate the payment
    console.log('Redirecting to Razorpay...');
    
    // Simulate Razorpay payment
    setTimeout(() => {
      // In real app, Razorpay callback would trigger this
      const transactionId = 'RAZORPAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      this.processingPayment.set(false);
      this.paymentCompleted.emit({
        method: 'RAZORPAY',
        transactionId,
      });
    }, 2500);
  }

  private processOtherPayment(methodId: string): void {
    this.processingPayment.set(true);
    this.paymentError.set('');

    // Simulate payment processing
    setTimeout(() => {
      const transactionId = methodId + '-' + Date.now();
      this.processingPayment.set(false);
      this.paymentCompleted.emit({
        method: methodId,
        transactionId,
      });
    }, 2000);
  }

  getPaymentMethodDetails(methodId: string): PaymentMethod | undefined {
    return this.paymentMethods().find(m => m.id === methodId);
  }

  getStatusMessage(): string {
    if (this.selectedPaymentMethod() === 'COD') {
      return 'Place your order with Cash on Delivery';
    } else if (this.selectedPaymentMethod() === 'RAZORPAY') {
      return 'Secure payment with Razorpay';
    }
    return 'Complete your payment';
  }
}
