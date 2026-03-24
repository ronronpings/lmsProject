import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

export const CreateLesson = ({
  course,
  showLessonModal,
  handleCloseLessonModal,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        // console.log('Backend validation errors:', result?.errors);
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
      //update the state
      //   setChapters({ type: 'UPDATE_CHAPTER', payload: result.data });
      toast.success(result.message);
      reset({
        chapter_id: '',
        title: '',
        status: 1,
      });
      //close the modal
      handleCloseLessonModal();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal size="lg" show={showLessonModal} onHide={handleCloseLessonModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Chapter
              </label>

              <select
                {...register('chapter_id', {
                  required: 'The chapter field is required',
                })}
                className={`form-select ${errors.chapter_id && 'is-invalid'}`}
              >
                <option value="">Select Chapter</option>
                {course?.chapters?.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
              {errors.chapter_id && (
                <p className="invalid-feedback">{errors.chapter_id.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Lesson
              </label>
              <input
                {...register('title', {
                  required: 'The title field is required',
                })}
                type="text"
                className={`form-control ${errors.title && 'is-invalid'}`}
                placeholder="Title"
              />
              {errors.title && (
                <p className="invalid-feedback">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                {...register('status', {
                  required: 'The status field is required',
                })}
                className={`form-select ${errors.status && 'is-invalid'}`}
              >
                {/* <option value="">Select Status</option> */}
                <option value="1" defaultValue={1}>
                  Active
                </option>
                <option value="0">Blocked</option>
              </select>
              {errors.status && (
                <p className="invalid-feedback">{errors.status.message}</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={loading} variant="primary" type="submit">
              {loading == false ? 'Save Changes' : 'Please Wait...'}
            </Button>
            {/* <Button variant="primary" type="submit">
              Save Changes
            </Button> */}
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
