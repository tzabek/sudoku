import { Avatar, Box, Chip, ChipProps, Divider, styled } from '@mui/material';
import { LightbulbCircleRounded } from '@mui/icons-material';
import { grey, yellow } from '@mui/material/colors';

export default function SudokuHint(props: { candidates: number[] | null }) {
  const { candidates } = props;

  if (!candidates) {
    return null;
  }

  const hasCandidates = !!candidates.length;
  const body = hasCandidates ? (
    <span>
      {candidates.length > 1 ? 'Possible candidates' : 'The only candidate is'}:{' '}
      <strong>
        {new Intl.ListFormat('en', {
          style: 'short',
          type: 'disjunction',
        }).format(candidates.map((c) => String(c)))}
      </strong>
    </span>
  ) : (
    <span>No possible candidates.</span>
  );

  const HintChip = styled(Chip)<ChipProps>(({ theme }) => ({
    color: theme.palette.getContrastText(grey[50]),
    backgroundColor: grey[50],
    fontSize: '11px',
  }));

  return (
    <>
      <Divider>
        <HintChip
          label="Hint"
          variant="filled"
          size="small"
          avatar={
            <Avatar sx={{ bgcolor: yellow.A700 }}>
              <LightbulbCircleRounded sx={{ color: grey[900] }} />
            </Avatar>
          }
        />
      </Divider>
      <Box sx={{ color: grey[50], fontSize: '11px', mt: 2, mb: 2 }}>{body}</Box>
    </>
  );
}
