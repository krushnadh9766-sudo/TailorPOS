import axiosInstance from './axiosInstance';

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
