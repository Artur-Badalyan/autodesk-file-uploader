import React from 'react';
import DATA_TYPES from '../../data/dataTypes';

/**
 * Props:
 * - item: { id, type, propertyName, propertySet, dataType, value }
 * - onChange: (patch) => void
 * - onRemove: () => void
 * - inputModeDropdowns: object
 * - onInputModeToggle: (fieldName) => void
 * - onInputModeClose: () => void
 * - nameOptions?: array of strings (optional)
 */
export default function PropertyApplicability({
  item = {},
  onChange = () => {},
  onRemove = () => {},
  inputModeDropdowns = {},
  onInputModeToggle = () => {},
  onInputModeClose = () => {},
  nameOptions = []
}) {
  const update = (patch) => onChange(patch);

  const INPUT_MODES = [
    { value: 'single', label: 'Single', icon: 'T', description: 'Simple text input' },
    { value: 'options', label: 'Options', icon: '☰', description: 'Selection from predefined choices' },
    { value: 'startsWith', label: 'Starts With', icon: 'a_', description: 'Value must start with specified string' },
    { value: 'endsWith', label: 'Ends With', icon: '_a', description: 'Value must end with specified string' },
    { value: 'regex', label: 'Regex Pattern', icon: '.*', description: 'Value defined by regular expression' },
    { value: 'complex', label: 'Complex', icon: '⊞', description: 'Advanced structured input method' }
  ];

  const getCurrentInputMode = (fieldName) => {
    return item[`${fieldName}InputMode`] || 'single';
  };

  const getCurrentModeIcon = (fieldName) => {
    const currentMode = getCurrentInputMode(fieldName);
    const mode = INPUT_MODES.find(m => m.value === currentMode);
    return mode ? mode.icon : 'T';
  };

  const handleInputModeSelect = (fieldName, mode) => {
    update({ [`${fieldName}InputMode`]: mode });
    onInputModeClose();
  };

  const renderInputModeDropdown = (fieldName) => {
    const dropdownKey = `${item.id}-${fieldName}`;
    const isOpen = inputModeDropdowns[dropdownKey];
    const currentMode = getCurrentInputMode(fieldName);
    
    return (
      <div className="input-mode-wrapper">
        <button 
          className="tmpl-btn" 
          onClick={() => onInputModeToggle(fieldName)}
          title={`Current mode: ${INPUT_MODES.find(m => m.value === currentMode)?.label || 'Single'}`}
        >
          {getCurrentModeIcon(fieldName)}
        </button>
        {isOpen && (
          <div className="input-mode-dropdown">
            {INPUT_MODES.map(mode => (
              <div
                key={mode.value}
                className={`input-mode-option ${mode.value === currentMode ? 'active' : ''}`}
                onClick={() => handleInputModeSelect(fieldName, mode.value)}
                title={mode.description}
              >
                <span className="input-mode-icon">{mode.icon}</span>
                <span className="input-mode-label">{mode.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card applicability property-applicability">
      <div className="card-head">
        <div>
          <div className="card-type">Property Applicability</div>
          <div className="card-sub">Must contain a property of type IfcLabel where the name must ??.</div>
        </div>

        <div className="card-actions">
          <button className="icon" title="Actions">⋮</button>
        </div>
      </div>

      <div className="card-body">
        <div className="row">
          <label>Property Name</label>
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <select
              value={item.propertyName || ''}
              onChange={(e) => update({ propertyName: e.target.value })}
              style={{ flex: 1 }}
            >
              <option value="">Select...</option>
              {nameOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            {renderInputModeDropdown('propertyName')}
          </div>
        </div>

        <div className="row">
          <label>Property Set</label>
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <input
              value={item.propertySet || ''}
              onChange={(e) => update({ propertySet: e.target.value })}
              placeholder=""
              style={{ flex: 1 }}
            />
            {renderInputModeDropdown('propertySet')}
          </div>
        </div>

        <div className="row">
          <label>Data Type</label>
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <select
              value={item.dataType || ''}
              onChange={(e) => update({ dataType: e.target.value })}
              style={{ flex: 1 }}
            >
              <option value="">Select data type...</option>
              {DATA_TYPES.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
            </select>

            <input
              value={item.value || ''}
              onChange={(e) => update({ value: e.target.value })}
              placeholder="Value (optional)"
              style={{ width: 260 }}
            />
            {renderInputModeDropdown('value')}
          </div>
        </div>
      </div>
    </div>
  );
}