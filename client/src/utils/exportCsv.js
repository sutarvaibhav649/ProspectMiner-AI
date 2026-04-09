export const exportToCsv = (leads, filename = 'leads.csv') => {
  if (!leads.length) return;

    const headers = ['Name', 'Phone', 'Website', 'Address', 'Rating', 'Category', 'Services', 'Score', 'Email Pattern', 'Owner'];
    const rows = leads.map(l => [
        l.name || '',
        l.phone || '',
        l.website || '',
        l.address || '',
        l.rating || '',
        l.category || '',
        l.services || '',
        l.score || '',
        l.emailPattern || '',
        l.ownerName || '',
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};