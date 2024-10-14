// @ts-nocheck
// IncomeForm component is used to create new Income items
import {
	Box,
	TextField,
	Select,
	MenuItem,
	Paper,
	FormControl,
	FormHelperText,
} from '@mui/material';
import { Btn } from '../utils/components';
import { useState } from 'react';
import { format, parse, parseISO } from 'date-fns';

export default function IncomeForm({
	category = null,
	onSave,
	onCancel,
	categories,
}) {
	const [item, setItem] = useState({
		name: '',
		amount: '',
		date: '',
		category: category || 'Select Category',
		desc: '',
	});

	// State to track the custom category input when the "Other" option is selected
	const [customCategory, setCustomCategory] = useState('');

	// State to disable the category text field based on dropdown selected
	const [disableCategoryTextfield, setDisableCategoryTextfield] =
		useState(true);

	// State for errors on form validation
	const [errors, setErrors] = useState({
		name: '',
		amount: '',
		date: '',
		category: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === 'category') {
			// Handle case where "Other" (or "other-category") is selected
			if (value === 'other-category') {
				setDisableCategoryTextfield(false);
				setItem({ ...item, category: 'other-category' }); // Keep "other-category" selected
			} else {
				setDisableCategoryTextfield(true);
				setItem({ ...item, category: value }); // set selected category
				setCustomCategory(''); // clear custom category input
			}
		} else {
			// For the other input fields
			setItem({
				...item,
				[name]: value,
			});
		}
	};

	const handleCustomCategoryChange = (e) => {
		const { value } = e.target;
		setCustomCategory(value);
		setItem({ ...item, category: value });
	};

	const validateForm = () => {
		let hasError = false;
		let newErrors = { name: '', amount: '', date: '', category: '' };

		// Name validation
		if (!item.name.trim()) {
			newErrors.name = 'Name is required';
			hasError = true;
		}

		// Amount validation

		// try to convert amount from string to number
		const convertedAmount = +item.amount;
		setItem({
			...item,
			amount: convertedAmount,
		});

		if (!item.amount || isNaN(item.amount) || item.amount <= 0) {
			newErrors.amount = 'Amount must be a number that is greater than 0';
			hasError = true;
		}

		// Date validation
		if (!item.date) {
			newErrors.date = 'Date is required';
			hasError = true;
		}

		// Category Validation
		if (
			!item.category.trim() ||
			item.category === 'Select Category' ||
			item.category === 'other-category'
		) {
			newErrors.category = 'Must select a category';
			hasError = true;
		}

		setErrors(newErrors);
		return !hasError;
	};

	return (
		<Box
			sx={{
				m: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				p: 1,
			}}
			component={Paper}
			elevation={5}
		>
			<TextField
				name='name'
				label='Name'
				value={item.name}
				required
				onChange={handleChange}
				error={!!errors.name}
				helperText={errors.name}
			/>
			<TextField
				name='amount'
				label='Amount'
				type='number'
				value={item.amount}
				required
				onChange={handleChange}
				error={!!errors.amount}
				helperText={errors.amount}
			/>
			<TextField
				name='date'
				type='date'
				value={item.date}
				required
				onChange={handleChange}
				error={!!errors.date}
				helperText={errors.date}
			/>
			<TextField
				name='desc'
				label='Description'
				value={item.desc}
				onChange={handleChange}
			/>

			{/* If the category is null, show category options, else disable category selection */}

			{category !== null ? (
				// Category is defined (provided as a prop)
				<>
					<Select disabled value={category} name='category'>
						<MenuItem value={category}>{category}</MenuItem>
					</Select>
				</>
			) : (
				// Category is null, allow user to select or type a custom category
				<>
					<FormControl error={!!errors.category} sx={{ gap: 2 }}>
						<Select
							value={item.category || 'Select Category'}
							required
							onChange={handleChange}
							name='category'
						>
							<MenuItem value='Select Category'>Select Category</MenuItem>
							{categories.map((category) => (
								<MenuItem value={category} key={category}>
									{category}
								</MenuItem>
							))}
							<MenuItem value='other-category'>Other</MenuItem>
						</Select>

						{/* TextField for a custom category */}
						<TextField
							name='customCategory'
							label='Custom Category'
							value={customCategory}
							disabled={disableCategoryTextfield}
							onChange={handleCustomCategoryChange}
						/>
						<FormHelperText>{errors.category}</FormHelperText>
					</FormControl>
				</>
			)}
			<Box
				sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}
			>
				<Btn
					onClick={() => {
						if (validateForm()) {
							onSave(item);
							// Clear input
							setItem({
								name: '',
								amount: '',
								date: '',
								category: category || 'Select Category',
								desc: '',
							});
						}
					}}
				>
					Add Income
				</Btn>
				<Btn onClick={onCancel}>Cancel</Btn>
			</Box>
		</Box>
	);
}
