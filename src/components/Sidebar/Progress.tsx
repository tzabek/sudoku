import {
  Box,
  LinearProgress,
  linearProgressClasses,
  styled,
  Typography,
} from '@mui/material';
import { useProgress } from '../../lib/hooks';
import { ProgressProps } from '../../lib/libs/sidebar';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
  },
}));

export default function Progress(props: ProgressProps) {
  const { board, editable } = props;

  const progress = useProgress(board, editable);

  return (
    <Box className="game-progress-bar">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <BorderLinearProgress variant="determinate" value={progress} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}
          >{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
