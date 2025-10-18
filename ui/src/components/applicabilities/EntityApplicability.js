import React from 'react';

/**
 * Props:
 * - item: { id, type, entity, predefinedType }
 * - onChange: (patch) => void
 * - inputModeDropdowns: object
 * - onInputModeToggle: (fieldName) => void
 * - onInputModeClose: () => void
 * - entityOptions?: array of strings
 */
export default function EntityApplicability({
  item = {},
  onChange = () => {},
  inputModeDropdowns = {},
  onInputModeToggle = () => {},
  onInputModeClose = () => {},
  entityOptions = []
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
    <div className="card applicability entity-applicability">
      <div className="card-head">
        <div>
          <div className="card-type">Entity Applicability</div>
          <div className="card-sub">The entity must ??.</div>
        </div>

        <div className="card-actions">
          <button className="icon" title="Actions">⋮</button>
        </div>
      </div>

      <div className="card-body">
        <div className="row">
          <label>Entity</label>
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <select value={item.entity || ''} onChange={(e) => update({ entity: e.target.value })} style={{ flex: 1 }}>
              <option value="">Select...</option>
              {entityOptions.map((en) => <option key={en} value={en}>{en}</option>)}
            </select>
            {renderInputModeDropdown('entity')}
          </div>
        </div>

        <div className="row">
          <label>Predefined Type <span className="optional">optional</span></label>
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <input value={item.predefinedType || ''} onChange={(e) => update({ predefinedType: e.target.value })} style={{ flex: 1 }} />
            {renderInputModeDropdown('predefinedType')}
          </div>
        </div>
      </div>
    </div>
  );
}