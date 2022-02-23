import { Item } from "./item.model";

export interface Order {

  id: string;

  customer_id: string;

  branch_id: string;

  branch_name: string;

  items: Partial<Item>[];

  order_date: Date;

  order_status: string;

  bill_id: string;

  receipt_voucher_id: string;

  issue_voucher_id: string;

}
