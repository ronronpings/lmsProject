import React from "react";
import { Link } from 'react-router-dom'
export const Login = ()=> {
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

            <form className="lms-login-form">
              <div className="lms-field-group">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" placeholder="Email" />
              </div>

              <div className="lms-field-group">
                <label htmlFor="password">Password *</label>
                <input id="password" type="password" placeholder="Password" />
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
