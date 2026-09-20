import axiosInstance from './axiosInstance';

export const paymentApi = {
  getPayments: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}/payments`);
    return response.data;
  },
  createPayment: async (orderId, paymentData) => {
    const response = await axiosInstance.post(`/orders/${orderId}/payments`, paymentData);
    return response.data;
  },
};
