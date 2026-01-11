import { Routes } from '@angular/router';

import { Admin } from './core/pages/admin/admin';
import { Cart } from './core/pages/cart/cart';
import { Home } from './core/pages/home/home';
import { Medicines } from './core/pages/medicines/medicines';
import { Orders } from './core/pages/orders/orders';
import { Profile } from './core/pages/profile/profile';
import { Store } from './core/pages/store/store';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'admin', component: Admin },
    { path: 'cart', component: Cart },
    { path: 'medicines', component: Medicines },
    { path: 'orders', component: Orders },
    { path: 'profile', component: Profile },
    { path: 'store', component: Store },
];

