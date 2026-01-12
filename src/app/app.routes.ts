import { Routes } from '@angular/router';
import {Home} from '../core/pages/home/home'
import { Store } from '../core/pages/store/store';
import {Orders} from '../core/pages/orders/orders'
import {Profile} from '../core/pages/profile/profile'
import { Medlist } from '../core/pages/medlist/medlist';
import { Cart } from '../core/pages/cart/cart';
import { Aboutus } from '../core/pages/aboutus/aboutus';
import { Contactus } from '../core/pages/contactus/contactus';
import { Signup } from '../core/pages/signup/signup';
import { Login } from '../core/pages/login/login';
export const routes: Routes = [
    {path: '', component: Home },
    {path : 'store', component : Store },
    {path: 'orders', component : Orders },
    {path: 'profile', component : Profile },
    {path: 'medlist', component: Medlist},
    {path: 'cart', component: Cart},
    {path : 'aboutus', component : Aboutus },
    {path : 'contactus', component : Contactus },
    {path : 'signup', component : Signup },  
    {path : 'login', component : Login }

];
