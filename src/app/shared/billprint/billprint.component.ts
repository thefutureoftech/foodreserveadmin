import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mobiscroll } from '@mobiscroll/angular';
import { Bill } from '../../models/bill.model';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-billprint',
  templateUrl: './billprint.component.html',
  styleUrls: ['./billprint.component.css']
})
export class BillprintComponent implements OnInit, AfterViewInit {

  @Input()
  bill: Partial<Bill> = {};

  mobiSettings: any;

  mobi: any;

  totalPriceRiyals: number = 0;

  totalPriceBizas: number = 0;

  tableItems: Partial<{

    item_no: number,
    stock_id: string;
    stoc_name: string;
    quanitity: number;
    unit_weight: number;
    total_weight: number;
    unit_price: number;
    total_price: number;
    account_code: string;

  }>[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.mobi = mobiscroll;

    this.mobiSettings = {
      lang: 'ar',
      rtl: true,
    };

    console.log(this.data);

    let i = 1;

    if (this.data && this.data.bill && this.data.bill.items && this.data.bill.items.length > 0) {

      for (let item of this.data.bill.items) {

        this.tableItems.push({ item_no: i, ...item });

        let itemData = { item_no: i, ...item };

        let riyals = this.getTotalPrice(itemData.quanitity, itemData.unit_price).beforePoint;

        let bizas = this.getTotalPrice(itemData.quanitity, itemData.unit_price).afterPoint;

        this.totalPriceRiyals = this.totalPriceRiyals + riyals;

        this.totalPriceBizas = this.totalPriceBizas + bizas;

        i++;

      }

    }

    console.log(this.tableItems);


  }


  getTonnes(numb1: number, numb2: number) {

    return (numb1 * numb2) / 1000;

  }


  getTotalPrice(quantity: number, unit_rpice: number) {

    let total = quantity * unit_rpice;

    let beforePoint = +total.toString().split(".")[0];

    let afterPoint = total % 1;

    return { beforePoint, afterPoint };

  }


  ngAfterViewInit() {



  }



}
