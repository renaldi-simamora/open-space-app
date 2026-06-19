function VoteButton({
  type, count, active, onVote, disabled,
}) {
  const icon = type === 'up' ? '▲' : '▼';
  return (
    <button
      className={`vote-btn vote-btn--${type}${active ? ' vote-btn--active' : ''}`}
      onClick={onVote}
      disabled={disabled}
      type="button"
      title={type === 'up' ? 'Up vote' : 'Down vote'}
    >
      {icon}
      {' '}
      <span>{count}</span>
    </button>
  );
}

export default VoteButton;
