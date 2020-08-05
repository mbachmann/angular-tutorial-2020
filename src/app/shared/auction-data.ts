import {Auction} from './auction';

export const AUCTION_DATA: Auction[] =
  [
    {
      id: 1,
      seller: 'Felix',
      category: {id: 1, name: 'Bikes', description: 'Motor bikes'},
      auctionItem:
        {
          title: 'Yamaha YZF R1 Sports Bike',
          description: 'Ready to take a "walk" on the wild side ',
          picture: '01-yamaha-blue.png'
        },
      startDateTime: getDate(-5),
      startingPrice: 4000,
      fixedPrice: 5000,
      bids:
        [
          {id: 1, amount: 4100, cancelExplanation: '', placedAtDateTime: getDate(-4), buyer: 'Max'},
          {id: 2, amount: 4200, cancelExplanation: '', placedAtDateTime: getDate(-3), buyer: 'Klaus'},
          {id: 3, amount: 4300, cancelExplanation: '', placedAtDateTime: getDate(-4), buyer: 'Nadja'}
        ],
      endDateTime: getDate(1),
      isFixedPrice: false,
      minBidIncrement: 100
    },
    {
      id: 2,
      seller: 'Max',
      category: {id: 1, name: 'Bikes', description: 'Motor bikes'},
      auctionItem:
        {
          title: 'Yamaha FZ V2.0 FI ',
          description: 'Nice for a city ride',
          picture: '02-yamaha-aquamarine.png'
        },
      startDateTime: getDate(-5),
      startingPrice: 2200,
      fixedPrice: 3000,
      bids:
        [
          {id: 4, amount: 2200, cancelExplanation: '', placedAtDateTime: getDate(-4), buyer: 'Felix'},
          {id: 5, amount: 2300, cancelExplanation: '', placedAtDateTime: getDate(-3), buyer: 'Nadja'},
          {id: 6, amount: 2400, cancelExplanation: '', placedAtDateTime: getDate(-4), buyer: 'Klaus'}
        ],
      endDateTime: getDate(1),
      isFixedPrice: false,
      minBidIncrement: 100
    },
    {
      id: 3,
      seller: 'Klaus',
      category: {id: 1, name: 'Bikes', description: 'Motor bikes'},
      auctionItem:
        {
          title: 'Yamaha SZ RR V 2.0',
          description: 'The stylish bike with a nice red color',
          picture: '03-yamaha-red.png'
        },
      startDateTime: getDate(-5),
      startingPrice: 1000,
      fixedPrice: 2000,
      bids:
        [
          {id: 7, amount: 1000, cancelExplanation: '', placedAtDateTime: getDate(-4), buyer: 'Max'},
          {id: 8, amount: 1100, cancelExplanation: '', placedAtDateTime: getDate(-3), buyer: 'Nadja'},
          {id: 9, amount: 1200, cancelExplanation: '', placedAtDateTime: getDate(-4), buyer: 'Felix'}
        ],
      endDateTime: getDate(1),
      isFixedPrice: false,
      minBidIncrement: 100
    }
  ];

function getDate(days: number): Date {
  return addDays(new Date(), days);
}

function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}
