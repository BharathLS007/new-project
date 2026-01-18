import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Footer } from '../footer/footer';
import { OrderService } from '../../Models/order.service';
import { Order } from '../../Models/order.model';

@Component({
  selector: 'app-orders',
  imports: [Footer, CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userOrders = signal<Order[]>([]);
  selectedOrder = signal<Order | null>(null);
  expandedOrderId = signal<string | null>(null);

  statusColors: { [key: string]: string } = {
    PENDING: '#f59e0b',
    CONFIRMED: '#0066cc',
    PROCESSING: '#8b5cf6',
    SHIPPED: '#06b6d4',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444',
  };

  statusLabels: { [key: string]: string } = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };

  constructor() {
    this.loadOrders();
    
    // Check if there's a specific order ID in query params
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        const order = this.orderService.getOrderById(params['orderId']);
        if (order) {
          this.selectedOrder.set(order);
          this.expandedOrderId.set(order.id);
        }
      }
    });
  }

  loadOrders(): void {
    const allOrders = this.orderService.getAllOrders();
    this.userOrders.set(allOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }

  selectOrder(order: Order): void {
    if (this.expandedOrderId() === order.id) {
      this.expandedOrderId.set(null);
      this.selectedOrder.set(null);
    } else {
      this.expandedOrderId.set(order.id);
      this.selectedOrder.set(order);
    }
  }

  getOrderProgress(status: string): number {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const index = statuses.indexOf(status);
    return Math.max(0, (index + 1) * 20);
  }

  getStatusStep(status: string): number {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    return statuses.indexOf(status) + 1;
  }

  isStatusCompleted(stepStatus: string, currentStatus: string): boolean {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    return statuses.indexOf(stepStatus) <= statuses.indexOf(currentStatus);
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId);
      this.loadOrders();
      this.selectedOrder.set(null);
    }
  }

  simulateShipping(orderId: string): void {
    // For demo purposes - simulate order progression
    const order = this.orderService.getOrderById(orderId);
    if (order) {
      const nextStatus: { [key: string]: Order['status'] } = {
        CONFIRMED: 'PROCESSING',
        PROCESSING: 'SHIPPED',
        SHIPPED: 'DELIVERED',
      };
      
      if (nextStatus[order.status]) {
        const statusMessages: { [key: string]: string } = {
          PROCESSING: 'Your order is being prepared',
          SHIPPED: 'Your order has been shipped',
          DELIVERED: 'Your order has been delivered',
        };
        
        const newStatus = nextStatus[order.status];
        this.orderService.updateOrderStatus(
          orderId,
          newStatus,
          statusMessages[newStatus] || 'Order status updated',
          'Distribution Center'
        );
        this.loadOrders();
        
        const updated = this.orderService.getOrderById(orderId);
        if (updated) {
          this.selectedOrder.set(updated);
        }
      }
    }
  }
}
