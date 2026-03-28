import React, { useEffect, useState } from 'react';
import { Layout } from '../../common/Layout';
import { Link } from 'react-router-dom';
import { UserSidebar } from '../../common/UserSidebar';
import { CourseEdit } from '../../common/CourseEdit';
import { apiUrl, getToken } from '../../common/Config';
import toast from 'react-hot-toast';

export const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const res = await fetch(`${apiUrl}my-courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        //add token for the authorization
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await res.json();
    if (!res.ok) {
      toast.error(result.message);
      return;
    }
    if (result.data) {
      //update the course data

      setCourses(result.data);
    }
    if (result.message) {
      toast.success(result.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <>
      <Layout>
        <section className="section-4">
          <div className="container">
            <div className="row">
              <div className="col-md-12 mt-5 mb-3">
                <div className="d-flex justify-content-between">
                  <h2 className="h4 mb-0 pb-0">My Courses</h2>
                  <Link
                    to="/account/courses/create"
                    className="btn btn-primary"
                  >
                    Create
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 account-sidebar">
                <UserSidebar />
              </div>
              <div className="col-lg-9">
                <div className="row gy-4">
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <CourseEdit
                        key={course.id}
                        course={course}
                        onDeleted={(id) =>
                          setCourses((prev) => prev.filter((c) => c.id !== id))
                        }
                      />
                    ))
                  ) : (
                    <div className="col-md-12">
                      <div className="alert alert-info">
                        You have no courses yet. Create one to get started. Or
                        Loading
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};
