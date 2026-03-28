import React, { useState, useEffect } from 'react';

//Modals
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { apiUrl, getToken } from '../../../common/Config';
import toast from 'react-hot-toast';

export const UpdateOutcome = ({
  outcomeData,
  showOutcome,
  handleClose,
  outcomes,
  setOutcomes,
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
      const res = await fetch(`${apiUrl}outcomes/${outcomeData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${getToken()}`,
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
      const updatedOutcomes = outcomes.map((outcome) =>
        outcome.id == result.data.id
          ? { ...outcome, text: result.data.text }
          : outcome
      );
      setOutcomes(updatedOutcomes);
      toast.success('Outcome Title Updated Successfully');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Kapag nagbago yung outcomeData (pagkinlick mo yung Edit), rereset nito yung form value gamit yung current data
  useEffect(() => {
    if (outcomeData) {
      reset({
        text: outcomeData.text, // Dito kinukuha yung existing title para ilagay sa input
      });
    }
  }, [outcomeData, reset]);
  return (
    <>
      <Modal size="lg" show={showOutcome} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Outcome</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Title
              </label>
              <input
                {...register('text', {
                  required: 'The title field is required',
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
            {/* <Button variant="primary" type="submit">
              Save Changes
            </Button> */}
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
