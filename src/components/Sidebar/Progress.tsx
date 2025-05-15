import {
  Box,
  Chip,
  LinearProgress,
  linearProgressClasses,
  styled,
} from '@mui/material';
import { useProgress } from '../../lib/hooks';
import { ProgressProps } from '../../lib/libs/sidebar';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 32,
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
  },
}));

function Progress(props: ProgressProps) {
  const { board, editable } = props;

  const progress = useProgress(board, editable);

  return (
    <Box className="game-progress-bar">
      <Chip
        label={`${progress}%`}
        style={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          bottom: 0,
          borderRadius: 0,
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <BorderLinearProgress variant="determinate" value={progress} />
        </Box>
      </Box>
    </Box>
  );
}

Progress.displayName = 'Progress';

export default Progress;
