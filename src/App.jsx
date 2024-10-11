import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import InvalidPage from './pages/InvalidPage';

// Create custom theme
const theme = createTheme({});

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline>
				<Router>
					<Layout>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='*' element={<InvalidPage />} />
						</Routes>
					</Layout>
				</Router>
			</CssBaseline>
		</ThemeProvider>
	);
}
