import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import CategoryBadge from '../ui/CategoryBadge';
import VoteButton from '../ui/VoteButton';
import { formatDate } from '../../utils/dateFormatter';
import {
  optimisticUpVote,
  optimisticDownVote,
  setCategoryFilter,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
} from '../../store/slices/threadsSlice';

function ThreadCard({ thread, user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);

  const isUpVoted = authUser && thread.upVotesBy.includes(authUser.id);
  const isDownVoted = authUser && thread.downVotesBy.includes(authUser.id);

  const handleUpVote = (e) => {
    e.stopPropagation();
    if (!authUser) { navigate('/login'); return; }
    dispatch(optimisticUpVote({ threadId: thread.id, userId: authUser.id }));
    if (isUpVoted) {
      dispatch(neutralVoteThread({ threadId: thread.id, userId: authUser.id }));
    } else {
      dispatch(upVoteThread({ threadId: thread.id, userId: authUser.id }));
    }
  };

  const handleDownVote = (e) => {
    e.stopPropagation();
    if (!authUser) { navigate('/login'); return; }
    dispatch(optimisticDownVote({ threadId: thread.id, userId: authUser.id }));
    if (isDownVoted) {
      dispatch(neutralVoteThread({ threadId: thread.id, userId: authUser.id }));
    } else {
      dispatch(downVoteThread({ threadId: thread.id, userId: authUser.id }));
    }
  };

  const handleCardClick = () => navigate(`/threads/${thread.id}`);
  const handleCategoryClick = (e) => {
    e.stopPropagation();
    dispatch(setCategoryFilter(thread.category));
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') navigate(`/threads/${thread.id}`);
  };

  const bodyPreview = thread.body.replace(/<[^>]*>/g, '').slice(0, 200);
  const bodyTruncated = thread.body.length > 200;

  return (
    <div
      className="thread-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="thread-card__header">
        <Avatar src={user?.avatar} name={user?.name || 'Unknown'} size="sm" />
        <div className="thread-card__meta">
          <span className="thread-card__author">{user?.name || 'Unknown'}</span>
          <span className="thread-card__time">{formatDate(thread.createdAt)}</span>
        </div>
        {thread.category && (
          <CategoryBadge
            category={thread.category}
            onClick={handleCategoryClick}
          />
        )}
      </div>
      <h2 className="thread-card__title">{thread.title}</h2>
      {bodyPreview && (
        <p className="thread-card__body">
          {bodyPreview}
          {bodyTruncated ? '...' : ''}
        </p>
      )}
      <div className="thread-card__footer">
        <div className="thread-card__votes">
          <VoteButton type="up" count={thread.upVotesBy.length} active={isUpVoted} onVote={handleUpVote} />
          <VoteButton type="down" count={thread.downVotesBy.length} active={isDownVoted} onVote={handleDownVote} />
        </div>
        <span className="thread-card__comments">
          💬
          {' '}
          {thread.totalComments}
          {' '}
          komentar
        </span>
      </div>
    </div>
  );
}

export default ThreadCard;
