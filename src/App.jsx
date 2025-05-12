import { useEffect } from 'react';
import './App.css';
import Home from './components/Home/Home';
import { Route, Routes } from 'react-router';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import UserProfile from './components/UserProfile/UserProfile';
import FitnessGoals from './components/FitnessGoals/FitnessGoals';
import History from './components/History/History';
import FitnessTips from './components/FitnessTips/FitnessTips';
import WorkoutApp from './components/Workout/WorkoutApp';
import Dashboard from './components/Dashboard/Dashboard';

import { useDispatch } from 'react-redux';
import { setEmail, setUsername, setLoggedOut } from './Redux/appSlice';

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem('token');
		const email = localStorage.getItem('email');
		const username = localStorage.getItem('username');

		if (token && email && username) {
			dispatch(setEmail(email));
			dispatch(setUsername(username));
			dispatch(setLoggedOut(false));
		} else {
			dispatch(setLoggedOut(true));
		}
	}, [dispatch]);

	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/profile" element={<UserProfile />} />
				<Route path="/Fitness-goals" element={<FitnessGoals />} />
				<Route path="/History" element={<History />} />
				<Route path="/tips" element={<FitnessTips />} />
				<Route path="/workout" element={<WorkoutApp />} />
				<Route path="/progress" element={<Dashboard />} />
			</Routes>
		</>
	);
}

export default App;
