import { Injectable, signal } from '@angular/core';
import { Order, TrackingUpdate, PaymentMethod } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders = signal<Order[]>([]);
  private currentUserId = 'USER_' + Date.now(); // Simple user ID for demo

  paymentMethods: PaymentMethod[] = [
    {
      id: 'COD',
      name: 'COD',
      displayName: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when your order arrives',
      available: true,
    },
    {
      id: 'RAZORPAY',
      name: 'RAZORPAY',
      displayName: 'Razorpay',
      icon: '💳',
      description: 'Fast & Secure Payment',
      available: true,
    },
    {
      id: 'CREDIT_CARD',
      name: 'CREDIT_CARD',
      displayName: 'Credit Card',
      icon: '💳',
      description: 'Visa, Mastercard, Amex',
      available: true,
    },
    {
      id: 'DEBIT_CARD',
      name: 'DEBIT_CARD',
      displayName: 'Debit Card',
      icon: '🏦',
      description: 'Direct bank transfer',
      available: true,
    },
  ];

  constructor() {
    this.loadOrders();
  }

  getOrders() {
    return this.orders;
  }

  getAllOrders(): Order[] {
    return this.orders();
  }

  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'trackingUpdates'>): Order {
    const newOrder: Order = {
      ...order,
      id: 'ORD-' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'CONFIRMED',
      trackingUpdates: [
        {
          timestamp: new Date(),
          status: 'CONFIRMED',
          message: 'Your order has been confirmed',
          location: 'Order Center',
        },
      ],
    };

    const allOrders = this.orders();
    allOrders.push(newOrder);
    this.orders.set([...allOrders]);
    this.saveOrders();

    return newOrder;
  }

  updateOrderStatus(orderId: string, newStatus: Order['status'], message: string, location?: string): void {
    const allOrders = this.orders();
    const order = allOrders.find(o => o.id === orderId);

    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date();
      order.trackingUpdates.push({
        timestamp: new Date(),
        status: newStatus,
        message,
        location,
      });

      this.orders.set([...allOrders]);
      this.saveOrders();
    }
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders().find(o => o.id === orderId);
  }

  getOrderByOrderNumber(orderNumber: string): Order | undefined {
    return this.orders().find(o => o.orderNumber === orderNumber);
  }

  cancelOrder(orderId: string): void {
    this.updateOrderStatus(orderId, 'CANCELLED', 'Your order has been cancelled', 'Order Center');
  }

  private saveOrders(): void {
    const ordersData = this.orders().map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      trackingUpdates: order.trackingUpdates.map(update => ({
        ...update,
        timestamp: update.timestamp.toISOString(),
      })),
    }));
    localStorage.setItem('orders', JSON.stringify(ordersData));
  }

  private loadOrders(): void {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        const ordersData = JSON.parse(saved);
        const orders = ordersData.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          trackingUpdates: order.trackingUpdates.map((update: any) => ({
            ...update,
            timestamp: new Date(update.timestamp),
          })),
        }));
        this.orders.set(orders);
      } catch (e) {
        console.error('Failed to load orders:', e);
      }
    }
  }

  getOrderStats() {
    const allOrders = this.orders();
    return {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'PENDING').length,
      confirmed: allOrders.filter(o => o.status === 'CONFIRMED').length,
      processing: allOrders.filter(o => o.status === 'PROCESSING').length,
      shipped: allOrders.filter(o => o.status === 'SHIPPED').length,
      delivered: allOrders.filter(o => o.status === 'DELIVERED').length,
      cancelled: allOrders.filter(o => o.status === 'CANCELLED').length,
    };
  }
}
