
import React, { useState } from 'react';
import { Audit, Finding, Severity } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface AuditDetailPageProps {
  audit: Audit;
}

const severityOrder: Severity[] = [Severity.Critical, Severity.High, Severity.Medium, Severity.Low, Severity.Informational];

const CodeViewer: React.FC<{ code: string; startLine: number; endLine: number }> = ({ code, startLine, endLine }) => {
    const lines = code.trim().split('\n');
    return (
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code>
                {lines.map((line, index) => {
                    const lineNumber = index + 1; // Assuming code snippet starts at line 1 for display
                    const isHighlighted = lineNumber >= startLine && lineNumber <= endLine;
                    return (
                        <div key={index} className={`flex ${isHighlighted ? 'bg-red-900/30' : ''}`}>
                            <span className="w-10 text-right pr-4 text-muted-foreground select-none">{lineNumber}</span>
                            <span className="flex-1">{line}</span>
                        </div>
                    );
                })}
            </code>
        </pre>
    );
};

const DiffViewer: React.FC<{ diff: string }> = ({ diff }) => {
    const lines = diff.trim().split('\n');
    return (
         <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code>
                {lines.map((line, index) => {
                    const getLineClass = () => {
                        if (line.startsWith('+')) return 'bg-green-900/30 text-green-300';
                        if (line.startsWith('-')) return 'bg-red-900/30 text-red-300';
                        return '';
                    };
                    return (
                        <div key={index} className={getLineClass()}>
                           <span>{line}</span>
                        </div>
                    );
                })}
            </code>
        </pre>
    );
};

export const AuditDetailPage: React.FC<AuditDetailPageProps> = ({ audit }) => {
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(audit.findings[0] || null);

  const sortedFindings = [...audit.findings].sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Audit Report</h2>
        <p className="text-muted-foreground">{audit.repo_url || `Audit ${audit.id}`}</p>
      </header>

      <div className="grid grid-cols-5 gap-4">
        {severityOrder.map(sev => (
            <Card key={sev}>
                <CardHeader>
                    <CardTitle className="text-lg">{sev}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{audit.summary[sev] || 0}</p>
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader><CardTitle>Findings</CardTitle></CardHeader>
            <CardContent className="overflow-y-auto" style={{maxHeight: 'calc(100vh - 300px)'}}>
                <div className="flex flex-col space-y-2">
                    {sortedFindings.map(finding => (
                        <button 
                            key={finding.id} 
                            onClick={() => setSelectedFinding(finding)}
                            className={`p-3 rounded-md text-left transition-colors ${selectedFinding?.id === finding.id ? 'bg-accent' : 'hover:bg-muted'}`}
                        >
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-sm mb-1">{finding.type}</p>
                                <Badge severity={finding.severity} />
                            </div>
                            <p className="text-xs text-muted-foreground">{finding.file_path}</p>
                        </button>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2">
          {selectedFinding ? (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{selectedFinding.type}</CardTitle>
                            <CardDescription>{selectedFinding.file_path}:{selectedFinding.start_line}-{selectedFinding.end_line}</CardDescription>
                        </div>
                        <Badge severity={selectedFinding.severity} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="explanation">
                        <TabsList>
                            <TabsTrigger value="explanation">Explanation</TabsTrigger>
                            <TabsTrigger value="code">Vulnerable Code</TabsTrigger>
                            <TabsTrigger value="patch">AI Suggested Patch</TabsTrigger>
                            <TabsTrigger value="trace">Trace Graph</TabsTrigger>
                        </TabsList>
                        <TabsContent value="explanation">
                            <div className="prose prose-invert mt-4 max-w-none">
                                <h4 className="font-semibold">Description</h4>
                                <p className="text-muted-foreground">{selectedFinding.description}</p>
                                <h4 className="font-semibold mt-4">AI Analysis</h4>
                                <p className="text-muted-foreground">{selectedFinding.ai_explanation}</p>
                                <div className="mt-4 flex space-x-2 text-xs">
                                    <span className="bg-muted px-2 py-1 rounded">CVSS: {selectedFinding.cvss}</span>
                                    {selectedFinding.swc_id && <span className="bg-muted px-2 py-1 rounded">{selectedFinding.swc_id}</span>}
                                    <span className="bg-muted px-2 py-1 rounded">Confidence: {selectedFinding.confidence}</span>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="code">
                            <CodeViewer code={selectedFinding.vulnerable_code} startLine={2} endLine={5} />
                        </TabsContent>
                        <TabsContent value="patch">
                            <DiffViewer diff={selectedFinding.ai_patch_diff} />
                        </TabsContent>
                        <TabsContent value="trace">
                             <p className="text-sm text-muted-foreground mb-4">Visualizing data flow from source to sink.</p>
                             <ResponsiveContainer width="100%" height={250}>
                                <ComposedChart data={selectedFinding.trace_data}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                                    <YAxis stroke="#888" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                                    <Legend />
                                    <Bar dataKey="source" barSize={20} fill="#f97316" name="Source Complexity"/>
                                    <Line type="monotone" dataKey="sink" stroke="#ef4444" name="Sink Risk"/>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select a finding to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
