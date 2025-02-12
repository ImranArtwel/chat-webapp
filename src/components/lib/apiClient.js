import axios from "axios";

const LOCAL_API_URL = "http://localhost:7002/api";

const aviseApiConfig = {
  baseURL: import.meta.env.VITE_SERVER_URL || LOCAL_API_URL,
};
const axiosInstance = axios.create(aviseApiConfig);
export const axiosInstanceJustForMockingPurposesOK = axiosInstance;
export const simpleFetcher = (url, config) => {
  return axiosInstance.get(url, config).then((res) => res.data);
};

export const api = {
  ...axiosInstance,
  get: (url, config) => {
    return axiosInstance.get(url, config);
  },
  post: (url, data, config) => {
    return axiosInstance.post(url, data, config);
  },
  put: (url, data, config) => {
    return axiosInstance.put(url, data, config);
  },
  patch: (url, data, config) => {
    return axiosInstance.patch(url, data, config);
  },
  delete: (url, config) => {
    return axiosInstance.delete(url, config);
  },
};
// api.interceptors.request.use((config) => {
//   console.log('Making request to:', config.url, 'with data:', config.data);
//   return config;
// });
