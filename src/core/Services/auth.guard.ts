import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route?: ActivatedRouteSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Store the attempted URL for redirecting after login
      const intendedUrl = route?.url?.join('/') || '';
      if (intendedUrl) {
        sessionStorage.setItem('redirectAfterLogin', '/' + intendedUrl);
      }
      
      this.router.navigate(['/login']);
      return false;
    }
  }
}