export interface Ledger {

  id: string;

  branch_id: string;

  branch_name: string;

  store_id: string;

  store_name: string;

  stack_id: string;

  stack_name: string;

  stock_id: string;

  stock_name: string;

  change_date: Date;

  request_id: string;

  request_type: string;

  previous_quantity: number;

  previous_quantity_weight: number;

  changed_quantity: number;

  changed_quantity_weight: number;

  new_quantity: number;

  new_quantity_weight: number;


}
