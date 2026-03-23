import React, { useState, useEffect } from 'react';

//Modals
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

export const UpdateRequirements = ({
  requirementsData,
  showRequirements,
  handleClose,
  requirements,
  setRequirements,
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
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}requirements/${requirementsData.id}`, {
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

      //update the value of the edit outcomes
      const updatedRequirements = requirements.map((requirement) =>
        requirement.id == result.data.id
          ? { ...requirement, text: result.data.text }
          : requirement
      );
      setRequirements(updatedRequirements);
      toast.success('Requirement Title Updated Successfully');
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Kapag nag bago yung requirementsData (pag kinlick mo yung Edit), reset nito yung value tapos kinuha nito yung existing data title.
  useEffect(() => {
    if (requirementsData) {
      reset({
        text: requirementsData.text,
      });
    }
  }, [requirementsData, reset]);

  return (
    <>
      <Modal size="lg" show={showRequirements} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Requirement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Title
              </label>
              <input
                {...register('text', {
                  required: 'The description field is required',
                })}
                type="text"
                className={`form-control ${errors.text && 'is-invalid'}`}
                placeholder="Title"
              />
              {errors.text && (
                <p className="invalid-feedback">{errors.text.message}</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={loading}
              className="btn btn-primary"
              type="submit"
            >
              {loading == false ? 'Save' : 'Please Wait...'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
