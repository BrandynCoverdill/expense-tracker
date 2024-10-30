import {
	Box,
	Container,
	MenuItem,
	Typography,
	TextField,
	Paper,
} from '@mui/material';
import { useLocalStorage } from '../utils/hooks';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Btn } from '../utils/components';

export default function SavingsBudgetForm({ onClick, closeForm }) {
	// State that holds categories for savings
	const [categories, setCategories] = useLocalStorage('savingsCategories', []);

	// State that holds the information the user types to create a Savings Budget
	const [budget, setBudget] = useState({
		category: 'select-category',
		goal: 0,
	});

	// State to hold the errors
	const [errors, setErrors] = useState({
		category: '',
		goal: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'goal') {
			// If the field saves a number, save it as a number
			setBudget({ ...budget, [name]: +value });
		} else {
			// for all other fields
			setBudget({ ...budget, [name]: value });
		}
	};

	const handleClick = () => {
		// If the data is validated, pass it back to parent to save the data locally
		if (validate()) {
			onClick(budget);
		}
	};

	const validate = () => {
		const newErrors = { category: '', goal: '' };
		let hasError = false;

		// category
		if (!budget.category || budget.category === 'select-category') {
			newErrors.category = 'Please select a category';
			hasError = true;
		}

		// goal
		if (isNaN(budget.goal) || !budget.goal) {
			newErrors.goal = 'Please enter a valid number';
			hasError = true;
		} else if (budget.goal <= 0) {
			newErrors.goal = 'Please set a budget higher than 0';
			hasError = true;
		}
		setErrors(newErrors);
		return !hasError;
	};

	return (
		<Box sx={{ m: 2 }} component={Paper} elevation={3}>
			<Container
				sx={{
					border: '1px solid black',
					p: 1,
				}}
			>
				<Typography variant='h6' sx={{ textAlign: 'center' }}>
					Create New Savings Budget
				</Typography>
				<Box>
					{/* If categories is blank, tell the user to create a Savings */}
					{categories.length === 0 ? (
						<>
							<Typography>
								Please create a new Saving to create a Saving Budget
							</Typography>
							<Typography component={Link} to='/savings'>
								Savings Page
							</Typography>
						</>
					) : (
						// Show the form to create a savings budget
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							<TextField
								name='category'
								value={budget.category}
								label='Category'
								required
								select // renders Select
								onChange={(e) => handleChange(e)}
								sx={{ width: '100%' }}
								error={!!errors.category}
								helperText={errors.category}
							>
								<MenuItem value={budget.category}>Select Category</MenuItem>
								{categories.map((category) => (
									<MenuItem key={category.name} value={category.name}>
										{category.name}
									</MenuItem>
								))}
							</TextField>
							<TextField
								type='number'
								sx={{ width: '100%' }}
								label='Amount to save'
								name='goal'
								required
								onChange={(e) => handleChange(e)}
								error={!!errors.goal}
								helperText={errors.goal}
							></TextField>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
								<Btn onClick={handleClick}>Create Budget</Btn>
								<Btn onClick={closeForm}>Cancel</Btn>
							</Box>
						</Box>
					)}
				</Box>
			</Container>
		</Box>
	);
}
