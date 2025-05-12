import { Box, LinearProgress, Typography } from '@mui/material';
import { useProgress } from '../../lib/hooks';
import { ProgressProps } from '../../lib/libs/sidebar';

export default function Progress(props: ProgressProps) {
  const { board, editable } = props;

  const progress = useProgress(board, editable);

  return (
    <Box className="game-progress-bar">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            color="success"
            value={progress}
          />
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
