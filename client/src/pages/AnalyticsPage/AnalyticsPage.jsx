import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { fetchAnalytics } from '../../api/analyticsApi.js';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import './AnalyticsPage.css';

const SCORE_COLORS = { High: '#22c55e', Medium: '#f59e0b', Low: '#ef4444' };

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics()
        .then(res => setData(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="analytics-wrapper">
        <Navbar />
        <div className="analytics-loading">Loading analytics...</div>
        </div>
    );

    if (!data) return null;

    const { summary, scoreDistribution, leadsOverTime, topQueries, avgRatingPerQuery } = data;

    const pieData = Object.entries(scoreDistribution).map(([name, value]) => ({ name, value }));

    return (
        <div className="analytics-wrapper">
        <Navbar />

        <div className="analytics-content">
            <div className="analytics-header">
            <h1>Analytics</h1>
            <p>Insights across all your scrape jobs</p>
            </div>

            {/* ── Summary Stats ── */}
            <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-card-num">{summary.totalJobs}</div>
                <div className="stat-card-label">Total Jobs</div>
            </div>
            <div className="stat-card">
                <div className="stat-card-num">{summary.totalLeads}</div>
                <div className="stat-card-label">Total Leads</div>
            </div>
            <div className="stat-card">
                <div className="stat-card-num">{summary.totalHighLeads}</div>
                <div className="stat-card-label">High Quality Leads</div>
            </div>
            <div className="stat-card">
                <div className="stat-card-num">{summary.overallHighPercentage}%</div>
                <div className="stat-card-label">High Lead Rate</div>
            </div>
            </div>

            {/* ── Charts Row 1 ── */}
            <div className="charts-row">
            {/* Score Distribution Pie */}
            <div className="chart-card">
                <h3>Score Distribution</h3>
                <p className="chart-sub">High / Medium / Low across all leads</p>
                {summary.totalLeads === 0 ? (
                <div className="no-data">No data yet</div>
                ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {pieData.map(entry => (
                        <Cell key={entry.name} fill={SCORE_COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                )}
                <div className="legend-row">
                {Object.entries(SCORE_COLORS).map(([label, color]) => (
                    <div key={label} className="legend-item">
                    <span className="legend-dot" style={{ background: color }} />
                    {label}: {scoreDistribution[label]}
                    </div>
                ))}
                </div>
            </div>

            {/* Leads Over Time Line */}
            <div className="chart-card">
                <h3>Leads Over Time</h3>
                <p className="chart-sub">Leads scraped per job</p>
                {leadsOverTime.length === 0 ? (
                <div className="no-data">No data yet</div>
                ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={leadsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalLeads" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
                )}
            </div>
            </div>

            {/* ── Charts Row 2 ── */}
            <div className="charts-row">
            {/* Top Queries Bar */}
            <div className="chart-card">
                <h3>Top Performing Queries</h3>
                <p className="chart-sub">By High lead percentage</p>
                {topQueries.length === 0 ? (
                <div className="no-data">No data yet</div>
                ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={topQueries} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                    <YAxis dataKey="query" type="category" tick={{ fontSize: 11 }} width={160} />
                    <Tooltip formatter={(val) => `${val}%`} />
                    <Bar dataKey="highPercentage" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                )}
            </div>

            {/* Avg Rating Bar */}
            <div className="chart-card">
                <h3>Average Rating per Query</h3>
                <p className="chart-sub">Google Maps rating average</p>
                {avgRatingPerQuery.length === 0 ? (
                <div className="no-data">No data yet</div>
                ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={avgRatingPerQuery} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="query" type="category" tick={{ fontSize: 11 }} width={160} />
                    <Tooltip />
                    <Bar dataKey="avgRating" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                )}
            </div>
            </div>

        </div>

        <footer className="footer">
            <span className="footer-logo">ProspectMiner AI</span>
            <span>© 2026 Infotact Solutions. All rights reserved.</span>
        </footer>
        </div>
    );
}