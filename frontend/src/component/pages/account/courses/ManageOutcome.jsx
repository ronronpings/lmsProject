import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

//icons
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';

import { UpdateOutcome } from './UpdateOutcome';

export const ManageOutcome = () => {
  //loading if submiting
  const [loading, setLoading] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [outcomeData, setOutcomesData] = useState([]);

  //modals states
  const [showOutcome, setShowOutcome] = useState(false);
  const handleClose = () => setShowOutcome(false);

  //for passing the data to the modal
  const handleShow = (outcome) => {
    // console.log('Clicked Outcome ID:', outcome.id);
    setShowOutcome(true);
    setOutcomesData(outcome);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm();
  const params = useParams();

  const onSubmit = async (data) => {
    const formData = { ...data, course_id: params.id };
    // console.log(formData);

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}outcomes`, {
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

      //add this for the auto appearing of mga bagong input
      const newOutcomes = [...outcomes, result.data];
      setOutcomes(newOutcomes);
      toast.success('Outcome Added Successfully');
      reset({});
      //   navigate('/account/courses/edit/' + result.data.id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOutcomes = async () => {
    try {
      const res = await fetch(`${apiUrl}outcomes?course_id=${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${token}`,
        },
        //WALA NA TO
        // body: JSON.stringify(formData),
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
      setOutcomes(result.data);
      //   navigate('/account/courses/edit/' + result.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  //delete
  const deleteOutcomes = async (id) => {
    if (confirm('Are you sure you want to delete?')) {
      try {
        const res = await fetch(`${apiUrl}outcomes/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            //add token for the authorization
            Authorization: `Bearer ${token}`,
          },
          //WALA NA TO
          // body: JSON.stringify(formData),
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
        //remove the deleted outcome from the list and update the state
        const newOutcomes = outcomes.filter((outcome) => outcome.id !== id);
        setOutcomes(newOutcomes);
        toast.success(result.message);
        //   navigate('/account/courses/edit/' + result.data.id);
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
            <h4 className="h5 mb-3">Outcome</h4>
          </div>
          <form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register('text', {
                  required: 'The outcome field is required',
                })}
                type="text"
                className={`form-control ${errors.text && 'is-invalid'}`}
                placeholder="Outcome"
              />

              {errors.text && (
                <p className="invalid-feedback">{errors.text.message}</p>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? 'Save' : 'Please Wait...'}
            </button>
          </form>

          {outcomes &&
            outcomes.map((outcome) => {
              return (
                <div className="card shadow mb-2" key={outcome.id}>
                  <div className="card-body p-2 d-flex">
                    <div>
                      <MdDragIndicator />
                    </div>
                    <div className="d-flex justify-content-between w-100">
                      <div className="ps-2">{outcome.text}</div>
                      <div className="d-flex">
                        <a
                          href="#"
                          className="text-primary me-1"
                          onClick={() => handleShow(outcome)}
                        >
                          <BsPencilSquare />
                        </a>
                        <a
                          href="#"
                          className="text-danger"
                          onClick={() => deleteOutcomes(outcome.id)}
                        >
                          <FaTrashAlt />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <UpdateOutcome
        outcomeData={outcomeData}
        showOutcome={showOutcome}
        handleClose={handleClose}
        outcomes={outcomes}
        setOutcomes={setOutcomes}
      />
    </>
  );
};
