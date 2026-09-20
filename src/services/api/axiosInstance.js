import axios from 'axios';

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
