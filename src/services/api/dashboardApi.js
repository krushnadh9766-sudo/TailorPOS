import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosInstance.get('/dashboard');
    return response.data;
  },
};
