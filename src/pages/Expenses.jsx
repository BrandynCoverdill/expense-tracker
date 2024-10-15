// @ts-nocheck
import {
	Box,
	Container,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableContainer,
	Paper,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	IconButton,
	TextField,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useLocalStorage} from '../utils/hooks';
import {useEffect, useState} from 'react';
import {format, parseISO, formatISO, parse} from 'date-fns';
import {v4 as uuidv4} from 'uuid';
import {ExpenseForm, Btn} from '../utils/components';

export default function Expenses() {
	// State to hold the expenses array
	const [expenses, setExpenses] = useLocalStorage('expenses', []);

	// Set to hold unique categories
	const categorySet = new Set();

	// State to hold the array of unique categories
	const [categoryArray, setCategoryArray] = useState([]);

	// state to hide/show the main expense form
	const [showMainForm, setShowMainForm] = useState(false);

	// State to hide/show expense form from a table
	const [showTableForm, setShowTableForm] = useState(false);

	// Edit row state in a table
	const [editRowId, setEditRowId] = useState(null);

	// State to track the values of the edited row
	const [editValues, setEditValues] = useState({});

	// State to track errors on invalid inputs
	const [errors, setErrors] = useState({
		name: '',
		amount: '',
		date: '',
	});

	// Create a Set for unique categories
	useEffect(() => {
		// Clear the Set
		categorySet.clear();

		// Clear the array
		setCategoryArray([]);

		// Add each category to the Set
		expenses.forEach((expense) => categorySet.add(expense.category));

		// Update the array that holds the unique categories
		setCategoryArray([...categorySet]);
	}, [expenses]);

	// Sort the array everytime the expenses state changes
	useEffect(() => {
		sortArray(expenses);
	}, [expenses]);

	/**
	 * Handles the event of the user clicking the delete button in a row in the table.
	 * Removes the expense item from the expenses state array.
	 * @param {number} id The id of the expense item to delete.
	 * @return {void} No return value.
	 */
	const handleDelete = (id) => {
		setExpenses(expenses.filter((item) => item.id !== id));
	};

	/**
	 * Handles the event of the user clicking the edit button in a row in the table.
	 * Sets the editRowId state to the id of the expense item to edit and sets the editValues
	 * state to the expense item to edit, with the date formatted as 'yyyy-MM-dd'.
	 * @param {number} id The id of the expense item to edit.
	 * @param {object} expense The expense item to edit.
	 * @return {void} No return value.
	 */
	const handleEdit = (id, expense) => {
		setEditRowId(id);
		setEditValues({
			...expense,
			date: format(parseISO(expense.date), 'yyyy-MM-dd'),
			amount: +expense.amount,
		});
	};

	/**
	 * Handles the event of the user changing a value in an input field in the
	 * edit form. Updates the editValues state with the new value.
	 * @param {object} e The event that triggered the function.
	 * @return {void} No return value.
	 */
	const handleInputChange = (e) => {
		const {name, value} = e.target;
		setEditValues({
			...editValues,
			[name]: value,
		});
	};

	/**
	 * Handles the event of the user clicking the save button in the edit form.
	 * Updates the expenses state array with the updated expense item, and resets the editRowId
	 * state to null.
	 * @return {void} No return value.
	 */
	const handleSave = () => {
		if (validateFields()) {
			const updatedExpense = {
				...editValues,
				date: formatISO(parse(editValues.date, 'yyyy-MM-dd', new Date()), {
					representation: 'date',
				}),
				amount: +editValues.amount,
			};
			setExpenses(
				expenses.map((item) => (item.id === editRowId ? updatedExpense : item))
			);
			setEditRowId(null);
		}
	};

	/**
	 * Resets the editRowId state to null, thus closing the edit form.
	 * @return {void} No return value.
	 */
	const handleCancelEdit = () => {
		setEditRowId(null);
	};

	/**
	 * Validates the fields of the edit form for the expense item.
	 * Updates the errors state with the validation errors, if any.
	 * Returns true if the fields are valid, false otherwise.
	 * @return {boolean} Whether the fields are valid.
	 */
	const validateFields = () => {
		let hasError = false;
		let newErrors = {name: '', amount: '', date: ''};

		// Name validation
		if (!editValues.name.trim()) {
			newErrors.name = 'Name is required';
			hasError = true;
		}

		// Amount validation
		if (
			!editValues.amount ||
			isNaN(editValues.amount) ||
			editValues.amount <= 0
		) {
			newErrors.amount = 'Amount must be a number and must be greater than 0';
			hasError = true;
		}

		// Date validation
		if (!editValues.date) {
			newErrors.date = 'Date is required';
			hasError = true;
		}
		setErrors(newErrors);
		return !hasError;
	};

	const sortArray = (arr) => {
		// Sort the array by date
		let sortedArray = expenses.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});
		setExpenses(sortedArray);
	};

	return (
		<Box sx={{p: 2}}>
			<Box sx={{display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap'}}>
				<Typography variant='h4'>Expenses</Typography>
				<Btn onClick={() => setShowMainForm(true)}>Add Expense</Btn>
			</Box>

			{/* Container to hold the expense form */}
			<Box>
				{showMainForm ? (
					<ExpenseForm
						onSave={(item) => {
							const updatedItem = {
								...item,
								id: uuidv4(),
								date: formatISO(parse(item.date, 'yyyy-MM-dd', new Date()), {
									representation: 'date',
								}),
								amount: +item.amount,
							};
							setExpenses([...expenses, updatedItem]);
							setShowMainForm(false);
						}}
						onCancel={() => {
							setShowMainForm(false);
						}}
						categories={categoryArray}
					/>
				) : null}
			</Box>
			{/* A grid to hold tables for each category */}

			{/* Container for larger viewports */}
			<Box
				sx={{
					display: {xs: 'none', md: 'grid'},
					gridTemplateColumns: '1fr 1fr',
					gap: 2,
				}}
			>
				{/* Accordion for each different category that holds a table for each item in that category */}
				{categoryArray.map((category) => (
					<Container
						key={category}
						sx={{
							overflowX: 'auto',
						}}
					>
						<Accordion>
							<AccordionSummary expandIcon={<ArrowDropDownIcon />}>
								<Typography>{category}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Box sx={{mb: 2}}>
									<Btn onClick={() => setShowTableForm(true)}>Add Expense</Btn>
								</Box>
								{showTableForm ? (
									<ExpenseForm
										onCancel={() => {
											setShowTableForm(false);
										}}
										onSave={(item) => {
											const updatedItem = {
												...item,
												id: uuidv4(),
												date: formatISO(
													parse(item.date, 'yyyy-MM-dd', new Date()),
													{
														representation: 'date',
													}
												),
												amount: +item.amount,
											};
											setExpenses([...expenses, updatedItem]);
											setShowTableForm(false);
										}}
										categories={categoryArray}
										category={category}
									/>
								) : null}
								<TableContainer component={Paper}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell>Amount</TableCell>
												<TableCell>Date</TableCell>
												<TableCell>Description</TableCell>
												<TableCell>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{expenses
												.filter((item) => item.category === category)
												.map((item) => (
													<TableRow key={item.id}>
														{editRowId === item.id ? (
															<TableCell colSpan={5} sx={{padding: '2 1'}}>
																<Box
																	sx={{
																		display: 'flex',
																		gap: 2,
																		flexDirection: 'column',
																	}}
																>
																	<TextField
																		name='name'
																		label='Name'
																		value={editValues.name}
																		onChange={handleInputChange}
																		fullWidth
																		required
																		error={!!errors.name}
																		helperText={errors.name}
																	/>
																	<TextField
																		name='amount'
																		label='Amount'
																		value={editValues.amount}
																		onChange={handleInputChange}
																		fullWidth
																		required
																		error={!!errors.amount}
																		helperText={errors.amount}
																	/>
																	<TextField
																		name='date'
																		label='Date'
																		type='date'
																		value={editValues.date}
																		onChange={handleInputChange}
																		fullWidth
																		required
																		error={!!errors.date}
																		helperText={errors.date}
																	/>
																	<TextField
																		name='desc'
																		label='Description'
																		value={editValues.desc}
																		onChange={handleInputChange}
																		fullWidth
																	/>
																	<Box
																		sx={{
																			display: 'flex',
																			gap: 2,
																			justifyContent: 'flex-end',
																		}}
																	>
																		<IconButton
																			disableRipple
																			sx={{padding: 0}}
																			onClick={handleSave}
																		>
																			<SaveIcon />
																		</IconButton>
																		<IconButton
																			disableRipple
																			sx={{padding: 0}}
																			onClick={handleCancelEdit}
																		>
																			<CancelIcon />
																		</IconButton>
																	</Box>
																</Box>
															</TableCell>
														) : (
															<>
																<TableCell>{item.name}</TableCell>
																<TableCell>${item.amount.toFixed(2)}</TableCell>
																<TableCell>
																	{format(parseISO(item.date), 'MM/dd/yyyy')}
																</TableCell>
																<TableCell>{item.desc}</TableCell>
																<TableCell>
																	<Box sx={{display: 'flex', gap: 2}}>
																		<IconButton
																			disableRipple
																			sx={{padding: 0}}
																			onClick={() => handleEdit(item.id, item)}
																		>
																			<EditIcon />
																		</IconButton>
																		<IconButton
																			disableRipple
																			sx={{padding: 0}}
																			onClick={() => handleDelete(item.id)}
																		>
																			<DeleteIcon />
																		</IconButton>
																	</Box>
																</TableCell>
															</>
														)}
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</AccordionDetails>
						</Accordion>
					</Container>
				))}
			</Box>

			{/* Container for smaller viewports */}
			<Box
				sx={{
					display: {xs: 'grid', md: 'none'},
					gridTemplateColumns: '1fr',
					gap: 2,
				}}
			>
				{/* Accordion for each different category that holds a table for each item in that category */}
				{categoryArray.map((category) => (
					<Accordion
						key={category}
						sx={{
							overflowX: 'auto',
						}}
					>
						<AccordionSummary expandIcon={<ArrowDropDownIcon />}>
							<Typography>{category}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<TableContainer component={Paper}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Name</TableCell>
											<TableCell>Amount</TableCell>
											<TableCell>Date</TableCell>
											<TableCell>Description</TableCell>
											<TableCell>Actions</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{expenses
											.filter((item) => item.category === category)
											.map((item) => (
												<TableRow key={item.id}>
													{editRowId === item.id ? (
														<TableCell colSpan={5} sx={{padding: '2 1'}}>
															<Box
																sx={{
																	display: 'flex',
																	gap: 2,
																	flexDirection: 'column',
																}}
															>
																<TextField
																	name='name'
																	label='Name'
																	value={editValues.name}
																	onChange={handleInputChange}
																	fullWidth
																	required
																	error={!!errors.name}
																	helperText={errors.name}
																/>
																<TextField
																	name='amount'
																	label='Amount'
																	value={editValues.amount}
																	onChange={handleInputChange}
																	fullWidth
																	required
																	error={!!errors.amount}
																	helperText={errors.amount}
																/>
																<TextField
																	name='date'
																	label='Date'
																	type='date'
																	value={editValues.date}
																	onChange={handleInputChange}
																	fullWidth
																	required
																	error={!!errors.date}
																	helperText={errors.date}
																/>
																<TextField
																	name='desc'
																	label='Description'
																	value={editValues.desc}
																	onChange={handleInputChange}
																	fullWidth
																/>
																<Box
																	sx={{
																		display: 'flex',
																		gap: 2,
																		justifyContent: 'flex-end',
																	}}
																>
																	<IconButton
																		disableRipple
																		sx={{padding: 0}}
																		onClick={handleSave}
																	>
																		<SaveIcon />
																	</IconButton>
																	<IconButton
																		disableRipple
																		sx={{padding: 0}}
																		onClick={handleCancelEdit}
																	>
																		<CancelIcon />
																	</IconButton>
																</Box>
															</Box>
														</TableCell>
													) : (
														<>
															<TableCell>{item.name}</TableCell>
															<TableCell>${item.amount.toFixed(2)}</TableCell>
															<TableCell>
																{format(parseISO(item.date), 'MM/dd/yyyy')}
															</TableCell>
															<TableCell>{item.desc}</TableCell>
															<TableCell>
																<Box sx={{display: 'flex', gap: 2}}>
																	<IconButton
																		disableRipple
																		sx={{padding: 0}}
																		onClick={() => handleEdit(item.id, item)}
																	>
																		<EditIcon />
																	</IconButton>
																	<IconButton
																		disableRipple
																		sx={{padding: 0}}
																		onClick={() => handleDelete(item.id)}
																	>
																		<DeleteIcon />
																	</IconButton>
																</Box>
															</TableCell>
														</>
													)}
												</TableRow>
											))}
									</TableBody>
								</Table>
							</TableContainer>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Box>
	);
}
