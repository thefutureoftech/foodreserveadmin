import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { Item } from '../../models/item.model';
import { LoadingService } from '../../services/loading.service';
import { Customer } from '../../models/customer.model';
import { MenuItem } from 'primeng/api/menuitem';
import { Order } from '../../models/order.model';
import { DocumentsService } from '../../services/documents.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BillprintComponent } from '../../shared/billprint/billprint.component';
import { Bill } from '../../models/bill.model';
import { ActionLog } from '../../models/action_log.model';
import { HistoryComponent } from '../../shared/history/history.component';
import { Receipt_voucher } from '../../models/receipt_voucher.model';
import { ReceiptVoucherComponent } from '../../shared/receipt_voucher/receipt-voucher.component';
import { Issue_voucher } from '../../models/issue_voucher.model';
import { IssueVoucherPrintComponent } from '../../shared/issue-voucher-print/issue-voucher-print.component';
import * as _ from 'lodash';
// import { SelectItem } from 'primeng/components/common/selectitem';



@Component({
  selector: 'app-display-order',
  templateUrl: './display-order.component.html',
  styleUrls: ['./display-order.component.css']
})
export class DisplayOrderComponent implements OnInit {

  order: Partial<Order> = {};

  items: Partial<Item>[] = [];

  customer: Partial<Customer> = {};

  dockItems: MenuItem[] = [];

  stepItems: MenuItem[] = [];

  activeStepIndex: number = 0;

  bill: Partial<Bill> = {};

  displayreceipDialog: boolean = false;

  displayInitialScalingDialog: boolean = false;

  displayFinalScalingDialog: boolean = false;

  receiptVoucher: Partial<Receipt_voucher> = {};

  issueVoucher: Partial<Issue_voucher> = {};

  formSettings: any;

  check_no: string = '';

  check_date: Date = new Date();

  vehicle_no: string = '';

  initial_scaling_card_no: string = '';

  initial_scaling: number = 0;

  final_scaling_card_no: string = '';

  final_scaling: number = 0;

  numpadSettings: any = {
    theme: 'ios',
    themeVariant: 'light',
    scale: 0,
    max: 9999999,
    min: 0,
    defaultValue: 0
  };

  issue_voucher: Partial<Issue_voucher> = {};

  storeData: Partial<{ text: string, value: string }>[] = [];

  storeStackData: Partial<{ text: string, value: string, store: string }>[] = [];

  stacks: Partial<{ text: string, value: string }>[] = [];

  order_id: string = '';

  display_mode: boolean = false;

  constructor(private activeRoute: ActivatedRoute, private loadingService: LoadingService, private ordersService: OrdersService,
    private router: Router, private documentsService: DocumentsService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.formSettings = {
      lang: 'ar',
      rtl: true,
      labelStyle: 'floating'
    };

    console.log(this.activeRoute.snapshot.params['orderid']);

    console.log(this.data.order_id);

    if (this.activeRoute.snapshot.params['orderid'] === undefined) {

      this.order_id = this.data.order_id;

      this.display_mode = true;

    }
    else {

      console.log('setting id from url');

      this.order_id = this.activeRoute.snapshot.params['orderid']

    }

    this.loadingService.showLoaderWhenPromiseComplete(this.ordersService.getOrderItems(this.order_id)).then(result => {

      this.order = result.order;

      this.items = result.items;

      this.customer = result.customer;

      this.issueVoucher = result.issue_voucher;

      this.storeData = result.stores;

      if (result.stores) {

        this.storeData.unshift({ text: 'إختر المخزن', value: '' });

      }

      this.storeStackData = result.stacks;

      console.log(this.issueVoucher);

      console.log(this.storeData);

      console.log(this.storeStackData);

      this.buildMenu(this.order);

      this.populateSteps();

    });


  }


  populateSteps() {

    this.stepItems = [
      { label: 'مشرف التوزيع' },
      { label: 'مراجعة الفاتوره' },
      { label: 'أمين الصندوق' },
      { label: 'وزن السياره قبل الشحن' },
      { label: 'أمين السجلات' },
      { label: 'أمين المستودع' },
      { label: 'وزن السياره بعد الشحن' },
      { label: 'مكتمله' }
    ];

    this.activeStepIndex = this.stepItems.findIndex(step => { return step.label == this.order.order_status });

  }


  onEdit(event: any) {

    this.stacks = [];

    if (this.issueVoucher.items![event.index]) {

      // if (this.issueVoucher.items![event.index].store_id || this.issueVoucher.items![event.index].store_id == '') {

      //   this.stacks = [];

      // }

      let copiedStacks = this.storeStackData.filter(stack => { return stack.store == this.issueVoucher.items![event.index].store_id });

      for (let stack of copiedStacks) {

        this.stacks.push({ text: stack.text, value: stack.value });

      }

    }

    this.stacks.unshift({ text: 'إختر الصفه', value: '' });

    console.log(this.stacks);

  }


  cancel() {

    if (this.display_mode) {

      this.dialog.closeAll();

    }
    else {

      this.router.navigateByUrl('home');

    }

  }


  buildMenu(order: Partial<Order>) {

    this.dockItems = [
      {
        label: 'الفاتوره',
        tooltipOptions: {
          tooltipLabel: "الفاتوره",
          tooltipPosition: 'right',
          positionTop: -20,
          positionLeft: 45
      },
        icon: "/assets/bill.svg",

        command: async () => {

          if (this.order.bill_id && this.order.bill_id != '') {

            this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.getBill(this.order.bill_id)).then(result => {

              this.bill = result;

              let dialogRef = this.dialog.open(BillprintComponent, {
                height: '1200px',
                width: '1500px',
                data: { bill: this.bill }
              });

            });

          }

        }
      },
      {
        label: 'سند القبض',
        tooltipOptions: {
          tooltipLabel: "سند القبض",
          tooltipPosition: 'right',
          positionTop: -20,
          positionLeft: 45
      },
        icon: "/assets/receipt.svg",

        command: () => {

          if (this.order.receipt_voucher_id && this.order.receipt_voucher_id != '') {

            this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.getReceiptVoucher(this.order)).then(result => {

              this.receiptVoucher = result;

              let dialogRef = this.dialog.open(ReceiptVoucherComponent, {
                height: '1200px',
                width: '1500px',
                data: { receipt: this.receiptVoucher }
              });

            });

          }

        }
      },
      {
        label: 'سند الصرف',
        tooltipOptions: {
          tooltipLabel: "سند الصرف",
          tooltipPosition: 'right',
          positionTop: -20,
          positionLeft: 45
      },
        icon: "/assets/issue.svg",

        command: () => {

          if (this.order.issue_voucher_id && this.order.issue_voucher_id != '') {

            this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.getIssueVoucher(this.order)).then(result => {

              this.issueVoucher = result;

              let dialogRef = this.dialog.open(IssueVoucherPrintComponent, {
                height: '1200px',
                width: '1500px',
                data: { issue_voucher: this.issueVoucher }
              });

            });

          }

        }
      },
      {
        label: 'سجل الموافقات',
        tooltipOptions: {
          tooltipLabel: "سجل الموافقات",
          tooltipPosition: 'right',
          positionTop: -20,
          positionLeft: 45
      },
        icon: "/assets/history.svg",

        command: () => {

          this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.getActionLoags(this.order.id!)).then(result => {

            let logs: Partial<ActionLog>[] = result;

            let dialogRef = this.dialog.open(HistoryComponent, {
              height: '1200px',
              width: '1500px',
              data: { logs: logs }
            });

          });

        }
      }
    ];

  }


  setStoreValue(event: any, item: any, index: number) {

    console.log(item);

    if (this.issueVoucher && this.issueVoucher.items && this.issueVoucher.items.length > 0 && item.store_label && item.store_label != '') {

      let foundStore = this.storeData.find(storeItem => { return storeItem.value == item.store_label });

      console.log(foundStore);

      if (foundStore) {

        item.store_label = foundStore.text;

        item.store_id = foundStore.value;

        let copiedStacks = this.storeStackData.filter(stack => { return stack.store == item.store_id });

        this.stacks = [];

        for (let stack of copiedStacks) {

          this.stacks.push({ text: stack.text, value: stack.value });

        }

        this.stacks.unshift({ text: 'إختر الصفه', value: '' });

      }

    }
    else {

      item.store_label = '';

      item.store_id = '';

      item.stack_id = '';

      item.stack_label = '';

      this.stacks = [];

    }


  }


  async setStackValue(event: any, item: any, index: number) {

    if (this.issueVoucher && this.issueVoucher.items && this.issueVoucher.items.length > 0 && item.stack_label && item.stack_label != '') {

      let foundStack = this.stacks.find(stackItem => { return stackItem.value == item.stack_label });

      console.log(foundStack);

      if (foundStack) {

        item.stack_label = foundStack.text;

        item.stack_id = foundStack.value;

        let stackValid = await this.documentsService.isStackValid(this.order, this.issueVoucher.items[index]);

        console.log(this.issueVoucher.items[index]);

        console.log(stackValid);

        if (!stackValid) {

          item.stack_label = '';

          item.stack_id = '';

        }

      }

    }


  }


  async quantity_changed(item: any, index: number) {

    console.log('quantity changed');

    if (this.issueVoucher && this.issueVoucher.items && this.issueVoucher.items.length > 0) {

      let quanitity = await this.documentsService.getAllowedQuantity(this.order, this.issueVoucher.items[index]);

      if (this.issueVoucher.items[index].dispatched_quantity! > quanitity) {

        this.issueVoucher.items[index].dispatched_quantity = quanitity;

      }

      this.issueVoucher.items[index].total_weight = this.issueVoucher.items[index].dispatched_quantity! * this.issueVoucher.items[index].unit_weight!;

      this.issueVoucher.items[index].total_price = this.issueVoucher.items[index].dispatched_quantity! * this.issueVoucher.items[index].unit_price!;

    }

    console.log(this.issueVoucher);


  }


  buildBill() {

    this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.saveBill(this.order, this.items, this.customer)).then(result => {


    });

  }


  updateIssueVoucher() {

    console.log(this.issueVoucher);

    this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.updateIssueVoucher(this.order, this.issueVoucher)).then(result => {


    });

  }


  callReceiptIssueDialog() {

    this.displayreceipDialog = true;

  }


  callInitialScalingDialog() {

    this.displayInitialScalingDialog = true;

  }


  callFinalScalingDialog() {

    this.displayFinalScalingDialog = true;

  }


  buildReceiptIssue() {

    this.displayreceipDialog = false;

    this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.saveReceiptVoucher(this.order, this.check_no, this.check_date)).then(result => {


    });

  }


  updateInitialScalingScaler() {

    this.displayInitialScalingDialog = false;

    this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.updateIssueVoucherInitialScaling(this.order, this.vehicle_no, this.initial_scaling_card_no, this.initial_scaling)).then(result => {


    });

  }


  updateFinalScalingScaler() {

    this.displayFinalScalingDialog = false;

    this.loadingService.showLoaderWhenPromiseComplete(this.documentsService.updateIssueVoucherInitialScaling(this.order, '', this.final_scaling_card_no, this.final_scaling, true)).then(result => {


    });

  }



}
