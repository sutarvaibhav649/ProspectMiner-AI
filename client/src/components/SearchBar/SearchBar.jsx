import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
    return (
        <div className="searchbar-box">
        <span className="searchbar-icon">🔍</span>
        <input
            type="text"
            placeholder="Search by name"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
        </div>
    );
}