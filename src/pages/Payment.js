import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import paymentService from "../services/paymentService";
import { initializeSignalRConnection, registerTransaction, onReceivePayment } from "../services/signalRService";
import alertify from "alertifyjs";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = {
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
    courseId: state?.course.id,
  };

  const validationSchema = Yup.object({
    cardHolderName: Yup.string().required("Card Holder Name is required"),
    cardNumber: Yup.string()
      .matches(/^[0-9]{16}$/, "Card Number must be 16 digits")
      .required("Card Number is required"),
    expireMonth: Yup.string()
      .matches(/^(0[1-9]|1[0-2])$/, "Invalid Month Format")
      .required("Expire Month is required"),
    expireYear: Yup.string()
      .matches(/^\d{4}$/, "Invalid Year")
      .required("Expire Year is required"),
    cvc: Yup.string()
      .matches(/^[0-9]{3}$/, "CVC must be 3 digits")
      .required("CVC is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);
    let popup = null;

    try {
      const response = await paymentService.payCourse(values);
      const { conversationId, htmlContent } = response;

      await initializeSignalRConnection();
      await registerTransaction(conversationId);

      onReceivePayment((paymentNotification) => {
        const { message, errorMessage } = paymentNotification;

        if (message === "success") {
          alertify.success("Payment completed successfully.");
          popup?.close();
          navigate("/payment-success");
        } else {
          console.log("Payment failed");
          alertify.error(errorMessage);
          popup?.close();
        }
      });

      const popup = window.open("", "3D Secure Verification", "width=600,height=400");
      popup.document.write(htmlContent);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
      popup?.close();
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <img
          src={course.imageUrl}
          alt={course.name}
          className="card-img-top mb-4"
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
        <h2 className="text-center mb-4">Payment for {course.name}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Card Holder Name</label>
                <Field
                  type="text"
                  name="cardHolderName"
                  className="form-control"
                  placeholder="Enter Card Holder Name"
                />
                <ErrorMessage name="cardHolderName" component="small" className="text-danger" />
              </div>

              <div className="mb-3">
                <label className="form-label">Card Number</label>
                <Field
                  type="text"
                  name="cardNumber"
                  className="form-control"
                  placeholder="Enter Card Number"
                />
                <ErrorMessage name="cardNumber" component="small" className="text-danger" />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Expire Month</label>
                  <Field
                    type="text"
                    name="expireMonth"
                    className="form-control"
                    placeholder="MM"
                  />
                  <ErrorMessage name="expireMonth" component="small" className="text-danger" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Expire Year</label>
                  <Field
                    type="text"
                    name="expireYear"
                    className="form-control"
                    placeholder="YYYY"
                  />
                  <ErrorMessage name="expireYear" component="small" className="text-danger" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">CVC</label>
                <Field
                  type="password"
                  name="cvc"
                  className="form-control"
                  placeholder="CVC"
                />
                <ErrorMessage name="cvc" component="small" className="text-danger" />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? "Processing..." : "Pay Now"}
              </button>
            </Form>
          )}
        </Formik>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}
