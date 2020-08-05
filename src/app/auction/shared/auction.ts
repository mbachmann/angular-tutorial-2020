export interface Auction {
  id: number;
  seller: string;
  category: Category;
  auctionItem: AuctionItem;
  bids: Bid[];
  startDateTime: Date;
  startingPrice: number;
  endDateTime: Date;
  isFixedPrice: boolean;
  minBidIncrement: number;
  fixedPrice: number;
  pendingPayment?: PendingPayment;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Bid {
  id: number;
  amount: number;
  cancelExplanation: string;
  placedAtDateTime: Date;
  buyer: string;
}

export interface AuctionItem {
  description: string;
  picture: string;
  title: string;
}

export interface PendingPayment {
  id: number;
  amount: number;
  date: Date;
}

export interface PaymenTransaction {
  id: number;
  date: Date;
  paymentInstrument: PaymentInstrument;
}

export interface PaymentInstrument {
  id: number;
  date: Date;
  transactionInfo: any;
}
