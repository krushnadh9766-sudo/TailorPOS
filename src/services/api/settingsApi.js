import axiosInstance from './axiosInstance';

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
