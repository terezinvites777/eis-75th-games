// src/components/epiconnect/EpiModeTabs.tsx
// Exhibit-style mode tabs for EpiConnect

import type { ReactNode } from 'react';

interface Tab {
  key: string;
  label: string;
  icon: ReactNode;
  count?: number;
}

interface EpiModeTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function EpiModeTabs({ tabs, activeTab, onTabChange }: EpiModeTabsProps) {
  return (
    <div className="epi-tabs">
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`epi-tab ${isActive ? 'is-active' : ''}`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="epi-tab__count">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default EpiModeTabs;
