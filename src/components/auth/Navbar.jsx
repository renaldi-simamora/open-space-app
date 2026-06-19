import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../../store/slices/authSlice';
import Avatar from '../ui/Avatar';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Berhasil keluar.');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          <span className="navbar__logo">💬</span>
          <span className="navbar__name">Forum Diskusi</span>
        </NavLink>
        <div className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
          >
            Beranda
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
          >
            Papan Peringkat
          </NavLink>
        </div>
        <div className="navbar__actions">
          {user ? (
            <>
              <button
                className="btn btn--secondary btn--sm"
                type="button"
                onClick={() => navigate('/threads/new')}
              >
                + Buat Thread
              </button>
              <div className="navbar__user" data-testid="user-info">
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <span className="navbar__username">{user.name}</span>
                <button
                  className="btn btn--ghost btn--sm"
                  type="button"
                  data-testid="logout-button"
                  onClick={handleLogout}
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <div className="navbar__auth">
              <button
                className="btn btn--ghost btn--sm"
                type="button"
                onClick={() => navigate('/login')}
              >
                Masuk
              </button>
              <button
                className="btn btn--primary btn--sm"
                type="button"
                onClick={() => navigate('/register')}
              >
                Daftar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
