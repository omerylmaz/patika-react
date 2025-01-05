import axios from 'axios';
import authService from '../services/authService';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

const getRefreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await authService.refreshToken({ refreshToken });
    console.log(response);
    const { accessToken, refreshToken: newRefreshToken } = response.token;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error(error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;
      if (data && data.errors && data.errors.length > 0) {
        const combinedErrors = data.errors.join('\n');
        return Promise.reject(new Error(combinedErrors));
      }

     

      switch (status) {
        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const token = await getRefreshToken();
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return api(originalRequest);
            } catch (refreshError) {
              return Promise.reject(refreshError);
            }
          }
          break;

        case 403:
          return Promise.reject(new Error('You do not have permission to perform this action'));

        case 500:
            return Promise.reject(new Error('Internal server error occurred'));

        default:
          if (data && data.detail) {
            return Promise.reject(new Error(data.detail));
          }
          return Promise.reject(new Error(data.message || 'An unknown error occurred'));
      }
    } else {
      return Promise.reject(new Error('Server is unavailable'));
    }
  }
);

export { api };
