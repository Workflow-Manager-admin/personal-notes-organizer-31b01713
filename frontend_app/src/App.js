import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import AIAssistant from './components/AIAssistant'; // AI Assistant import
/**
 * In-memory notes/data structure used in browser state.
 * Each note: { id, title, text, tags (array<string>), updatedAt }
 */

// PUBLIC_INTERFACE
function App() {
  // Theme state ("light" or "dark"), default to light
  const [theme, setTheme] = useState('light');

  // Notes state
  const [notes, setNotes] = useState(() => {
    // Try load from localStorage for demo usability
    const saved = window.localStorage.getItem('notes-data');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Tags state (deduced from notes)
  const tagsSet = useMemo(
    () =>
      Array.from(
        new Set(
          notes.reduce((acc, note) => acc.concat(note.tags || []), [])
        )
      ),
    [notes]
  );
  const [selectedTag, setSelectedTag] = useState(null);

  // Search/filter state
  const [search, setSearch] = useState('');

  // Effect: persist notes to localStorage
  useEffect(() => {
    window.localStorage.setItem('notes-data', JSON.stringify(notes));
  }, [notes]);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(theme => (theme === 'light' ? 'dark' : 'light'));

  // Create new note
  function handleNewNote() {
    const newNote = {
      id: `${Date.now()}`,
      title: '',
      text: '',
      tags: [],
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  }

  // Update or save note
  function handleUpdateNote(noteInput) {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteInput.id
          ? { ...note, ...noteInput, updatedAt: Date.now() }
          : note
      )
    );
  }

  // Delete note
  function handleDeleteNote(noteId) {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    if (noteId === selectedNoteId) setSelectedNoteId(null);
  }

  // Add tag to sidebar
  function handleAddTag(newTag) {
    if (!newTag) return;
    // Apply to selected note if desired, else just update sidebar
    // Optionally, let user select to tag all notes
    // For now, do nothing extra (tags are on notes)
  }

  // Filtering notes for sidebar/tag/search
  const filteredNotes = useMemo(() => {
    let filtered = notes;
    if (selectedTag) {
      filtered = filtered.filter(n => (n.tags || []).includes(selectedTag));
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        n =>
          (n.title && n.title.toLowerCase().includes(s)) ||
          (n.text && n.text.toLowerCase().includes(s)) ||
          (n.tags && n.tags.join(',').toLowerCase().includes(s))
      );
    }
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, selectedTag, search]);

  // Find selected note
  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  // Assign accent/primary/secondary colors as CSS vars (could also set from theme customization)
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', '#1976d2');
    document.documentElement.style.setProperty('--secondary', '#424242');
    document.documentElement.style.setProperty('--accent', '#ff9800');
  }, []);

  return (
    <>
      <div className="App" style={{display: "flex", flexDirection: "row", minHeight: "100vh"}}>
        <Sidebar
          tags={tagsSet}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          onAddTag={handleAddTag}
        />
        <div style={{flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh"}}>
          <TopBar
            search={search}
            onSearchChange={setSearch}
            onNewNote={handleNewNote}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              minHeight: 0,
              background: "var(--bg-primary)"
            }}
          >
            <NotesList
              notes={filteredNotes}
              selectedNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
              onDeleteNote={handleDeleteNote}
            />
            <div style={{flex: 2, minWidth: 0}}>
              <NoteEditor
                note={selectedNote}
                onUpdate={handleUpdateNote}
              />
            </div>
          </div>
        </div>
      </div>
      <AIAssistant />
    </>
  );
}

export default App;
