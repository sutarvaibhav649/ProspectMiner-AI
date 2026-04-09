import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { fetchBalance } from '../../api/creaditApi.js';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [credits, setCredits] = useState(null);

    useEffect(() => {
        fetchBalance()
        .then(res => setCredits(res.data.credits))
        .catch(() => {});
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <nav className="navbar">
        <Link to="/" className="navbar-logo">
            <span className="logo-prospect">Prospect</span>
            <span className="logo-miner">Miner AI</span>
        </Link>

        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/history" className="nav-link">History</Link>
            <Link to="/analytics" className="nav-link">Analytics</Link>
        </div>

        <div className="navbar-right">
            {credits !== null && (
            <div className="credit-badge">{credits} credits</div>
            )}
            <div className="avatar" onClick={handleLogout} title="Logout">
            {initials}
            </div>
        </div>
        </nav>
    );
}