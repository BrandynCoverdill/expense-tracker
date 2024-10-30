// Common functions to use throughout the app
import {v4 as uuidv4} from 'uuid';

const addExpenses = () => {
	return [
		{
			name: 'Grocery Run',
			amount: 45.3,
			category: 'Groceries',
			date: '2024-10-20',
		},
		{
			name: 'Gas Station',
			amount: 30.0,
			category: 'Transportation',
			date: '2024-10-18',
		},
		{
			name: 'Electric Bill',
			amount: 60.5,
			category: 'Utilities',
			date: '2024-10-15',
		},
		{
			name: 'Dining Out',
			amount: 25.75,
			category: 'Entertainment',
			date: '2024-10-17',
		},
		{
			name: 'Gym Membership',
			amount: 20.0,
			category: 'Health',
			date: '2024-10-10',
		},
		{
			name: 'Coffee Shop',
			amount: 8.5,
			category: 'Food & Drink',
			date: '2024-10-22',
		},
		{
			name: 'Online Subscription',
			amount: 12.99,
			category: 'Entertainment',
			date: '2024-10-12',
		},
		{
			name: 'Pet Supplies',
			amount: 50.0,
			category: 'Pet Care',
			date: '2024-10-08',
		},
		{
			name: 'Water Bill',
			amount: 25.0,
			category: 'Utilities',
			date: '2024-10-05',
		},
		{
			name: 'Medication',
			amount: 15.99,
			category: 'Health',
			date: '2024-10-07',
		},
	];
};

const addExpensesCategories = () => {
	return [
		{
			name: 'Groceries',
			tracked: true,
			startDate: '2024-10-01',
			numWeeks: 2,
			allowance: 200.0,
		},
		{
			name: 'Transportation',
			tracked: true,
			startDate: '2024-10-03',
			numWeeks: 3,
			allowance: 100.0,
		},
		{
			name: 'Utilities',
			tracked: false,
			startDate: '2024-10-05',
			numWeeks: 4,
			allowance: 0,
		},
		{
			name: 'Entertainment',
			tracked: true,
			startDate: '2024-10-08',
			numWeeks: 1,
			allowance: 150.0,
		},
		{
			name: 'Health',
			tracked: true,
			startDate: '2024-10-12',
			numWeeks: 2,
			allowance: 75.0,
		},
		{
			name: 'Food & Drink',
			tracked: false,
			startDate: '2024-10-15',
			numWeeks: 3,
			allowance: 0,
		},
		{
			name: 'Pet Care',
			tracked: true,
			startDate: '2024-10-07',
			numWeeks: 4,
			allowance: 80.0,
		},
	];
};

const addIncome = () => {
	return [
		{
			id: uuidv4(),
			name: 'Freelance Project',
			amount: 500.0,
			date: '2024-10-20',
			category: 'Freelance',
			desc: 'Payment for web development project',
		},
		{
			id: uuidv4(),
			name: 'Salary',
			amount: 3000.0,
			date: '2024-10-15',
			category: 'Employment',
			desc: 'Monthly salary payment',
		},
		{
			id: uuidv4(),
			name: 'Dividends',
			amount: 150.75,
			date: '2024-10-12',
			category: 'Investments',
			desc: 'Quarterly dividend earnings',
		},
		{
			id: uuidv4(),
			name: 'Gift',
			amount: 200.0,
			date: '2024-10-10',
			category: 'Personal',
			desc: 'Birthday gift from family',
		},
		{
			id: uuidv4(),
			name: 'Side Hustle',
			amount: 250.0,
			date: '2024-10-08',
			category: 'Freelance',
			desc: 'Income from weekend job',
		},
		{
			id: uuidv4(),
			name: 'Investment Sale',
			amount: 1200.0,
			date: '2024-10-05',
			category: 'Investments',
			desc: 'Proceeds from selling stocks',
		},
		{
			id: uuidv4(),
			name: 'Bonus',
			amount: 400.0,
			date: '2024-10-03',
			category: 'Employment',
			desc: 'Performance-based bonus',
		},
	];
};

const addIncomeCategories = () => {
	return ['Freelance', 'Employment', 'Investments', 'Personal'];
};

const addSavings = () => {
	return [
		{
			id: uuidv4(),
			name: 'Emergency Fund',
			amount: 1000.0,
			date: '2024-10-22',
			category: 'Emergency',
			desc: 'Monthly contribution to emergency savings',
		},
		{
			id: uuidv4(),
			name: 'Vacation Fund',
			amount: 300.0,
			date: '2024-10-15',
			category: 'Travel',
			desc: 'Set aside for future travel expenses',
		},
		{
			id: uuidv4(),
			name: 'Retirement Savings',
			amount: 500.0,
			date: '2024-10-12',
			category: 'Retirement',
			desc: 'Contribution to retirement account',
		},
		{
			id: uuidv4(),
			name: 'Education Fund',
			amount: 200.0,
			date: '2024-10-10',
			category: 'Education',
			desc: 'Savings for educational courses',
		},
		{
			id: uuidv4(),
			name: 'Home Renovation',
			amount: 750.0,
			date: '2024-10-08',
			category: 'Home',
			desc: 'Saved for future home improvements',
		},
		{
			id: uuidv4(),
			name: 'Health Savings',
			amount: 150.0,
			date: '2024-10-05',
			category: 'Health',
			desc: 'Funds for unexpected health expenses',
		},
		{
			id: uuidv4(),
			name: 'Wedding Fund',
			amount: 600.0,
			date: '2024-10-03',
			category: 'Personal',
			desc: 'Savings for wedding expenses',
		},
	];
};

const addSavingsCategories = () => {
	return [
		{
			name: 'Emergency',
			goal: 5000.0,
			tracked: true,
		},
		{
			name: 'Travel',
			goal: 2000.0,
			tracked: true,
		},
		{
			name: 'Retirement',
			goal: 10000.0,
			tracked: true,
		},
		{
			name: 'Education',
			goal: 0,
			tracked: false,
		},
		{
			name: 'Home',
			goal: 4000.0,
			tracked: true,
		},
		{
			name: 'Health',
			goal: 1500.0,
			tracked: true,
		},
		{
			name: 'Personal',
			goal: 0,
			tracked: false,
		},
	];
};

export {
	addExpenses,
	addExpensesCategories,
	addIncome,
	addIncomeCategories,
	addSavings,
	addSavingsCategories,
};
