// Shown when the user goes to a subdirectory that doesn't exist
import { Box, Container, Typography } from '@mui/material';

export default function InvalidPage() {
	return (
		<Container>
			<Box>
				<Typography>Invalid Page</Typography>
			</Box>
		</Container>
	);
}
