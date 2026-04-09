import { scoreColor, scoreBg } from '../../utils/scoreColor.js';

export default function ScoreBadge({ score }) {
    if (!score) return <span style={{ color: '#94a3b8', fontSize: '13px' }}>N/A</span>;
    return (
        <span style={{
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '700',
        color: scoreColor(score),
        background: scoreBg(score)
        }}>
        {score}
        </span>
    );
}