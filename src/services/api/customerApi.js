import axiosInstance from './axiosInstance';

export const customerApi = {
  getCustomers: async (search = '') => {
    const params = search ? { search } : {};
    const response = await axiosInstance.get('/customers', { params });
    return response.data;
  },
  getCustomer: async (id) => {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data;
  },
  createCustomer: async (customerData) => {
    const response = await axiosInstance.post('/customers', customerData);
    return response.data;
  },
  updateCustomer: async (id, customerData) => {
    const response = await axiosInstance.put(`/customers/${id}`, customerData);
    return response.data;
  },
};
