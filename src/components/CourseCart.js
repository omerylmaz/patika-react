import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course, showUpdateAndDelete, showGoToDetails, onDelete }) {
  const truncateTitle = (title) => {
    if (title?.length > 50) {
      return `${title.slice(0, 50)}...`;
    }
    return title;
  };

  if (!course) {
    return null;
  }

  return (
    <div className="col-md-4 mb-4">
      <div className="card card-hovered h-100 shadow rounded">
        <Link to={`/course/${course.id}`} style={{ textDecoration: 'none' }}>
          <img
            src={course.imageUrl || ''}  //TODO default image daha sonra koyacam
            alt={course.name}
            className="card-img-top"
            style={{ objectFit: 'cover', height: '200px' }}
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{course.name}</h5>
          <p className="card-text text-muted">{truncateTitle(course.title)}</p>
          <p className="card-text fw-bold text-success">{`${course.price || 'Free'}₺`}</p>

          {showGoToDetails && (
            <Link to={`/course/${course.id}`} className="btn btn-primary btn-lg mt-3">
              Go to Details
            </Link>
          )}

          {showUpdateAndDelete && (
            <div className="mt-3 d-flex justify-content-between">
              <Link
                to={`/teacher/courses/edit/${course.id}`}
                className="btn btn-warning btn-lg rounded shadow-sm px-4"
              >
                Edit
              </Link>
              <button
                className="btn btn-danger btn-lg rounded shadow-sm px-4"
                onClick={() => onDelete(course.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
