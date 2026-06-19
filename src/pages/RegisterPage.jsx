import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser, clearError } from '../store/slices/authSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Akun berhasil dibuat! Silakan masuk.');
      navigate('/login');
    } else {
      toast.error(result.payload || 'Gagal membuat akun.');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">💬</div>
        <h1 className="auth-card__title">Buat Akun</h1>
        <p className="auth-card__subtitle">Bergabung dengan Forum Diskusi</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Nama Lengkap</label>
            <input
              id="register-name"
              className="form-input"
              type="text"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              className="form-input"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              className="form-input"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Buat Akun'}
          </button>
        </form>

        <p className="auth-card__footer">
          Sudah punya akun?
          {' '}
          <Link to="/login" className="auth-link">Masuk</Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
