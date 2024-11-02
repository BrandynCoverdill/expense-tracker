// @ts-nocheck
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Container,
	Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useLocalStorage } from '../utils/hooks';

export default function Dashboard() {
	/**
	 * Things I want included in this component:
	 *
	 * - Starting Amount (prompt user for starting amount)
	 *   - If the user enters a number, show the total income
	 * - Total Savings per Category (Sum of Savings)
	 * - Total Expenses per Category (Sum of Expenses)
	 * - Show total - expenses as the total income
	 * - Add pie-chart to show total income, total expenses, and total savings
	 */

	const [incomeCategories, setIncomeCategories] = useLocalStorage(
		'incomeCategories',
		[]
	);
	const [expensesCategories, setExpensesCategories] = useLocalStorage(
		'expensesCategories',
		[]
	);
	const [savingsCategories, setSavingsCategories] = useLocalStorage(
		'savingsCategories',
		[]
	);

	return (
		<Box sx={{ m: 2 }}>
			<Box>
				<Typography variant='h4'>Dashboard</Typography>
				<hr />
			</Box>

			{/* Income */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<Typography
					variant='h5'
					sx={{ textAlign: 'center', fontWeight: 'bold' }}
				>
					Income
				</Typography>
				<Box
					sx={{
						borderBottom: '2px solid black',
						width: '50%',
						maxWidth: '500px',
					}}
				></Box>
				<Box sx={{ mt: 2, width: '100%', maxWidth: '800px' }}>
					{incomeCategories.map((cat) => (
						<Accordion key={cat}>
							<AccordionSummary expandIcon={<ArrowDropDownIcon />}>
								{cat}
							</AccordionSummary>
							<AccordionDetails></AccordionDetails>
						</Accordion>
					))}
				</Box>
			</Box>

			{/* Expenses */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					mt: 2,
				}}
			>
				<Typography
					variant='h5'
					sx={{ textAlign: 'center', fontWeight: 'bold' }}
				>
					Expenses
				</Typography>
				<Box
					sx={{
						borderBottom: '2px solid black',
						width: '50%',
						maxWidth: '500px',
					}}
				></Box>
				<Box sx={{ mt: 2, width: '100%', maxWidth: '800px' }}>
					{expensesCategories
						.filter((cat) => cat.tracked)
						.map((cat) => (
							<Accordion key={cat.name}>
								<AccordionSummary expandIcon={<ArrowDropDownIcon />}>
									{cat.name}
								</AccordionSummary>
								<AccordionDetails></AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Box>

			{/* Savings */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					mt: 2,
				}}
			>
				<Typography
					variant='h5'
					sx={{ textAlign: 'center', fontWeight: 'bold' }}
				>
					Savings
				</Typography>
				<Box
					sx={{
						borderBottom: '2px solid black',
						width: '50%',
						maxWidth: '500px',
					}}
				></Box>
				<Box sx={{ mt: 2, width: '100%', maxWidth: '800px' }}>
					{savingsCategories
						.filter((cat) => cat.tracked)
						.map((cat) => (
							<Accordion key={cat.name}>
								<AccordionSummary>{cat.name}</AccordionSummary>
								<AccordionDetails></AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Box>
		</Box>
	);
}
