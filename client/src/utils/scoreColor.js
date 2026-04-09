export const scoreColor = (score) => {
    if (score === 'High') return '#22c55e';
    if (score === 'Medium') return '#f59e0b';
    return '#ef4444';
};

export const scoreBg = (score) => {
    if (score === 'High') return '#dcfce7';
    if (score === 'Medium') return '#fef3c7';
    return '#fee2e2';
};