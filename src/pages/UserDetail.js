import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CourseCart from "../components/CourseCart";
import Spinner from "../components/LoadingSpinner";
import authService from "../services/authService";
import courseService from "../services/courseService";
import alertify from "alertifyjs";
import { useNavigate } from "react-router-dom";

export default function UserDetail() {
  const [userDetails, setUserDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await authService.getUserDetails();
        setUserDetails(userResponse);
        const coursesResponse = await courseService.getPaidCourses(
          pageNumber,
          pageSize
        );
        console.log(coursesResponse);
        setCourses(coursesResponse.courses.items);
        setTotalCount(coursesResponse.courses.totalCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    console.log(totalCount);

    fetchData();
  }, [pageNumber, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const userValidationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New Password is required"),
  });

  const handleEditUserSubmit = async (values, { setSubmitting }) => {
    try {
      await authService.updateUserDetails(values);
      alertify.success("User details updated successfully!");
      setUserDetails(values);
      setEditingUser(false);
    } catch (err) {
      alertify.error(err.message || "Failed to update user details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePasswordSubmit = async (values, { setSubmitting }) => {
    try {
      await authService.changePassword(values);
      alertify.success("Password updated successfully!");
      setEditingPassword(false);
    } catch (error) {
      alertify.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Details</h1>

      {editingUser ? (
        <Formik
          initialValues={userDetails}
          validationSchema={userValidationSchema}
          onSubmit={handleEditUserSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="card shadow p-4 mb-4">
              <h3>Edit User Details</h3>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <Field
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Enter full name"
                />
                <ErrorMessage
                  name="fullName"
                  component="small"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                />
                <ErrorMessage
                  name="email"
                  component="small"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <Field
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="Enter phone number"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="small"
                  className="text-danger"
                />
              </div>
              <div className="d-flex mt-4">

              <button
                type="submit"
                className="btn btn-success btn me-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setEditingUser(false)}
              >
                Cancel
              </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="card shadow p-4 mb-4">
          <h2>{userDetails?.fullName}</h2>
          <p>
            <strong>Username:</strong> {userDetails?.userName}
          </p>
          <p>
            <strong>Email:</strong> {userDetails?.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {userDetails?.phoneNumber}
          </p>
          <div className="d-flex mt-4">
          <button
      className="btn btn-primary me-2"
      onClick={() => setEditingUser(true)}
    >
      Edit Details
    </button>
    <button
      className="btn btn-outline-secondary"
      onClick={() => navigate("/orders")}
    >
      View Order History
    </button>
  </div>
        </div>
      )}

      {editingPassword ? (
        <Formik
          initialValues={{ currentPassword: "", newPassword: "" }}
          validationSchema={passwordValidationSchema}
          onSubmit={handleChangePasswordSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="card shadow p-4 mb-4">
              <h3>Change Password</h3>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <Field
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  placeholder="Enter current password"
                />
                <ErrorMessage
                  name="currentPassword"
                  component="small"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  className="form-control"
                  placeholder="Enter new password"
                />
                <ErrorMessage
                  name="newPassword"
                  component="small"
                  className="text-danger"
                />
              </div>

              <div className="d-flex mt-4">
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setEditingPassword(false)}
              >
                Cancel
              </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <button
          className="btn btn-warning"
          onClick={() => setEditingPassword(true)}
        >
          Change Password
        </button>
      )}

      <h2 className="text-center mb-4">Purchased Courses</h2>
      {isLoading ? (
        <div className="d-flex justify-content-center my-4">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="row">
            {courses.map((course) => (
              <CourseCart key={course.id} course={course} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center mt-4">
                {[...Array(totalPages).keys()].map((number) => (
                  <li
                    key={number + 1}
                    className={`page-item ${
                      pageNumber === number + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => setPageNumber(number + 1)}
                      className="page-link"
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
