import { useState } from 'react';
import LeadCard from '../LeadCard/LeadCard.jsx';
import './LeadsTable.css';

export default function LeadsTable({ leads, isCompleted }) {
  const [expandedId, setExpandedId] = useState(null);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(leads.length / PAGE_SIZE);
  const paginated = leads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
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
                <LeadCard
                    key={lead._id || i}
                    lead={lead}
                    expanded={expandedId === lead._id}
                    onToggle={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
                    isCompleted={isCompleted}
                />
                ))}
                {Array.from({ length: Math.max(0, PAGE_SIZE - paginated.length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="empty-row"><td colSpan={6}>&nbsp;</td></tr>
                ))}
            </tbody>
            </table>
        </div>

        {totalPages > 1 && (
            <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button key={i+1} className={page === i+1 ? 'active-page' : ''} onClick={() => setPage(i+1)}>{i+1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</button>
            </div>
        )}
        </div>
    );
}