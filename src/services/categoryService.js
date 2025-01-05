import { api } from '../interceptors/axiosInterceptor';

class CategoryService {
  async getAllCategories() {
    const response = await api.get(`categories`);
    return response.data.data;
  }
}

export default new CategoryService();