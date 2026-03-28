import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/Config';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Logo from '../../assets/images/login.png';

export const Register = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();

  const handleRegister = async (data) => {
    try {
      const res = await fetch(`${apiUrl}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result?.errors) {
          Object.keys(result.errors).forEach((field) => {
            setError(field, {
              type: 'server',
              message: result.errors[field][0],
            });
          });
        }
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      navigate('/account/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="login-page">
      <div className="login-left">
        <div className="brand">
          <img src={Logo} alt="" />
        </div>
      </div>

      <motion.div
        className="login-right"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      >
        <div className="login-card">
          <h2>Create your account</h2>
          <p className="subtitle">Sign up to start your learning journey</p>

          <form onSubmit={handleSubmit(handleRegister)}>
            <div className="field">
              <input
                {...register('name', {
                  required: 'The name field is required.',
                  minLength: {
                    value: 5,
                    message: 'Name must be at least 5 characters.',
                  },
                })}
                id="fullName"
                type="text"
                placeholder="Full Name"
              />
              {errors.name && <span>{errors.name.message}</span>}
            </div>

            <div className="field">
              <input
                {...register('email', {
                  required: 'The email field is required.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                id="email"
                type="email"
                placeholder="Email"
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>

            <div className="field">
              <input
                {...register('password', {
                  required: 'The password field is required.',
                })}
                id="password"
                type="password"
                placeholder="Password"
              />
              {errors.password && <span>{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn-login">
              Create Account
            </button>

            <p className="signup">
              Already have an account? <Link to="/account/login">Log in</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
};
