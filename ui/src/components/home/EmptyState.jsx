import React from 'react';

/**
 * EmptyState component for when no specifications are found
 * Props:
 * - type: 'no-specs' | 'no-results' - type of empty state
 * - onCreateNew: () => void - callback to create new specification (only for 'no-specs')
 */
export default function EmptyState({ type = 'no-specs', onCreateNew = () => {} }) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm">
        <div className="text-6xl mb-6 opacity-60">🔍</div>
        <h3 className="text-xl font-medium text-gray-800 mb-3">
          No specifications found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search query
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm">
      <div className="text-6xl mb-6 opacity-60">📋</div>
      <h3 className="text-xl font-medium text-gray-800 mb-3">
        No specifications yet
      </h3>
      <p className="text-gray-600 mb-6">
        Create your first IDS specification to get started
      </p>
      <button
        onClick={onCreateNew}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        Create New Specification
      </button>
    </div>
  );
}