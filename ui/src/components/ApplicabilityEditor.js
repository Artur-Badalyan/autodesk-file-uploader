import React, { useState, useEffect } from 'react';
import { makeId } from './utils';

// импорт компонентов, которые вы уже добавили в src/components/applicabilities/
import {
  PropertyApplicability,
  PartOfApplicability,
  MaterialApplicability,
  ClassificationApplicability,
  EntityApplicability
} from './applicabilities';

/**
 * Props:
 * - value: array of applicability items
 * - onChange: (newArray) => void
 * - filter, activeTab - optional UI controls
 *
 * Структура item должна содержать поле `type` с одним из значений:
 * 'Property', 'Part of', 'Material', 'Classification', 'Entity'
 */
export default function ApplicabilityEditor({ value = [], onChange = () => {}, filter = '', activeTab = 'All' }) {
  const TYPES = ['Property', 'Part of', 'Material', 'Classification', 'Entity'];
  const [inputModeDropdowns, setInputModeDropdowns] = useState({});

  const addItem = (type = 'Property') => {
    const newItem = {
      id: makeId(),
      type,
      // поля по-умолчанию; компоненты обновят через onChange
      propertyName: '',
      propertySet: '',
      dataType: 'IfcLabel',
      value: '',
      relation: '',
      entity: '',
      predefinedType: '',
      material: '',
      system: '',
      attributes: []
    };
    onChange([...value, newItem]);
  };

  const updateItem = (id, patch) => {
    const next = value.map((it) => (it.id === id ? { ...it, ...patch } : it));
    onChange(next);
  };

  const removeItem = (id) => {
    onChange(value.filter((it) => it.id !== id));
  };

  const handleInputModeToggle = (itemId, fieldName) => {
    const key = `${itemId}-${fieldName}`;
    setInputModeDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputModeClose = () => {
    setInputModeDropdowns({});
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.input-mode-wrapper')) {
        handleInputModeClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const renderItem = (item) => {
    const commonProps = {
      item,
      onChange: (patch) => updateItem(item.id, patch),
      onRemove: () => removeItem(item.id),
      inputModeDropdowns,
      onInputModeToggle: (fieldName) => handleInputModeToggle(item.id, fieldName),
      onInputModeClose: handleInputModeClose,
      // передавайте опции, если есть: nameOptions, entityOptions, materialOptions...
    };

    switch ((item.type || '').toLowerCase()) {
      case 'property':
        return <PropertyApplicability key={item.id} {...commonProps} nameOptions={[]} dataTypeOptions={['IfcLabel', 'IfcText', 'IfcInteger', 'IfcReal']} />;
      case 'part of':
      case 'partof':
      case 'part_of':
        return <PartOfApplicability key={item.id} {...commonProps} relationOptions={['IFCRELAGGREGATES', 'IFCRELDECOMPOSES']} entityOptions={[]} />;
      case 'material':
        return <MaterialApplicability key={item.id} {...commonProps} materialOptions={[]} />;
      case 'classification':
        return <ClassificationApplicability key={item.id} {...commonProps} />;
      case 'entity':
        return <EntityApplicability key={item.id} {...commonProps} entityOptions={[]} />;
      default:
        // fallback: рендер простой карточки с возможностью выбрать тип
        return (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6" key={item.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Unknown Applicability</h3>
                  <p className="text-sm text-gray-500">Change type to render proper editor</p>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={item.type || ''} 
                  onChange={(e) => updateItem(item.id, { type: e.target.value })}
                >
                  <option value="">Select type...</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
    }
  };

  const filtered = value.filter((it) => {
    if (activeTab === 'Applicability' && !TYPES.includes(it.type)) return false;
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (it.name || it.propertyName || '').toLowerCase().includes(q) || (it.type || '').toLowerCase().includes(q);
  });

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Controls */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button 
                key={t} 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={() => addItem(t)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add {t}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {filtered.length} items
            </span>
          </div>
        </div>
      </div>

      {/* Applicability Items List */}
      <div className="transition-all duration-200">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6 bg-white border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicability items yet</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              Add applicability items from the sidebar or use the buttons above to get started with your specification.
            </p>
          </div>
        )}
        
        <div className="grid gap-6">
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className="transition-all duration-200 hover:shadow-lg"
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}