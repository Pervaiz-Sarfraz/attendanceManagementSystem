import React from 'react';

export default function Header({ activeTab }) {
  const titles = {
    overview: 'Dashboard Overview',
    teachers: 'Teacher Management',
    classes: 'Class Management',
    assign: 'Class Assignments',
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{titles[activeTab]}</h2>
      </div>
    </header>
  );
}
