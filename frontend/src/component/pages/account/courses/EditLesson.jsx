import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Layout } from '../../../common/Layout';
import { UserSidebar } from '../../../common/UserSidebar';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiUrl, getToken } from '../../../common/Config';

import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';
import { LessonVideo } from './LessonVideo';

export const EditLesson = ({ placeholder }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [chapters, setChapters] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [loading, setLoading] = useState(false);

  //for the loading state on edit lesson page JODIT EDITOR
  const [isLoaded, setIsLoaded] = useState(false);

  const params = useParams();
  //for the jodit editor on description
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || 'Start typings...',
    }),
    [placeholder]
  );

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = {
        ...data,
        description: content,
        course_id: params.courseId,
      };

      const res = await fetch(`${apiUrl}lessons/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
      } else {
        toast.error('Error updating lesson');
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //get course chapters that have lessons on api endpoint
  useEffect(() => {
    fetch(`${apiUrl}chapters?course_id=${params.courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        //add token for the authorization
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setChapters(result.data);
        }
      });

    fetch(`${apiUrl}lessons/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        //add token for the authorization
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setLesson(result.data);
          reset({
            title: result.data.title,
            chapter_id: result.data.chapter_id,
            duration: result.data.duration,
            status: result.data.status,
            is_free_preview:
              result.data.is_free_preview === 'yes' ? true : false,
          });
          setContent(result.data.description || '');
          setIsLoaded(true);
        }
      });
  }, [params.courseId, params.id]);
  return (
    <>
      <Layout>
        <section className="section-4">
          <div className="container pb-5 pt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/account">Account</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dashboard
                </li>
              </ol>
            </nav>
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">Edit Lesson</h2>
                  <Link
                    className="btn btn-primary"
                    to={`/account/courses/edit/${params.courseId}`}
                  >
                    Back
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 account-sidebar">
                <UserSidebar />
              </div>
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-md-8">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="card border-0 shadow-lg">
                        <div className="card-body p-4">
                          <h4 className="h5 border-bottom pb-3 mb-3">
                            Basic Information
                          </h4>
                          <div className="mb-3">
                            <label htmlFor="title">Title</label>
                            <input
                              type="text"
                              className="form-control"
                              id="title"
                              {...register('title', {
                                required: 'Title is required',
                              })}
                            />
                            {errors.title && (
                              <p className="text-danger">
                                {errors.title.message}
                              </p>
                            )}
                          </div>
                          <div className="mb-3">
                            <label htmlFor="">Chapter</label>
                            <select
                              name="chapter_id"
                              id="chapter_id"
                              className="form-select"
                              {...register('chapter_id', {
                                required: 'Chapter is required',
                              })}
                            >
                              <option value="">Select Chapter</option>
                              {chapters.map((chapter) => (
                                <option key={chapter.id} value={chapter.id}>
                                  {chapter.title}
                                </option>
                              ))}
                            </select>
                            {errors.chapter_id && (
                              <p className="text-danger">
                                {errors.chapter_id.message}
                              </p>
                            )}
                          </div>
                          <div className="mb-3">
                            <label htmlFor="duration">
                              Duration (in minutes)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="duration"
                              {...register('duration', {
                                required: 'Duration is required',
                              })}
                            />
                            {errors.duration && (
                              <p className="text-danger">
                                {errors.duration.message}
                              </p>
                            )}
                          </div>
                          <div className="mb-3">
                            <label htmlFor="description">Description</label>

                            {isLoaded ? (
                              <JoditEditor
                                ref={editor}
                                value={content}
                                config={config}
                                onBlur={(newContent) => setContent(newContent)}
                              />
                            ) : (
                              <p>Loading Editor...</p>
                            )}
                          </div>
                          <div className="mb-3">
                            <label htmlFor="status">Status</label>
                            <select
                              name="status"
                              id="status"
                              className="form-select"
                              {...register('status', {
                                required: 'Status is required',
                              })}
                            >
                              <option value="">Select Status</option>
                              <option value="1">Active</option>
                              <option value="0">Block</option>
                            </select>
                            {errors.status && (
                              <p className="text-danger">
                                {errors.status.message}
                              </p>
                            )}
                          </div>
                          {/* //checkbox */}
                          <div className="d-flex">
                            <input
                              type="checkbox"
                              name="is_free_preview"
                              value="1"
                              id="freeLesson"
                              className="form-check-input"
                              {...register('is_free_preview')}
                            />
                            <label className="ms-2" htmlFor="freeLesson">
                              Free Lesson
                            </label>
                          </div>

                          {/* <button
                            type="submit"
                            className="btn btn-primary mt-4"
                          >
                            Update Lesson
                          </button> */}
                          <button
                            disabled={loading}
                            className="btn btn-primary mt-4"
                          >
                            {loading == false ? 'Update' : 'Please Wait...'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-4">
                    <LessonVideo lesson={lesson} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};
