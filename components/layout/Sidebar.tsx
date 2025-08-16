import React from 'react';
import { Page } from '../../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  icon: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}> = ({ page, label, icon, currentPage, onNavigate }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => onNavigate(page)}
      className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-card p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-primary"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <h1 className="ml-3 text-2xl font-bold">ChainSentryAI</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem
          page="dashboard"
          label="Dashboard"
          icon={<HomeIcon />}
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
        <NavItem
          page="new-audit"
          label="New Audit"
          icon={<PlusCircleIcon />}
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
        <NavItem
          page="projects"
          label="Projects"
          icon={<FolderIcon />}
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
         <NavItem
          page="settings"
          label="Settings"
          icon={<SettingsIcon />}
          currentPage={currentPage}
          onNavigate={onNavigate}
        />
      </nav>
      <div className="mt-auto">
        <div className="p-4 rounded-lg bg-muted text-center text-muted-foreground">
            <h3 className="font-semibold text-foreground">Upgrade to Pro</h3>
            <p className="text-sm mt-1 mb-3">Get unlimited audits and advanced features.</p>
            <button className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity">Upgrade</button>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-4">
          Built by <a href="https://github.com/AmayTrip29" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Amay Tripathi</a>
        </div>
      </div>
    </aside>
  );
};

// SVG Icons
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);
const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);