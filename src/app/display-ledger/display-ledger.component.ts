import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { mobiscroll } from '@mobiscroll/angular';
import { DisplayOrderComponent } from '../home/display-order/display-order.component';
import { Ledger } from '../models/ledger.model';
import { DocumentsService } from '../services/documents.service';
import { LoadingService } from '../services/loading.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-display-ledger',
  templateUrl: './display-ledger.component.html',
  styleUrls: ['./display-ledger.component.css']
})
export class DisplayLedgerComponent implements OnInit {

  ledgers: Partial<Ledger>[] = [];

  mobiSettings: any;

  mobi: any;

  constructor(private ordersService: OrdersService, private documentService: DocumentsService, private loadingService: LoadingService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.mobi = mobiscroll;

    this.mobiSettings = {
      lang: 'ar',
      rtl: true,
    };

    this.loadingService.showLoaderWhenPromiseComplete(this.documentService.getBranchLedger('d3kL19HmCEbpcnn4OS2D')).then(result => {

      this.ledgers = result;

      console.log(this.ledgers);

    });

  }


  goToOrder(order_id: string) {

    // this.router.navigateByUrl('/home/displayorder/' + order_id);

    console.log(order_id);

    let dialogRef = this.dialog.open(DisplayOrderComponent, {
      height: '1200px',
      width: '1500px',
      data: { order_id }
    });

  }



}
