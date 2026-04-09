import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { getJobStatus, getLeads } from '../../api/scrapeApi.js';
import { exportToCsv } from '../../utils/exportCsv.js';
import { scoreColor, scoreBg } from '../../utils/scoreColor.js';
import { formatDate } from '../../utils/formatDate.js';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import LeadTable from '../../components/LeadsTable/LeadTable.jsx';
import ExportButton from '../../components/ExportButton/ExportButton.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import './ResultPage.css';

const PAGE_SIZE = 10;

export default function ResultsPage() {
    const { jobId } = useParams();
    const [status, setStatus] = useState('active');
    const [progress, setProgress] = useState(0);
    const [leads, setLeads] = useState([]);
    const [jobInfo, setJobInfo] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const pollRef = useRef(null);

  //Poll job status
    useEffect(() => {
        const poll = async () => {
            try {
            const res = await getJobStatus(jobId);
            setStatus(res.data.status);
            setProgress(res.data.progress || 0);
            setJobInfo(res.data);

            // Fetch leads on every poll, not just when completed 
            const leadsRes = await getLeads(jobId);
            setLeads(leadsRes.data.leads);

            if (res.data.status === 'completed' || res.data.status === 'failed') {
                clearInterval(pollRef.current);
            }
            } catch (err) {
            console.error(err);
            }
        };

        poll();
        pollRef.current = setInterval(poll, 3000);
        return () => clearInterval(pollRef.current);
        }, [jobId]);

    // Filter + Sort
    const filtered = leads
        .filter(l => l.name?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'score') {
            const order = { High: 3, Medium: 2, Low: 1 };
            return (order[b.score] || 0) - (order[a.score] || 0);
        }
        return 0;
        });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const isCompleted = status === 'completed';
    const progressLabel = Math.round(progress);

    return (
        <div className="results-wrapper">
        <Navbar />

        <div className="results-content">

            {/*  Search Summary Card  */}
           <div className="summary-card">
            <div className="summary-left">
                <h2>Search Summary</h2>
                <table className="summary-table">
                <tbody>
                    <tr>
                    <td>Query</td>
                    <td><strong style={{color:'#0f172a'}}>{jobInfo?.query || '...'}</strong></td>
                    </tr>
                    <tr>
                    <td>Leads Requested</td>
                    <td><strong style={{color:'#0f172a'}}>{jobInfo?.limit || '...'}</strong></td>
                    </tr>
                    <tr>
                    <td>Credits Used</td>
                    <td><strong style={{color:'#6366f1'}}>{jobInfo?.limit || '...'}</strong></td>
                    </tr>
                    <tr>
                    <td>Timestamp</td>
                    <td><strong style={{color:'#0f172a'}}>{jobInfo?.timestamp ? formatDate(jobInfo.timestamp) : '...'}</strong></td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div className="summary-right">
                <h2>Status</h2>
                <div className={`status-badge ${isCompleted ? 'completed' : 'active'}`}>
                <span className="status-dot" />
                {isCompleted ? 'Completed' : 'Processing...'}
                </div>
            </div>
            </div>

            {/* Progress Card  */}
            {!isCompleted && (
                <div className="progress-card">
                    <h2>Progress Status</h2>
                    <ProgressBar progress={progress} limit={jobInfo?.limit} />
                </div>
            )}

            {/* Controls */}
            <div className="controls-row">
            <div className="sort-btns">
                <button
                className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
                onClick={() => setSortBy(sortBy === 'rating' ? '' : 'rating')}
                >
                Ratings
                </button>
                <button
                className={`sort-btn ${sortBy === 'score' ? 'active' : ''}`}
                onClick={() => setSortBy(sortBy === 'score' ? '' : 'score')}
                >
                Scores
                </button>
            </div>
            <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
            <ExportButton leads={filtered} jobId={jobId} />
            </div>

            {/*Leads Table */}
            <div className="table-section">
            <h3 className="table-heading">Leads</h3>
            <div className="table-wrapper">
                <table className="leads-table">
                <thead>
                    <tr>
                    <th>Business Name</th>
                    <th>Ratings</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Score</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map((lead, i) => (
                    <>
                        <tr key={lead._id || i} className="lead-row">
                        <td className="lead-name">{lead.name}</td>
                        <td className="lead-rating">
                            <span className="star">⭐</span> {lead.rating || 'N/A'}
                        </td>
                        <td>{lead.phone || 'N/A'}</td>
                        <td className="lead-email">
                            {isCompleted
                                ? <span className={lead.emailPattern ? 'email-val' : 'na-val'}>
                                    {lead.emailPattern || 'N/A'}
                                </span>
                                : lead.emailPattern
                                ? <span className="email-val">{lead.emailPattern}</span>
                                : <span className="fetching">⌛ Fetching...</span>
                            }
                            </td>
                            <td>
                            {isCompleted
                                ? lead.score
                                ? <span className="score-pill" style={{ color: scoreColor(lead.score), background: scoreBg(lead.score) }}>
                                    {lead.score}
                                    </span>
                                : <span className="na-val">N/A</span>
                                : lead.score
                                ? <span className="score-pill" style={{ color: scoreColor(lead.score), background: scoreBg(lead.score) }}>
                                    {lead.score}
                                    </span>
                                : <span className="calculating">⚡ Calculating...</span>
                            }
                            </td>
                        <td>
                            <button
                            className="details-btn"
                            onClick={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
                            >
                            Details
                            </button>
                        </td>
                        </tr>

                        {/* Expanded detail row */}
                        {expandedId === lead._id && (
                        <tr key={`exp-${lead._id}`} className="expanded-row">
                            <td colSpan={6}>
                            <div className="expanded-content">
                                <div className="expanded-grid">
                                <div>
                                    <div className="exp-label">Website</div>
                                    <div className="exp-value">
                                    {lead.website
                                        ? <a href={lead.website} target="_blank" rel="noreferrer">{lead.website}</a>
                                        : 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="exp-label">Address</div>
                                    <div className="exp-value">{lead.address || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="exp-label">Category</div>
                                    <div className="exp-value">{lead.category || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="exp-label">Owner</div>
                                    <div className="exp-value">{lead.ownerName || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="exp-label">Services</div>
                                    <div className="exp-value">{lead.services || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="exp-label">Score Reason</div>
                                    <div className="exp-value">{lead.scoreReason || 'N/A'}</div>
                                </div>
                                </div>
                            </div>
                            </td>
                        </tr>
                        )}
                    </>
                    ))}

                    {/* Empty rows to fill table */}
                    {Array.from({ length: Math.max(0, PAGE_SIZE - paginated.length) }).map((_, i) => (
                    <tr key={`empty-${i}`} className="empty-row">
                        <td colSpan={6}>&nbsp;</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="pagination">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                    key={i + 1}
                    className={page === i + 1 ? 'active-page' : ''}
                    onClick={() => setPage(i + 1)}
                    >
                    {i + 1}
                    </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</button>
                </div>
            )}
            </div>
        </div>

        {/* Footer  */}
        <footer className="footer">
            <span className="footer-logo">ProspectMiner AI</span>
            <span>© 2026 Infotact Solutions. All rights reserved.</span>
        </footer>
        </div>
    );
}