
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Audit, Severity } from '../types';
import { DEMO_AUDITS } from '../demo';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DashboardPageProps {
  onViewAudit: (audit: Audit) => void;
  onNewAudit: () => void;
}

const severityOrder: Severity[] = [Severity.Critical, Severity.High, Severity.Medium, Severity.Low, Severity.Informational];
const severityColors: { [key in Severity]: string } = {
    [Severity.Critical]: '#ef4444',
    [Severity.High]: '#f97316',
    [Severity.Medium]: '#eab308',
    [Severity.Low]: '#3b82f6',
    [Severity.Informational]: '#6b7280',
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onViewAudit, onNewAudit }) => {
  const totalAudits = DEMO_AUDITS.length;
  const totalFindings = DEMO_AUDITS.reduce((acc, audit) => acc + audit.findings.length, 0);
  const criticalFindings = DEMO_AUDITS.reduce((acc, audit) => acc + (audit.summary.Critical || 0), 0);

  const chartData = severityOrder.map(sev => ({
      name: sev,
      count: DEMO_AUDITS.reduce((acc, audit) => acc + (audit.summary[sev] || 0), 0),
      fill: severityColors[sev]
  }));
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's a summary of your security posture.</p>
        </div>
        <Button onClick={onNewAudit}>Start New Audit</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Audits</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold">{totalAudits}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Findings</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold">{totalFindings}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Critical Findings</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-bold text-red-500">{criticalFindings}</div></CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>View your latest security scan results.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEMO_AUDITS.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <div>
                    <p className="font-semibold">{audit.repo_url || `Audit ${audit.id}`}</p>
                    <p className="text-sm text-muted-foreground">{new Date(audit.finished_at).toLocaleString()}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onViewAudit(audit)}>View Report</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Findings by Severity</CardTitle>
            <CardDescription>Distribution of all findings across severity levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                        cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} 
                        contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem'}} 
                    />
                    <Bar dataKey="count" background={{ fill: '#ffffff08' }} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
