import React from 'react';

const tabs = [
  { key: 'overview', label: 'Overview', iconPath: 'M4 6a2 2 0 012-2...' },
  { key: 'teachers', label: 'Teachers', iconPath: 'M12 4.354a4 4 0 110 5.292...' },
  { key: 'classes', label: 'Classes', iconPath: 'M8 14v3m4-3v3...' },
  { key: 'assign', label: 'Assign Classes', iconPath: 'M9 5H7a2 2 0 00-2 2...' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-blue-800 text-white shadow-lg">
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-xl font-bold">School Admin</h1>
        <p className="text-sm text-blue-200">Management Dashboard</p>
      </div>
      <nav className="p-4 space-y-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
              activeTab === tab.key
                ? 'bg-blue-700 text-white'
                : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-50'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.iconPath} />
            </svg>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
