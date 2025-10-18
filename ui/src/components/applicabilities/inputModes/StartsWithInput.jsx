import React from 'react';

export default function StartsWithInput({ value, onChange, placeholder }) {
  const prefixValue = value?.prefix || '';
  
  const handleChange = (newPrefix) => {
    onChange({ prefix: newPrefix, type: 'startsWith' });
  };

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={prefixValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder || 'Enter prefix...'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        <span className="text-gray-500 text-sm">*</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Value must start with: <span className="font-medium">{prefixValue || 'prefix'}</span>
      </p>
    </div>
  );
}