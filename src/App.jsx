// @ts-nocheck
import {CssBaseline, ThemeProvider, createTheme} from '@mui/material';
import {useEffect} from 'react';
import Layout from './components/Layout';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Savings from './pages/Savings';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import InvalidPage from './pages/InvalidPage';
import 'normalize.css';
import {
	addIncome,
	addSavings,
	addExpenses,
	addSavingsCategories,
	addIncomeCategories,
	addExpensesCategories,
} from './utils/util';

// Create custom theme
const theme = createTheme({});

export default function App() {
	// Load data from local storage
	useEffect(() => {
		const keysToLoad = [
			'User',
			'income',
			'incomeCategories',
			'savings',
			'savingsCategories',
			'expenses',
			'expensesCategories',
		];
		keysToLoad.forEach((key) => {
			/**
			 * // TODO: uncomment this block of code below once testing is complete.
			 */
			// if (key === 'User') {
			// 	const name = localStorage.getItem(key) || 'User';
			// 	if (name) {
			// 		localStorage.setItem(key, name);
			// 	}
			// } else {
			// 	if (!localStorage.getItem(key)) {
			// 		localStorage.setItem(key, JSON.stringify([]));
			// 	}
			// }

			// TODO: Remove code below once testing is complete
			// For every key in keysToLoad, place the data from the util functions into the local storage
			if (key === 'User') {
				localStorage.setItem(key, JSON.stringify('User'));
			}
			if (key === 'income') {
				localStorage.setItem(key, JSON.stringify(addIncome()));
			}
			if (key === 'incomeCategories') {
				localStorage.setItem(key, JSON.stringify(addIncomeCategories()));
			}
			if (key === 'savings') {
				localStorage.setItem(key, JSON.stringify(addSavings()));
			}
			if (key === 'savingsCategories') {
				localStorage.setItem(key, JSON.stringify(addSavingsCategories()));
			}
			if (key === 'expenses') {
				localStorage.setItem(key, JSON.stringify(addExpenses()));
			}
			if (key === 'expensesCategories') {
				localStorage.setItem(key, JSON.stringify(addExpensesCategories()));
			}
		});
	});
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Layout>
					<Routes>
						<Route path='/' element={<Dashboard />} />
						<Route path='/income' element={<Income />} />
						<Route path='/savings' element={<Savings />} />
						<Route path='/expenses' element={<Expenses />} />
						<Route path='/budgeting' element={<Budgets />} />
						<Route path='*' element={<InvalidPage />} />
					</Routes>
				</Layout>
			</Router>
		</ThemeProvider>
	);
}
