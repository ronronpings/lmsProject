import React from "react";
import { Link } from "react-router-dom";
export const Register = ()=>{
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

          <form className="lms-register-form">
            <div className="lms-register-field-group">
              <label htmlFor="fullName">Full Name *</label>
              <input id="fullName" type="text" placeholder="Full Name" />
            </div>

            <div className="lms-register-field-group">
              <label htmlFor="email">Email *</label>
              <input id="email" type="email" placeholder="Email" />
            </div>

            <div className="lms-register-field-group">
              <label htmlFor="password">Password *</label>
              <input id="password" type="password" placeholder="Password" />
            </div>

            <div className="lms-register-field-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
              />
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