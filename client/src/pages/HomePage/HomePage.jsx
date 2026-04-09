import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { startScrape } from '../../api/scrapeApi.js';
import { fetchBalance } from '../../api/creaditApi.js';
import './HomePage.css';

const FEATURES = [
    { icon: '🔍', title: 'Stealth scraping', desc: 'Puppeteer with stealth plugin scrapes Google Maps without getting blocked.' },
    { icon: '🤖', title: 'AI enrichment', desc: 'LLM visits each website and extracts services, email patterns, and key insights.' },
    { icon: '⚡', title: 'Real-time progress', desc: 'Live progress bar shows exactly how many leads have been scraped and enriched.' },
    { icon: '🏆', title: 'Lead scoring', desc: 'Every lead is scored High, Medium, or Low based on quality and relevance.' },
    { icon: '🕐', title: 'Search history', desc: 'Reload leads from any past job instantly — no re-scraping needed.' },
    { icon: '📁', title: 'CSV export', desc: 'Export any filtered lead list to CSV with one click — ready for your CRM.' },
];

    const STEPS = [
    { n: 1, title: 'Enter query', desc: 'Type your niche and location' },
    { n: 2, title: 'AI Scrapes', desc: 'Google Maps scraped in background' },
    { n: 3, title: 'Enriched', desc: 'LLM visits and scores each lead' },
    { n: 4, title: 'Exports', desc: 'Download CSV ready for outreach' },
];

export default function HomePage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [limit, setLimit] = useState(10);
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBalance()
        .then(res => setCredits(res.data.credits))
        .catch(() => {});
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        if (credits !== null && limit > credits) {
        setError(`Not enough credits. You have ${credits} credits.`);
        return;
        }
        setError('');
        setLoading(true);
        try {
        const res = await startScrape(query.trim(), Number(limit));
        navigate(`/results/${res.data.jobId}`);
        } catch (err) {
        setError(err.response?.data?.message || 'Failed to start job');
        setLoading(false);
        }
    };

    return (
        <div className="home-wrapper">
        <Navbar />

        {/* ── Hero ── */}
        <section className="hero">
            <div className="hero-badge">AI-Powered Lead Generation</div>
            <h1 className="hero-title">
            Find <span className="hero-highlight">qualified leads</span><br />in seconds
            </h1>
            <p className="hero-sub">
            Type a niche and location. ProspectMiner scrapes, enriches, and<br />
            scores every lead with AI — ready for outreach.
            </p>

            {/* ── Search Card ── */}
            <div className="search-card">
            {error && <div className="search-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="search-field">
                <label>What leads are you looking for?</label>
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder='e.g. "Dentists in Sangli" or "Plumber in Kolhapur"'
                    required
                />
                </div>
                <div className="search-bottom">
                <div className="limit-field">
                    <label>Number of leads</label>
                    <input
                    type="number"
                    value={limit}
                    onChange={e => setLimit(e.target.value)}
                    min={1}
                    max={50}
                    />
                </div>
                <button type="submit" className="find-btn" disabled={loading}>
                    {loading ? 'Starting...' : 'Find Leads'}
                </button>
                </div>
            </form>
            <p className="credit-hint">
                Each lead costs <span className="accent">1 credit</span>. You have{' '}
                <span className="accent">{credits ?? '...'} credits</span> remaining.
            </p>
            </div>
        </section>

        {/* ── Stats ── */}
        <section className="stats-row">
            <div className="stat"><div className="stat-num">10K+</div><div className="stat-label">Leads generated</div></div>
            <div className="stat"><div className="stat-num">98%</div><div className="stat-label">Enrichment accuracy</div></div>
            <div className="stat"><div className="stat-num">3min</div><div className="stat-label">Avg. job time</div></div>
        </section>

        {/* ── Features ── */}
        <section className="features-section">
            <h2 className="section-title">Everything your sales team needs</h2>
            <p className="section-sub">From raw search to export-ready leads — fully automated</p>
            <div className="features-grid">
            {FEATURES.map(f => (
                <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                </div>
            ))}
            </div>
        </section>

        {/* ── How It Works ── */}
        <section className="how-section">
            <h2 className="section-title">How It Works</h2>
            <p className="section-sub">From query to qualified leads in 4 simple steps</p>
            <div className="steps-row">
            {STEPS.map((s, i) => (
                <div key={s.n} className="step-wrapper">
                <div className="step-circle">{s.n}</div>
                {i < STEPS.length - 1 && <div className="step-line" />}
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
                </div>
            ))}
            </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
            <h2>Ready to find your next customer?</h2>
            <p>Start with 150 free credits. No credit card required.</p>
            <button className="cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Get Started Free
            </button>
        </section>

        {/* ── Footer ── */}
        <footer className="footer">
            <span className="footer-logo">ProspectMiner AI</span>
            <span>© 2026 Infotact Solutions. All rights reserved.</span>
        </footer>
        </div>
    );
}