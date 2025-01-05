import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import alertify from 'alertifyjs';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values);
      alertify.success('Login successful!');
      navigate('/');
    } catch (error) {
      alertify.error(error.message || 'Login failed!');
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mt-4">Login</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <Field
                  name="email"
                  type="text"
                  className="form-control"
                  placeholder="Enter email"
                />
                <ErrorMessage name="email" component="small" className="text-danger" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                />
                <ErrorMessage name="password" component="small" className="text-danger" />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
