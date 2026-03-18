import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { apiUrl } from "../common/Config";
import  toast  from "react-hot-toast";

export const Register = ()=>{
  //use navigate and declared it to react-router-dom
  const navigate = useNavigate();
  //Handle submit on backend
 const{
      handleSubmit, register, formState: {errors}, setError
  } = useForm();

 const handleRegister = async (data) => {
  // console.log('form data:', data);
  try {
    const res = await fetch(`${apiUrl}register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    //import toast
  
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
      return; // stop, do not navigate
    }
    toast.success(result.message);
    navigate('/account/login');
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};


   return(
     <>
        <section className="lms-register-page">
      <div className="lms-register-left">
        <div className="lms-register-brand">
          <p className="lms-register-logo">Ronsdemy</p>
          <h1>Learning University</h1>
        </div>
      </div>

      <div className="lms-register-right">
        <div className="lms-register-card">
          <h2>Create your account</h2>

          <form className="lms-register-form" onSubmit={handleSubmit(handleRegister)}>
            <div className="lms-register-field-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                {...register('name', {
                  required: 'The name field is required.',
                  minLength: {
                    value: 5,
                    message: 'Name must be at least 5 characters.',
                  },
                })}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="fullName"
                type="text"
                placeholder="Full Name"
              />

              {errors.name && (
                <p className="invalid-feedback">{errors.name.message}</p>
              )}

              
            </div>

            <div className="lms-register-field-group">
              <label htmlFor="email">Email *</label>
              <input 
              
               {
                ...register('email', {
                    required: "The email field is required.",
                    pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                } 
                })
              }
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email" htmlFor="email" type="email" placeholder="Email" />
              {
                errors.email && <p className="invalid-feedback">{errors.email.message}</p>
              }
            </div>

            <div className="lms-register-field-group">
              <label htmlFor="password">Password *</label>
              <input
               {
                ...register('password', {
                  required: "The password field is required."
                })
              }
              
              id="password" className={`form-control`} type="password" placeholder="Password" />
            </div>

         

            <div className="lms-register-actions">
              <button type="submit">CREATE ACCOUNT</button>
              <Link to="/account/login">I ALREADY HAVE AN ACCOUNT</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
    </>

   )
}
