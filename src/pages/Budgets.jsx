// @ts-nocheck
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	TextField,
	Typography,
} from '@mui/material';
import {Btn, SpendableBudgetForm, SavingsBudgetForm} from '../utils/components';
import {useState} from 'react';
import {useLocalStorage} from '../utils/hooks';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {format, parse, addWeeks, subWeeks} from 'date-fns';

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
	const [expenseEditValues, setExpenseEditValues] = useState({
		allowance: '',
		startDate: '',
		numWeeks: '',
	});
	const [expenseEditErrors, setExpenseEditErrors] = useState({
		allowance: '',
		startDate: '',
		numWeeks: '',
	});

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
				resetSavingEditValues();
			}
		});

		setShowBudgetForm('');
	};

	const resetSavingEditValues = () => {
		setSavingEditValues({
			goal: '',
		});
	};

	const handleExpenseBudgetSubmit = (category) => {
		const tempCategories = [...expenseCategories];

		tempCategories.forEach((cat) => {
			if (cat.name === category.name) {
				let updatedAllowance = +expenseEditValues.allowance;
				cat.allowance = updatedAllowance.toFixed(2);
				cat.startDate = expenseEditValues.startDate;
				cat.numWeeks = +expenseEditValues.numWeeks;
				cat.tracked = true;
			}
		});

		setExpenseCategories([...tempCategories]);
		resetExpenseEditValues();
		setShowBudgetForm('');
	};

	const resetExpenseEditValues = () => {
		setExpenseEditValues({
			allowance: '',
			startDate: '',
			numWeeks: '',
		});
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
				return (
					<SpendableBudgetForm
						onClick={(budget) => handleExpenseBudgetSubmit(budget)}
						closeForm={() => setShowBudgetForm('')}
					/>
				);
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

	const removeSavingBudget = (category) => {
		const tempCategories = [...savingCategories];
		tempCategories.find((cat) => {
			if (cat.name === category.name) {
				cat.goal = 0;
				cat.tracked = false;
				setSavingCategories(tempCategories);
			}
		});
	};

	const removeExpenseBudget = (category) => {
		const tempCategories = [...expenseCategories];
		tempCategories.find((cat) => {
			if (cat.name === category.name) {
				cat.tracked = false;
				cat.allowance = 0;
				cat.numWeeks = 1;
				setExpenseCategories(tempCategories);
			}
		});
	};

	const handleSavingInputChange = (e) => {
		const {name, value} = e.target;
		if (name === 'goal' && isNaN(value)) {
			return;
		}
		setSavingEditValues({
			[name]: +value,
		});
	};

	const handleExpenseBudgetChange = (e) => {
		const {name, value} = e.target;
		if (name === 'allowance' && isNaN(value)) {
			return;
		}
		if (name === 'numWeeks' && !isNaN(value)) {
			setExpenseEditValues({
				...expenseEditValues,
				[name]: +value,
			});
			return;
		}
		setExpenseEditValues({
			...expenseEditValues,
			[name]: value,
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

	const validateExpenseInput = () => {
		const newErrors = {
			allowance: '',
			startDate: '',
			numWeeks: '',
		};
		let hasError = false;

		// allowance
		if (isNaN(expenseEditValues.allowance) || !expenseEditValues.allowance) {
			newErrors.allowance = 'Please enter a valid number';
			hasError = true;
		} else if (expenseEditValues.allowance <= 0) {
			newErrors.allowance = 'Please set an allowance higher than 0';
			hasError = true;
		}

		// startDate
		if (!expenseEditValues.startDate) {
			newErrors.startDate = 'Please select the start date';
			hasError = true;
		}

		// numWeeks
		if (isNaN(expenseEditValues.numWeeks) || !expenseEditValues.numWeeks) {
			newErrors.numWeeks = 'Please enter a valid number';
			hasError = true;
		} else if (expenseEditValues.numWeeks <= 0) {
			newErrors.numWeeks = 'Please set the number of weeks greater than 0';
			hasError = true;
		}

		setExpenseEditErrors(newErrors);
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

	const findRenewalDate = (startDate, numWeeks) => {
		// Hold today's date to compare
		const today = new Date();

		// mutable variable
		let tempDate = parse(startDate, 'yyyy-MM-dd', new Date());

		// While the tempDate does not go over today's date
		while (tempDate < today) {
			const newDate = addWeeks(tempDate, numWeeks);
			tempDate = newDate;
		}
		return format(tempDate, 'yyyy-MM-dd');
	};

	const findRemainingAllowance = (category) => {
		// get renewal date
		const renewalDate = parse(
			findRenewalDate(category.startDate, category.numWeeks),
			'yyyy-MM-dd',
			new Date()
		);
		// get previous renewal date if there is one
		const previousRenewalDate = subWeeks(renewalDate, category.numWeeks);

		// find the total expenses from that date range
		const filteredData = expenses.filter(
			(expense) =>
				parse(expense.date, 'yyyy-MM-dd', new Date()) >= previousRenewalDate
		);
		const total = filteredData.reduce(
			(total, expense) => total + expense.amount,
			0
		);

		// return that total minus the allowance
		return (category.allowance - total).toFixed(2);
	};

	return (
		<Box sx={{p: 2}}>
			<Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
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
			<Box sx={{m: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
				<Typography variant='h5' sx={{borderBottom: '1px solid black'}}>
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
									<Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
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
											<span style={{fontWeight: 'bold'}}>${category.goal}</span>
										</Typography>
										<Typography>
											Currently Saved:{' '}
											<span style={{fontWeight: 'bold'}}>
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
													removeSavingBudget(category);
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
			<Box sx={{m: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
				<Typography variant='h5' sx={{borderBottom: '1px solid black'}}>
					Spendable Budgets
				</Typography>

				{/* If there is not a tracked category in expenses, display text telling there is none
					if there are some being tracked, show each as an accordion. */}
				{expenseCategories.map((category) =>
					category.tracked ? (
						<Accordion key={category.name}>
							<AccordionSummary expandIcon={<ArrowDropDownIcon />}>
								{category.name}
							</AccordionSummary>
							<AccordionDetails>
								{expenseEditId === category.name ? (
									// show edit details
									<Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
										<TextField
											name='allowance'
											type='number'
											sx={{width: '100%'}}
											label='Spendable Allowance'
											required
											onChange={(e) => handleExpenseBudgetChange(e)}
											error={!!expenseEditErrors.allowance}
											helperText={expenseEditErrors.allowance}
										></TextField>
										<TextField
											type='date'
											sx={{width: '100%'}}
											label='Date to start budget'
											name='startDate'
											required
											onChange={(e) => handleExpenseBudgetChange(e)}
											error={!!expenseEditErrors.startDate}
											helperText={expenseEditErrors.startDate}
										></TextField>
										<TextField
											type='number'
											sx={{width: '100%'}}
											label='Number of weeks to budget'
											name='numWeeks'
											required
											onChange={(e) => handleExpenseBudgetChange(e)}
											error={!!expenseEditErrors.numWeeks}
											helperText={expenseEditErrors.numWeeks}
										></TextField>
										<Box
											sx={{display: 'flex', flexDirection: 'column', gap: 2}}
										>
											<Btn
												onClick={() => {
													if (validateExpenseInput()) {
														handleExpenseBudgetSubmit(category);
														setExpenseEditId(null);
													}
												}}
											>
												Update Changes
											</Btn>
											<Btn onClick={() => setExpenseEditId(null)}>
												Cancel Changes
											</Btn>
										</Box>
									</Box>
								) : (
									// show category details
									<>
										<Typography>
											Remaining Allowance:{' '}
											{findRemainingAllowance(category) < 0 ? (
												<span style={{fontWeight: 'bold', color: '#ff0000'}}>
													${findRemainingAllowance(category)}
												</span>
											) : (
												<span style={{fontWeight: 'bold', color: '#00bb00'}}>
													${findRemainingAllowance(category)}
												</span>
											)}
										</Typography>
										<Typography>
											Set Allowance:{' '}
											<span style={{fontWeight: 'bold'}}>
												${category.allowance}
											</span>
										</Typography>
										<Typography>
											Renews on:{' '}
											<span style={{fontWeight: 'bold'}}>
												{findRenewalDate(category.startDate, category.numWeeks)}
											</span>
										</Typography>
										<Typography>
											Start Date:{' '}
											<span style={{fontWeight: 'bold'}}>
												{category.startDate}
											</span>
										</Typography>
										<Typography>
											Number of weeks:{' '}
											<span style={{fontWeight: 'bold'}}>
												{category.numWeeks}
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
													setExpenseEditId(category.name);
												}}
											>
												Edit Budget
											</Btn>
											<Btn
												onClick={() => {
													removeExpenseBudget(category);
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
		</Box>
	);
}
