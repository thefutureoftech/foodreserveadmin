import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ListboxModule } from 'primeng/listbox';
import {DockModule} from 'primeng/dock';
import {DropdownModule} from 'primeng/dropdown';
import {StepsModule} from 'primeng/steps';
import {TooltipModule} from 'primeng/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BillprintComponent } from './shared/billprint/billprint.component';
import { HistoryComponent } from './shared/history/history.component';
import { IssueVoucherPrintComponent } from './shared/issue-voucher-print/issue-voucher-print.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { ReceiptVoucherComponent } from './shared/receipt_voucher/receipt-voucher.component';
import { AuthGuard } from './guards/auth.guard';
import { MessageService } from 'primeng/api';
import { DisplayOrderComponent } from './home/display-order/display-order.component';
import { DisplayLedgerComponent } from './display-ledger/display-ledger.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    BillprintComponent,
    HistoryComponent,
    IssueVoucherPrintComponent,
    LoadingComponent,
    ReceiptVoucherComponent,
    DisplayOrderComponent,
    DisplayLedgerComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MbscModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ButtonModule,
    BrowserAnimationsModule,
    InputTextModule,
    PasswordModule,
    ToolbarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarModule,
    SplitterModule,
    TableModule,
    DialogModule,
    AccordionModule,
    InputNumberModule,
    ToastModule,
    ListboxModule,
    DockModule,
    MatDialogModule,
    DropdownModule,
    StepsModule,
    TooltipModule
  ],
  providers: [MessageService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
