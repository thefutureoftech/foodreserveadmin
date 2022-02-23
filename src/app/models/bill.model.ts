export interface Bill {

  id: string;

  number: number;

  order_id: string;

  customer_id: string;

  customer_number: number;

  customer_name: string;

  customer_address: {
    city: string;
  };

  customer_bank_details: {
    account_no: string;
    bankName: string;
  };

  items: Partial<{
    stock_id: string;
    stoc_name: string;
    quanitity: number;
    unit_weight: number;
    total_weight: number;
    unit_price: number;
    total_price: number;
    account_code: string;
    // store_id: string;
    // store_label: string;
    // stack_id: string
    // stack_label: string;
    // container_no: string;
    // dispatched_quantity: number;
  }>[],

  receipt_voucher_number: number;

  issue_voucher_number: number;

  bill_date: Date;

  issuer_id: string;

  approver_id: string;

  customer_check_no: string;

  customer_due_amount: number;

  customer_payment_due_date: Date;

  receipt_voucher_date: Date;

  issue_voucher_date: Date;

  total_riyals: number;

  total_bizas: number;

}
