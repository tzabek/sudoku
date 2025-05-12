export default function getCandidates(candidates: number[] | null) {
  if (!candidates) {
    return null;
  }

  const hasCandidates = !!candidates.length;
  const body = hasCandidates ? (
    <span>
      {candidates.length > 1 ? 'Possible candidates' : 'Remaining candidate'}:{' '}
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

  return body;
}
