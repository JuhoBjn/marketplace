import { useState, useRef, useContext } from "react";

import { AuthContext } from "../../utils/AuthContext";

import "./Authentication.css";

const Authentication = () => {
  const [signupMode, setSignupMode] = useState(true);
  const firstnameRef = useRef("");
  const lastnameRef = useRef("");
  const emailRef = useRef("");
  const phoneRef = useRef("");
  const passwordRef = useRef("");

  const authContext = useContext(AuthContext);

  const toggleSignupMode = () => {
    setSignupMode(!signupMode);
  };

  const signupHandler = async (event) => {
    event.preventDefault();
    try {
      await authContext.signup(
        firstnameRef.current.value,
        lastnameRef.current.value,
        emailRef.current.value,
        phoneRef.current.value,
        passwordRef.current.value
      );
    } catch (err) {
      console.log("Something went wrong while signing up. Please try again.");
    }
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    try {
      await authContext.login(
        emailRef.current.value,
        passwordRef.current.value
      );
    } catch (err) {
      console.log("Something went wrong while loggin in. Please try again.");
    }
  };

  return (
    <div className='authentication-page center'>
      <div className='auth-form__container'>
        <form onSubmit={signupMode ? signupHandler : loginHandler}>
          {signupMode && (
            <div className='auth-form__name-input-container'>
              <div className='auth-form__firstname-input'>
                <label htmlFor='firstname'>First name</label>
                <input
                  id='firstname'
                  data-testid='firstname-input'
                  type='text'
                  placeholder='Enter your first name'
                  ref={firstnameRef}
                  required
                />
              </div>
              <div className='auth-form__lastname-input'>
                <label htmlFor='lastname'>Last name</label>
                <input
                  id='lastname'
                  data-testid='lastname-input'
                  type='text'
                  placeholder='Enter your last name'
                  ref={lastnameRef}
                  required
                />
              </div>
            </div>
          )}
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            data-testid='email-input'
            type='email'
            placeholder='Enter your email address'
            ref={emailRef}
            required
          />
          {signupMode && (
            <>
              <label htmlFor='phone'>Phone number</label>
              <input
                id='phone'
                data-testid='phone-input'
                type='text'
                placeholder='Enter your phone number'
                ref={phoneRef}
                required
              />
            </>
          )}
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            data-testid='password-input'
            type='password'
            placeholder='Enter your password'
            ref={passwordRef}
            required
          />
          <div className='center'>
            <button
              id='auth-form__submit-button'
              data-testid='auth-form__submit-button'
              className='center'
              type='submit'
            >
              {signupMode ? "Sign up" : "Log in"}
            </button>
          </div>
        </form>
        <button data-testid="toggle-signup-mode-button" className='center' onClick={toggleSignupMode}>
          {signupMode ? "Change to login" : "Change to signup"}
        </button>
      </div>
    </div>
  );
};

export default Authentication;
