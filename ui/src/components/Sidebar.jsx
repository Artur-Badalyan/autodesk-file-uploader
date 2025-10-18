import React, { useState } from 'react';
import { makeId } from './utils';

const TYPES = ['Property', 'Part of', 'Material', 'Classification', 'Attribute', 'Entity'];

export default function Sidebar({ spec = {}, onSpecChange, onAddApplicability }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const addItemOfType = (type) => {
    const item = {
      id: makeId(),
      type,
      name: '',
      description: '',
      attributes: []
    };
    onAddApplicability && onAddApplicability(item);
    setMenuOpen(false);
  };

  return (
    <div className="spec-card">
      <div className="spec-actions">
        <div className="dropdown">
          <button className="primary" onClick={() => setMenuOpen((s) => !s)}>Add Applicability ▾</button>
          {menuOpen && (
            <div className="dropdown-menu">
              <div className="menu-title">New Applicability</div>
              {TYPES.map((t) => (
                <button key={t} className="menu-item" onClick={() => addItemOfType(t)}>{t}</button>
              ))}
            </div>
          )}
        </div>
        <button className="secondary">Add Requirement</button>
      </div>

      <div className="spec-content">
        <h3>Specification</h3>
        <input className="spec-input" value={spec.title || ''} onChange={(e) => onSpecChange({ title: e.target.value })} />
        <label className="small">Description</label>
        <textarea className="spec-area" value={spec.description || ''} onChange={(e) => onSpecChange({ description: e.target.value })} />
        <label className="small">IFC Version</label>
        <div className="chip-row">
          {(spec.ifcVersion || []).map((v) => <span key={v} className="chip">{v}</span>)}
        </div>

        <button className="choose-fields">Choose fields</button>
      </div>
    </div>
  );
}