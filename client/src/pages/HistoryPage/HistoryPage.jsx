import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { fetchHistory, deleteJob } from '../../api/historyApi.js';
import { formatDate } from '../../utils/formatDate.js';
import './HistoryPage.css';

export default function HistoryPage() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchHistory()
        .then(res => setJobs(res.data.jobs))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (jobId) => {
        if (!window.confirm('Delete this job and all its leads?')) return;
        setDeletingId(jobId);
        try {
        await deleteJob(jobId);
        setJobs(prev => prev.filter(j => j.jobId !== jobId));
        } catch (err) {
        alert('Failed to delete job');
        } finally {
        setDeletingId(null);
        }
    };

    return (
        <div className="history-wrapper">
        <Navbar />

        <div className="history-content">
            <div className="history-header">
            <h1>Search History</h1>
            <p>View and reload your past scrape jobs</p>
            </div>

            {loading ? (
            <div className="history-loading">Loading jobs...</div>
            ) : jobs.length === 0 ? (
            <div className="history-empty">
                <div className="empty-icon">📭</div>
                <h3>No jobs yet</h3>
                <p>Start a scrape from the home page to see your history here.</p>
                <button className="go-home-btn" onClick={() => navigate('/')}>
                Find Leads
                </button>
            </div>
            ) : (
            <div className="jobs-table-wrapper">
                <table className="jobs-table">
                <thead>
                    <tr>
                    <th>Query</th>
                    <th>Date</th>
                    <th>Leads</th>
                    <th>Credits Used</th>
                    <th>Status</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => (
                    <tr key={job.jobId} className="job-row">
                        <td className="job-query">
                        <span className="query-icon">🔍</span>
                        {job.query}
                        </td>
                        <td className="job-date">{formatDate(job.createdAt)}</td>
                        <td className="job-leads">
                        <span className="leads-badge">{job.totalLeads}</span>
                        </td>
                        <td className="job-credits">{job.limit} credits</td>
                        <td>
                        <span className={`job-status ${job.status}`}>
                            <span className="status-dot" />
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                        </td>
                        <td className="job-actions">
                        <button
                            className="view-btn"
                            onClick={() => navigate(`/results/${job.jobId}`)}
                        >
                            View Leads
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(job.jobId)}
                            disabled={deletingId === job.jobId}
                        >
                            {deletingId === job.jobId ? '...' : 'Delete'}
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>

        <footer className="footer">
            <span className="footer-logo">ProspectMiner AI</span>
            <span>© 2025 Infotact Solutions. All rights reserved.</span>
        </footer>
        </div>
    );
}