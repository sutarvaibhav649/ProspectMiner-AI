import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/authApi.js';
import './RegisterPage.css';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
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
        await API.post('/auth/user', form);
        navigate('/login');
        } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            <div className="auth-logo">⛏️</div>
            <h1 className="auth-title">ProspectMiner AI</h1>
            <p className="auth-subtitle">Create your free account</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label>Full Name</label>
                <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                />
            </div>
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
                {loading ? 'Creating account...' : 'Create Account'}
            </button>
            </form>

            <p className="auth-subtitle" style={{ marginTop: '8px', fontSize: '12px' }}>
            🎁 You get <strong style={{ color: '#6366f1' }}>150 free credits</strong> on signup
            </p>

            <p className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </div>
        </div>
    );
}