import React, { useState } from 'react';
import styles from './FitnessGoals.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const FitnessGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [progress, setProgress] = useState('');
  const [showGoals, setShowGoals] = useState(false);

  const addGoal = () => {
    if (goalName.trim() === '' || progress === '') return;

    const newGoal = {
      name: goalName,
      progress: parseInt(progress, 10),
    };

    setGoals([...goals, newGoal]);
    setGoalName('');
    setProgress('');
  };

  const toggleGoals = () => {
    setShowGoals(!showGoals);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Set Your Fitness Goals</h2>

        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.inputField}
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="Goal (e.g., Run 5km)"
          />
          <input
            type="number"
            className={styles.inputField}
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="Progress (%)"
            min="0"
            max="100"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.actionButton} onClick={addGoal}>
            Add Goal
          </button>
          <button className={styles.actionButton} onClick={toggleGoals}>
            {showGoals ? 'Hide Goals' : 'View Your Goals'}
          </button>
        </div>

        {showGoals && (
          <div className={styles.goalContainer}>
            {goals.length === 0 ? (
              <p className={styles.emptyMessage}>No goals added yet</p>
            ) : (
              goals.map((goal, index) => (
                <div className={styles.goalCard} key={index}>
                  <span className={styles.goalName}>{goal.name}</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>{goal.progress}%</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FitnessGoals;