import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Mock users database (in real app, this would be a backend service)
  private users: User[] = [
    {
      id: '1',
      email: 'admin@medishop.com',
      fullName: 'Admin User',
      phone: '1234567890',
      role: 'admin',
      createdAt: new Date()
    },
    {
      id: '2',
      email: 'user@medishop.com',
      fullName: 'Test User',
      phone: '9876543210',
      role: 'user',
      createdAt: new Date()
    }
  ];

  constructor(private router: Router) {
    // Check if user is already logged in
    try {
      if (typeof localStorage !== 'undefined') {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          this.currentUserSubject.next(JSON.parse(savedUser));
        }
      }
    } catch (e) {
      // localStorage not available (SSR) — ignore
    }
  }

  async signup(email: string, password: string, fullName: string, phone: string): Promise<User> {
    // Simulate API delay
    await this.delay(1000);
    
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw { code: 'auth/email-already-in-use', message: 'Email already in use' };
    }

    // Validate password strength
    if (password.length < 6) {
      throw { code: 'auth/weak-password', message: 'Password is too weak' };
    }

    // Create new user
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email,
      fullName,
      phone,
      role: 'user',
      createdAt: new Date()
    };

    // Add to users array (simulate database save)
    this.users.push(newUser);
    
    // Save password separately (in real app, this would be hashed and stored securely)
    try {
      if (typeof localStorage !== 'undefined') {
        const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
        passwords[email] = password;
        localStorage.setItem('userPasswords', JSON.stringify(passwords));
      }
    } catch (e) {
      // ignore on SSR
    }

    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await this.delay(1000);
    
    // Find user by email
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw { code: 'auth/user-not-found', message: 'User not found' };
    }

    // Check password (in real app, this would be properly hashed and verified)
    let storedPassword: string | undefined;
    try {
      if (typeof localStorage !== 'undefined') {
        const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
        storedPassword = passwords[email];
      }
    } catch (e) {
      storedPassword = undefined;
    }
    
    if (!storedPassword || storedPassword !== password) {
      throw { code: 'auth/wrong-password', message: 'Incorrect password' };
    }

    // Set current user
    this.currentUserSubject.next(user);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } catch (e) {
      // ignore on SSR
    }
    
    return user;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('currentUser');
      }
    } catch (e) {
      // ignore on SSR
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Helper method to simulate async operations
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Return current user details (synchronous)
  getUserDetails(): User | null {
    return this.getCurrentUser();
  }

  // Update user details (mock implementation)
  async updateUserDetails(updated: Partial<User> & { id: string }): Promise<User> {
    await this.delay(500);

    const idx = this.users.findIndex(u => u.id === updated.id);
    if (idx === -1) {
      throw { message: 'User not found' };
    }

    const existing = this.users[idx];
    const merged: User = {
      ...existing,
      ...updated,
      createdAt: existing.createdAt
    };

    this.users[idx] = merged;

    // If the updated user is the current user, update the subject and localStorage
    if (this.currentUserSubject.value?.id === merged.id) {
      this.currentUserSubject.next(merged);
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(merged));
        }
      } catch (e) {
        // ignore on SSR
      }
    }

    return merged;
  }
}