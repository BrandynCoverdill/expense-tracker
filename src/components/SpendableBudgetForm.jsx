import {
	Box,
	Typography,
	Container,
	MenuItem,
	TextField,
	Paper,
} from '@mui/material';
import {useLocalStorage} from '../utils/hooks';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import {Btn} from '../utils/components';

export default function SpendableBudgetForm({onClick, closeForm}) {
	// State that holds categories for expenses
	const [categories, setCategories] = useLocalStorage('expensesCategories', []);

	// State that holds the information the user types to create a Expense Budget
	const [budget, setBudget] = useState({
		category: 'select-category',
		allowance: 0,
		startDate: '',
		numWeeks: 0,
	});

	// State to hold the errors upon validation
	const [errors, setErrors] = useState({
		category: '',
		allowance: '',
		startDate: '',
		numWeeks: '',
	});

	const handleChange = (e) => {
		const {name, value} = e.target;
		if (name === 'allowance') {
			// If the field saves a number, save it as a number
			setBudget({...budget, [name]: +value});
		} else {
			// for all other fields
			setBudget({...budget, [name]: value});
		}
	};

	const handleClick = () => {
		// if data is validated, pass it back to parent component to save the data locally
		if (validate()) {
			onClick(budget);
		}
	};

	const validate = () => {
		const newErrors = {
			category: '',
			allowance: '',
			startDate: '',
			numWeeks: '',
		};
		let hasError = false;

		// category
		if (!budget.category || budget.category === 'select-category') {
			newErrors.category = 'Please select a category';
			hasError = true;
		}

		// allowance
		if (isNaN(budget.allowance) || !budget.allowance) {
			newErrors.allowance = 'Please enter a valid number';
			hasError = true;
		} else if (budget.allowance <= 0) {
			newErrors.allowance = 'Please set an allowance higher than 0';
			hasError = true;
		}

		// startDate
		if (!budget.startDate) {
			newErrors.startDate = 'Please select the start date';
			hasError = true;
		}

		// numWeeks
		if (isNaN(budget.numWeeks) || !budget.numWeeks) {
			newErrors.numWeeks = 'Please enter a valid number';
			hasError = true;
		} else if (budget.numWeeks <= 0) {
			newErrors.numWeeks = 'Please set the number of weeks greater than 0';
			hasError = true;
		}

		setErrors(newErrors);
		return !hasError;
	};

	return (
		<Box sx={{m: 2}} component={Paper} elevation={3}>
			<Container
				sx={{
					border: '1px solid black',
					p: 1,
				}}
			>
				<Typography variant='h6' sx={{textAlign: 'center'}}>
					Create New Spendable Budget
				</Typography>
				<Box>
					{/* If categories is blank, tell the user to create an Expense */}
					{categories.length === 0 ? (
						<>
							<Typography>
								Please create a new Expense to create a Spendable Budget
							</Typography>
							<Typography component={Link} to='/expenses'>
								Expenses Page
							</Typography>
						</>
					) : (
						// Show the form to create a spendable budget
						<Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
							<TextField
								name='category'
								value={budget.category}
								label='Category'
								required
								select // renders Select component
								onChange={(e) => handleChange(e)}
								sx={{width: '100%'}}
								error={!!errors.category}
								helperText={errors.category}
							>
								<MenuItem value={budget.category}>Select Category</MenuItem>
								{categories.map((cat) => (
									<MenuItem key={cat.name} value={cat.name}>
										{cat.name}
									</MenuItem>
								))}
							</TextField>
							<TextField
								type='number'
								sx={{width: '100%'}}
								label='Spendable Allowance'
								name='allowance'
								required
								onChange={(e) => handleChange(e)}
								error={!!errors.allowance}
								helperText={errors.allowance}
							></TextField>
							<TextField
								type='date'
								sx={{width: '100%'}}
								label='Date to start budget'
								name='startDate'
								required
								onChange={(e) => handleChange(e)}
								error={!!errors.startDate}
								helperText={errors.startDate}
							></TextField>
							<TextField
								type='number'
								sx={{width: '100%'}}
								label='Number of weeks to budget'
								name='numWeeks'
								required
								onChange={(e) => handleChange(e)}
								error={!!errors.numWeeks}
								helperText={errors.numWeeks}
							></TextField>
							<Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
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
