import ScoreBadge from '../ScoreBadge/ScoreBadge.jsx';
import './LeadCard.css';

export default function LeadCard({ lead, expanded, onToggle, isCompleted }) {
  return (
    <>
        <tr className="lead-row">
            <td className="lead-name">{lead.name}</td>
            <td className="lead-rating"><span className="star">⭐</span> {lead.rating || 'N/A'}</td>
            <td>{lead.phone || 'N/A'}</td>
            <td className="lead-email">
            {isCompleted
                ? <span className={lead.emailPattern ? 'email-val' : 'na-val'}>{lead.emailPattern || 'N/A'}</span>
                : lead.emailPattern
                ? <span className="email-val">{lead.emailPattern}</span>
                : <span className="fetching">⌛ Fetching...</span>
            }
            </td>
            <td>
            {isCompleted
                ? <ScoreBadge score={lead.score} />
                : lead.score
                ? <ScoreBadge score={lead.score} />
                : <span className="calculating">⚡ Calculating...</span>
            }
            </td>
            <td>
            <button className="details-btn" onClick={onToggle}>Details</button>
            </td>
        </tr>

        {expanded && (
            <tr className="expanded-row">
            <td colSpan={6}>
                <div className="expanded-content">
                <div className="expanded-grid">
                    <div><div className="exp-label">Website</div>
                    <div className="exp-value">{lead.website ? <a href={lead.website} target="_blank" rel="noreferrer">{lead.website}</a> : 'N/A'}</div>
                    </div>
                    <div><div className="exp-label">Address</div><div className="exp-value">{lead.address || 'N/A'}</div></div>
                    <div><div className="exp-label">Category</div><div className="exp-value">{lead.category || 'N/A'}</div></div>
                    <div><div className="exp-label">Owner</div><div className="exp-value">{lead.ownerName || 'N/A'}</div></div>
                    <div><div className="exp-label">Services</div><div className="exp-value">{lead.services || 'N/A'}</div></div>
                    <div><div className="exp-label">Score Reason</div><div className="exp-value">{lead.scoreReason || 'N/A'}</div></div>
                </div>
                </div>
            </td>
            </tr>
        )}
        </>
    );
}