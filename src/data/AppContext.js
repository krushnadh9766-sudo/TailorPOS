import React, {createContext, useState} from 'react';
import {initialOrders, initialCustomers} from './mockData';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);

  const addOrder = (order) => {
    setOrders([order, ...orders]);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? {...o, status: newStatus} : o)),
    );
  };

  const addPayment = (orderId, amount) => {
    setOrders(
      orders.map((o) => {
        if (o.id === orderId) {
          const newPaid = o.paid + amount;
          const newBalance = o.total - newPaid;
          return {...o, paid: newPaid, balance: newBalance};
        }
        return o;
      }),
    );
  };

  const addCustomer = (customer) => {
    setCustomers([...customers, customer]);
  };

  const updateCustomerMeasurements = (customerId, newMeasurements) => {
    setCustomers(
      customers.map((c) =>
        c.id === customerId ? {...c, measurements: newMeasurements} : c
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        orders,
        customers,
        addOrder,
        updateOrderStatus,
        addPayment,
        addCustomer,
        updateCustomerMeasurements,
      }}>
      {children}
    </AppContext.Provider>
  );
};

