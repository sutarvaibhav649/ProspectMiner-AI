import './ProgressBar.css';

export default function ProgressBar({ progress, limit }) {
  const current = Math.round((progress / 100) * (limit || 100));
    return (
        <div className="progressbar-wrapper">
        <div className="progressbar-label-main">
            Scraping {current} / {limit || '...'} leads
        </div>
        <div className="progressbar-label-sub">🔍 Enriching leads...</div>
        <div className="progressbar-track">
            <div className="progressbar-fill" style={{ width: `${progress}%` }} />
        </div>
        </div>
    );
}