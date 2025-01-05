import { api } from '../interceptors/axiosInterceptor';

class AuthService {
  async register(userData) {
    const response = await api.post('users/register', userData);
    return response.data.data;
  }

  async login(credentials) {
    const response = await api.post('users/login', credentials);
    return response.data.data;
  }

  async getUserDetails() {
    const response = await api.get('users/detail');
    console.log(response);
    return response.data.data;
  }

  async updateUserDetails(userData) {
    const response = await api.put('users', userData);
    return response.data.data;
  }

  async changePassword(passwordData) {
    const response = await api.patch('users/change-password', passwordData);
    return response.data.data;
  }

  async refreshToken(refreshToken) {
    const response = await api.post('users/refresh-token', refreshToken);
    return response.data.data;
  }
}

export default new AuthService();
