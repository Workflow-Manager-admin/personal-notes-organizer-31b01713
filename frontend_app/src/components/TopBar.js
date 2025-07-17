import React from 'react';
import './TopBar.css';

// PUBLIC_INTERFACE
function TopBar({
  search,
  onSearchChange,
  onNewNote,
  theme,
  onToggleTheme
}) {
  /**
   * Top bar with search and new note button.
   * @param {string} search
   * @param {function} onSearchChange
   * @param {function} onNewNote
   * @param {'light'|'dark'} theme
   * @param {function} onToggleTheme
   */
  return (
    <header className="topbar">
      <input
        className="search-input"
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        aria-label="Search notes"
      />
      <button className="btn-accent" onClick={onNewNote}>
        + New Note
      </button>
      <button className="theme-toggle-bar" onClick={onToggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}

export default TopBar;
