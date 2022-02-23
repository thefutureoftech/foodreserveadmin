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
import { Bill } from '../models/bill.model';
import { ActionLog } from '../models/action_log.model';
import { environment } from '../../environments/environment';
import { Receipt_voucher } from '../models/receipt_voucher.model';
import { Issue_voucher } from '../models/issue_voucher.model';
import { Ledger } from '../models/ledger.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private ordersSubject = new BehaviorSubject<Partial<Order>[]>([]);

  orders$: Observable<Partial<Order>[]> = this.ordersSubject.asObservable();

  constructor(public firestore: AngularFirestore, private authService: AuthService) {


  }


  async saveBill(order: Partial<Order>, items: Partial<Item>[], customer: Partial<Customer>) {

    let bill: Partial<Bill> = { items: [] };

    let bill_number: number = 0;

    let billItems: Partial<{
      stock_id: string;
      quanitity: number;
      total_weight: number;
      unit_price: number;
      total_price: number;
    }>[] = [];


    if (order.bill_id && order.bill_id != '') {

      return;

    }


    let query2 = await this.firestore.collection('bills').ref;

    const querySnapshot = await getDocs(query2);

    if (querySnapshot.empty) {

      bill_number = 100;

    }
    else {

      query2.orderBy('number', 'desc').limit(1);

      const querySnapshot = await getDocs(query2);

      bill_number = (querySnapshot.docs[0].data() as Partial<Bill>).number! + 1;

    }

    bill.number = bill_number;

    bill.order_id = order.id;

    bill.customer_id = customer.user_id;

    bill.customer_name = customer.arabicName;

    bill.customer_number = customer.number;

    bill.customer_address = customer.address;

    bill.customer_bank_details = customer.bankDetails;

    bill.total_riyals = 0;

    bill.total_bizas = 0;

    for (let item of items) {

      let billItem: Partial<{
        stock_id: string;
        stoc_name: string;
        quanitity: number;
        unit_weight: number;
        total_weight: number;
        unit_price: number;
        total_price: number;
        account_code: string;
      }> = { unit_price: 0, total_price: 0, quanitity: 0, total_weight: 0 };



      billItem.stock_id = item.stock_id;

      if (item && item.sub_items) {

        billItem.quanitity = item.sub_items[0].quantity;

        let docSnapshot = await this.firestore.collection('stocks').doc(item.stock_id).get().toPromise();

        let stockData: Partial<Stock> = (docSnapshot?.data() as Partial<Stock>);

        billItem.total_weight = stockData.weight! * item.sub_items[0].quantity!;

        billItem.unit_price = stockData.price;

        billItem.unit_weight = stockData.weight;

        billItem.total_price = billItem.unit_price! * item.sub_items[0].quantity!

        console.log(stockData.price);

        console.log(billItem.unit_price);

        console.log(stockData);

        console.log(item.sub_items[0]);

        billItem.account_code = stockData.accountCode;

        billItem.stoc_name = stockData.arabicName;

        let riyals = this.getTotalPrice(item.sub_items[0].quantity!, billItem.unit_price!).beforePoint;

        let bizas = this.getTotalPrice(item.sub_items[0].quantity!, billItem.unit_price!).afterPoint;

        bill.total_riyals = bill.total_riyals! + riyals;

        bill.total_bizas = bill.total_bizas! + bizas;

        bill.items?.push(billItem);

      }

    }

    bill.bill_date = new Date();

    bill.issuer_id = this.authService.getUserUID();

    console.log(bill);

    if (order.bill_id && order.bill_id != '') {

      let docSnapshot2 = await this.firestore.collection('bills').doc(order.bill_id).get().toPromise();

      docSnapshot2?.ref.update(bill);


    }
    else {

      let colRef = await this.firestore.collection('bills').add(bill);

      order.bill_id = colRef.id;

      let orderData = _.cloneDeep(order);

      delete orderData.id;

      await this.firestore.collection('orders').doc(order.id).update(orderData);

    }


  }


  getTotalPrice(quantity: number, unit_rpice: number) {

    let total = quantity * unit_rpice;

    let beforePoint = +total.toString().split(".")[0];

    let afterPoint = total % 1;

    return { beforePoint, afterPoint };

  }


  async getBill(bill_id: string) {

    let docSnapshot = await this.firestore.collection('bills').doc(bill_id).get().toPromise();

    let billData: Partial<Bill> = (docSnapshot?.data() as Partial<Bill>);

    billData.id = docSnapshot?.id;

    let bill_date = billData.bill_date;

    if (bill_date instanceof fs.Timestamp) {

      bill_date = bill_date.toDate();

    }

    billData.bill_date = bill_date;

    let receipt_voucher_date = billData.receipt_voucher_date;

    if (receipt_voucher_date instanceof fs.Timestamp) {

      receipt_voucher_date = receipt_voucher_date.toDate();

    }

    billData.receipt_voucher_date = receipt_voucher_date;


    let issue_voucher_date = billData.issue_voucher_date;

    if (issue_voucher_date instanceof fs.Timestamp) {

      issue_voucher_date = issue_voucher_date.toDate();

    }

    billData.issue_voucher_date = issue_voucher_date;


    return billData;

  }


  async saveReceiptVoucher(order: Partial<Order>, check_no?: string, check_date?: Date) {

    let receipt_voucher: Partial<Receipt_voucher> = {};

    if (order.receipt_voucher_id && order.receipt_voucher_id != '') {

      return;

    }

    delete receipt_voucher.id;

    delete receipt_voucher.bill;

    receipt_voucher.bill_id = order.bill_id;

    receipt_voucher.customer_id = order.customer_id;


    let receipt_no = 0;

    let query2 = await this.firestore.collection('receipt_vouchers').ref;

    const querySnapshot = await getDocs(query2);

    if (querySnapshot.empty) {

      receipt_no = 100;

    }
    else {

      query2.orderBy('number', 'desc').limit(1);

      const querySnapshot = await getDocs(query2);

      receipt_no = (querySnapshot.docs[0].data() as Partial<Receipt_voucher>).number! + 1;

    }

    receipt_voucher.number = receipt_no;

    receipt_voucher.receipt_date = new Date();

    let colRef = await this.firestore.collection('receipt_vouchers').add(receipt_voucher);

    order.receipt_voucher_id = colRef.id;

    let orderData = _.cloneDeep(order);

    delete orderData.id;

    await this.firestore.collection('orders').doc(order.id).update(orderData);




    let docSnapshot = await this.firestore.collection('bills').doc(order.bill_id).get().toPromise();

    let billData: Partial<Bill> = (docSnapshot?.data() as Partial<Bill>);

    delete billData.id;

    billData.customer_check_no = check_no;

    billData.customer_payment_due_date = check_date;

    billData.receipt_voucher_number = receipt_voucher.number;

    billData.receipt_voucher_date = receipt_voucher.receipt_date;

    await docSnapshot?.ref.update(billData);

  }


  async getReceiptVoucher(order: Partial<Order>) {


    let docSnapshot = await this.firestore.collection('bills').doc(order.bill_id).get().toPromise();

    let billData: Partial<Bill> = (docSnapshot?.data() as Partial<Bill>);

    billData.id = docSnapshot?.id;

    let bill_date = billData.bill_date;

    if (bill_date instanceof fs.Timestamp) {

      bill_date = bill_date.toDate();

    }

    billData.bill_date = bill_date;


    let customer_due_date = billData.customer_payment_due_date;

    if (customer_due_date instanceof fs.Timestamp) {

      customer_due_date = customer_due_date.toDate();

    }

    billData.customer_payment_due_date = customer_due_date;


    let docSnapshot2 = await this.firestore.collection('receipt_vouchers').doc(order.receipt_voucher_id).get().toPromise();

    let receiptData: Partial<Receipt_voucher> = (docSnapshot2?.data() as Partial<Receipt_voucher>);

    console.log(order.receipt_voucher_id);

    console.log(receiptData);

    receiptData.id = docSnapshot2?.id;

    let receipt_date = receiptData.receipt_date;

    if (receipt_date instanceof fs.Timestamp) {

      receipt_date = receipt_date.toDate();

    }

    receiptData.receipt_date = receipt_date;

    receiptData.bill = billData;

    receiptData.bill_id = billData.id

    let docSnapshot3 = await this.firestore.collection('orders').doc(order.id).get().toPromise();

    let orderData: Partial<Order> = (docSnapshot3?.data() as Partial<Order>);

    let docSnapshot4 = await this.firestore.collection('branches').doc(orderData.branch_id).get().toPromise();

    let branchData: Partial<Branch> = (docSnapshot4?.data() as Partial<Branch>);

    receiptData.branch_name = branchData.name;

    return receiptData;

  }


  async getActionLoags(order_id: string) {

    let logs: Partial<ActionLog>[] = [];

    let query = await this.firestore.collection('action_logs').ref.where('order_id', '==', order_id);

    const querySnapshot = await getDocs(query);

    for (let log of querySnapshot.docs) {

      let logData: any = log.data();

      logData.id = log.id;

      let action_date = logData.action_date;

      if (action_date instanceof fs.Timestamp) {

        action_date = action_date.toDate();

      }

      logData.action_date = action_date;

      logs.push(logData);

    }

    return logs;

  }


  async save_issue_voucher(order_id: string, order: Partial<Order>) {

    let issue_voucher: Partial<Issue_voucher> = {};

    delete issue_voucher.id;

    let issue_no = 0;

    let query2 = await this.firestore.collection('issue_vouchers').ref;

    const querySnapshot = await getDocs(query2);

    if (querySnapshot.empty) {

      issue_no = 100;

    }
    else {

      query2.orderBy('number', 'desc').limit(1);

      const querySnapshot = await getDocs(query2);

      issue_no = (querySnapshot.docs[0].data() as Partial<Issue_voucher>).number! + 1;

    }

    issue_voucher.number = issue_no;

    issue_voucher.issue_voucher_date = new Date;

    issue_voucher.order_id = order_id;

    let docSnapshot = await this.firestore.collection('bills').doc(order.bill_id).get().toPromise();

    let billData: Partial<Bill> = (docSnapshot?.data() as Partial<Bill>);

    issue_voucher.bill_id = docSnapshot?.id;

    issue_voucher.items = [];

    console.log(billData.items);

    for (let item of billData.items!) {

      let issue_item: any = {};

      issue_item.stock_id = item.stock_id;
      issue_item.stoc_name = item.stoc_name;
      issue_item.quanitity = item.quanitity;
      issue_item.unit_weight = item.unit_weight;
      issue_item.total_weight = 0;  // item.total_weight;
      issue_item.unit_price = item.unit_price;
      issue_item.total_price = 0;  // item.total_price;
      issue_item.account_code = item.account_code;
      issue_item.dispatched_quantity = 0;

      issue_voucher.items.push(issue_item);

    }

    let totalWeight = 0;

    for (let item of billData.items!) {

      totalWeight = totalWeight + item.total_weight!;

    }

    issue_voucher.total_weight = totalWeight;

    console.log(issue_voucher);

    let colRef = await this.firestore.collection('issue_vouchers').add(issue_voucher);

    console.log('issue voucher saved');

    billData.issue_voucher_number = issue_voucher.number;

    billData.issue_voucher_date = issue_voucher.issue_voucher_date;

    delete billData.id;

    await docSnapshot?.ref.update(billData);

    return colRef.id;


  }


  async getIssueVoucher(order: Partial<Order>) {

    let issue_voucher: Partial<Issue_voucher> = {};

    let docSnapshot = await this.firestore.collection('bills').doc(order.bill_id).get().toPromise();

    let billData: Partial<Bill> = (docSnapshot?.data() as Partial<Bill>);

    billData.id = docSnapshot?.id;

    let docSnapshot2 = await this.firestore.collection('issue_vouchers').doc(order.issue_voucher_id).get().toPromise();

    issue_voucher = (docSnapshot2?.data() as Partial<Issue_voucher>);

    issue_voucher.bill = billData;

    let issue_voucher_date = issue_voucher.issue_voucher_date;

    if (issue_voucher_date instanceof fs.Timestamp) {

      issue_voucher_date = issue_voucher_date.toDate();

    }

    issue_voucher.issue_voucher_date = issue_voucher_date;

    return issue_voucher;

  }


  async updateIssueVoucherInitialScaling(order: Partial<Order>, vehicle_no: string, weight_card_no: string, weight: number, final?: boolean) {

    let issue_voucher: Partial<Issue_voucher> = {};

    let docSnapshot2 = await this.firestore.collection('issue_vouchers').doc(order.issue_voucher_id).get().toPromise();

    issue_voucher = (docSnapshot2?.data() as Partial<Issue_voucher>);

    delete issue_voucher.id;

    if (final) {

      issue_voucher.weight_card_no_after_loading = weight_card_no;

      issue_voucher.weight_after_loading = weight;

    }
    else {

      issue_voucher.customer_car_no = vehicle_no;

      issue_voucher.weight_card_no_before_loading = weight_card_no;

      issue_voucher.weight_before_loading = weight;

    }

    await docSnapshot2?.ref.update(issue_voucher);

  }


  async updateIssueVoucher(order: Partial<Order>, issueVoucher: Partial<Issue_voucher>) {

    let issue_voucher_data: Partial<Issue_voucher> = {};

    let docSnapshot2 = await this.firestore.collection('issue_vouchers').doc(order.issue_voucher_id).get().toPromise();

    issue_voucher_data = issueVoucher

    delete issue_voucher_data.id;

    console.log(issue_voucher_data);

    await docSnapshot2?.ref.update(issue_voucher_data);

  }


  async isStackValid(order: Partial<Order>, item: any) {

    let query2 = await this.firestore.collection('store_inventory').ref.where('branch', '==', order.branch_id).where('store', '==', item.store_id).where('stack', '==', item.stack_id).where('stock', '==', item.stock_id);

    const querySnapshot = await getDocs(query2);

    return !querySnapshot.empty;

  }


  async getAllowedQuantity(order: Partial<Order>, item: any) {

    let allowed_quantity = 0;

    let query2 = await this.firestore.collection('store_inventory').ref.where('branch', '==', order.branch_id).where('store', '==', item.store_id).where('stack', '==', item.stack_id).where('stock', '==', item.stock_id);

    const querySnapshot = await getDocs(query2);

    console.log('query empty is ' + querySnapshot.empty);

    let inventory: any = querySnapshot.docs[0].data();

    allowed_quantity = inventory.quantity; // - inventory.consumed;

    console.log(allowed_quantity);

    return allowed_quantity;

  }


  async addLedger(order: Partial<Order>, issue_voucher: Partial<Issue_voucher>) {

    for (let item of issue_voucher.items!) {

      let ledger: Partial<Ledger> = {};

      ledger.change_date = new Date();

      ledger.branch_id = order.branch_id;

      let docSnapshot2 = await this.firestore.collection('branches').doc(order.branch_id).get().toPromise();

      let branchData: any = docSnapshot2?.data();

      ledger.branch_name = branchData.name;

      ledger.store_id = item.store_id;

      ledger.store_name = item.store_label;

      ledger.stack_id = item.stack_id;

      ledger.stack_name = item.stack_label;

      ledger.stock_id = item.stock_id;

      ledger.stock_name = item.stoc_name;

      ledger.request_id = order.id;

      ledger.request_type = 'طلبية وكيل';

      let query2 = await this.firestore.collection('store_inventory').ref.where('branch', '==', order.branch_id).where('store', '==', item.store_id).where('stack', '==', item.stack_id).where('stock', '==', item.stock_id);

      const querySnapshot = await getDocs(query2);

      let inventory: any = querySnapshot.docs[0].data();

      ledger.previous_quantity = inventory.quantity;

      let docSnapshot = await this.firestore.collection('stocks').doc(item.stock_id).get().toPromise();

      let stockData: Partial<Stock> = (docSnapshot?.data() as Partial<Stock>);

      ledger.previous_quantity_weight = inventory.quantity * stockData.weight!;

      ledger.changed_quantity = item.quanitity;

      ledger.changed_quantity_weight = item.quanitity! * stockData.weight!;

      ledger.new_quantity = inventory.quantity - item.quanitity!;

      ledger.new_quantity_weight = ledger.new_quantity! * stockData.weight!;

      delete ledger.id;

      console.log(ledger);

      let colRef = await this.firestore.collection('ledgers').add(ledger);

    }


    let query3 = await this.firestore.collection('order_items').ref.where('order_id', '==', order.id);

    const querySnapshot2 = await getDocs(query3);

    let orderItems: Partial<Item>[] = [];

    for (let doc of querySnapshot2.docs) {

      const data: any = doc.data();
      const id = doc.id;

      let obj: Stock = { id, ...data };

      orderItems.push(obj);

    }

    console.log(orderItems);

    for (let item of orderItems) {

      console.log(item.booked_stacks);

      for (let bookedStack of item.booked_stacks!) {

        let docSnapshot2 = await this.firestore.collection('store_inventory').doc(bookedStack.stack_id).get().toPromise();

        let inventoryData: any = docSnapshot2?.data();

        inventoryData.id = docSnapshot2?.id;

        inventoryData.booked = inventoryData.booked - bookedStack.quantity!;

        inventoryData.quantity = inventoryData.quantity - bookedStack.quantity!;

        console.log(inventoryData);

        delete inventoryData.id;

        await docSnapshot2?.ref.update(inventoryData);

      }

    }


    // }


  }


  async getBranchLedger(branchId: string) {

    let ledgers: Partial<Ledger>[] = [];

    let query2 = await this.firestore.collection('ledgers').ref.where('branch_id', '==', branchId);

    const querySnapshot = await getDocs(query2);

    for (let doc of querySnapshot.docs) {

      const data: any = doc.data();
      const id = doc.id;

      let obj: Partial<Ledger> = { id, ...data };


      let change_date = obj.change_date;

      if (change_date instanceof fs.Timestamp) {

        change_date = change_date.toDate();

      }

      obj.change_date = change_date;


      ledgers.push(obj);

    }


    // ledgers.sort(function (a, b) {
    //   // Turn your strings into dates, and then subtract them
    //   // to get a value that is either negative, positive, or zero.
    //   return new Date(a.change_date as Date).getTime() - new Date(b.change_date as Date).getTime();
    // });

    // ledgers.sort(function (a, b) {

    //   if (new Date(a.change_date as Date).getTime() > new Date(b.change_date as Date).getTime()) {
    //     return 1;
    //   }

    //   if (new Date(a.change_date as Date).getTime() < new Date(b.change_date as Date).getTime()) {
    //     return -1;
    //   }

    //   return 0;

    // });

    ledgers.sort(function (a, b) {

      if ((a.stock_name as string) > (b.stock_name as string)) {
        return 1;
      }

      if ((a.stock_name as string) < (b.stock_name as string)) {
        return -1;
      }

      return 0;

    });

    // ledgers = _.orderBy(ledgers, ['change_date'], ['asc']);

    // _.groupBy(ledgers, ['stock_name']);


    return ledgers;


  }



}
