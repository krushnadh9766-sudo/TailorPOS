export const initialOrders = [
  {
    id: 'TP-0041',
    customer: 'Rahul Sharma',
    customerMobile: '9876543210',
    items: [
      { type: 'Shirt', quantity: 2, price: 1000 },
      { type: 'Pant', quantity: 1, price: 800 }
    ],
    total: 2800,
    paid: 1600,
    balance: 1200,
    dueDate: '12 Sep 2026',
    orderDate: '5 Sep 2026',
    status: 'In Progress'
  },
  {
    id: 'TP-0040',
    customer: 'Priya Menon',
    customerMobile: '9845012345',
    items: [
      { type: 'Blouse', quantity: 3, price: 600 }
    ],
    total: 1800,
    paid: 1800,
    balance: 0,
    dueDate: '10 Sep 2026',
    orderDate: '3 Sep 2026',
    status: 'Ready'
  },
  {
    id: 'TP-0039',
    customer: 'Arun Kumar',
    customerMobile: '9900112233',
    items: [
      { type: 'Suit', quantity: 1, price: 5500 }
    ],
    total: 5500,
    paid: 4700,
    balance: 800,
    dueDate: '15 Sep 2026',
    orderDate: '8 Sep 2026',
    status: 'Pending'
  },
  {
    id: 'TP-0038',
    customer: 'Sunita Rao',
    customerMobile: '9712345678',
    items: [
      { type: 'Kurta', quantity: 4, price: 500 },
      { type: 'Blouse', quantity: 2, price: 600 }
    ],
    total: 3200,
    paid: 700,
    balance: 2500,
    dueDate: '8 Sep 2026',
    orderDate: '1 Sep 2026',
    status: 'Pending'
  },
  {
    id: 'TP-0037',
    customer: 'Vijay Nair',
    customerMobile: '9988776655',
    items: [
      { type: 'Pant', quantity: 2, price: 600 }
    ],
    total: 1200,
    paid: 1200,
    balance: 0,
    dueDate: '5 Sep 2026',
    orderDate: '30 Aug 2026',
    status: 'Delivered'
  },
  {
    id: 'TP-0036',
    customer: 'Rahul Sharma',
    customerMobile: '9876543210',
    items: [
      { type: 'Shirt', quantity: 1, price: 800 }
    ],
    total: 800,
    paid: 800,
    balance: 0,
    dueDate: '2 Sep 2026',
    orderDate: '26 Aug 2026',
    status: 'Delivered'
  }
];

export const initialCustomers = [
  {
    id: 'C001',
    name: 'Rahul Sharma',
    mobile: '9876543210',
    orders: 8,
    due: 1200
  },
  {
    id: 'C002',
    name: 'Priya Menon',
    mobile: '9845012345',
    orders: 14,
    due: 0
  },
  {
    id: 'C003',
    name: 'Arun Kumar',
    mobile: '9900112233',
    orders: 3,
    due: 800
  },
  {
    id: 'C004',
    name: 'Sunita Rao',
    mobile: '9712345678',
    orders: 22,
    due: 2500
  },
  {
    id: 'C005',
    name: 'Vijay Nair',
    mobile: '9988776655',
    orders: 5,
    due: 0
  }
];

// Helper to format currency
export const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const getCurrentDateFormatted = () => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date().toLocaleDateString('en-IN', options);
};

