// @ts-nocheck
import { useName, useModal } from '../utils/hooks';
import { Link } from 'react-router-dom';
import {
	Box,
	AppBar,
	Container,
	Toolbar,
	IconButton,
	Typography,
	Menu,
	Tooltip,
	MenuItem,
	Modal,
	TextField,
	Button,
} from '@mui/material';
import { Btn } from '../utils/components';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useRef, useEffect } from 'react';

export default function Layout({ children }) {
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);
	const [name, setName] = useName('User');
	const [openModal, setOpenModal] = useModal();

	const textFieldRef = useRef(null);

	// Set focus on text field when modal is open
	useEffect(() => {
		if (openModal && textFieldRef.current) {
			textFieldRef.current.focus();
		}
	}, [openModal]);

	const pages = ['Dashboard', 'Income', 'Savings', 'Expenses', 'Budgeting'];
	const userSettings = [{ name: 'Change Name', action: 'changeName' }];

	/**
	 * Handles the event of the nav menu being opened.
	 * @param {MouseEvent} event The event that triggered the function.
	 * @return {void} No return value.
	 */
	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	/**
	 * Handles the event of the user menu being opened.
	 * @param {MouseEvent} event The event that triggered the function.
	 * @return {void} No return value.
	 */
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	/**
	 * Handles the event of the nav menu being closed.
	 * @return {void} No return value.
	 */
	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	/**
	 * Handles the event of the user menu being closed.
	 * @return {void} No return value.
	 */
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	/**
	 * Handles the event of the user clicking on a button in the user settings menu.
	 * @param {string} action The action that the button should perform.
	 * @return {void} No return value.
	 */
	const handleClick = (action) => {
		switch (action) {
			case 'changeName':
				setOpenModal(true);
				break;
			default:
				break;
		}
	};

	return (
		<>
			<AppBar position='static'>
				<Container maxWidth='xl'>
					<Toolbar disableGutters>
						<Typography
							sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}
							variant='h5'
						>
							Expense Tracker
						</Typography>
						<Box sx={{ flexGrow: 1, display: 'flex' }}>
							{pages.map((page) => (
								<Typography
									variant='h6'
									noWrap
									component='a'
									href={`/${page.toLowerCase()}`}
									key={page}
									sx={{
										mr: 2,
										display: { xs: 'none', md: 'flex' },
										fontWeight: 700,
										textDecoration: 'none',
										color: 'black',
										letterSpacing: '.3rem',
									}}
								>
									<Link to={page.toLowerCase()}>{page}</Link>
								</Typography>
							))}
						</Box>
						<Box
							sx={{
								flexGrow: 1,
								display: { xs: 'flex', md: 'none' },
								justifyContent: 'space-between',
								alignItems: 'center',
								width: '100%',
							}}
						>
							<IconButton
								size='large'
								onClick={handleOpenNavMenu}
								disableRipple
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id='menu-appbar'
								anchorEl={anchorElNav}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: 'block', md: 'none' },
								}}
							>
								{pages.map((page) => (
									<MenuItem
										key={page}
										onClick={handleCloseNavMenu}
										disableRipple
									>
										<Link to={page.toLowerCase()}>
											<Typography
												textAlign='center'
												sx={{ textDecoration: 'none', color: 'black' }}
											>
												{page}
											</Typography>
										</Link>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title='Open user settings'>
								<IconButton
									onClick={handleOpenUserMenu}
									sx={{ p: 0 }}
									disableRipple
								>
									{name}
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id='menu-appbar'
								anchorEl={anchorElUser}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								keepMounted
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{userSettings.map((setting) => (
									<MenuItem
										key={setting}
										onClick={handleCloseUserMenu}
										disableRipple
									>
										<Typography
											textAlign='center'
											onClick={() => handleClick(setting.action)}
										>
											{setting.name}
										</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<Modal
				open={openModal}
				onClose={() => {
					if (textFieldRef.current.value.trim() === '') {
						setName('User');
					}
					setOpenModal(false);
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						boxShadow: 10,
						p: 4,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<TextField
							label={`Name`}
							sx={{ width: '100%' }}
							inputRef={textFieldRef}
							inputProps={{ maxLength: 20 }}
						/>
						<Box sx={{ mt: 2 }}>
							<Btn
								onClick={() => {
									if (textFieldRef.current.value.trim() === '') {
										setName('User');
									}
									setName(textFieldRef.current.value);
									setOpenModal(false);
								}}
							>
								Change Name
							</Btn>
						</Box>
					</Box>
				</Box>
			</Modal>
		</>
	);
}
