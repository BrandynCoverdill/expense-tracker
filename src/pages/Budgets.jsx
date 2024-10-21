// @ts-nocheck
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	TextField,
	Typography,
} from '@mui/material';
import {
	Btn,
	SpendableBudgetForm,
	SavingsBudgetForm,
} from '../utils/components';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../utils/hooks';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Budgets() {
	// State to show/hide forms for creating new budgets
	const [showBudgetForm, setShowBudgetForm] = useState('');

	// State to hold user data
	const [expenses, setExpenses] = useLocalStorage('expenses', []);
	const [savings, setSavings] = useLocalStorage('savings', []);
	const [expenseCategories, setExpenseCategories] = useLocalStorage(
		'expensesCategories',
		[]
	);
	const [savingCategories, setSavingCategories] = useLocalStorage(
		'savingsCategories',
		[]
	);

	// State to edit Savings
	const [savingEditId, setSavingEditId] = useState(null);
	const [savingEditValues, setSavingEditValues] = useState({
		goal: '',
	});
	const [savingEditErrors, setSavingEditErrors] = useState({
		goal: '',
	});

	// State to edit Expenese
	const [expenseEditId, setExpenseEditId] = useState(null);
	const [expenseEditValues, setExpenseEditValues] = useState({});
	const [expenseEditErrors, setExpenseEditErrors] = useState({});

	const handleShowForm = (form) => {
		setShowBudgetForm(form);
	};

	const handleSavingBudgetSubmit = (budget) => {
		const tempCategories = [...savingCategories];
		tempCategories.find((category) => {
			if (category.name === budget.category) {
				category.goal = budget.goal;
				category.tracked = true;
				setSavingCategories(tempCategories);
			}
		});

		setShowBudgetForm('');
	};

	const renderForm = () => {
		switch (showBudgetForm) {
			case 'saving-budget':
				return (
					<SavingsBudgetForm
						onClick={(budget) => {
							handleSavingBudgetSubmit(budget);
						}}
						closeForm={() => setShowBudgetForm('')}
					/>
				);
			case 'spendable-budget':
				return <SpendableBudgetForm />;
			default:
				return null;
		}
	};

	const findTotalSaved = (category) => {
		let total = 0;
		const startingValue = 0;

		const filteredData = savings.filter(
			(cat) => cat.category === category.name
		);
		total = filteredData.reduce(
			(sum, item) => sum + +item.amount,
			startingValue
		);

		return total.toFixed(2);
	};

	const findPercentageSaved = (category) => {
		return ((findTotalSaved(category) / category.goal) * 100).toFixed(2);
	};

	const removeBudget = (category) => {
		const tempCategories = [...savingCategories];
		tempCategories.find((cat) => {
			if (cat.name === category.name) {
				cat.goal = 0;
				cat.tracked = false;
				setSavingCategories(tempCategories);
			}
		});
	};

	const handleSavingInputChange = (e) => {
		const { name, value } = e.target;
		if (name === 'goal' && isNaN(value)) {
			return;
		}
		setSavingEditValues({
			[name]: +value,
		});
	};

	const validateSavingInput = () => {
		const newErrors = {
			goal: '',
		};

		let hasError = false;

		// goal
		if (isNaN(savingEditValues.goal) || !savingEditValues.goal) {
			newErrors.goal = 'Please enter a valid number';
			hasError = true;
		} else if (savingEditValues.goal <= 0) {
			newErrors.goal = 'Please set a budget higher than 0';
			hasError = true;
		}
		setSavingEditErrors(newErrors);
		return !hasError;
	};

	const saveSavingInputChanges = (category) => {
		const tempCategories = [...savingCategories];

		tempCategories.find((cat) => {
			if (cat.name === category.name) {
				cat.goal = savingEditValues.goal.toFixed(2);
				setSavingCategories(tempCategories);
			}
		});

		setSavingEditId(null);
	};

	return (
		<Box sx={{ p: 2 }}>
			<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
				<Typography variant='h4'>Budgeting</Typography>

				{/* Buttons to show the forms for creating the two kinds of budgets */}
				<Btn onClick={() => handleShowForm('saving-budget')}>
					New Savings Budget
				</Btn>
				<Btn onClick={() => handleShowForm('spendable-budget')}>
					New Spendable Budget
				</Btn>
			</Box>

			{/* Show form when the user clicks on one of the buttons above */}
			{renderForm()}

			{/* Saving Budget Tables */}
			<Box sx={{ m: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Typography variant='h5' sx={{ borderBottom: '1px solid black' }}>
					Saving Budgets
				</Typography>

				{/* If there is not a tracked category in savings, display text telling there is none
					if there are some being tracked, show each as an accordion. */}
				{savingCategories.map((category) =>
					category.tracked ? (
						<Accordion key={category.name}>
							<AccordionSummary expandIcon={<ArrowDropDownIcon />}>
								{category.name}: {findPercentageSaved(category)}% saved
							</AccordionSummary>
							<AccordionDetails>
								{savingEditId === category.name ? (
									// Show edit details
									<Box
										sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
									>
										<TextField
											name='goal'
											value={savingEditValues.goal}
											label='Goal to save'
											required
											onChange={handleSavingInputChange}
											error={!!savingEditErrors.goal}
											helperText={savingEditErrors.goal}
										></TextField>
										<Btn
											onClick={() => {
												if (validateSavingInput()) {
													saveSavingInputChanges(category);
												}
											}}
										>
											Update changes
										</Btn>
										<Btn
											onClick={() => {
												setSavingEditId(null);
											}}
										>
											Cancel changes
										</Btn>
									</Box>
								) : (
									// Show category details
									<>
										<Typography>
											Saving Goal:{' '}
											<span style={{ fontWeight: 'bold' }}>
												${category.goal}
											</span>
										</Typography>
										<Typography>
											Currently Saved:{' '}
											<span style={{ fontWeight: 'bold' }}>
												${findTotalSaved(category)}
											</span>
										</Typography>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												p: 1,
												gap: 1,
											}}
										>
											<Btn
												onClick={() => {
													setSavingEditId(category.name);
												}}
											>
												Edit Budget
											</Btn>
											<Btn
												onClick={() => {
													removeBudget(category);
												}}
											>
												Remove Budget
											</Btn>
										</Box>
									</>
								)}
							</AccordionDetails>
						</Accordion>
					) : null
				)}
			</Box>
			{/* Spendable Budget Tables */}
			<Box sx={{ m: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Typography variant='h5' sx={{ borderBottom: '1px solid black' }}>
					Spendable Budgets
				</Typography>

				{/* If there is not a tracked category in expenses, display text telling there is none
					if there are some being tracked, show each as an accordion. */}
			</Box>
		</Box>
	);
}
