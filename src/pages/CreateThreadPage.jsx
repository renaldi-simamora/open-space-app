import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createThread } from '../store/slices/threadsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function CreateThreadPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    const result = await dispatch(createThread({ title, body, category }));
    setLoading(false);
    if (createThread.fulfilled.match(result)) {
      toast.success('Thread berhasil dipublikasikan!');
      navigate(`/threads/${result.payload.id}`);
    } else {
      toast.error(result.payload || 'Gagal membuat thread.');
    }
  };

  return (
    <main className="page">
      <div className="container container--narrow">
        <h1 className="page__title">Buat Thread Baru</h1>
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="thread-title">Judul Thread *</label>
            <input
              id="thread-title"
              className="form-input"
              type="text"
              placeholder="Masukkan judul yang menarik..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
            <span className="form-hint">
              {title.length}
              /100 karakter
            </span>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="thread-category">Kategori</label>
            <input
              id="thread-category"
              className="form-input"
              type="text"
              placeholder="contoh: teknologi, sains, umum..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="thread-body">Isi Thread *</label>
            <textarea
              id="thread-body"
              className="form-textarea form-textarea--lg"
              placeholder="Tulis konten thread Anda di sini..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
              Batal
            </button>
            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading || !title.trim() || !body.trim()}
            >
              {loading ? <LoadingSpinner /> : 'Publikasikan Thread'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateThreadPage;
