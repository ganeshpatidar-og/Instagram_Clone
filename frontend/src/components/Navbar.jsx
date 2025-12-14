import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>Instagram</h1>
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
        <Link to={`/profile/${user.id}`}>Profile</Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
