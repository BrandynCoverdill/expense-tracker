import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Savings from './pages/Savings';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import InvalidPage from './pages/InvalidPage';
import 'normalize.css';

// Create custom theme
const theme = createTheme({});

export default function App() {
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
