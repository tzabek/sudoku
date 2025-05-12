export default function SudokuHint(props: { candidates: number[] | null }) {
  const { candidates } = props;

  if (!candidates) {
    return null;
  }

  const hasCandidates = !!candidates.length;
  const body = hasCandidates ? (
    <span>
      Possible candidates: <strong>{candidates.join(', ')}</strong>
    </span>
  ) : (
    <span>No possible candidates.</span>
  );

  return <div>{body}</div>;
}
