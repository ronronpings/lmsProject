import React, { useEffect, useState } from 'react';
import { Course } from './Course';
import { apiUrl } from './Config';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);
  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const response = await fetch(`${apiUrl}all-courses`);
      const data = await response.json();

      if (!response.ok || !data.status) {
        toast.error(data.message);
        return;
      }
      console.log(data.data);
      setCourses(data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };
  return (
    <>
      <section className="section-3 my-5">
        <div className="container">
          <div className="section-title py-3  mt-4">
            <h2 className="h3">Featured Courses</h2>
            <p>
              Discover courses designed to help you excel in your professional
              and personal growth.
            </p>
          </div>
          <div className="row gy-4">
            <AnimatePresence mode="wait">
              {coursesLoading ? (
                <motion.div
                  key="loading"
                  className="row gy-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="col-12 d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="courses"
                  className="row gy-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {courses.map((course) => (
                    <Course
                      key={course.id}
                      title={course.title}
                      level={course.level?.name}
                      enrolled={course.enrolled}
                      price={course.price}
                      image={course.course_small_image}
                      customClasses="col-lg-4 col-md-6"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
};
