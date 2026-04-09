export default function CreditBadge({ credits }) {
  return (
        <div style={{
        border: '1.5px solid #6366f1',
        color: '#6366f1',
        padding: '5px 14px',
        borderRadius: '999px',
        fontSize: '13px',
        fontWeight: '600'
        }}>
        {credits ?? '...'} credits
        </div>
    );
}