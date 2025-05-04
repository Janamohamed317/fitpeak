import { useState } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import { Route, Router, Routes } from 'react-router';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import UserProfile from './components/UserProfile/UserProfile';
import FitnessGoals from './components/FitnessGoals/FitnessGoals';
import History from './components/History/History';
import FitnessTips from './components/FitnessTips/FitnessTips';
import WorkoutApp from './components/Workout/WorkoutApp';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/profile" element={<UserProfile />} />
				<Route path="/Fitness-goals" element={<FitnessGoals />} />
				<Route path="/History" element={<History />} />
				<Route path="/trip-input" element={<FitnessTips />} />
				<Route path="/workout" element={<WorkoutApp />} />
				<Route path="/progress" element={<Dashboard />} />

			</Routes>
		</>
	);
}

export default App;
