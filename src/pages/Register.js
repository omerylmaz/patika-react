import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import alertify from 'alertifyjs';
import authService from '../services/authService';

export default function Register() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const initialValues = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const onSubmit = async (userData, { setSubmitting }) => {
    try {
    //   const { confirmPassword, ...userData } = values; // confirmPassword'u API'ye göndermiyoruz
      await authService.register(userData);
      alertify.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      alertify.error(error.message || 'Registration failed!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mt-4">Register</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <Field name="fullName" type="text" className="form-control" placeholder="Enter full name" />
                <ErrorMessage name="fullName" component="small" className="text-danger" />
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <Field name="username" type="text" className="form-control" placeholder="Enter username" />
                <ErrorMessage name="username" component="small" className="text-danger" />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <Field name="email" type="email" className="form-control" placeholder="Enter email" />
                <ErrorMessage name="email" component="small" className="text-danger" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <Field name="password" type="password" className="form-control" placeholder="Enter password" />
                <ErrorMessage name="password" component="small" className="text-danger" />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <Field name="confirmPassword" type="password" className="form-control" placeholder="Confirm password" />
                <ErrorMessage name="confirmPassword" component="small" className="text-danger" />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
