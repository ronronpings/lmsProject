import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../common/Config';
import toast from 'react-hot-toast';
import { AuthContext } from '../Context/Auth';
import Logo from '../../assets/images/login.png';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();
  const handleLogin = async (data) => {
    // console.log('form data:', data);
    // return;
    try {
      const res = await fetch(`${apiUrl}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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
              type: 'server',
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
        token: result?.access_token,
      };

      localStorage.setItem('userInfoLms', JSON.stringify(userInfo));
      login(userInfo);
      navigate('/account/dashboard');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="login-page">
      <div className="login-left">
        <div className="brand">
          <img src={Logo} alt="Ronsdemy" />
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Log in to continue your learning journey</p>

          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="field">
              <input {...register('email')} type="email" placeholder="Email" />
              {errors.email && <span>{errors.email.message}</span>}
            </div>

            <div className="field">
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
              />
            </div>

            <button className="btn-login">Continue</button>

            <p className="signup">
              Don’t have an account? <Link to="/account/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
