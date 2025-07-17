import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

// PUBLIC_INTERFACE
function NoteEditor({ note, onUpdate, onTagChange }) {
  /**
   * Main editor for a note.
   * @param {Object|null} note
   * @param {function} onUpdate({id, title, text, tags})
   * @param {function} onTagChange(tags: Array<string>)
   */
  const [editNote, setEditNote] = useState(note || { title: '', text: '', tags: [] });

  useEffect(() => {
    setEditNote(note || { title: '', text: '', tags: [] });
  }, [note]);

  if (!note) {
    return <div className="note-editor-empty">Select or create a note.</div>;
  }
  const handleSave = () => {
    onUpdate({
      ...editNote,
      id: note.id
    });
  };
  return (
    <div className="note-editor">
      <input
        className="note-editor-title"
        value={editNote.title}
        placeholder="Title"
        onChange={e => setEditNote({ ...editNote, title: e.target.value })}
      />
      <textarea
        className="note-editor-text"
        placeholder="Write your note here..."
        value={editNote.text}
        onChange={e => setEditNote({ ...editNote, text: e.target.value })}
        rows={12}
      />
      <div className="note-editor-tags">
        <input
          className="note-editor-tags-input"
          value={editNote.tags ? editNote.tags.join(', ') : ''}
          onChange={e =>
            setEditNote({
              ...editNote,
              tags: e.target.value.split(',').map(x => x.trim()).filter(Boolean),
            })
          }
          placeholder="Tags: separated by comma"
        />
      </div>
      <button className="btn-accent" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default NoteEditor;
