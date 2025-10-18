import React from 'react';

export default function Header({ title, tabs = [], activeTab, onTabChange, onSearch, onImport, onExportJSON, onExportNamespacedJSON, onExportXML }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="back-btn" title="Back">⤺</button>
        <div className="title-block">
          <h1 className="title">{title}</h1>
          <div className="tabs">
            {tabs.map((t) => (
              <button
                key={t}
                className={`tab ${t === activeTab ? 'active' : ''}`}
                onClick={() => onTabChange && onTabChange(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="search-wrap">
          <input className="search" placeholder="Search..." onChange={(e) => onSearch && onSearch(e.target.value)} />
        </div>

        <label className="file-input">
          <input type="file" accept=".json,.xml,application/json,application/xml,text/xml" onChange={(e) => onImport && onImport(e.target.files[0])} />
          ⬆
        </label>

        <button className="icon-btn" title="Export JSON" onClick={onExportJSON}>JSON</button>
        <button className="icon-btn" title="Export Namespaced JSON" onClick={onExportNamespacedJSON}>NS JSON</button>
        <button className="icon-btn" title="Export XML" onClick={onExportXML}>XML</button>

        <div className="avatar">A</div>
      </div>
    </header>
  );
}