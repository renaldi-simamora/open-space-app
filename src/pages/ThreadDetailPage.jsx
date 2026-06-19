import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchThreadDetail,
  optimisticUpVoteThread,
  optimisticDownVoteThread,
  optimisticNeutralVoteThread,
  upVoteDetailThread,
  downVoteDetailThread,
  neutralVoteDetailThread,
} from '../store/slices/threadDetailSlice';
import CommentItem from '../components/comment/CommentItem';
import CommentForm from '../components/comment/CommentForm';
import Avatar from '../components/ui/Avatar';
import VoteButton from '../components/ui/VoteButton';
import CategoryBadge from '../components/ui/CategoryBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDate } from '../utils/dateFormatter';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { thread, loading, error } = useSelector((state) => state.threadDetail);
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="container"><div className="alert alert--error">{error}</div></div>;
  if (!thread) return null;

  const isUpVoted = authUser && thread.upVotesBy.includes(authUser.id);
  const isDownVoted = authUser && thread.downVotesBy.includes(authUser.id);

  const handleUpVote = () => {
    if (!authUser) { navigate('/login'); return; }
    if (isUpVoted) {
      dispatch(optimisticNeutralVoteThread({ userId: authUser.id }));
      dispatch(neutralVoteDetailThread({ threadId }));
    } else {
      dispatch(optimisticUpVoteThread({ userId: authUser.id }));
      dispatch(upVoteDetailThread({ threadId }));
    }
  };

  const handleDownVote = () => {
    if (!authUser) { navigate('/login'); return; }
    if (isDownVoted) {
      dispatch(optimisticNeutralVoteThread({ userId: authUser.id }));
      dispatch(neutralVoteDetailThread({ threadId }));
    } else {
      dispatch(optimisticDownVoteThread({ userId: authUser.id }));
      dispatch(downVoteDetailThread({ threadId }));
    }
  };

  return (
    <main className="page">
      <div className="container container--narrow">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>← Kembali</button>

        <article className="thread-detail">
          <div className="thread-detail__header">
            {thread.category && <CategoryBadge category={thread.category} />}
            <h1 className="thread-detail__title">{thread.title}</h1>
            <div className="thread-detail__meta">
              <Avatar src={thread.owner?.avatar} name={thread.owner?.name} size="md" />
              <div>
                <span className="thread-detail__author">{thread.owner?.name}</span>
                <span className="thread-detail__time">{formatDate(thread.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* eslint-disable-next-line react/no-danger */}
          <div
            className="thread-detail__body"
            dangerouslySetInnerHTML={{ __html: thread.body }}
          />

          <div className="thread-detail__votes">
            <VoteButton type="up" count={thread.upVotesBy.length} active={isUpVoted} onVote={handleUpVote} />
            <VoteButton type="down" count={thread.downVotesBy.length} active={isDownVoted} onVote={handleDownVote} />
            <span className="thread-detail__comment-count">
              💬
              {' '}
              {thread.comments.length}
              {' '}
              komentar
            </span>
          </div>
        </article>

        <section className="comments-section">
          <h2 className="comments-section__title">
            Komentar (
            {thread.comments.length}
            )
          </h2>
          <CommentForm threadId={threadId} />
          <div className="comments-list">
            {thread.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} threadId={threadId} />
            ))}
          </div>
          {thread.comments.length === 0 && (
            <div className="empty-state">
              <p>Belum ada komentar. Jadilah yang pertama!</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ThreadDetailPage;
