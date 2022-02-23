import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';

import { mobiscroll } from '@mobiscroll/angular';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterViewInit {

  orders: Partial<Order>[] = [];

  mobiSettings: any;

  mobi: any;

  constructor(public orderService: OrdersService, private authService: AuthService, private router: Router, private loadingService: LoadingService) {


  }

  ngOnInit(): void {


    this.mobi = mobiscroll;

    this.mobiSettings = {
      lang: 'ar',
      rtl: true,
    };

    this.orderService.orders$.subscribe((orders: Partial<Order>[]) => {

      this.orders = orders;

      console.log(orders);

    });

  }


  ngAfterViewInit() {



  }

  displayOrderDetails(orderId: string) {

    console.log(orderId);

    this.router.navigateByUrl('home/displayorder/' + orderId);

  }

}
