import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private router = inject(Router);
  private authService = inject(AuthService);

  user = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  errors: any = {};
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  validateForm() {
    this.errors = {};
    let isValid = true;

    // Full Name validation
    if (!this.user.fullName.trim()) {
      this.errors.fullName = 'Full name is required';
      isValid = false;
    } else if (this.user.fullName.length < 2) {
      this.errors.fullName = 'Full name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.user.email) {
      this.errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.user.email)) {
      this.errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!this.user.phone) {
      this.errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(this.user.phone.replace(/\D/g, ''))) {
      this.errors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    // Password validation
    if (!this.user.password) {
      this.errors.password = 'Password is required';
      isValid = false;
    } else if (this.user.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!this.user.confirmPassword) {
      this.errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (this.user.password !== this.user.confirmPassword) {
      this.errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    return isValid;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async onSignup() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.signup(
        this.user.email,
        this.user.password,
        this.user.fullName,
        this.user.phone
      );
      
      alert('Account created successfully! Please log in.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        this.errors.email = 'Email address is already registered';
      } else if (error.code === 'auth/weak-password') {
        this.errors.password = 'Password is too weak';
      } else {
        alert('Signup failed: ' + (error.message || 'Unknown error'));
      }
    } finally {
      this.isLoading = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
