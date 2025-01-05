import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import "../css/SliderComponent.css";

export default function SliderComponent({ bestSellingCourses = [] }) {
  const chunkedCourses = [];
  for (let i = 0; i < bestSellingCourses.length; i += 3) {
    chunkedCourses.push(bestSellingCourses.slice(i, i + 3));
  }

  return (
    <div className="slider-container mt-4">
      <Carousel
        nextIcon={
          <span
            className="custom-next-icon"
            aria-hidden="true"
            style={{
              fontSize: "2rem",
              color: "#007bff",
              backgroundColor: "rgba(31, 7, 7, 0.8)",
              padding: "10px",
              borderRadius: "50%",
            }}
          >
            &rarr;
          </span>
        }
        prevIcon={
          <span
            className="custom-prev-icon"
            aria-hidden="true"
            style={{
              fontSize: "2rem",
              color: "#007bff",
              backgroundColor: "rgba(31, 7, 7, 0.8)",
              padding: "10px",
              borderRadius: "50%",
            }}
          >
            &larr;
          </span>
        }
      >
        {chunkedCourses.map((courseGroup, index) => (
          <Carousel.Item key={index}>
            <div className="row">
              {courseGroup.map((course) => (
                <div className="col-md-4" key={course.courseId}>
                  <Link to={`/course/${course.courseId}`} className="text-decoration-none">
                    <div className="card-slider card-hovered shadow-sm">
                      <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="card-img-top"
                        style={{
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "10px 10px 0 0",
                        }}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">{course.name}</h5>
                        <p className="card-text">{course.title}</p>
                        <p className="text-success fw-bold">{course.price}₺</p>
                        <small className="text-muted">Sales: {course.salesCount}</small>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
