export interface Item {

  id: string;

  order_id: string;

  stock_id: string;

  stock_name: string;

  branch_name: string;

  status: string;

  sub_items: Partial<sub_item>[];

  booked_stacks: Partial<BookedStack>[];   //This is used to track all booked stakcs by the user in order to free them after they are actually delivered to user as consumed will replace it somewhere else

}


export interface sub_item {

  id: string;

  order_id: string;

  item_id: string;

  quantity: number;

  bill_id: string;

  receipt_voucher_id: string;

  status: string;

  issue_voucher_id: string;

}


export interface BookedStack {

  stack_id: string;

  quantity: number;

}
