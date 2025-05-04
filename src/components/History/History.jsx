import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from './history.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const History = () => {
	const [workouts] = useState([
		{ date: '2025-02-10', type: 'Cardio', duration: 30, calories: 250 },
		{ date: '2025-01-12', type: 'Strength', duration: 45, calories: 300 },
		{ date: '2025-02-14', type: 'Cardio', duration: 40, calories: 270 },
		{ date: '2025-02-16', type: 'Yoga', duration: 50, calories: 180 },
	]);

	const [filteredWorkouts, setFilteredWorkouts] = useState([]);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [workoutType, setWorkoutType] = useState('');
	const [chartInstance, setChartInstance] = useState(null);

	useEffect(() => {
		setFilteredWorkouts(workouts);
	}, [workouts]);

	useEffect(() => {
		if (filteredWorkouts.length > 0) {
			updateChart(filteredWorkouts);
		}
		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	}, [filteredWorkouts]);

	const filterWorkouts = () => {
		const filteredData = workouts.filter((workout) => {
			const workoutDate = new Date(workout.date);
			const start = startDate ? new Date(startDate) : null;
			const end = endDate ? new Date(endDate) : null;

			return (
				(!start || workoutDate >= start) &&
				(!end || workoutDate <= end) &&
				(!workoutType || workout.type === workoutType)
			);
		});

		setFilteredWorkouts(filteredData);
	};

	const updateChart = (workoutData) => {
		const ctx = document.getElementById('workoutChart').getContext('2d');

		if (chartInstance) {
			chartInstance.destroy();
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(0, 'rgba(76, 175, 80, 0.6)');
		gradient.addColorStop(1, 'rgba(76, 175, 80, 0.1)');

		const labels = workoutData.map((w) => w.date);
		const durations = workoutData.map((w) => w.duration);

		const newChartInstance = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Workout Duration (minutes)',
						data: durations,
						backgroundColor: gradient,
						borderColor: '#4CAF50',
						borderWidth: 3,
						pointBackgroundColor: '#fff',
						pointBorderColor: '#4CAF50',
						pointRadius: 6,
						pointHoverRadius: 8,
						fill: true,
						tension: 0.4,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: { color: '#ffffff' },
					},
					tooltip: {
						backgroundColor: 'rgba(0,0,0,0.8)',
						bodyColor: '#ffffff',
						titleColor: '#4CAF50',
					},
				},
				scales: {
					x: {
						grid: { color: '#333333' },
						ticks: { color: '#ffffff' },
					},
					y: {
						grid: { color: '#333333' },
						ticks: { color: '#ffffff' },
					},
				},
			},
		});

		setChartInstance(newChartInstance);
	};

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<h2>Workout History</h2>

				<div className={styles.filters}>
					<label>
						Start Date:
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</label>
					<label>
						End Date:
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
					</label>
					<label>
						Workout Type:
						<select
							value={workoutType}
							onChange={(e) => setWorkoutType(e.target.value)}
						>
							<option value="">All Types</option>
							<option value="Cardio">Cardio</option>
							<option value="Strength">Strength</option>
							<option value="Yoga">Yoga</option>
						</select>
					</label>
					<button onClick={filterWorkouts}>Apply Filters</button>
				</div>

				<table className={styles.workoutTable}>
					<thead>
						<tr>
							<th>Date</th>
							<th>Workout Type</th>
							<th>Duration</th>
							<th>Calories Burned</th>
						</tr>
					</thead>
					<tbody>
						{filteredWorkouts.map((workout, index) => (
							<tr key={index}>
								<td>{workout.date}</td>
								<td>
									<span className={styles.workoutType}>{workout.type}</span>
								</td>
								<td>{workout.duration} min</td>
								<td>{workout.calories} kcal</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className={styles.chartContainer}>
					<canvas id="workoutChart"></canvas>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default History;
