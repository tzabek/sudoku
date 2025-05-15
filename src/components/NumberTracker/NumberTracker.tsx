import { useMemo } from 'react';
import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { amber, green, red } from '@mui/material/colors';
import { NumberTrackerProps } from '../../lib/libs/game';

import './NumberTracker.scss';

const MAX_PER_NUMBER = 9;

function Title({ number, count }: { number: number; count: number }) {
  return (
    <Box>
      <strong>{number}</strong> filled {count} {count === 1 ? 'time' : 'times'}
    </Box>
  );
}

function NumberTracker(props: NumberTrackerProps) {
  const { board } = props;

  const numberStats = useMemo(() => {
    const counts = Array(10).fill(0); // Index 0 unused

    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        const value = board[row][col];

        if (value >= 1 && value <= 9) {
          counts[value] += 1;
        }
      }
    }

    return counts;
  }, [board]);

  return (
    <Box sx={{ width: '100%', maxWidth: 260, p: 1 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 1,
          maxWidth: 260,
          width: '100%',
          margin: '0 auto',
          mt: 0,
        }}
      >
        <Grid container spacing={1}>
          {Array.from({ length: 9 }, (_, i) => {
            const number = i + 1;
            const count = numberStats[number];
            const isOver = count > MAX_PER_NUMBER;
            const isComplete = count === MAX_PER_NUMBER;
            const progress = isOver ? 100 : (count / MAX_PER_NUMBER) * 100;

            return (
              <Grid size={{ xs: 4 }} key={number} component="div">
                <Tooltip
                  title={<Title count={count} number={number} />}
                  arrow
                  disableInteractive
                  slots={{ transition: Zoom }}
                >
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: '1px solid #333',
                      textAlign: 'center',
                      p: 1,
                      cursor: 'pointer',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ fontSize: '12px' }}
                    >
                      {number}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        mt: 1,
                        '& .MuiLinearProgress-bar': {
                          // eslint-disable-next-line no-nested-ternary
                          backgroundColor: isComplete
                            ? green[500]
                            : isOver
                            ? red[500]
                            : amber[500],
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}

NumberTracker.displayName = 'NumberTracker';

export default NumberTracker;
