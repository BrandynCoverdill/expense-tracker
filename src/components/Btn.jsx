// @ts-nocheck
import { Button } from '@mui/material';

export default function Btn({ onClick, children }) {
	return (
		<Button disableRipple variant='contained' onClick={onClick}>
			{children}
		</Button>
	);
}
