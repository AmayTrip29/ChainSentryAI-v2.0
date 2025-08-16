
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useDropzone } from 'react-dropzone';

interface NewAuditPageProps {
  onStartAudit: () => void;
}

export const NewAuditPage: React.FC<NewAuditPageProps> = ({ onStartAudit }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [chain, setChain] = useState<'Ethereum' | 'Solana'>('Ethereum');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file uploads here
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Initiate New Security Audit</h2>
        <p className="text-muted-foreground mt-2">Analyze your smart contracts using our hybrid analysis engine.</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="github" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="github">From GitHub</TabsTrigger>
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
            </TabsList>
            <TabsContent value="github" className="mt-6">
              <div className="space-y-4">
                <label htmlFor="github-url" className="block text-sm font-medium text-foreground">GitHub Repository URL</label>
                <input
                  id="github-url"
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your/repository"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </TabsContent>
            <TabsContent value="upload" className="mt-6">
              <div {...getRootProps()} className={`flex justify-center items-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'}`}>
                <input {...getInputProps()} />
                <div className="text-center text-muted-foreground">
                  {isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  }
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground">Target Chain</label>
            <div className="flex space-x-2 mt-2">
              <Button variant={chain === 'Ethereum' ? 'secondary' : 'outline'} onClick={() => setChain('Ethereum')}>Ethereum</Button>
              <Button variant={chain === 'Solana' ? 'secondary' : 'outline'} onClick={() => setChain('Solana')}>Solana</Button>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button size="lg" onClick={onStartAudit}>
                <ScanIcon className="mr-2 h-5 w-5" />
                Start Hybrid Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


const ScanIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M7 12a5 5 0 0 1 5-5"></path><path d="M12 17a5 5 0 0 0 5-5"></path></svg>
);
