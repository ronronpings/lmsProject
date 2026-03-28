import React, { useEffect, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import { MdDragIndicator } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { apiUrl, getToken } from '../../../common/Config';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { UpdateRequirements } from './UpdateRequirements';

//drag and drop
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const ManageRequirements = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const params = useParams();

  //loading state
  const [loading, setLoading] = useState(false);

  //set requirements for
  const [requirements, setRequirements] = useState([]);
  const [requirementsData, setRequirementsData] = useState([]);

  //modals state
  const [showRequirements, setShowRequirements] = useState(false);
  const handleClose = () => setShowRequirements(false);

  //para sa pagpasa ng data sa modal
  const handleShow = (requirement) => {
    setShowRequirements(true);
    setRequirementsData(requirement);
  };

  //submit
  const onSubmit = async (data) => {
    console.log(data);
    //data to be sent to the backend
    const formData = { ...data, course_id: params.id };

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
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

      //add the new data to the existing data
      const newRequirements = [...requirements, result.data];
      setRequirements(newRequirements);
      toast.success('Requirement Added Successfully');
      reset({});
    } catch (errors) {
      console.log(errors);
    } finally {
      setLoading(false);
    }
  };

  //get requirements from backend
  const fetchRequirements = async () => {
    try {
      const res = await fetch(`${apiUrl}requirements?course_id=${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${getToken()}`,
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
      setRequirements(result.data);
      //   navigate('/account/courses/edit/' + result.data.id);
    } catch (error) {
      console.log(error);
    }
  };
  //use effect to fetch the requirements
  useEffect(() => {
    fetchRequirements();
  }, []);

  //delete function
  const deleteRequirements = async (id) => {
    const swalAlert = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (swalAlert.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}requirements/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            //add token for the authorization
            Authorization: `Bearer ${getToken()}`,
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
        //remove the deleted requirement from the list and update the state
        const newRequirements = requirements.filter(
          (requirement) => requirement.id !== id
        );
        setRequirements(newRequirements);
        toast.success(result.message);
        //   navigate('/account/courses/edit/' + result.data.id);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return; // Kapag binitawan sa labas ng listahan
    const items = Array.from(requirements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRequirements(items);
    saveOrder(items);
  };

  const saveOrder = async (updatedRequirements) => {
    try {
      const res = await fetch(`${apiUrl}sort-requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ text: updatedRequirements }),
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
      toast.success(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Requirements</h4>
          </div>
          <form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register('text', {
                  required: 'The requirement field is required',
                })}
                type="text"
                className={`form-control ${errors.text ? 'is-invalid' : ''}`}
                placeholder="Requirements"
              />
              {errors.text && (
                <div className="invalid-feedback">{errors.text.message}</div>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? 'Save' : 'Please Wait...'}
            </button>
          </form>
          {/* display the requirements */}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="requirements">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {requirements &&
                    requirements.map((requirement, index) => (
                      <Draggable
                        key={requirement.id.toString()}
                        draggableId={requirement.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="card shadow mb-2"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="card-body p-2 d-flex">
                              <div>
                                <MdDragIndicator />
                              </div>
                              <div className="d-flex justify-content-between w-100">
                                <div className="ps-2">{requirement.text}</div>
                                <div className="d-flex">
                                  <Link
                                    className="text-primary me-1"
                                    onClick={() => handleShow(requirement)}
                                  >
                                    <BsPencilSquare />
                                  </Link>
                                  <Link
                                    className="text-danger"
                                    onClick={() =>
                                      deleteRequirements(requirement.id)
                                    }
                                  >
                                    <FaTrashAlt />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* {requirements &&
            requirements.map((requirement) => {
              return (
                <div className="card shadow mb-2" key={requirement.id}>
                  <div className="card-body p-2 d-flex">
                    <div>
                      <MdDragIndicator />
                    </div>
                    <div className="d-flex justify-content-between w-100">
                      <div className="ps-2">{requirement.text}</div>
                      <div className="d-flex">
                        <Link
                          className="text-primary me-1"
                          onClick={() => handleShow(requirement)}
                        >
                          <BsPencilSquare />
                        </Link>
                        <Link
                          className="text-danger"
                          onClick={() => deleteRequirements(requirement.id)}
                        >
                          <FaTrashAlt />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })} */}
        </div>
      </div>

      {/* MODAL */}
      <UpdateRequirements
        showRequirements={showRequirements}
        requirementsData={requirementsData}
        handleClose={handleClose}
        requirements={requirements}
        setRequirements={setRequirements}
      />
    </>
  );
};
