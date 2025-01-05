import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import alertify from 'alertifyjs';
import courseService from '../services/courseService';
import categoryService from '../services/categoryService';
import { useNavigate } from 'react-router-dom';

export default function CreateCourse() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data.categories);
      } catch (error) {
        alertify.error(error.message);
      }
    };

    fetchCategories();
  }, []);

  const initialValues = {
    name: '',
    title: '',
    categoryId: '',
    description: '',
    price: '',
    imageUrl: '',
    contents: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .max(150, 'Title must not exceed 150 characters'),
    name: Yup.string()
      .required('Name is required')
      .max(100, 'Name must not exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .max(1000, 'Description must not exceed 1000 characters'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive')
      .typeError('Price must be a number'),
    imageUrl: Yup.string().required('ImageUrl is required'),
    contents: Yup.array().of(
      Yup.object({
        title: Yup.string().required('Content title is required'),
        description: Yup.string().required('Content description is required'),
      })
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await courseService.createCourse(values);
      alertify.success('Course created successfully');
      navigate('/teacher');
    } catch (error) {
      alertify.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="text-center mb-0">Create New Course</h2>
        </div>
        <div className="card-body">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, values }) => (
              <Form>
                <div className="mb-4 position-relative">
                  <label className="form-label">Course Title</label>
                  <Field type="text" name="title" className="form-control" placeholder="Enter course title" />
                  <ErrorMessage name="title" component="div" className="text-danger small" />
                </div>

                <div className="mb-4 position-relative">
                  <label className="form-label">Course Name</label>
                  <Field type="text" name="name" className="form-control" placeholder="Enter course name" />
                  <ErrorMessage name="name" component="div" className="text-danger small" />
                </div>

                <div className="mb-4 position-relative">
                  <label className="form-label">Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="form-control"
                    placeholder="Enter course description"
                    rows="4"
                  />
                  <ErrorMessage name="description" component="div" className="text-danger small" />
                </div>

                <div className="mb-4 position-relative">
                  <label className="form-label">Price</label>
                  <Field type="number" name="price" className="form-control" placeholder="Enter course price" />
                  <ErrorMessage name="price" component="div" className="text-danger small" />
                </div>

                <div className="mb-4 position-relative">
                  <label className="form-label">Category</label>
                  <Field as="select" name="categoryId" className="form-control">
                    <option value="" label="Select a category" />
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="categoryId" component="div" className="text-danger small" />
                </div>

                <div className="mb-4 position-relative">
                  <label className="form-label">Image URL</label>
                  <Field
                    type="text"
                    name="imageUrl"
                    className="form-control"
                    placeholder="Enter image URL"
                  />
                  <ErrorMessage name="imageUrl" component="div" className="text-danger small" />
                </div>

                {/* Content Bölümü */}
                <FieldArray name="contents">
                  {({ remove, push }) => (
                    <div>
                      <h4>Course Contents</h4>
                      {values.contents.map((content, index) => (
                        <div key={index} className="mb-4 border p-3">
                          <h5>Content {index + 1}</h5>
                          <div className="mb-2">
                            <label className="form-label">Title</label>
                            <Field
                              type="text"
                              name={`contents[${index}].title`}
                              className="form-control"
                              placeholder="Enter content title"
                            />
                            <ErrorMessage name={`contents[${index}].title`} component="div" className="text-danger small" />
                          </div>

                          <div className="mb-2">
                            <label className="form-label">Description</label>
                            <Field
                              type="text"
                              name={`contents[${index}].description`}
                              className="form-control"
                              placeholder="Enter content description"
                            />
                            <ErrorMessage name={`contents[${index}].description`} component="div" className="text-danger small" />
                          </div>

                          <div className="mb-2">
                            <label className="form-label">Duration (hh:mm)</label>
<Field
                              type="time"
                              name={`contents.${index}.duration`}
                              className="form-control"
                            />
                            <ErrorMessage name={`contents[${index}].duration`} component="div" className="text-danger small" />
                          </div>

                          <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
                            Remove Content
                          </button>
                        </div>
                      ))}

                      <button type="button" className="btn btn-secondary mt-2" onClick={() => push({ title: '', description: '', duration: '' })}>
                        Add Content
                      </button>
                    </div>
                  )}
                </FieldArray>

                <button type="submit" className="btn btn-primary w-100 mt-4" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
