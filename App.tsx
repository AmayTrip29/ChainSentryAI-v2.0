
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { NewAuditPage } from './pages/NewAuditPage';
import { AuditDetailPage } from './pages/AuditDetailPage';
import { Audit, Page } from './types';
import { DEMO_AUDITS } from './demo';
import { AuditProgress } from './components/audit/AuditProgress';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(false);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setSelectedAudit(null);
    setIsAuditing(false);
    setAuditComplete(false);
  }, []);

  const viewAudit = useCallback((audit: Audit) => {
    setSelectedAudit(audit);
    setCurrentPage('audit-detail');
  }, []);

  const startNewAudit = useCallback(() => {
    setIsAuditing(true);
    setAuditComplete(false);
    setCurrentPage('new-audit'); // Keep user on this page to show progress
    
    // Simulate audit duration
    setTimeout(() => {
        setIsAuditing(false);
        setAuditComplete(true);
        // In a real app, you'd get the new audit result from an API
        // Here we just pick the first demo audit as the "result"
        setSelectedAudit(DEMO_AUDITS[0]); 
        setCurrentPage('audit-detail');
    }, 5000); // 5 second audit simulation
  }, []);

  const renderPage = () => {
    if (isAuditing) {
      return <AuditProgress />;
    }
    
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onViewAudit={viewAudit} onNewAudit={() => navigate('new-audit')} />;
      case 'new-audit':
        return <NewAuditPage onStartAudit={startNewAudit} />;
      case 'audit-detail':
        if (selectedAudit) {
          return <AuditDetailPage audit={selectedAudit} />;
        }
        // Fallback to dashboard if no audit is selected
        navigate('dashboard');
        return null;
      default:
        return <DashboardPage onViewAudit={viewAudit} onNewAudit={() => navigate('new-audit')} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background font-sans antialiased">
      <Sidebar currentPage={currentPage} onNavigate={navigate} />
      <main className="flex-1 overflow-y-auto p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
