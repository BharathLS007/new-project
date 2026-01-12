//import { Injectable } from '@angular/core';
//import { CanActivate, Router } from '@angular/router';
//import { AngularFirestore } from '@angular/fire/compat/firestore';
//import { AngularFireAuth } from '@angular/fire/compat/auth';//

//@Injectable({ providedIn: 'root' })
//export class AdminGuard implements CanActivate {//

//  constructor(
//    private afAuth: AngularFireAuth,
//    private afs: AngularFirestore,
//    private router: Router
//  ) {}//

//  async canActivate() {
//    const user = await this.afAuth.currentUser;
//    const doc = await this.afs.doc(`users/${user?.uid}`).ref.get();//

//    if (doc.data()?.role === 'admin') return true;//

//    this.router.navigate(['/home']);
//    return false;
//  }
//}
