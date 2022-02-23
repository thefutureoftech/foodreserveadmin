import { Injectable } from '@angular/core';
import { collection, query, where, getDocs } from "firebase/firestore";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Stock } from '../models/stock.model';
import { Branch } from '../models/branch.model';
import { Order } from '../models/order.model';
import { BookedStack, Item, sub_item } from '../models/item.model';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import * as fs from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Customer } from '../models/customer.model';
import { environment } from 'src/environments/environment';
import { Issue_voucher } from '../models/issue_voucher.model';
import { Bill } from '../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private ordersSubject = new BehaviorSubject<Partial<Order>[]>([]);

  orders$: Observable<Partial<Order>[]> = this.ordersSubject.asObservable();

  constructor(public firestore: AngularFirestore, private authService: AuthService) {


  }


  async getBranches(branchId: string) {

    let branch: Partial<Branch> = {};

    let docSnapshot = await this.firestore.collection('branches').doc(branchId).get().toPromise();

    let branchData: any = docSnapshot?.data();

    branchData.id = docSnapshot?.id;

    branch = branchData;

    return branch;

  }


  async getOrderItems(orderId: string) {

    let items: Item[] = [];

    let orderDetails: Partial<Order> = {};

    let customerDetails: Partial<Customer>;

    let docSnapshot = await this.firestore.collection('orders').doc(orderId).get().toPromise();

    orderDetails = docSnapshot?.data() as Partial<Order>;

    orderDetails.id = docSnapshot?.id;

    let query3 = await this.firestore.collection('customers').ref.where('user_id', '==', orderDetails.customer_id);

    const querySnapshot3 = await getDocs(query3);

    customerDetails = querySnapshot3.docs[0].data() as Partial<Customer>;

    customerDetails.id = querySnapshot3.docs[0].id;

    let query2 = await this.firestore.collection('order_items').ref.where('order_id', '==', orderId);

    const querySnapshot2 = await getDocs(query2);

    for (let doc of querySnapshot2.docs) {

      let itemData = doc.data() as Item;

      itemData.id = doc.id;

      items.push(itemData);

    }

    let issue_voucher: Partial<Issue_voucher> = {};

    let returned_object: any = {};

    let return_stores_stacks: any = {};

    if (orderDetails.order_status == 'أمين السجلات') {

      issue_voucher = await this.getIssueVoucher(orderDetails);

      // return_stores_stacks = await this.getStoresStacks();

    }

    if (issue_voucher.id) {

      returned_object = { order: orderDetails, items: items, customer: customerDetails, issue_voucher, stores: return_stores_stacks.storeArray, stacks: return_stores_stacks.stackArray };

    }
    else {

      returned_object = { order: orderDetails, items: items, customer: customerDetails };

    }

    console.log(returned_object);

    return returned_object;


  }



  async getIssueVoucher(order: Partial<Order>) {

    let issue_voucher: Partial<Issue_voucher> = {};

    let docSnapshot = await this.firestore.collection('bills').doc(order.bill_id).get().toPromise();

    let billData: Partial<Bill> = (docSnapshot?.data() as Partial<Bill>);

    billData.id = docSnapshot?.id;

    let docSnapshot2 = await this.firestore.collection('issue_vouchers').doc(order.issue_voucher_id).get().toPromise();

    issue_voucher = (docSnapshot2?.data() as Partial<Issue_voucher>);

    issue_voucher.id = docSnapshot2?.id;

    issue_voucher.bill = billData;

    let issue_voucher_date = issue_voucher.issue_voucher_date;

    if (issue_voucher_date instanceof fs.Timestamp) {

      issue_voucher_date = issue_voucher_date.toDate();

    }

    issue_voucher.issue_voucher_date = issue_voucher_date;

    return issue_voucher;

  }



}




