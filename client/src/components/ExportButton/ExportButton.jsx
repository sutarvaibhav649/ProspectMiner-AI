import { exportToCsv } from '../../utils/exportCsv.js';

export default function ExportButton({ leads, jobId }) {
    return (
        <button
            onClick={() => exportToCsv(leads, `leads-${jobId}.csv`)}
            disabled={!leads?.length}
            style={{
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: leads?.length ? 'pointer' : 'not-allowed',
                opacity: leads?.length ? 1 : 0.5,
                whiteSpace: 'nowrap'
            }}
        >
            Export List
        </button>
    );
}