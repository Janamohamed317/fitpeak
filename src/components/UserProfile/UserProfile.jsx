import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './UserProfile.module.css';
import { imgs } from '../../assets/assets';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { resetUser, setEmail, setUsername } from '../../Redux/appSlice';

const UserProfile = () => {
  const [age, setAge] = useState(22);
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(60);
  const [bmi, setBmi] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const username = useSelector((state) => state.app.username);
  const email = useSelector((state) => state.app.email);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedUsername = localStorage.getItem('username');

    if (!email && storedEmail) {
      dispatch(setEmail(storedEmail));
    }

    if (!username && storedUsername) {
      dispatch(setUsername(storedUsername));
    }
  }, [email, username, dispatch]);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi.toFixed(1));
    }
  }, [height, weight]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    dispatch(resetUser());
    navigate('/signin');
  };

  return (
    <>
      <Navbar />
      <div className={styles.profileContainer}>
        <div className={styles.topbar}>
          <h2>My Fitness Profile</h2>
        </div>

        <div className={styles.profileGrid}>
          <div className={styles.profileSidebar}>
            <img src={imgs.UserImg} alt="User" className={styles.profileImg} />
            <h4 className={styles.username}>{username}</h4>
            <div className={styles.buttonContainer}>
              <button className={styles.deleteBtn}>Delete Account</button>
            </div>
          </div>

          <div className={styles.profileContent}>
            <h3 className={styles.sectionTitle}>About</h3>
            <div className={styles.infoRow}>
              <label>Full Name:</label>
              <span>{username}</span>
            </div>
            <div className={styles.infoRow}>
              <label>Email:</label>
              <span>{email}</span>
            </div>
         

            <h3 className={`${styles.sectionTitle} ${styles.mt}`}>Fitness Info</h3>
            <div className={styles.infoRow}>
              <label>Age:</label>
              <input
                type="number"
                value={age}
                className={styles.profileInput}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
            <div className={styles.infoRow}>
              <label>Height (cm):</label>
              <input
                type="number"
                value={height}
                className={styles.profileInput}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
            <div className={styles.infoRow}>
              <label>Weight (kg):</label>
              <input
                type="number"
                value={weight}
                className={styles.profileInput}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div className={styles.infoRow}>
              <label>BMI:</label>
              <span>{bmi}</span>
            </div>
            <button
              className={styles.HistoryBtn}
              onClick={() => navigate('/History')}
            >
              User History
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
