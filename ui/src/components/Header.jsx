import React from 'react';

export default function Header({ 
  title, 
  tabs = [], 
  activeTab, 
  onTabChange, 
  onSearch, 
  onImport, 
  onExportJSON, 
  onExportNamespacedJSON, 
  onExportXML, 
  onBackToHome,
  showBackButton = false 
}) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button 
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700 hover:text-gray-900" 
                title="Back to Home"
                onClick={onBackToHome}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900 truncate">{title}</h1>
              <div className="flex space-x-1 mt-1">
                {tabs.map((t) => (
                  <button
                    key={t}
                    className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                      t === activeTab 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => onTabChange && onTabChange(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <input 
                className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors duration-200" 
                placeholder="Search specifications..." 
                onChange={(e) => onSearch && onSearch(e.target.value)} 
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Import */}
            <label className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700 hover:text-gray-900 cursor-pointer">
              <input type="file" className="hidden" accept=".json,.xml,application/json,application/xml,text/xml" onChange={(e) => onImport && onImport(e.target.files[0])} />
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </label>

            {/* Export buttons */}
            <div className="flex items-center space-x-2">
              <button 
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200" 
                title="Export JSON" 
                onClick={onExportJSON}
              >
                JSON
              </button>
              <button 
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200" 
                title="Export Namespaced JSON" 
                onClick={onExportNamespacedJSON}
              >
                NS JSON
              </button>
              <button 
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200" 
                title="Export XML" 
                onClick={onExportXML}
              >
                XML
              </button>
            </div>

            {/* Avatar */}
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-medium text-sm shadow-md">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}