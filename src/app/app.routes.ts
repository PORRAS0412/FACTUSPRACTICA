import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NewbillComponent } from './pages/newbill/newbill.component';
import { DeletebillComponent } from './pages/deletebill/deletebill.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'newbill', component:NewbillComponent},
  { path: 'deletebill', component:DeletebillComponent},
  {path : '', redirectTo: 'login', pathMatch: 'full'},
];



