import os

frontend_api_dir = "src/services/api"

axios_instance_code = """import axios from 'axios';

// For local Android Emulator, 10.0.2.2 points to host localhost
// For physical device, change to your PC's IP address
const BASE_URL = 'http://10.0.2.2:8000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
"""

customer_api_code = """import axiosInstance from './axiosInstance';

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
"""

order_api_code = """import axiosInstance from './axiosInstance';

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
"""

payment_api_code = """import axiosInstance from './axiosInstance';

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
"""

measurement_api_code = """import axiosInstance from './axiosInstance';

export const measurementApi = {
  getMeasurements: async (customerId) => {
    const response = await axiosInstance.get(`/customers/${customerId}/measurements`);
    return response.data;
  },
  getMeasurement: async (customerId, garmentType) => {
    const response = await axiosInstance.get(`/customers/${customerId}/measurements/${garmentType}`);
    return response.data;
  },
  saveMeasurement: async (customerId, measurementData) => {
    // We use POST since the backend handles create/update via POST in our setup
    const response = await axiosInstance.post(`/customers/${customerId}/measurements`, measurementData);
    return response.data;
  },
};
"""

dashboard_api_code = """import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosInstance.get('/dashboard');
    return response.data;
  },
};
"""

settings_api_code = """import axiosInstance from './axiosInstance';

export const settingsApi = {
  getShopSettings: async () => {
    const response = await axiosInstance.get('/settings/shop');
    return response.data;
  },
  updateShopSettings: async (settingsData) => {
    const response = await axiosInstance.put('/settings/shop', settingsData);
    return response.data;
  },
};
"""

os.makedirs(frontend_api_dir, exist_ok=True)

def write_file(filename, content):
    with open(os.path.join(frontend_api_dir, filename), "w") as f:
        f.write(content)

write_file("axiosInstance.js", axios_instance_code)
write_file("customerApi.js", customer_api_code)
write_file("orderApi.js", order_api_code)
write_file("paymentApi.js", payment_api_code)
write_file("measurementApi.js", measurement_api_code)
write_file("dashboardApi.js", dashboard_api_code)
write_file("settingsApi.js", settings_api_code)

print("Frontend API services created.")

