import React, { useState, useEffect, useCallback } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHeartbeat, faPlusCircle, faList, faChartBar,
  faChartLine, faDumbbell, faFire, faBolt,
  faCalendarCheck, faSave, faTrash, faMedal,
  faTag, faClock, faCalendar, faCalendarDay,
  faChevronUp, faChevronDown, faTrashAlt,
  faInfoCircle, faCheckCircle, faExclamationCircle,
  faExclamationTriangle, faRunning, faBiking, faSwimmer, faPray
} from '@fortawesome/free-solid-svg-icons';
import styles from './workout.module.css';
import { Header, Notification } from './UI.jsx';
import { ChartSection, StatsSection, WorkoutForm, WorkoutList } from './WorkoutComponents.jsx';
import Footer from '../Footer/Footer.jsx';
import Navbar from '../Navbar/Navbar.jsx';

// Add FontAwesome icons to library
library.add(
  faHeartbeat, faPlusCircle, faList, faChartBar,
  faChartLine, faDumbbell, faFire, faBolt,
  faCalendarCheck, faSave, faTrash, faMedal,
  faTag, faClock, faCalendar, faCalendarDay,
  faChevronUp, faChevronDown, faTrashAlt,
  faInfoCircle, faCheckCircle, faExclamationCircle,
  faExclamationTriangle, faRunning, faBiking, faSwimmer, faPray
);

function WorkoutApp() {
  // State
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [chartPeriod, setChartPeriod] = useState('all');

  const filterWorkouts = useCallback((search, sort, period) => {
    let filtered = [...workouts];

    if (search) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (period !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      filtered = filtered.filter(workout => {
        const workoutDate = new Date(workout.date);
        if (period === 'week') {
          return workoutDate >= startOfWeek;
        } else if (period === 'month') {
          return workoutDate >= startOfMonth;
        }
        return true;
      });
    }

    // Sort workouts
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'calories-high':
        filtered.sort((a, b) => b.calories - a.calories);
        break;
      case 'calories-low':
        filtered.sort((a, b) => a.calories - b.calories);
        break;
      default:
        break;
    }

    setFilteredWorkouts(filtered);
  }, [workouts]);

  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      const parsedWorkouts = JSON.parse(storedWorkouts);
      setWorkouts(parsedWorkouts);
      setFilteredWorkouts(parsedWorkouts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
    filterWorkouts(searchTerm, sortOption, chartPeriod);
  }, [workouts, searchTerm, sortOption, chartPeriod, filterWorkouts]);

  const handleAddWorkout = (workout) => {
    setWorkouts(prev => [workout, ...prev]);
    setNotification({ message: 'Workout added!', type: 'success' });
  };

  const handleDeleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
    setNotification({ message: 'Workout deleted!', type: 'error' });
  };



  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterWorkouts(value, sortOption, chartPeriod);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    filterWorkouts(searchTerm, value, chartPeriod);
  };

  const handleChartPeriodChange = (e) => {
    const value = e.target.value;
    setChartPeriod(value);
    filterWorkouts(searchTerm, sortOption, value);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const totalCalories = workouts.reduce((total, workout) => total + workout.calories, 0);

  const getBestWorkout = () => {
    if (workouts.length === 0) return '-';

    const bestWorkout = workouts.reduce((best, current) =>
      current.calories > best.calories ? current : best, workouts[0]);

    return `${bestWorkout.name} (${bestWorkout.calories} cal)`;
  };

  // Calculate workout streak
  const getWorkoutStreak = () => {
    if (workouts.length === 0) return '0 days';

    // Sort workouts by date
    const sortedDates = workouts
      .map(workout => new Date(workout.date).toISOString().split('T')[0])
      .sort()
      .reverse(); // Newest first

    // Remove duplicates (multiple workouts on same day)
    const uniqueDates = [...new Set(sortedDates)];

    // Calculate streak
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];

    // Check if there's a workout today
    const hasWorkoutToday = uniqueDates[0] === today;

    // If no workout today, start checking from yesterday
    let currentDate = new Date();
    if (!hasWorkoutToday) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let i = hasWorkoutToday ? 1 : 0; i < uniqueDates.length; i++) {
      // Get previous date to check
      currentDate.setDate(currentDate.getDate() - 1);
      const dateToCheck = currentDate.toISOString().split('T')[0];

      // If date exists in our workout dates, increase streak
      if (uniqueDates[i] === dateToCheck) {
        streak++;
      } else {
        break; // Streak broken
      }
    }

    return `${streak} day${streak !== 1 ? 's' : ''}`;
  };

  return (
    <div className="app1">

      <Navbar />
      <div className="container1">
        <Header />

        <WorkoutForm onAddWorkout={handleAddWorkout} totalCalories={workouts.reduce((sum, w) => sum + (w.calories || 0), 0)} />

        <WorkoutList
          workouts={filteredWorkouts}
          onDeleteWorkout={handleDeleteWorkout}
        // يمكنك إضافة خصائص البحث والفرز هنا إذا كانت مدعومة في المكون
        />

        <ChartSection
          workouts={filteredWorkouts}
          onChartPeriodChange={handleChartPeriodChange}
          chartPeriod={chartPeriod}
        />

        <StatsSection
          totalWorkouts={workouts.length}
          totalCalories={workouts.reduce((sum, w) => sum + (w.calories || 0), 0)}
          bestWorkout={workouts[0]}
          workoutStreak={0}
        />
      </div>

      <Footer />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}
    </div>
  );
}

export default WorkoutApp;
