import axiosInstance from './axiosInstance';

export const orderApi = {
  getOrders: async (status = '', search = '') => {
    const params = {};
    if (status && status !== 'All') params.status = status;
    if (search) params.search = search;
    const response = await axiosInstance.get('/orders', { params });
    return response.data;
  },
  getOrder: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};
