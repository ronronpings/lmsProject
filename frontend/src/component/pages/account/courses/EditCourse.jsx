import React, { useEffect, useState } from 'react';
import { Layout } from '../../../common/Layout';
import { UserSidebar } from '../../../common/UserSidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';
import { ManageOutcome } from './ManageOutcome';
import { ManageRequirements } from './ManageRequirements';

export const EditCourse = () => {
  const params = useParams();
  //loading if submiting
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm(
    //kunin yung mg data para automatic ng meron
    {
      defaultValues: async () => {
        try {
          const res = await fetch(`${apiUrl}courses/${params.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              //add token for the authorization
              Authorization: `Bearer ${token}`,
            },
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
          // console.log(result);
          //reset para ipakita yung current data on field form
          reset({
            title: result.data.title,
            category_id: String(result?.data?.category_id ?? ''),
            level_id: String(result?.data?.level_id ?? ''),
            language_id: String(result?.data?.language_id ?? ''),
            description: result.data.description,
            price: result.data.price,
            cross_price: result.data.cross_price,
          });
        } catch (error) {
          console.log(error);
        }
      },
    }
  );
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}courses/update/${params.id}`, {
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

      toast.success('Updated Successfully');
      //   navigate('/account/courses/edit/' + result.data.id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //Retrive Data from backend api
  const retriveData = async () => {
    try {
      const res = await fetch(`${apiUrl}courses/meta-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${token}`,
        },
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
      setCategories(result.categories);
      setLevels(result.levels);
      setLanguages(result.languages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    retriveData();
  }, []);
  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Dashboard
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-md-7">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-lg">
                      <div className="card-body p-4">
                        <h4 className="h5 border-bottom pb-3 mb-3">
                          Course Details
                        </h4>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="title">
                            Title
                          </label>
                          <input
                            {...register('title', {
                              required: 'The title field is required',
                            })}
                            type="text"
                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                            placeholder="Title"
                          />
                          {errors.title && (
                            <p className="invalid-feedback">
                              {errors.title.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="category">
                            Category
                          </label>
                          <select
                            className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                            id="category"
                            {...register('category_id', {
                              required: 'The category field is required',
                            })}
                          >
                            <option value="">Select Category</option>
                            {categories?.map((category) => (
                              <option
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.name}
                              </option>
                            ))}
                          </select>
                          {errors.category_id && (
                            <p className="invalid-feedback">
                              {errors.category_id.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="level">
                            Level
                          </label>
                          <select
                            className={`form-select ${errors.level_id ? 'is-invalid' : ''}`}
                            id="level"
                            {...register('level_id', {
                              required: 'The level field is requried',
                            })}
                          >
                            <option value="">Select Level</option>
                            {levels?.map((level) => (
                              <option key={level.id} value={level.id}>
                                {level.name}
                              </option>
                            ))}
                          </select>
                          {errors.level_id && (
                            <p className="invalid-feedback">
                              {errors.level_id.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="language">
                            Language
                          </label>
                          <select
                            className={`form-select ${errors.language_id ? 'is-invalid' : ''}`}
                            id="level"
                            {...register('language_id', {
                              required: 'This language field is required',
                            })}
                          >
                            <option value="">Select Language</option>
                            {languages?.map((language) => (
                              <option key={language.id} value={language.id}>
                                {language.name}
                              </option>
                            ))}
                          </select>
                          {errors.language_id && (
                            <p className="invalid-feedback">
                              {errors.language.language_id}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="description">
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows={5}
                            placeholder="Description"
                            className="form-control"
                            {...register('description', {})}
                          ></textarea>
                        </div>

                        <h4 className="h5 border-bottom pb-3 mb-3">Price</h4>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="cross-price">
                            Sell Price
                          </label>
                          <input
                            {...register('price', {
                              required: 'The sell price field is required',
                            })}
                            type="text"
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                            placeholder=" Sell Price"
                            id="sell-price"
                          />
                          {errors.price && (
                            <p className="invalid-feedback">
                              {errors.price.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="cross-price">
                            Cross Price
                          </label>
                          <input
                            {...register('cross_price', {})}
                            type="text"
                            className="form-control"
                            placeholder=" Cross Price"
                            id="cross-price"
                          />
                        </div>

                        <button disabled={loading} className="btn btn-primary">
                          {loading == false ? 'Update' : 'Please Wait...'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="col-md-5">
                  <ManageOutcome />
                  <div className="mt-3">
                    <ManageRequirements />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
