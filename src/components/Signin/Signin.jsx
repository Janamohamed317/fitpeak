import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPassword, toggleShowPassword, setLoggedOut } from '../../Redux/appSlice';
import styles from './Signin.module.css';
import login_img from '../../assets/login.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Signin() {
  const email = useSelector((state) => state.app.email);
  const password = useSelector((state) => state.app.password);
  const showPassword = useSelector((state) => state.app.showPassword);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Clear fields when component mounts
  useEffect(() => {
    dispatch(setEmail(''));
    dispatch(setPassword(''));
  }, [dispatch]);

  const validateSignIn = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (field === 'email') {
      if (!value) setEmailError('Email is required');
      else if (!emailRegex.test(value)) setEmailError('Invalid email format');
      else setEmailError('');
    } else if (field === 'password') {
      if (!value) setPasswordError('Password is required');
      else if (!passwordRegex.test(value)) {
        setPasswordError(`Password must contain:
                          - 6+ characters
                          - 1 uppercase letter
                          - 1 lowercase letter
                          - 1 number
                          - 1 special character (!@#$%^&*)`);
      } else setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validateSignIn('email', email);
    validateSignIn('password', password);

    // const isEmailEmpty = !email.trim();
    // const isPasswordEmpty = !password.trim();
    const isAnyFieldEmpty = !email || !password;

    const hasErrors = emailError || passwordError;

    if (isAnyFieldEmpty) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        confirmButtonText: 'OK',
      });

      return;
    }
    else if (hasErrors) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting',
        confirmButtonText: 'OK',
      });
      return;
    }
    dispatch(setLoggedOut(false));
    navigate('/');
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.form_container}>
        <img src={login_img} alt="Description" className={styles.form_img} />
        <div className={styles.form}>
          <form className={styles.form_inputs} onSubmit={handleSubmit}>
            <p className={styles.Login_text}>Sign in</p>

            <label className={styles.Input_label}>Email</label>
            <input
              className={styles.inputs}
              placeholder="Email"
              value={email}
              onChange={(e) => {
                dispatch(setEmail(e.target.value));
                validateSignIn('email', e.target.value);
              }}
            />
            {emailError && <p className={styles.error_text}>{emailError}</p>}

            <label className={styles.Input_label}>Password</label>
            <input
              className={styles.inputs}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                dispatch(setPassword(e.target.value));
                validateSignIn('password', e.target.value);
              }}
            />
            {passwordError && <p className={styles.error_text}>{passwordError}</p>}

            <div className={styles.form_checkbox_container}>
              <label className={styles.checkbox_label}>Show Password</label>
              <input
                type="checkbox"
                className={styles.form_checkbox}
                onChange={() => dispatch(toggleShowPassword())}
              />
            </div>

            <button className={styles.form_btn} type="submit">
              <span>Sign In</span>
            </button>
          </form>

          <p className={styles.Login_text2}>
            Doesn't have an account?
            <span
              className={styles.Signup_text}
              onClick={() => {
                // Clear fields before navigating
                dispatch(setEmail(''));
                dispatch(setPassword(''));
                navigate('/signup');
              }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;