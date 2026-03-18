import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom'
import { apiUrl } from "../common/Config";
import  toast  from "react-hot-toast";
import { AuthContext } from "../Context/Auth";

export const Login = ()=> {

  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit, register, formState: {errors}, setError
  } = useForm()
  const handleLogin = async (data) => {
    // console.log('form data:', data);
  // return;
    try {
      const res = await fetch(`${apiUrl}login`, {
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
        //appear toast if invalid credentials comes from backend
        toast.error(result.message);
        return; // stop, do not navigate
      }
      const userInfo = {
         name: result?.user?.name,
         id: result?.user?.id,
         token:result?.access_token,
        }  
      const userToken = {
        token:result?.access_token,

      } 
      localStorage.setItem('userInfoLms',JSON.stringify(userInfo));
      localStorage.setItem('userToken',JSON.stringify(userToken));
      login(userInfo);
      navigate('/account/dashboard');
    } catch (error) {
      console.error(error);
    }
  };
   return(
     <section className="lms-login-page">
        <div className="lms-login-left">
          <div className="lms-login-brand">
            <p className="lms-login-logo">Ronsdemy</p>
            <h1>Learning University</h1>
          </div>
        </div>

        <div className="lms-login-right">
          <div className="lms-login-card">
            <h2>Login into your account</h2>

            <form className="lms-login-form" onSubmit={handleSubmit(handleLogin)}>
              <div className="lms-field-group">
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

              <div className="lms-field-group">
                <label htmlFor="password">Password *</label>
                <input
               {
                ...register('password', {
                  required: "The password field is required."
                })
              }
              
              id="password" className={`form-control`} type="password" placeholder="Password" />
              </div>

              <div className="lms-login-actions">
                <button type="submit">LOG IN</button>
                <Link to="/account/change-password">I CAN'T ACCESS MY ACCOUNT</Link>
              </div>

              <p className="lms-login-register-link">
                Don&apos;t have an account? <Link to="/account/register">Create one</Link>
              </p>
            </form>
          </div>
        </div>
     </section>
   )
}
