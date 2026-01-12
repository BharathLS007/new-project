import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../Services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private authService = inject(AuthService);

  user: User | null = null;
  editUser: Partial<User> = {};
  isEditing = false;
  isLoading = false;
  errors: any = {};

  ngOnInit() {
    const current = this.authService.getUserDetails();
    if (current) {
      this.user = { ...current };
    }

    // keep in sync with auth state
    this.authService.currentUser$.subscribe(u => {
      if (u) this.user = { ...u };
      else this.user = null;
    });
  }

  startEdit() {
    this.editUser = this.user ? { ...this.user } : {};
    this.errors = {};
    this.isEditing = true;
  }

  cancelEdit() {
    this.editUser = {};
    this.isEditing = false;
  }

  validate() {
    this.errors = {};
    let valid = true;

    if (!this.editUser) return false;

    if (!this.editUser.fullName || this.editUser.fullName.trim().length < 2) {
      this.errors.fullName = 'Full name must be at least 2 characters';
      valid = false;
    }

    const phone = (this.editUser.phone || '').toString().replace(/\D/g, '');
    if (!phone || phone.length !== 10) {
      this.errors.phone = 'Please enter a valid 10-digit phone number';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.editUser.email || !emailRegex.test(this.editUser.email)) {
      this.errors.email = 'Please enter a valid email address';
      valid = false;
    }

    return valid;
  }

  async save() {
    if (!this.user) return;
    if (!this.validate()) return;

    this.isLoading = true;
    try {
      const updated = await this.authService.updateUserDetails({ id: this.user.id, ...this.editUser } as any);
      this.user = { ...updated };
      this.isEditing = false;
      this.editUser = {};
      alert('Profile updated successfully');
    } catch (err: any) {
      console.error('Profile update failed', err);
      alert('Failed to update profile: ' + (err?.message || 'Unknown error'));
    } finally {
      this.isLoading = false;
    }
  }
}
