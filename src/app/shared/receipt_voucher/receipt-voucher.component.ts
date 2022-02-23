import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mobiscroll } from '@mobiscroll/angular';
import { Receipt_voucher } from '../../models/receipt_voucher.model';


declare var toArabicWord: any;


@Component({
  selector: 'app-receipt-issue',
  templateUrl: './receipt-voucher.component.html',
  styleUrls: ['./receipt-voucher.component.css']
})
export class ReceiptVoucherComponent implements OnInit {

  receipt_voucher: Partial<Receipt_voucher> = {};

  mobiSettings: any;

  mobi: any;

  totalAmount: number = 0;

  amountInArabicWord: string = '';



  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.receipt_voucher = this.data.receipt;

    this.totalAmount = this.receipt_voucher.bill?.total_riyals! + this.receipt_voucher.bill?.total_bizas!;

    this.amountInArabicWord = toArabicWord(this.totalAmount);

    console.log(this.receipt_voucher);

    this.mobi = mobiscroll;

    this.mobiSettings = {
      lang: 'ar',
      rtl: true,
    };

  }

}
