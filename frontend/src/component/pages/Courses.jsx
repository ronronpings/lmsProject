import React, { useEffect, useState } from 'react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';
import { Course } from '../common/Course';
import { apiUrl } from '../common/Config';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export const Courses = () => {
  //state
  const [rating, setRating] = useState(4.0);

  //state on category
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [categoryloading, setcategoryLoading] = useState(false);
  const [levelLoading, setlevelLoading] = useState(false);
  const [languageLoading, setlanguageLoading] = useState(false);

  //search params
  const [searchParams, setSearchParams] = useSearchParams();

  //category checked
  const [categoryChecked, setCategoryChecked] = useState(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });
  const handleCategory = (e) => {
    const { value, checked } = e.target;
    //add category id in array if checked
    if (checked) {
      setCategoryChecked((prev) => [...prev, value]);
    } else {
      setCategoryChecked((prev) => prev.filter((item) => item !== value));
    }
  };

  //level checked
  const [levelChecked, setLevelChecked] = useState(() => {
    const level = searchParams.get('level');
    return level ? level.split(',') : [];
  });
  const handleLevel = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setLevelChecked((prev) => [...prev, value]);
    } else {
      setLevelChecked((prev) => prev.filter((item) => item !== value));
    }
  };

  //language checked
  const [languageChecked, setLanguageChecked] = useState(() => {
    const language = searchParams.get('language');
    return language ? language.split(',') : [];
  });
  const handleLanguage = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setLanguageChecked((prev) => [...prev, value]);
    } else {
      setLanguageChecked((prev) => prev.filter((item) => item !== value));
    }
  };

  //pass to backend

  const fetchCourses = async () => {
    setCoursesLoading(true);
    let search = [];
    let params = '';

    if (categoryChecked.length > 0) {
      search.push(['category', categoryChecked]);
    }

    if (levelChecked.length > 0) {
      search.push(['level', levelChecked]);
    }

    if (languageChecked.length > 0) {
      search.push(['language', languageChecked]);
    }

    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }

    try {
      const response = await fetch(`${apiUrl}fetch-courses?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok || !data.status) {
        console.error('Failed to fetch courses:', data.message);
        setCourses([]);
        return;
      }
      console.log(data.data);
      setCourses(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchCourseFilters = async () => {
    setcategoryLoading(true);
    setlevelLoading(true);
    setlanguageLoading(true);
    try {
      const response = await fetch(`${apiUrl}course-filters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok || !data.status) {
        console.error('Failed to fetch course filters:', data.message);
        setCategories([]);
        setLevels([]);
        setLanguages([]);
        return;
      }

      setCategories(
        Array.isArray(data.data?.categories) ? data.data.categories : []
      );
      setLevels(Array.isArray(data.data?.levels) ? data.data.levels : []);
      setLanguages(
        Array.isArray(data.data?.languages) ? data.data.languages : []
      );
    } catch (error) {
      console.error('Error fetching course filters:', error);
      setCategories([]);
      setLevels([]);
      setLanguages([]);
    } finally {
      setcategoryLoading(false);
      setlevelLoading(false);
      setlanguageLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseFilters();
  }, []);

  //separate use effect for filters checked to avoid infinite loop
  useEffect(() => {
    fetchCourses();
  }, [categoryChecked, levelChecked, languageChecked]);

  return (
    <>
      <Header />
      <div className="container pb-5 pt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Courses
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-lg-3">
            <div className="sidebar mb-5 card border-0">
              <div className="card-body shadow">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by keyword"
                />
                <div className="pt-3">
                  <h3 className="h5 mb-2">Category</h3>
                  <ul>
                    {categoryloading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      categories.map((category, index) => (
                        <li key={index}>
                          <div className="form-check">
                            <input
                              onClick={(e) => handleCategory(e)}
                              className="form-check-input"
                              type="checkbox"
                              value={category.id}
                              id={`flexCheckDefault${category.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`flexCheckDefault${category.id}`}
                            >
                              {category.name}
                            </label>
                          </div>
                        </li>
                      ))
                    )}
                    {/* <li>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Web Development
                        </label>
                      </div>
                    </li> */}
                  </ul>
                </div>
                <div className="mb-3">
                  <h3 className="h5  mb-2">Level</h3>
                  <ul>
                    {levelLoading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      levels.map((level, index) => (
                        <li key={index}>
                          <div className="form-check">
                            <input
                              onClick={handleLevel}
                              className="form-check-input"
                              type="checkbox"
                              value={level.id}
                              id={`levelCheck${level.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`levelCheck${level.id}`}
                            >
                              {level.name}
                            </label>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="mb-3">
                  <h3 className="h5 mb-2">Language</h3>
                  <ul>
                    {languageLoading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      languages.map((language, index) => (
                        <li key={index}>
                          <div className="form-check">
                            <input
                              onClick={handleLanguage}
                              className="form-check-input"
                              type="checkbox"
                              value={language.id}
                              id={`languageCheck${language.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`languageCheck${language.id}`}
                            >
                              {language.name}
                            </label>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <a href="" className="clear-filter">
                  Clear All Filters
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <section className="section-3">
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <div className="h5 mb-0">
                  {courses.length} {courses.length === 1 ? 'course' : 'courses'}{' '}
                  found
                </div>
                <div>
                  <select name="" id="" className="form-select">
                    <option value="0">Newset First</option>
                    <option value="1">Oldest First</option>
                  </select>
                </div>
              </div>
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
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
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
                    {courses.length > 0 ? (
                      courses.map((course, index) => (
                        <Course
                          key={course.id || index}
                          title={course.title}
                          level={course.level?.name}
                          enrolled={course.enrolled}
                          price={course.price}
                          image={course.course_small_image}
                          customClasses="col-lg-4 col-md-6"
                        />
                      ))
                    ) : (
                      <div className="col-12 py-5 text-center">
                        <h4 className="text-muted">
                          No courses found matching your criteria.
                        </h4>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
