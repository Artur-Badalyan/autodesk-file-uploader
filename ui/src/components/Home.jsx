import React, { useState } from 'react';
import { HomeHeader, SearchBox, EmptyState, SpecificationCard } from './home';

/**
 * Home component for managing specifications
 * Props:
 * - specifications: array of specification objects
 * - onCreateNew: () => void - callback to create new specification
 * - onOpenSpec: (specId) => void - callback to open existing specification
 * - onDeleteSpec: (specId) => void - callback to delete specification
 * - onDuplicateSpec: (specId) => void - callback to duplicate specification
 */
export default function Home({
  specifications = [],
  onCreateNew = () => {},
  onOpenSpec = () => {},
  onDeleteSpec = () => {},
  onDuplicateSpec = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpecs = specifications.filter(spec => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (spec.title || '').toLowerCase().includes(query) ||
      (spec.description || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <HomeHeader onCreateNew={onCreateNew} />

        {/* Search and filters */}
        <SearchBox
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={specifications.length}
          filteredCount={filteredSpecs.length}
        />

        {/* Specifications content */}
        <div className="min-h-96">
          {/* Empty state - no specifications */}
          {filteredSpecs.length === 0 && specifications.length === 0 && (
            <EmptyState type="no-specs" onCreateNew={onCreateNew} />
          )}

          {/* Empty state - no search results */}
          {filteredSpecs.length === 0 && specifications.length > 0 && (
            <EmptyState type="no-results" />
          )}

          {/* Specifications grid */}
          {filteredSpecs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecs.map((spec) => (
                <SpecificationCard
                  key={spec.id}
                  spec={spec}
                  onOpen={onOpenSpec}
                  onDuplicate={onDuplicateSpec}
                  onDelete={onDeleteSpec}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}