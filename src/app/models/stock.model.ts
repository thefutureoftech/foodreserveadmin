export interface Stock {

  id: string;

  name: string;

  arabicName: string;

  price: number;

  currency: string;

  weight: number;

  unit: string;

  expiry_date: Date;

  accountCode: string;

  max_quantity: number;   //make sure you don't save this to db

  selected_quantity: number

}
