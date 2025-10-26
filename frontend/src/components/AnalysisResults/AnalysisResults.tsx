import React from 'react';

interface AnalysisResultProps {
  result: {
    taskDetected: boolean;
    taskDescription?: string;
    confidence?: number;
    specialist?: string;
    id?: string;
  };
}

const AnalysisResults: React.FC<AnalysisResultProps> = ({ result }) => {
  const getSpecialistIcon = (specialist: string | undefined) => {
    switch (specialist) {
      case 'Records Wrangler':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'Client Communication Guru':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'Legal Researcher':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'Voice Bot Scheduler':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'Evidence Sorter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
    }
  };

  const getConfidenceColor = (confidence: number | undefined) => {
    if (!confidence) return 'bg-neutral';
    
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatConfidence = (confidence: number | undefined) => {
    if (!confidence) return '0%';
    return `${Math.round(confidence * 100)}%`;
  };

  if (!result.taskDetected) {
    return (
      <div className="card shadow-card hover:shadow-card-hover transition-shadow duration-300 border-t-4 border-neutral bg-white bg-opacity-90 p-6">
        <div className="flex items-center justify-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-neutral-dark">No Task Detected</h3>
            <p className="text-neutral">The AI couldn't identify an actionable task in the provided content.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-card hover:shadow-card-hover transition-shadow duration-300 border-t-4 border-law-navy bg-white bg-opacity-90">
      <h2 className="text-xl font-semibold mb-6 text-law-navy flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Analysis Results
      </h2>
      
      <div className="space-y-6">
        <div className="bg-neutral-lightest p-4 rounded-lg">
          <h3 className="text-sm uppercase tracking-wider text-neutral font-medium mb-2">Detected Task</h3>
          <p className="text-lg font-medium text-law-navy">{result.taskDescription}</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] bg-neutral-lightest p-4 rounded-lg">
            <h3 className="text-sm uppercase tracking-wider text-neutral font-medium mb-2">AI Confidence</h3>
            <div className="flex items-center">
              <div className="w-full bg-neutral-light rounded-full h-2.5 mr-2">
                <div 
                  className={`h-2.5 rounded-full ${getConfidenceColor(result.confidence)}`} 
                  style={{ width: formatConfidence(result.confidence) }}
                ></div>
              </div>
              <span className="text-sm font-medium text-law-navy">{formatConfidence(result.confidence)}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px] bg-neutral-lightest p-4 rounded-lg">
            <h3 className="text-sm uppercase tracking-wider text-neutral font-medium mb-2">Routed To</h3>
            <div className="flex items-center">
              {getSpecialistIcon(result.specialist)}
              <span className="ml-2 text-law-navy font-medium">{result.specialist}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;