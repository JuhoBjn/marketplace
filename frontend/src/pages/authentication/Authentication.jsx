import { useState } from "react";

import "./Authentication.css";

const Authentication = () => {
  const [signupMode, setSignupMode] = useState(true);

  const toggleSignupMode = () => {
    setSignupMode(!signupMode);
  };

  const signupHandler = async (event) => {
    event.preventDefault();
    console.log("Signup user handler.");
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    console.log("Login user handler.");
  };

  return (
    <div className='authentication-page center'>
      <div className='auth-form__container'>
        <form onSubmit={signupMode ? signupHandler : loginHandler}>
          {signupMode && (
            <div className="auth-form__name-input-container">
              <div className='auth-form__firstname-input'>
                <label htmlFor='firstname'>First name</label>
                <input
                  id='firstname'
                  type='text'
                  placeholder='Enter your first name'
                  required
                />
              </div>
              <div className='auth-form__lastname-input'>
                <label htmlFor='lastname'>Last name</label>
                <input
                  id='lastname'
                  type='text'
                  placeholder='Enter your last name'
                  required
                />
              </div>
            </div>
          )}
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            placeholder='Enter your email address'
            required
          />
          {signupMode && (
            <>
              <label htmlFor='phone'>Phone number</label>
              <input
                id='phone'
                type='text'
                placeholder='Enter your phone number'
                required
              />
            </>
          )}
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            placeholder='Enter your password'
            required
          />
          <div className='center'>
            <button
              id='auth-form__submit-button'
              className='center'
              type='submit'
            >
              {signupMode ? "Sign up" : "Log in"}
            </button>
          </div>
        </form>
        <button className='center' onClick={toggleSignupMode}>
          {signupMode ? "Change to login" : "Change to signup"}
        </button>
      </div>
    </div>
  );
};

export default Authentication;
