import React, { useState } from 'react';

export default function RegexPatternInput({ value, onChange, placeholder }) {
  const patternValue = value?.pattern || '';
  const flagsValue = value?.flags || '';
  const [testString, setTestString] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const handlePatternChange = (newPattern) => {
    try {
      // Test if the regex is valid
      new RegExp(newPattern, flagsValue);
      setIsValid(true);
      onChange({ pattern: newPattern, flags: flagsValue, type: 'regex' });
    } catch (e) {
      setIsValid(false);
      onChange({ pattern: newPattern, flags: flagsValue, type: 'regex' });
    }
  };

  const handleFlagsChange = (newFlags) => {
    try {
      new RegExp(patternValue, newFlags);
      setIsValid(true);
      onChange({ pattern: patternValue, flags: newFlags, type: 'regex' });
    } catch (e) {
      setIsValid(false);
      onChange({ pattern: patternValue, flags: newFlags, type: 'regex' });
    }
  };

  const testRegex = () => {
    if (!patternValue || !testString) return null;
    try {
      const regex = new RegExp(patternValue, flagsValue);
      return regex.test(testString);
    } catch (e) {
      return false;
    }
  };

  const testResult = testRegex();

  return (
    <div className="flex-1 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <input
            type="text"
            value={patternValue}
            onChange={(e) => handlePatternChange(e.target.value)}
            placeholder={placeholder || 'Enter regex pattern...'}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
            }`}
          />
        </div>
        <input
          type="text"
          value={flagsValue}
          onChange={(e) => handleFlagsChange(e.target.value)}
          placeholder="flags (g,i,m)"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>
      
      {!isValid && (
        <p className="text-xs text-red-600">Invalid regular expression</p>
      )}
      
      <div className="bg-gray-50 p-3 rounded-lg">
        <label className="block text-xs font-medium text-gray-700 mb-1">Test String:</label>
        <input
          type="text"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter test string..."
          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {testString && patternValue && (
          <p className={`text-xs mt-2 ${testResult ? 'text-green-600' : 'text-red-600'}`}>
            {testResult ? '✓ Match' : '✗ No match'}
          </p>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        Pattern: <code className="bg-gray-100 px-1 rounded">{patternValue || 'pattern'}</code>
      </p>
    </div>
  );
}