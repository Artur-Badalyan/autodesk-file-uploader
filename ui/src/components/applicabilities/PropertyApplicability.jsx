import React from 'react';
import DATA_TYPES from '../../data/dataTypes';
import {
  SingleInput,
  OptionsInput,
  StartsWithInput,
  EndsWithInput,
  RegexPatternInput,
  ComplexInput
} from './inputModes';

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
      <div className="relative input-mode-wrapper">
        <button 
          className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors duration-200" 
          onClick={() => onInputModeToggle(fieldName)}
          title={`Current mode: ${INPUT_MODES.find(m => m.value === currentMode)?.label || 'Single'}`}
        >
          {getCurrentModeIcon(fieldName)}
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
            {INPUT_MODES.map(mode => (
              <div
                key={mode.value}
                className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  mode.value === currentMode ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleInputModeSelect(fieldName, mode.value)}
                title={mode.description}
              >
                <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded text-sm font-medium">
                  {mode.icon}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{mode.label}</div>
                  <div className="text-sm text-gray-500">{mode.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInputField = (fieldName, placeholder, options = [], type = 'text') => {
    const currentMode = getCurrentInputMode(fieldName);
    const fieldValue = item[fieldName];
    
    const handleFieldChange = (newValue) => {
      update({ [fieldName]: newValue });
    };

    switch (currentMode) {
      case 'options':
        return <OptionsInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'startsWith':
        return <StartsWithInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'endsWith':
        return <EndsWithInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'regex':
        return <RegexPatternInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'complex':
        return <ComplexInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'single':
      default:
        return <SingleInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} options={options} type={type} />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Property Applicability</h3>
            <p className="text-sm text-gray-500">Must contain a property of type IfcLabel where the name must match criteria</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200" title="More actions">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            title="Remove applicability"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
          <div className="flex gap-2">
            {renderInputField('propertyName', 'Select property name...', nameOptions, 'select')}
            {renderInputModeDropdown('propertyName')}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Set</label>
          <div className="flex gap-2">
            {renderInputField('propertySet', 'Enter property set name')}
            {renderInputModeDropdown('propertySet')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
            {renderInputField('dataType', 'Select data type...', DATA_TYPES, 'select')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value (optional)</label>
            <div className="flex gap-2">
              {renderInputField('value', 'Enter value')}
              {renderInputModeDropdown('value')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}