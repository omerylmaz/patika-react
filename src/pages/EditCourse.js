import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import courseService from '../services/courseService';
import categoryService from '../services/categoryService';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/LoadingSpinner';

export default function EditCourse() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const categories = await categoryService.getAllCategories();
        setCategories(categories.categories);

        const course = await courseService.getCourseById(id);
        setInitialValues({
          name: course.data.name,
          title: course.data.title,
          description: course.data.description,
          price: course.data.price,
          categoryId: categories.categories.find(cat => cat.name === course.data.categoryName).id,
          imageUrl: course.data.imageUrl,
          contents: course.data.contents || [],
        });
        setIsLoading(false);
      } catch (error) {
        alertify.error(error.message);
      }
    };

    fetchCourse();
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Course name is required')
    .max(100, 'Course name must not exceed 100 characters'),
    title: Yup.string().required('Course title is required')
    .max(150, 'Course title must not exceed 150 characters'),
    description: Yup.string().required('Course description is required')
    .max(1000, 'Course description must not exceed 1000 characters'),
    price: Yup.number().required('Price is required')
    .positive('Price must be positive').typeError('Price must be a number'),
    imageUrl: Yup.string().required('Image URL is required'),
    contents: Yup.array().of(
      Yup.object({
        title: Yup.string().required('Content title is required'),
        description: Yup.string().required('Content description is required'),
      })
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      values.id = id;
      await courseService.updateCourse(values);
      alertify.success('Course updated successfully');
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
          <h2 className="text-center mb-0">Edit Course</h2>
        </div>
        <div className="card-body">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, values }) => (
              <Form>
                <div className="mb-4 position-relative">
                  <label className="form-label">Course Name</label>
                  <Field type="text" name="name" className="form-control" placeholder="Enter course name" />
                  <ErrorMessage name="name" component="div" className="text-danger position-absolute small" />
                </div>

                <div className="mb-4 position-relative">
                  <label className="form-label">Course Title</label>
                  <Field type="text" name="title" className="form-control" placeholder="Enter course title" />
                  <ErrorMessage name="title" component="div" className="text-danger position-absolute small" />
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
                  <ErrorMessage name="description" component="div" className="text-danger position-absolute small" />
                </div>

                <div className="mb-4 position-relative">
                  <label className="form-label">Price</label>
                  <Field type="number" name="price" className="form-control" placeholder="Enter course price" />
                  <ErrorMessage name="price" component="div" className="text-danger position-absolute small" />
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
                  <ErrorMessage name="categoryId" component="div" className="text-danger position-absolute small" />
                </div>

                <div className="mb-4 position-relative">
                  <label className="form-label">Image URL</label>
                  <Field type="text" name="imageUrl" className="form-control" placeholder="Enter image URL" />
                  <ErrorMessage name="imageUrl" component="div" className="text-danger position-absolute small" />
                </div>

                <FieldArray name="contents">
                  {({ push, remove }) => (
                    <div>
                      <h4>Course Contents</h4>
                      {values.contents.map((content, index) => (
                        <div key={index} className="mb-3">
                          <div className="mb-2">
                            <label>Content Title</label>
                            <Field
                              type="text"
                              name={`contents.${index}.title`}
                              className="form-control"
                              placeholder="Enter content title"
                            />
                            <ErrorMessage name={`contents.${index}.title`} component="div" className="text-danger" />
                          </div>
                          <div className="mb-2">
                            <label>Content Description</label>
                            <Field
                              type="text"
                              name={`contents.${index}.description`}
                              className="form-control"
                              placeholder="Enter content description"
                            />
                            <ErrorMessage name={`contents.${index}.description`} component="div" className="text-danger" />
                          </div>
                          <div className="mb-2">
                            <label>Duration (hh:mm)</label>
                            <Field
                              type="time"
                              name={`contents.${index}.duration`}
                              className="form-control"
                            />

                            <ErrorMessage name={`contents.${index}.duration`} component="div" className="text-danger" />
                          </div>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(index)}>
                            Remove Content
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => push({ title: '', description: '', duration: '' })}>
                        Add Content
                      </button>
                    </div>
                  )}
                </FieldArray>

                <button type="submit" className="btn btn-primary w-100 mt-4" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Course'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
