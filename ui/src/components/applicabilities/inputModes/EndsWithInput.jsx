import React from 'react';

export default function EndsWithInput({ value, onChange, placeholder }) {
  const suffixValue = value?.suffix || '';
  
  const handleChange = (newSuffix) => {
    onChange({ suffix: newSuffix, type: 'endsWith' });
  };

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm">*</span>
        <input
          type="text"
          value={suffixValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || 'Enter suffix...'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Value must end with: <span className="font-medium">{suffixValue || 'suffix'}</span>
      </p>
    </div>
  );
}