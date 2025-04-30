import React, { useContext, useState } from "react";
import styles from "./Signin.module.css";
import login_img from "../../assets/login.png";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { showPassword, handleCheckboxChange, setLoggedOut } = useContext(AppContext);
  const navigate = useNavigate();

  const ValidateSignIn = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/

    if (field === "email") {
      if (!value) {
        setEmailError("Email is required");
      } else if (!emailRegex.test(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    } else if (field === "password") {
      if (!value) {
        setPasswordError("Password is required");
      } else if (!passwordRegex.test(value)) {
        setPasswordError(`Password must contain:
                         - 6+ characters
                         - 1 uppercase letter
                         - 1 lowercase letter
                         - 1 number
                         - 1 special character (!@#$%^&*)`);
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    ValidateSignIn("email", email);
    ValidateSignIn("password", password);

    if (!emailError && !passwordError) {
      setLoggedOut(false);
      navigate("/");
    }
    if (emailError || passwordError) {

      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix the errors in the form before submitting.",
        confirmButtonText: "OK",
      });
      return;
    }
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.form_container}>
        <img src={login_img} alt="Description" className={styles.form_img} />
        <div className={styles.form}>
          <form className={styles.form_inputs} onSubmit={handleSubmit}>
            <p className={styles.Login_text}>Sign in</p>
            <label className={`${styles.Input_label}`}>Email</label>
            <br />
            <input
              className={styles.inputs}
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                ValidateSignIn("email", e.target.value);
              }}
            />
            {emailError && <p className={styles.error_text}>{emailError}</p>}
            <br />
            <label className={`${styles.Input_label}`}>Password</label>
            <br />
            <input
              className={styles.inputs}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                ValidateSignIn("password", e.target.value);
              }}
            />
            {passwordError && (
              <p className={styles.error_text}>{passwordError}</p>
            )}

            <div className={styles.form_checkbox_container}>
              <label className={styles.checkbox_label}>Show Password</label>
              <input
                type="checkbox"
                className={styles.form_checkbox}
                onChange={(e) => handleCheckboxChange(e)}
              ></input>
            </div>

            <button
              className={styles.form_btn}
              type="submit"

            >

              <span>Sign In</span>

            </button>
          </form>
          <p className={styles.Login_text2}>
            Doesn't have an account?
            <span
              className={styles.Signup_text}
              onClick={() => navigate("/signup")}
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
