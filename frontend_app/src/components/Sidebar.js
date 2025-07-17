import React from 'react';
import './Sidebar.css';

// PUBLIC_INTERFACE
function Sidebar({ tags, selectedTag, onSelectTag, onAddTag }) {
  /** 
   * Sidebar with tag list for navigation.
   * @param {Array<string>} tags - List of tag/category strings.
   * @param {string} selectedTag - Currently selected tag.
   * @param {function} onSelectTag - Callback(tag: string).
   * @param {function} onAddTag - Callback to add new tag.
   */
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Tags</h2>
        <button
          className="btn-accent"
          onClick={() => {
            const newTag = prompt("Enter new tag name:");
            if (newTag && !tags.includes(newTag)) {
              onAddTag(newTag);
            }
          }}
          title="Add Tag"
        >
          +
        </button>
      </div>
      <ul className="tag-list">
        <li
          className={!selectedTag ? "active" : ""}
          onClick={() => onSelectTag(null)}
        >
          All Notes
        </li>
        {tags.map(tag => (
          <li
            key={tag}
            className={selectedTag === tag ? "active" : ""}
            onClick={() => onSelectTag(tag)}
          >
            #{tag}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
