import { Button, ButtonProps, styled } from '@mui/material';
import { grey } from '@mui/material/colors';

const ActionButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(grey[900]),
  backgroundColor: grey[900],
  '&:hover': {
    backgroundColor: grey[900],
  },
  '&:focus': {
    backgroundColor: grey[900],
    outline: 'none',
  },
  outline: 'none',
  fontSize: '11px',
}));

ActionButton.displayName = 'ActionButton';

export default ActionButton;
