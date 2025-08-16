
import React, { useState, useEffect } from 'react';

const analysisSteps = [
    "Ingesting & Normalizing Files...",
    "Building AST, CFG, and DFG...",
    "Compiling to Bytecode & Disassembling...",
    "Running Deterministic Static Passes...",
    "Executing Taint Analysis (Source → Sink)...",
    "Performing Bounded Symbolic Execution with Z3...",
    "Analyzing Graph Layer (SCC, Dominators, Max-Flow)...",
    "Running Ensemble Vulnerability Scanners...",
    "Augmenting Results with Gemini AI...",
    "Generating Patches and Explanations...",
    "Finalizing Report..."
];

export const AuditProgress: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 450); // Speed up progress for demo

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full max-w-2xl text-center">
            <div className="relative mb-4">
                <svg className="w-24 h-24 mx-auto animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Analysis in Progress</h2>
            <p className="text-muted-foreground mb-8">Our hybrid engine is meticulously scanning your code...</p>

            <div className="text-left bg-muted p-6 rounded-lg border border-border">
                <ul className="space-y-3">
                    {analysisSteps.map((step, index) => (
                        <li key={index} className={`flex items-center transition-all duration-300 ${index <= currentStep ? 'opacity-100' : 'opacity-40'}`}>
                            {index < currentStep ? (
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            ) : index === currentStep ? (
                                <LoadingIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 animate-spin" />
                            ) : (
                                <CircleIcon className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                            )}
                            <span className={index === currentStep ? 'text-foreground font-semibold' : 'text-muted-foreground'}>{step}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

// Icons
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const LoadingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
);
const CircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle></svg>
);
