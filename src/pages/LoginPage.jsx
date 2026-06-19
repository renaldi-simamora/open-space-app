import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser, fetchProfile, clearError } from '../store/slices/authSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile()).then(() => {
        toast.success('Berhasil masuk!');
        navigate('/');
      });
    }
  }, [token, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">💬</div>
        <h1 className="auth-card__title">Selamat Datang</h1>
        <p className="auth-card__subtitle">Masuk ke Forum Diskusi</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Masuk'}
          </button>
        </form>

        <p className="auth-card__footer">
          Belum punya akun?
          {' '}
          <Link to="/register" className="auth-link">Daftar sekarang</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
