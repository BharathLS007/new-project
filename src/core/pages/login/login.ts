import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);

  credentials = {
    email: '',
    password: ''
  };

  errors: any = {};
  isLoading = false;
  showPassword = false;
  rememberMe = false;

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }

    // Load saved email if remember me was checked
    try {
      if (typeof localStorage !== 'undefined') {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
          this.credentials.email = savedEmail;
          this.rememberMe = true;
        }
      }
    } catch (e) {
      // ignore on SSR
    }
  }

  validateForm() {
    this.errors = {};
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.credentials.email) {
      this.errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(this.credentials.email)) {
      this.errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!this.credentials.password) {
      this.errors.password = 'Password is required';
      isValid = false;
    } else if (this.credentials.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    return isValid;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.login(this.credentials.email, this.credentials.password);
      
      // Handle remember me
      try {
        if (typeof localStorage !== 'undefined') {
          if (this.rememberMe) {
            localStorage.setItem('rememberedEmail', this.credentials.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
        }
      } catch (e) {
        // ignore on SSR
      }

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found') {
        this.errors.email = 'No account found with this email address';
      } else if (error.code === 'auth/wrong-password') {
        this.errors.password = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        this.errors.email = 'Invalid email address';
      } else if (error.code === 'auth/user-disabled') {
        this.errors.general = 'This account has been disabled';
      } else {
        this.errors.general = 'Login failed: ' + (error.message || 'Unknown error');
      }
    } finally {
      this.isLoading = false;
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  navigateToForgotPassword() {
    // Navigate to forgot password page (implement if needed)
    alert('Forgot password feature coming soon!');
  }
}
