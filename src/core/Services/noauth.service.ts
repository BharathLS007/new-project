//import { Injectable } from '@angular/core';
//import { CanActivate, Router } from '@angular/router';
//import { AngularFireAuth } from '@angular/fire/compat/auth';
//
//@Injectable({ providedIn: 'root' })
//export class NoAuthGuard implements CanActivate {
//
//  constructor(private afAuth: AngularFireAuth, private router: Router) {}
//
//  canActivate(): Promise<boolean> {
//    return new Promise(resolve => {
//      this.afAuth.onAuthStateChanged(user => {
//        if (user) {
//          this.router.navigate(['/home']);
//          resolve(false);
//        } else {
//          resolve(true);
//        }
//      });
//    });
//  }
//}
//