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
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useIncome } from '../utils/hooks';
import { useEffect, useState } from 'react';

export default function Income() {
	const sampleData = [
		{
			id: 0,
			name: 'Job Income',
			amount: 1000.5,
			date: new Date(),
			category: 'Job',
			desc: '',
		},
		{
			id: 1,
			name: 'Rent from a roomate',
			amount: 700,
			date: new Date(),
			category: 'Housing',
			desc: 'Rent from Mike',
		},
		{
			id: 2,
			name: 'Rent from a roomate',
			amount: 700,
			date: new Date(),
			category: 'Housing',
			desc: 'Rent from Civ',
		},
		{
			id: 3,
			name: 'Scratch Ticket',
			amount: 27.79,
			date: new Date(),
			category: 'Other',
			desc: 'Won a scratch ticket and some change on the side of the machine.',
		},
	];

	const [income, setIncome] = useIncome(sampleData);
	const categorySet = new Set();
	const [categoryArray, setCategoryArray] = useState([]);

	// Create a Set for unique categories
	useEffect(() => {
		// Clear the Set
		categorySet.clear();

		// Clear the array
		setCategoryArray([]);

		// Add each category to the Set
		income.forEach((income) => categorySet.add(income.category));

		// Update the array that holds the unique categories
		setCategoryArray([...categorySet]);
	}, [income]);

	const handleDelete = (id) => {
		setIncome(income.filter((item) => item.id !== id));
	};

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant='h4'>Income</Typography>
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
											{income
												.filter((income) => income.category === category)
												.map((income) => (
													<TableRow key={income.id}>
														<TableCell>{income.name}</TableCell>
														<TableCell>${income.amount}</TableCell>
														<TableCell>
															{income.date.toLocaleDateString()}
														</TableCell>
														<TableCell>{income.desc}</TableCell>
														<TableCell>
															<Box sx={{ display: 'flex', gap: 2 }}>
																<IconButton disableRipple sx={{ padding: 0 }}>
																	<EditIcon />
																</IconButton>
																<IconButton
																	disableRipple
																	sx={{ padding: 0 }}
																	onClick={() => handleDelete(income.id)}
																>
																	<DeleteIcon />
																</IconButton>
															</Box>
														</TableCell>
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
										{income
											.filter((income) => income.category === category)
											.map((income) => (
												<TableRow key={income.id}>
													<TableCell>{income.name}</TableCell>
													<TableCell>${income.amount}</TableCell>
													<TableCell>
														{income.date.toLocaleDateString()}
													</TableCell>
													<TableCell>{income.desc}</TableCell>
													<TableCell>
														<Box sx={{ display: 'flex', gap: 2 }}>
															<IconButton disableRipple sx={{ padding: 0 }}>
																<EditIcon />
															</IconButton>
															<IconButton
																disableRipple
																sx={{ padding: 0 }}
																onClick={() => handleDelete(income.id)}
															>
																<DeleteIcon />
															</IconButton>
														</Box>
													</TableCell>
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
