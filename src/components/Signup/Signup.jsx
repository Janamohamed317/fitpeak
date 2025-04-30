import React, { useContext, useState } from 'react';
import styles1 from './Signup.module.css';
import signupimg from '../../assets/login.png';
import { AppContext } from '../Context/AppContext';
import { useNavigate } from "react-router-dom";


function Signup() {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmedPasswordError, setConfirmedPasswordError] = useState('');
    const { setShowPassword, showPassword, handleCheckboxChange } = useContext(AppContext);
    const navigate = useNavigate();

    const validateField = (field, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/
        if (field === 'email') {
            if (!value) {
                setEmailError('Email is required');
            } else if (!emailRegex.test(value)) {
                setEmailError('Invalid email format');
            } else {
                setEmailError('');
            }
        } else if (field === 'userName') {
            if (!value) {
                setUserNameError('Username is required');
            } else if (value.length < 3) {
                setUserNameError('Username must be at least 3 characters');
            } else {
                setUserNameError('');
            }
        } else if (field === 'password') {
            if (!value) {
                setPasswordError('Password is required');
            }
            else if (!passwordRegex.test(value)) {
                setPasswordError(`Password must contain:
                                 - 6+ characters
                                 - 1 uppercase letter
                                 - 1 lowercase letter
                                 - 1 number
                                 - 1 special character (!@#$%^&*)`);
            }
            else {
                setPasswordError('');
            }
        } else if (field === 'confirmedPassword') {
            if (!value) {
                setConfirmedPasswordError('Please confirm your password');
            } else if (value !== password) {
                setConfirmedPasswordError("Passwords don't match");
            } else {
                setConfirmedPasswordError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateField('email', email);
        validateField('userName', userName);
        validateField('password', password);
        validateField('confirmedPassword', confirmedPassword);

        if (emailError || userNameError || passwordError || confirmedPasswordError) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fix the errors in the form before submitting.',
                confirmButtonText: 'OK',
            });
            return;
        }
     
    };

    return (
        <div className={styles1.main_container}>
            <div className={styles1.form_container}>
                <img src={signupimg} alt="Description" className={styles1.form_img} />
                <div className={styles1.form}>
                    <form className={styles1.form_inputs} onSubmit={handleSubmit}>
                        <p className={styles1.Sigunp_text}>Sign Up</p>
                        <label className={`${styles1.Input_label}`}>Username</label>
                        <input className={styles1.input}
                            type='text'
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => { setUserName(e.target.value); validateField('userName', e.target.value); }}
                        />
                        {userNameError && <p className={styles1.error_text}>{userNameError}</p>}

                        <label className={`${styles1.Input_label}`}>Email</label>
                        <input className={styles1.input}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); validateField('email', e.target.value); }}
                        />
                        {emailError && <p className={styles1.error_text}>{emailError}</p>}

                        <label className={`${styles1.Input_label}`}>Password</label>
                        <input
                            className={styles1.input}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); validateField('password', e.target.value); }}
                        />
                        {passwordError && <p className={styles1.error_text}>{passwordError}</p>}

                        <label className={styles1.Input_label}>Confirm Password</label>
                        <input
                            className={styles1.input}
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmedPassword}
                            onChange={(e) => { setConfirmedPassword(e.target.value); validateField('confirmedPassword', e.target.value); }}
                        />
                        {confirmedPasswordError && <p className={styles1.error_text}>{confirmedPasswordError}</p>}

                        <div className={styles1.form_checkbox_container}>
                            <label className={styles1.checkbox_label}>Show Password</label>
                            <input type='checkbox' className={styles1.form_checkbox} onChange={(e) => handleCheckboxChange(e)}></input>
                        </div>

                        <button className={styles1.form_btn} type="submit">
                            <span>Sign Up</span>
                        </button>
                    </form>
                    <p className={styles1.Sigunp_text2}>
                        Already have an account?<span className={styles1.Signin_text} onClick={() => navigate("/signin")}> Sign in</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;