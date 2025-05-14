import { Chip, Grid, Paper, Typography } from '@mui/material';
import {
  CheckCircleOutline,
  HighlightOff,
  WarningAmber,
} from '@mui/icons-material';
import { useNumberTracker } from '../../lib/hooks';
import { NumberTrackerProps } from '../../lib/libs/game';

import './NumberTracker.scss';

const MAX_PER_NUMBER = 9;

export default function NumberTracker(props: NumberTrackerProps) {
  const { board } = props;

  const numberCounts = useNumberTracker(board);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        maxWidth: 260,
        width: '100%',
        margin: '0 auto',
        mt: 0,
      }}
    >
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ textAlign: 'center', fontSize: 12 }}
      >
        Number usage
      </Typography>
      <Grid container spacing={1} justifyContent="center">
        {Object.entries(numberCounts).map(([num, count]) => {
          const complete = count === 9;
          const over = count > 9;
          return (
            <Grid key={num}>
              <Chip
                size="small"
                label={`${num}: ${count}`}
                // eslint-disable-next-line no-nested-ternary
                color={complete ? 'success' : over ? 'error' : 'warning'}
                variant="outlined"
                icon={
                  // eslint-disable-next-line no-nested-ternary
                  complete ? (
                    <CheckCircleOutline />
                  ) : over ? (
                    <HighlightOff />
                  ) : (
                    <WarningAmber />
                  )
                }
                sx={{ minWidth: 60, justifyContent: 'center' }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
