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
import { useLocalStorage } from '../utils/hooks';
import { useEffect, useState } from 'react';
import { format, parseISO, formatISO, parse } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { SavingsForm, Btn } from '../utils/components';

export default function Savings() {
	// State to hold the savings array
	const [savings, setSavings] = useLocalStorage('savings', []);

	// Set to hold unique categories
	const categorySet = new Set();

	// State to hold the array of unique category objects with a tracked, name, and goal property
	const [categories, setCategories] = useLocalStorage('savingsCategories', []);

	// state to hide/show the main savings form
	const [showMainForm, setShowMainForm] = useState(false);

	// State to hide/show savings form from a table
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

		// Retain the previous category objects to keep the tracked and goal properties
		const tempOldCategories = [...categories];

		// Clear the categories state
		setCategories([]);

		// Add each category to the Set
		savings.forEach((saving) => categorySet.add(saving.category));

		// Temp array to hold the new unique category objects
		const tempUniqueCategories = [...categorySet];

		// Update the categories state with the new category objects and combine the tracked and goal properties with the previous category objects if they exist
		tempUniqueCategories.forEach((category) => {
			// Find the category in the previous category objects
			const tempCategory = tempOldCategories.find(
				(oldCategory) => oldCategory.name === category
			);

			// if the category exists in the previous category objects, update the tracked and goal properties
			if (tempCategory) {
				setCategories((prevCategories) => [
					...prevCategories,
					{
						name: category,
						tracked: tempCategory.tracked,
						goal: tempCategory.goal,
					},
				]);
			} else {
				// if the category does not exist in the previous category objects, add it to the categories state
				setCategories((prevCategories) => [
					...prevCategories,
					{
						name: category,
						tracked: false,
						goal: 0,
					},
				]);
			}
		});
	}, [savings]);

	// Sort the array everytime the savings state changes
	useEffect(() => {
		sortArray(savings);
	}, [savings]);

	/**
	 * Handles the event of the user clicking the delete button in a row in the table.
	 * Removes the savings item from the savings state array.
	 * @param {number} id The id of the savings item to delete.
	 * @return {void} No return value.
	 */
	const handleDelete = (id) => {
		setSavings(savings.filter((item) => item.id !== id));
	};

	/**
	 * Handles the event of the user clicking the edit button in a row in the table.
	 * Sets the editRowId state to the id of the savings item to edit and sets the editValues
	 * state to the savings item to edit, with the date formatted as 'yyyy-MM-dd'.
	 * @param {number} id The id of the savings item to edit.
	 * @param {object} saving The saving item to edit.
	 * @return {void} No return value.
	 */
	const handleEdit = (id, saving) => {
		setEditRowId(id);
		setEditValues({
			...saving,
			date: format(parseISO(saving.date), 'yyyy-MM-dd'),
		});
	};

	/**
	 * Handles the event of the user changing a value in an input field in the
	 * edit form. Updates the editValues state with the new value.
	 * @param {object} e The event that triggered the function.
	 * @return {void} No return value.
	 */
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === 'amount' && isNaN(value)) {
			return;
		}
		setEditValues({
			...editValues,
			[name]: value,
		});
	};

	/**
	 * Handles the event of the user clicking the save button in the edit form.
	 * Updates the savings state array with the updated savings item, and resets the editRowId
	 * state to null.
	 * @return {void} No return value.
	 */
	const handleSave = () => {
		if (validateFields()) {
			const updatedAmount = +editValues.amount;
			const updatedSaving = {
				...editValues,
				date: formatISO(parse(editValues.date, 'yyyy-MM-dd', new Date()), {
					representation: 'date',
				}),
				amount: updatedAmount.toFixed(2),
			};
			setSavings(
				savings.map((item) => (item.id === editRowId ? updatedSaving : item))
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
	 * Validates the fields of the edit form for the savings item.
	 * Updates the errors state with the validation errors, if any.
	 * Returns true if the fields are valid, false otherwise.
	 * @return {boolean} Whether the fields are valid.
	 */
	const validateFields = () => {
		let hasError = false;
		let newErrors = { name: '', amount: '', date: '' };

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
		let sortedArray = savings.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});
		setSavings(sortedArray);
	};

	return (
		<Box sx={{ p: 2 }}>
			<Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
				<Typography variant='h4'>Savings</Typography>
				<Btn onClick={() => setShowMainForm(true)}>New Saving</Btn>
			</Box>

			{/* Container to hold the savings form */}
			<Box>
				{showMainForm ? (
					<SavingsForm
						onSave={(item) => {
							const updatedItem = {
								...item,
								id: uuidv4(),
								date: formatISO(parse(item.date, 'yyyy-MM-dd', new Date()), {
									representation: 'date',
								}),
								amount: +item.amount,
							};
							setSavings([...savings, updatedItem]);
							setShowMainForm(false);
						}}
						onCancel={() => {
							setShowMainForm(false);
						}}
						categories={categories}
					/>
				) : null}
			</Box>
			{/* A grid to hold tables for each category */}

			{/* Container for larger viewports */}
			<Box
				sx={{
					display: { xs: 'none', md: 'grid' },
					gridTemplateColumns: '1fr 1fr',
					gap: 2,
				}}
			>
				{/* Accordion for each different category that holds a table for each item in that category */}
				{categories.map((category) => (
					<Container
						key={category.name}
						sx={{
							overflowX: 'auto',
						}}
					>
						<Accordion>
							<AccordionSummary expandIcon={<ArrowDropDownIcon />}>
								<Typography>{category.name}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Box sx={{ mb: 2 }}>
									<Btn onClick={() => setShowTableForm(true)}>New Saving</Btn>
								</Box>
								{showTableForm ? (
									<SavingsForm
										onCancel={() => {
											setShowTableForm(false);
										}}
										onSave={(item) => {
											const updatedAmount = +item.amount;
											const updatedItem = {
												...item,
												id: uuidv4(),
												date: formatISO(
													parse(item.date, 'yyyy-MM-dd', new Date()),
													{
														representation: 'date',
													}
												),
												amount: updatedAmount.toFixed(2),
											};
											setSavings([...savings, updatedItem]);
											setShowTableForm(false);
										}}
										categories={categories}
										category={category.name}
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
											{savings
												.filter((item) => item.category === category.name)
												.map((item) => (
													<TableRow key={item.id}>
														{editRowId === item.id ? (
															<TableCell colSpan={5} sx={{ padding: '2 1' }}>
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
																			sx={{ padding: 0 }}
																			onClick={handleSave}
																		>
																			<SaveIcon />
																		</IconButton>
																		<IconButton
																			disableRipple
																			sx={{ padding: 0 }}
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
																<TableCell>${item.amount}</TableCell>
																<TableCell>
																	{format(parseISO(item.date), 'MM/dd/yyyy')}
																</TableCell>
																<TableCell>{item.desc}</TableCell>
																<TableCell>
																	<Box sx={{ display: 'flex', gap: 2 }}>
																		<IconButton
																			disableRipple
																			sx={{ padding: 0 }}
																			onClick={() => handleEdit(item.id, item)}
																		>
																			<EditIcon />
																		</IconButton>
																		<IconButton
																			disableRipple
																			sx={{ padding: 0 }}
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
					display: { xs: 'grid', md: 'none' },
					gridTemplateColumns: '1fr',
					gap: 2,
				}}
			>
				{/* Accordion for each different category that holds a table for each item in that category */}
				{categories.map((category) => (
					<Accordion
						key={category.name}
						sx={{
							overflowX: 'auto',
						}}
					>
						<AccordionSummary expandIcon={<ArrowDropDownIcon />}>
							<Typography>{category.name}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Box sx={{ mb: 2 }}>
								<Btn onClick={() => setShowTableForm(true)}>New Saving</Btn>
							</Box>
							{showTableForm ? (
								<SavingsForm
									onCancel={() => {
										setShowTableForm(false);
									}}
									onSave={(item) => {
										const updatedAmount = +item.amount;
										const updatedItem = {
											...item,
											id: uuidv4(),
											date: formatISO(
												parse(item.date, 'yyyy-MM-dd', new Date()),
												{
													representation: 'date',
												}
											),
											amount: updatedAmount.toFixed(2),
										};
										setSavings([...savings, updatedItem]);
										setShowTableForm(false);
									}}
									categories={categories}
									category={category.name}
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
										{savings
											.filter((item) => item.category === category.name)
											.map((item) => (
												<TableRow key={item.id}>
													{editRowId === item.id ? (
														<TableCell colSpan={5} sx={{ padding: '2 1' }}>
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
																		sx={{ padding: 0 }}
																		onClick={handleSave}
																	>
																		<SaveIcon />
																	</IconButton>
																	<IconButton
																		disableRipple
																		sx={{ padding: 0 }}
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
															<TableCell>${item.amount}</TableCell>
															<TableCell>
																{format(parseISO(item.date), 'MM/dd/yyyy')}
															</TableCell>
															<TableCell>{item.desc}</TableCell>
															<TableCell>
																<Box sx={{ display: 'flex', gap: 2 }}>
																	<IconButton
																		disableRipple
																		sx={{ padding: 0 }}
																		onClick={() => handleEdit(item.id, item)}
																	>
																		<EditIcon />
																	</IconButton>
																	<IconButton
																		disableRipple
																		sx={{ padding: 0 }}
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
