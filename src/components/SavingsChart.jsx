// @ts-nocheck
import { Box, Typography } from '@mui/material';
import { useLocalStorage } from '../utils/hooks';
import { findTotalSaved } from '../utils/util';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register necessary elements and plugins with Chart.js
ChartJS.register(
	BarElement,
	CategoryScale,
	LinearScale,
	Title,
	Tooltip,
	Legend,
	annotationPlugin
);

export default function SavingsChart({ category }) {
	const [savings, setSavings] = useLocalStorage('savings', []);

	const totalSaved = findTotalSaved(category);
	const goal = category.goal;

	// Set up the data for the barchart
	const chartData = {
		labels: [category.name],
		datasets: [
			{
				label: 'Current Savings',
				data: [totalSaved],
				backgroundColor: 'rgba(75, 192, 192, 0.7)',
			},
		],
	};

	// Set up options to configure chart appearance
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: 'top',
			},
			title: {
				display: true,
				text: `${category.name} Savings`,
			},
			annotation: {
				annotations: {
					goalLine: {
						type: 'line',
						yMin: goal,
						yMax: goal,
						borderColor: 'rgba(255, 99, 132, 0.7)',
						borderWidth: 2,
						borderDash: [5, 5],
						label: {
							content: `Goal: $${goal}`,
							enabled: true,
							position: 'end',
						},
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Amount Saved ($)',
				},
			},
			x: {
				title: {
					display: true,
					text: `${category.name} Category`,
				},
			},
		},
	};

	return (
		<Box sx={{ width: '60%', height: '400px', margin: '0 auto' }}>
			<Bar data={chartData} options={options} />
		</Box>
	);
}
