export interface Customer {

  id: string;

  user_id: string;

  email: string;

  name: string;

  arabicName: string;

  bankDetails: {
    account_no: string;
    bankName: string;
  };

  number: number;

  address: {
    city: string;
  }

}
