import React from 'react';

/**
 * SpecificationCard component for displaying individual specifications
 * Props:
 * - spec: object - specification data
 * - onOpen: (specId) => void - callback to open specification
 * - onDuplicate: (specId) => void - callback to duplicate specification
 * - onDelete: (specId) => void - callback to delete specification
 */
export default function SpecificationCard({ 
  spec = {}, 
  onOpen = () => {}, 
  onDuplicate = () => {}, 
  onDelete = () => {} 
}) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getApplicabilityCount = () => {
    return spec.applicability ? spec.applicability.length : 0;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this specification?')) {
      onDelete(spec.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100">
        <h3 
          className="text-xl font-semibold text-gray-800 flex-1 truncate mr-4"
          title={spec.title}
        >
          {spec.title || 'Untitled Specification'}
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={() => onDuplicate(spec.id)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Duplicate"
          >
            📋
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {spec.description && (
          <p 
            className="text-gray-600 text-sm line-clamp-2 mb-4"
            title={spec.description}
          >
            {spec.description}
          </p>
        )}

        {/* Metadata */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Applicabilities:</span>
            <span className="text-gray-800 font-medium">{getApplicabilityCount()}</span>
          </div>

          {spec.ifcVersion && spec.ifcVersion.length > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">IFC Version:</span>
              <span className="text-gray-800 font-medium">
                {Array.isArray(spec.ifcVersion) 
                  ? spec.ifcVersion.join(', ') 
                  : spec.ifcVersion}
              </span>
            </div>
          )}

          {/* Dates */}
          <div className="border-t border-gray-50 pt-3 space-y-1">
            {spec.createdAt && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-400 font-mono">{formatDate(spec.createdAt)}</span>
              </div>
            )}
            {spec.modifiedAt && spec.modifiedAt !== spec.createdAt && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Modified:</span>
                <span className="text-gray-400 font-mono">{formatDate(spec.modifiedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => onOpen(spec.id)}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Open Specification
        </button>
      </div>
    </div>
  );
}