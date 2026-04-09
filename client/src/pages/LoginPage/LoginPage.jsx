import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import API from '../../api/authApi.js';
import Navbar from '../../components/Navbar/Navbar.jsx';
import './LoginPage.css';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        const res = await API.post('/auth/login', form);
        login(res.data.user, res.data.token);
        navigate('/');
        } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
        } finally {
        setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className="auth-container">
        <div className="auth-card">
            <div className="auth-logo">⛏️</div>
            <h1 className="auth-title">ProspectMiner AI</h1>
            <p className="auth-subtitle">Sign in to your account</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label>Email</label>
                <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
            </button>
            </form>

            <p className="auth-link">
            Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
        </div>
        </>
    );
}