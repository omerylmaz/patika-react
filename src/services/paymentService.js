import { api } from '../interceptors/axiosInterceptor';

class PaymentService {
  async payCourse(paymentData) {
      const response = await api.post('payments', paymentData);
      console.log(response);
      return response.data.data;
  }
}

export default new PaymentService();
