import React from "react";
import { Link } from "react-router-dom";
import unauthorizedImage from "../assets/images/unauthorized.png";

export default function Unauthorized() {
  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ height: "75vh" }}>
      <div className="card text-center shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-header bg-danger text-white">
          <h2>Unauthorized Access</h2>
        </div>
        <div className="card-body">
          <div className="mb-4 d-flex justify-content-center">
            <img
              src={unauthorizedImage}
              alt="Unauthorized"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
            />
          </div>

          <h4 className="card-title text-danger">Oops! You don't have access to this page.</h4>

          <Link to="/" className="btn btn-primary mt-3">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
