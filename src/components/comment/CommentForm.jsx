import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createComment } from '../../store/slices/threadDetailSlice';
import LoadingSpinner from '../ui/LoadingSpinner';

function CommentForm({ threadId }) {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!content.trim()) return;
    setLoading(true);
    const result = await dispatch(createComment({ threadId, content }));
    setLoading(false);
    if (createComment.fulfilled.match(result)) {
      setContent('');
      toast.success('Komentar berhasil dikirim!');
    } else {
      toast.error('Gagal mengirim komentar.');
    }
  };

  if (!user) {
    return (
      <div className="comment-form comment-form--guest">
        <p>
          <button className="link-btn" type="button" onClick={() => navigate('/login')}>Masuk</button>
          {' '}
          untuk meninggalkan komentar.
        </p>
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3 className="comment-form__title">Tambah Komentar</h3>
      <textarea
        className="form-textarea"
        placeholder="Tulis komentar Anda..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      <button
        className="btn btn--primary"
        type="submit"
        disabled={loading || !content.trim()}
      >
        {loading ? <LoadingSpinner /> : 'Kirim Komentar'}
      </button>
    </form>
  );
}

export default CommentForm;
