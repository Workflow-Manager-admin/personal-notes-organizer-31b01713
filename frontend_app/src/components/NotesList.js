import React from 'react';
import './NotesList.css';

// PUBLIC_INTERFACE
function NotesList({ notes, selectedNoteId, onSelectNote, onDeleteNote }) {
  /**
   * Main notes list - shows titles and short text.
   * @param {Array<Object>} notes: [{id, title, updatedAt}]
   * @param {string|null} selectedNoteId
   * @param {function} onSelectNote
   * @param {function} onDeleteNote
   */
  return (
    <div className="notes-list">
      {notes.length === 0 && (
        <div className="notes-list-empty">No notes found.</div>
      )}
      {notes.map(note => (
        <div
          className={
            "notes-list-item" +
            (selectedNoteId === note.id ? " selected" : "")
          }
          key={note.id}
          onClick={() => onSelectNote(note.id)}
        >
          <div className="notes-list-title">{note.title || "Untitled"}</div>
          <div className="notes-list-meta">
            <span className="notes-list-date">
              {new Date(note.updatedAt).toLocaleDateString()}
            </span>
            <button
              className="notes-list-delete"
              onClick={e => {
                e.stopPropagation();
                if (
                  window.confirm('Delete this note? This cannot be undone.')
                ) {
                  onDeleteNote(note.id);
                }
              }}
            >
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotesList;
