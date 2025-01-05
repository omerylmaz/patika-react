import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCart';
import courseService from '../services/courseService';
import { Modal, Button } from 'react-bootstrap';
import 'alertifyjs/build/css/alertify.css';
import alertify from 'alertifyjs';
import { useNavigate } from 'react-router-dom';

export default function TeacherPanel() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCourses = async (page, size) => {
    setLoading(true);
    try {
      const data = await courseService.getPaginatedTeacherCourses(page, size);
      setCourses(data.courses.items);
      setTotalCount(data.courses.totalCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(pageNumber, pageSize);
  }, [pageNumber, pageSize]);

  const handleShowModal = (id) => {
    setSelectedCourseId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourseId(null);
  };

  const handleDeleteCourse = async () => {
    try {
      await courseService.deleteCourse(selectedCourseId);
      setCourses(courses.filter((course) => course.id !== selectedCourseId));
      alertify.success('Course deleted successfully');
    } catch (err) {
      alertify.error(err.message);
    } finally {
      handleCloseModal();
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
<div className="container mt-4 mb-4">
  <h1 className="d-inline-block">My Courses</h1>
  <button
    className="btn btn-success mb-3 float-end"
    onClick={() => navigate("/teacher/courses/create")}
  >
    Create New Course
  </button>
  <div className="clearfix"></div>
  <div className="row mt-4">
    {courses.map((course) => (
      <CourseCard
  key={course.id}
  course={course}
  showUpdateAndDelete={true}
  showGoToDetails={false}
  onDelete={handleShowModal}
/>
    ))}
  </div>

  {totalPages > 1 && (
    <nav>
      <ul className="pagination justify-content-center mt-4">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${
              pageNumber === number ? "active" : ""
            }`}
          >
            <button
              onClick={() => setPageNumber(number)}
              className="page-link"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )}


      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this course?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCourse}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}