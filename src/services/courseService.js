import { api } from '../interceptors/axiosInterceptor';

class CourseService {
  async getPaginatedCourses(pageNumber, pageSize) {
    const response = await api.get(`courses/?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data.data;
  }

  async getPaginatedCoursesByFiltering(pageNumber, pageSize, searchTerm, category) {
    const params = {
      pageNumber,
      pageSize,
      name: searchTerm || undefined,
      categoryName: category || undefined,
    };
  
    const response = await api.get(`courses/filtering`, { params });
    return response.data.data;
  }

  async getCourseById(courseId) {
    const response = await api.get(`courses/${courseId}`);
    console.log(response);
    return response.data;
  }

  async getPaidCourses(pageNumber, pageSize) {
    const response = await api.get(`courses/user/paid?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  }

  async getPaginatedTeacherCourses(pageNumber, pageSize) {
    const response = await api.get(`courses/teacher?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  }

  async createCourse(courseData) {
    console.log(courseData);
    return await api.post("courses/", courseData);
  }

  async updateCourse(courseData) {
    return await api.put(`courses/`, courseData);
  }

  async deleteCourse(courseId) {
    return await api.delete(`courses/${courseId}`);
  }

  async getBestSellingCourses(count) {
    const response = await api.get(`courses/best-selling?count=${count}`);
    return response.data;
  }
}

export default new CourseService();