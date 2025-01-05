import React from "react";
import { Link } from "react-router-dom";
import paymentSuccessImage from "../assets/images/payment-success.png";

export default function PaymentSuccess() {
  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
      <div className="card text-center shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-header bg-success text-white">
          <h2>Payment Successful</h2>
        </div>
        <div className="card-body">
          <div className="mb-4 d-flex justify-content-center">
            <img
              src={paymentSuccessImage}
              alt="Payment Success"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
            />
          </div>

          <h4 className="card-title text-success">Thank You!</h4>
          <p className="card-text">
            Your payment has been successfully processed.
          </p>
          <Link to="/" className="btn btn-primary mt-3">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
