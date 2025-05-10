// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useSelector } from 'react-redux';  // Import useSelector to access the Redux state

const Navbar = () => {
  // Use useSelector to access loggedOut state from Redux store
  const loggedOut = useSelector((state) => state.app.loggedOut);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: 'transparent' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          FitPeak
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/profile">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/workout">
                Workouts
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Fitness-goals">
                Set Goal
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/progress">
                Progress
              </Link>
            </li>
            {loggedOut && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signin">
                  Login
                </Link>
              </li>
            )}
            {!loggedOut && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signin">
                  Log out
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
