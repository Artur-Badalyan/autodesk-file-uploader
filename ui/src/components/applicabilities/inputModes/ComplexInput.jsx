import React, { useState } from 'react';

export default function ComplexInput({ value, onChange, placeholder }) {
  const [conditions, setConditions] = useState(value?.conditions || []);
  const [logicalOperator, setLogicalOperator] = useState(value?.operator || 'AND');

  const addCondition = () => {
    const newConditions = [...conditions, { field: '', operator: 'equals', value: '' }];
    setConditions(newConditions);
    updateValue(newConditions, logicalOperator);
  };

  const removeCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    updateValue(newConditions, logicalOperator);
  };

  const updateCondition = (index, updates) => {
    const newConditions = conditions.map((condition, i) => 
      i === index ? { ...condition, ...updates } : condition
    );
    setConditions(newConditions);
    updateValue(newConditions, logicalOperator);
  };

  const updateOperator = (newOperator) => {
    setLogicalOperator(newOperator);
    updateValue(conditions, newOperator);
  };

  const updateValue = (newConditions, newOperator) => {
    onChange({
      conditions: newConditions,
      operator: newOperator,
      type: 'complex'
    });
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">Complex Conditions</h4>
        
        {conditions.length > 1 && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-blue-800 mb-1">Logical Operator:</label>
            <select
              value={logicalOperator}
              onChange={(e) => updateOperator(e.target.value)}
              className="px-3 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="AND">AND (all conditions must match)</option>
              <option value="OR">OR (any condition can match)</option>
            </select>
          </div>
        )}

        {conditions.map((condition, index) => (
          <div key={index} className="bg-white border border-blue-200 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Condition {index + 1}</span>
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={condition.field}
                onChange={(e) => updateCondition(index, { field: e.target.value })}
                placeholder="Field name"
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <select
                value={condition.operator}
                onChange={(e) => updateCondition(index, { operator: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="equals">Equals</option>
                <option value="notEquals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="startsWith">Starts With</option>
                <option value="endsWith">Ends With</option>
                <option value="greaterThan">Greater Than</option>
                <option value="lessThan">Less Than</option>
              </select>
              
              <input
                type="text"
                value={condition.value}
                onChange={(e) => updateCondition(index, { value: e.target.value })}
                placeholder="Value"
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCondition}
          className="w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:text-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Condition
        </button>
      </div>
      
      {conditions.length > 0 && (
        <div className="text-xs text-gray-500">
          <strong>Preview:</strong> {conditions.map((c, i) => 
            `${c.field || 'field'} ${c.operator} "${c.value || 'value'}"`
          ).join(` ${logicalOperator} `)}
        </div>
      )}
    </div>
  );
}