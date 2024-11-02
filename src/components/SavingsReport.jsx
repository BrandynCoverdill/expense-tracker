// @ts-nocheck
import { Box, Typography } from '@mui/material';
import { findTotalSaved } from '../utils/util';

export default function SavingsReport({ category }) {
	return (
		<Box
			sx={{
				width: '60%',
				color: '#555',
			}}
		>
			<Typography>Goal to Reach: ${category.goal}</Typography>
			<Typography>
				Total Amount Saved: ${findTotalSaved(category)} (
				{(findTotalSaved(category) / category.goal).toFixed(2) * 100}%)
			</Typography>
		</Box>
	);
}
