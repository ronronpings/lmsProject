import React, { useState, useEffect } from 'react';
//Modals
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

export const UpdateChapter = ({
  showChapter,
  handleClose,
  chapterData,
  setChapters,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}chapters/${chapterData.id}`, {
        method: 'PUT',
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
      setChapters({ type: 'UPDATE_CHAPTER', payload: result.data });
      toast.success('Chapter Updated Successfully');
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chapterData) {
      reset({
        title: chapterData.title,
      });
    }
  }, [chapterData, reset]);

  return (
    <>
      <Modal size="lg" show={showChapter} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Chapter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Title
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
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={loading} variant="primary" type="submit">
              {loading == false ? 'Save Changes' : 'Please Wait...'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
