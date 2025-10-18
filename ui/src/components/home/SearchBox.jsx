import React from 'react';

/**
 * SearchBox component for filtering specifications
 * Props:
 * - searchQuery: string - current search query
 * - onSearchChange: (query: string) => void - callback when search changes
 * - totalCount: number - total number of specifications
 * - filteredCount: number - number of filtered specifications
 */
export default function SearchBox({ 
  searchQuery = '', 
  onSearchChange = () => {}, 
  totalCount = 0, 
  filteredCount = 0 
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
      <div className="relative flex-1 max-w-md mb-4 md:mb-0">
        <input
          type="text"
          placeholder="Search specifications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
          🔍
        </span>
      </div>

      <div className="text-gray-500 text-sm">
        {filteredCount} of {totalCount} specifications
      </div>
    </div>
  );
}