import React from "react";
import { Layout } from "../../../common/Layout";
import { UserSidebar } from "../../../common/UserSidebar";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { apiUrl, getToken } from "../../../common/Config";
export const CreateCourse = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${apiUrl}courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //add token for the authorization
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        // Laravel validation errors example: { errors: { email: ["..."] } }
        if (result?.errors) {
          Object.keys(result.errors).forEach((field) => {
            setError(field, {
              type: "server",
              message: result.errors[field][0],
            });
          });
        }
        //appear toast if invalid credentials comes from backend
        toast.error(result.message);
        return; // stop, do not navigate
      }
      toast.success("Created Successfully");
      navigate("/account/courses/edit/" + result.data.id);
    } catch (error) {
      console.log(error);
    }
  };

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
                <h2 className="h4 mb-0 pb-0">Create Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="card border-0 shadow-lg">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <label htmlFor="title">Title</label>
                        <input
                          {...register("title", {
                            required: "The title field is required",
                          })}
                          type="text"
                          className={`form-control ${errors.title ? "is-invalid" : ""}`}
                          placeholder="Title"
                        />
                        {errors.title && (
                          <p className="invalid-feedback">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      <button className="btn btn-primary">Continue</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
