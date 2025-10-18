import React from 'react';

/**
 * HomeHeader component for the home page header section
 * Props:
 * - onCreateNew: () => void - callback to create new specification
 */
export default function HomeHeader({ onCreateNew = () => {} }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-8 rounded-xl shadow-sm">
      <div className="mb-6 md:mb-0">
        <h1 className="text-3xl font-semibold text-blue-600 mb-2">
          IDS Specifications
        </h1>
        <p className="text-gray-600 text-base">
          Manage your Industry Data Standards (IDS) specifications
        </p>
      </div>
      
      <button
        onClick={onCreateNew}
        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        <span className="text-xl font-bold">+</span>
        New Specification
      </button>
    </div>
  );
}