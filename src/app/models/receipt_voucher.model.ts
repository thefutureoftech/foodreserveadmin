import { Bill } from "./bill.model";

export interface Receipt_voucher {

  id: string;

  number: number;

  order_id: string;

  customer_id: string;

  bill: Partial<Bill>;      //Not to be stored in DB but read during program using bill_id;

  bill_id: string;

  receipt_date: Date;

  branch_name: string

}
