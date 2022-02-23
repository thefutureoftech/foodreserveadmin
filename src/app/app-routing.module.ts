import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayLedgerComponent } from './display-ledger/display-ledger.component';
import { AuthGuard } from './guards/auth.guard';
import { DisplayOrderComponent } from './home/display-order/display-order.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [

    { path: 'displayorder/:orderid', component: DisplayOrderComponent },

    { path: 'displayledger', component: DisplayLedgerComponent }
  ] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
