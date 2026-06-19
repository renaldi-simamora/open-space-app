import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import VoteButton from '../ui/VoteButton';
import { formatDate } from '../../utils/dateFormatter';
import {
  optimisticUpVoteComment,
  optimisticDownVoteComment,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
} from '../../store/slices/threadDetailSlice';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);

  const isUpVoted = authUser && comment.upVotesBy.includes(authUser.id);
  const isDownVoted = authUser && comment.downVotesBy.includes(authUser.id);

  const handleUpVote = () => {
    if (!authUser) { navigate('/login'); return; }
    dispatch(optimisticUpVoteComment({ commentId: comment.id, userId: authUser.id }));
    if (isUpVoted) {
      dispatch(neutralVoteComment({ threadId, commentId: comment.id, userId: authUser.id }));
    } else {
      dispatch(upVoteComment({ threadId, commentId: comment.id, userId: authUser.id }));
    }
  };

  const handleDownVote = () => {
    if (!authUser) { navigate('/login'); return; }
    dispatch(optimisticDownVoteComment({ commentId: comment.id, userId: authUser.id }));
    if (isDownVoted) {
      dispatch(neutralVoteComment({ threadId, commentId: comment.id, userId: authUser.id }));
    } else {
      dispatch(downVoteComment({ threadId, commentId: comment.id, userId: authUser.id }));
    }
  };

  return (
    <div className="comment">
      <div className="comment__header">
        <Avatar src={comment.owner?.avatar} name={comment.owner?.name} size="sm" />
        <div className="comment__meta">
          <span className="comment__author">{comment.owner?.name || 'Unknown'}</span>
          <span className="comment__time">{formatDate(comment.createdAt)}</span>
        </div>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <div
        className="comment__content"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      <div className="comment__votes">
        <VoteButton type="up" count={comment.upVotesBy.length} active={isUpVoted} onVote={handleUpVote} />
        <VoteButton type="down" count={comment.downVotesBy.length} active={isDownVoted} onVote={handleDownVote} />
      </div>
    </div>
  );
}

export default CommentItem;
