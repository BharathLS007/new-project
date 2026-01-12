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
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
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
    const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    passwords[email] = password;
    localStorage.setItem('userPasswords', JSON.stringify(passwords));

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
    const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    const storedPassword = passwords[email];
    
    if (!storedPassword || storedPassword !== password) {
      throw { code: 'auth/wrong-password', message: 'Incorrect password' };
    }

    // Set current user
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
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
}