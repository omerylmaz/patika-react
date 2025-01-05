import React from "react";

export default function CourseContent({ contents }) {
  return (
    <div className="accordion">
      {contents.map((content, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header" id={`heading-${index}`}>
            <button
              className={`accordion-button ${index === 0 ? "" : "collapsed"}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${index}`}
              aria-expanded={index === 0 ? "true" : "false"}
              aria-controls={`collapse-${index}`}
            >
              {content.title}
            </button>
          </h2>
          <div
            id={`collapse-${index}`}
            className={`accordion-collapse collapse ${
              index === 0 ? "show" : ""
            }`}
            aria-labelledby={`heading-${index}`}
          >
            <div className="accordion-body">
              <p>{content.description}</p>
              <p>
                <strong>Duration:</strong> {content.duration} minutes
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
