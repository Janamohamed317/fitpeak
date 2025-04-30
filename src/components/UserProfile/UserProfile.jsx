import React, { useState, useEffect } from 'react';
import styles from './UserProfile.module.css';
import { imgs } from '../../assets/assets';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const UserProfile = () => {
  const [age, setAge] = useState(22);
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(60);
  const [bmi, setBmi] = useState(0);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi.toFixed(1));
    }
  }, [height, weight]);

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
            <h4 className={styles.username}>Username</h4>
            <div className={styles.buttonContainer}>
              <button className={styles.editBtn}>Edit</button>
              <button className={styles.deleteBtn}>Delete Account</button>
            </div>
          </div>

          <div className={styles.profileContent}>
            <h3 className={styles.sectionTitle}>About</h3>
            <div className={styles.infoRow}>
              <label>Full Name:</label>
              <span>Username</span>
            </div>
            <div className={styles.infoRow}>
              <label>Email:</label>
              <span>abc@gmail.com</span>
            </div>
            <div className={styles.infoRow}>
              <label>Phone:</label>
              <span>+0123458900</span>
            </div>
            <div className={styles.infoRow}>
              <label>Address:</label>
              <span>Cairo, Egypt</span>
            </div>

            <h3 className={`${styles.sectionTitle} ${styles.mt}`}>Fitness Info</h3>
            <div className={styles.infoRow}>
              <label>Age:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={styles.profileInput}
              />
            </div>
            <div className={styles.infoRow}>
              <label>Height (cm):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={styles.profileInput}
              />
            </div>
            <div className={styles.infoRow}>
              <label>Weight (kg):</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={styles.profileInput}
              />
            </div>
            <div className={styles.infoRow}>
              <label>BMI:</label>
              <span>{bmi}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>

  );
};

export default UserProfile;