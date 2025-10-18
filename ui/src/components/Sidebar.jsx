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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="relative">
          <button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            onClick={() => setMenuOpen((s) => !s)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Applicability</span>
            <svg className={`w-4 h-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {menuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-200">
                New Applicability
              </div>
              <div className="py-2">
                {TYPES.map((t) => (
                  <button 
                    key={t} 
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => addItemOfType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Add Requirement</span>
        </button>
      </div>

      {/* Specification Details */}
      <div className="space-y-4">
        <div className="pb-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Specification</span>
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
              placeholder="Enter specification title"
              value={spec.title || ''} 
              onChange={(e) => onSpecChange({ title: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none" 
              rows={3}
              placeholder="Enter specification description"
              value={spec.description || ''} 
              onChange={(e) => onSpecChange({ description: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IFC Version</label>
            <div className="flex flex-wrap gap-2">
              {(spec.ifcVersion || []).map((v) => (
                <span 
                  key={v} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {v}
                </span>
              ))}
              {(!spec.ifcVersion || spec.ifcVersion.length === 0) && (
                <span className="text-sm text-gray-400 italic">No IFC version specified</span>
              )}
            </div>
          </div>

          <button className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span>Choose Fields</span>
          </button>
        </div>
      </div>
    </div>
  );
}