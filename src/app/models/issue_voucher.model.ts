import { Bill } from "./bill.model";

export interface Issue_voucher {

  id: string;

  number: number;

  order_id: string;

  customer_car_no: string;

  voucher_number: string;

  issue_voucher_date: Date;

  bill: Partial<Bill>;      //Not to be stored in DB but read during program using bill_id;

  items: Partial<{
    stock_id: string;
    stoc_name: string;
    quanitity: number;
    unit_weight: number;
    total_weight: number;
    unit_price: number;
    total_price: number;
    account_code: string;
    store_id: string;
    store_label: string;
    stack_id: string
    stack_label: string;
    container_no: string;
    dispatched_quantity: number;
  }>[],

  bill_id: string;

  total_weight: number;

  weight_card_no_before_loading: string;

  weight_before_loading: number;

  weight_card_no_after_loading: string;

  weight_after_loading: number;

}
