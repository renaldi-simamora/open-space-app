import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/slices/leaderboardSlice';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const medals = ['🥇', '🥈', '🥉'];

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <main className="page">
      <div className="container container--narrow">
        <div className="page__hero">
          <h1 className="page__title">
            🏆
            {' '}
            Papan Peringkat
          </h1>
          <p className="page__subtitle">Pengguna paling aktif di Forum Diskusi</p>
        </div>

        {loading && <LoadingSpinner fullPage />}
        {error && <div className="alert alert--error">{error}</div>}

        {!loading && (
          <div className="leaderboard">
            {items.map((item, index) => (
              <div
                key={item.user.id}
                className={`leaderboard-item${index < 3 ? ' leaderboard-item--top' : ''}`}
              >
                <div className="leaderboard-item__rank">
                  {index < 3 ? (
                    <span className="leaderboard-item__medal">{medals[index]}</span>
                  ) : (
                    <span className="leaderboard-item__number">{index + 1}</span>
                  )}
                </div>
                <Avatar src={item.user.avatar} name={item.user.name} size="md" />
                <div className="leaderboard-item__info">
                  <span className="leaderboard-item__name">{item.user.name}</span>
                  <span className="leaderboard-item__email">{item.user.email}</span>
                </div>
                <div className="leaderboard-item__score">
                  <span className="leaderboard-item__score-value">{item.score}</span>
                  <span className="leaderboard-item__score-label">poin</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default LeaderboardPage;
