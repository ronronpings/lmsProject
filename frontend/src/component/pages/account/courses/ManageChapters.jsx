import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';
import Accordion from 'react-bootstrap/Accordion';
import { UpdateChapter } from './UpdateChapter';
import Swal from 'sweetalert2';
import { CreateLesson } from './CreateLesson';

//icons
import { FaPlus } from 'react-icons/fa';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';

export const ManageChapters = ({ course }) => {
  const [loading, setLoading] = useState(false);
  const params = useParams();

  //for the modal
  const [chapterData, setChapterData] = useState(null);

  //For chapter modal
  const [showChapter, setShowChapter] = useState(false);
  const handleClose = () => setShowChapter(false);
  const handleShow = (chapter) => {
    setShowChapter(true);
    setChapterData(chapter);
  };

  //for lesson modal
  const [showLessonModal, setShowLessonModal] = useState(false);
  const handleCloseLessonModal = () => setShowLessonModal(false);
  const handleShowLessonModal = () => {
    setShowLessonModal(true);
  };

  const chapterReducer = (state, action) => {
    switch (action.type) {
      case 'SET_CHAPTERS':
        return action.payload;
      case 'ADD_CHAPTER':
        return [...state, action.payload];
      case 'UPDATE_CHAPTER':
        return state.map((chapter) => {
          if (chapter.id === action.payload.id) {
            return action.payload;
          }
          return chapter;
        });
      case 'DELETE_CHAPTER':
        return state.filter((chapter) => chapter.id !== action.payload);
      default:
        return state;
    }
  };
  //add this to manage the state of the chapters
  const [chapters, setChapters] = useReducer(chapterReducer, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = { ...data, course_id: params.id };
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        console.log('Backend validation errors:', result?.errors);
        // Laravel validation errors example: { errors: { email: ["..."] } }
        if (result?.errors) {
          Object.keys(result.errors).forEach((field) => {
            setError(field, {
              type: 'server',
              message: result.errors[field][0],
            });
          });
        }

        //appear toast if invalid credentials comes from backend
        toast.error(result.message);
        return; // stop, do not navigate
      }
      setChapters({ type: 'ADD_CHAPTER', payload: result.data });
      toast.success('Chapter Added Successfully');
      reset({});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //ADD USE EFFECT TO FETCH THE CHAPTERS
  useEffect(() => {
    //comment this when you implement the fetch function
    //
    if (course?.chapters) {
      setChapters({ type: 'SET_CHAPTERS', payload: course.chapters });
    }
  }, [course]);

  //DELETE FUNCTION
  const deleteChapter = async (id) => {
    // Confirmation gamit ang SweetAlert
    const swalAlert = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (swalAlert.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}chapters/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          toast.error(result.message);
          return;
        }

        // Gagamitin ang reducer para tanggalin sa UI
        setChapters({ type: 'DELETE_CHAPTER', payload: id });
        toast.success(result.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //deleteFunction on lesson
  const deleteLesson = async (id) => {
    // Confirmation gamit ang SweetAlert
    const swalAlert = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (swalAlert.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}lessons/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          toast.error(result.message);
          return;
        }

        // Gagamitin ang reducer para tanggalin sa UI
        setChapters({ type: 'UPDATE_CHAPTER', payload: result.data });
        toast.success(result.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <div className="d-flex">
            <div className="d-flex justify-content-between w-100">
              <h4 className="h5 mb-3">Manage Chapters</h4>
              <Link onClick={() => handleShowLessonModal()}>
                <FaPlus size={12} />
                <strong>Add Lesson</strong>
              </Link>
            </div>
          </div>
          <form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register('title', {
                  required: 'The title field is required',
                })}
                type="text"
                className={`form-control ${errors.title && 'is-invalid'}`}
                placeholder="Chapter Title"
              />

              {errors.title && (
                <p className="invalid-feedback">{errors.title.message}</p>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? 'Save' : 'Please Wait...'}
            </button>
            {/* <button className="btn btn-primary">Save</button> */}
          </form>
          <Accordion>
            {chapters.map((chapter, index) => {
              return (
                <Accordion.Item eventKey={index} key={chapter.id}>
                  <Accordion.Header>{chapter.title}</Accordion.Header>
                  <Accordion.Body>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-between mb-2 mt-4">
                          <h5 className="h5">Lessons</h5>
                          <a className="h6" href="#" data-discover="true">
                            <strong>Reorder Lessons</strong>
                          </a>
                        </div>
                      </div>
                      <div className="col-md-12">
                        {chapter.lessons &&
                          chapter.lessons.map((lesson) => {
                            return (
                              <div
                                className="card shadow px-3 py-2 mb-2"
                                key={lesson.id}
                              >
                                {/* {lesson.title} */}
                                <div className="row">
                                  <div className="col-md-7">{lesson.title}</div>
                                  <div className="col-md-5 text-end">
                                    {lesson.duration > 0 && (
                                      <small className="fw-bold text-muted me-2">
                                        20 mins
                                      </small>
                                    )}

                                    {lesson.is_free_preview == 'yes' && (
                                      <span className="badge bg-success">
                                        Preview
                                      </span>
                                    )}
                                    <Link
                                      to={`/account/courses/edit-lesson/${lesson.id}/${course.id}`}
                                      className="ms-2"
                                    >
                                      <BsPencilSquare />
                                    </Link>
                                    <Link
                                      onClick={() => deleteLesson(lesson.id)}
                                      className="ms-2 text-danger"
                                    >
                                      <FaTrashAlt />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="col-md-12 mt-3">
                        <div className="d-flex">
                          <div className="">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteChapter(chapter.id)}
                            >
                              Delete Chapter
                            </button>
                            <button
                              className="btn btn-primary btn-sm ms-2"
                              onClick={() => handleShow(chapter)}
                            >
                              Update Chapter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      </div>

      <UpdateChapter
        showChapter={showChapter}
        handleClose={handleClose}
        chapterData={chapterData}
        setChapters={setChapters}
      />

      <CreateLesson
        showLessonModal={showLessonModal}
        handleCloseLessonModal={handleCloseLessonModal}
        course={course}
      />
    </>
  );
};
