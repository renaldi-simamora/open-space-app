import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchThreads,
  fetchUsers,
  setCategoryFilter,
} from '../store/slices/threadsSlice';
import ThreadCard from '../components/thread/ThreadCard';
import CategoryBadge from '../components/ui/CategoryBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: threads, users, loading, error, categoryFilter,
  } = useSelector((state) => state.threads);

  useEffect(() => {
    dispatch(fetchThreads());
    dispatch(fetchUsers());
  }, [dispatch]);

  const getUserById = (ownerId) => users.find((u) => u.id === ownerId);

  const categories = [...new Set(threads.map((t) => t.category).filter(Boolean))];

  const filteredThreads = categoryFilter
    ? threads.filter((t) => t.category === categoryFilter)
    : threads;

  return (
    <main className="page">
      <div className="container">
        <div className="page__hero">
          <h1 className="page__title">Forum Diskusi</h1>
          <p className="page__subtitle">Bergabung, bertanya, berbagi pengetahuan bersama komunitas.</p>
          <button
            className="btn btn--primary btn--lg"
            type="button"
            onClick={() => navigate('/threads/new')}
          >
            + Buat Thread Baru
          </button>
        </div>

        {categories.length > 0 && (
          <div className="category-filter">
            <span className="category-filter__label">Filter kategori:</span>
            <div className="category-filter__tags">
              <CategoryBadge
                category="Semua"
                active={!categoryFilter}
                onClick={() => dispatch(setCategoryFilter(''))}
              />
              {categories.map((cat) => (
                <CategoryBadge
                  key={cat}
                  category={cat}
                  active={categoryFilter === cat}
                  onClick={() => dispatch(setCategoryFilter(categoryFilter === cat ? '' : cat))}
                />
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingSpinner fullPage />}
        {error && <div className="alert alert--error">{error}</div>}

        {!loading && filteredThreads.length === 0 && (
          <div className="empty-state">
            <p>Belum ada thread. Jadilah yang pertama!</p>
          </div>
        )}

        <div className="thread-list">
          {filteredThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              user={getUserById(thread.ownerId)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default HomePage;
