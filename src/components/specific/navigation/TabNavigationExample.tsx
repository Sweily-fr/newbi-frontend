import React, { useState } from 'react';
import { TabNavigation, TabItem } from './TabNavigation';
import { Category, DocumentText, MessageText, Note } from 'iconsax-react';

const TabNavigationExample: React.FC = () => {
  // Sample tabs with icons from iconsax-react
  const tabs: TabItem[] = [
    {
      id: 'select',
      label: 'Select list',
      icon: <Category size={20} variant="Bold" color="currentColor" />
    },
    {
      id: 'emojis',
      label: 'Emojis',
      icon: <MessageText size={20} variant="Bold" color="currentColor" />,
      count: 12
    },
    {
      id: 'numerical',
      label: 'Numerical',
      icon: <DocumentText size={20} variant="Bold" color="currentColor" />
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <Note size={20} variant="Bold" color="currentColor" />,
      count: 5
    }
  ];

  // State to track the active tab
  const [activeTab, setActiveTab] = useState<string | null>('select');

  // Handler for tab changes
  const handleTabChange = (tabId: string | null) => {
    setActiveTab(tabId);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Tab Navigation Example</h2>
      
      {/* Modern variant (new design) */}
      <div className="mb-8">
        <h3 className="text-md font-medium mb-3 text-gray-700">Modern Design</h3>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="modern"
        />
      </div>
      
      {/* Default variant */}
      <div className="mb-8">
        <h3 className="text-md font-medium mb-3 text-gray-700">Default Design</h3>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="default"
        />
      </div>
      
      {/* Pills variant */}
      <div className="mb-8">
        <h3 className="text-md font-medium mb-3 text-gray-700">Pills Design</h3>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="pills"
        />
      </div>
      
      {/* Simple tabs variant */}
      <div>
        <h3 className="text-md font-medium mb-3 text-gray-700">Simple Tabs Design</h3>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="simple-tabs"
        />
      </div>
    </div>
  );
};

export default TabNavigationExample;
