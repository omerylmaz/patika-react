import { api } from '../interceptors/axiosInterceptor';

class NotificationService {
  async getAllNotifications(pageNumber, pageSize) {
    const response = await api.get(`notifications/?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data.data;
  }

  async markAsRead(notificationId) {
    console.log(notificationId);
    const response = await api.patch(`/notifications/mark-as-read/${notificationId}`);
    console.log(response.data);
    return response.data;
  }
}

export default new NotificationService();