import React, { useEffect, useState } from 'react';
import { Layout } from '../../../common/Layout';
import { UserSidebar } from '../../../common/UserSidebar';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

export const EditLesson = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [chapters, setChapters] = useState([]);

  const params = useParams();

  const onSubmit = async () => {};

  //get course chapters that have lessons on api endpoint
  useEffect(() => {
    fetch(`${apiUrl}chapters?course_id=${params.courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        //add token for the authorization
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // if (!result.ok) {
        //   toast.error(result.message);
        //   console.log(result.message);
        //   return;
        // }
        setChapters(result.data);
      });
  }, []);
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
                  <h2 className="h4 mb-0 pb-0">Basic Information</h2>
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
                        </div>
                      </div>
                    </form>
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
