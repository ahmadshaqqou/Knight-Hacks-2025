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
  const getConfidenceColor = (confidence: number | undefined) => {
    if (!confidence) return 'bg-neutral-light';
    
    if (confidence >= 0.8) {
      return 'bg-green-100 text-green-800';
    } else if (confidence >= 0.5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const formatConfidence = (confidence: number | undefined) => {
    if (confidence === undefined) return 'Unknown';
    return `${Math.round(confidence * 100)}%`;
  };

  const getSpecialistIcon = (specialist: string | undefined) => {
    if (!specialist) return null;
    
    switch (specialist) {
      case 'Legal Researcher':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-law-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'Client Communication Guru':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-law-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'Voice Bot Scheduler':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-law-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'Evidence Sorter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-law-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-law-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!result.taskDetected) {
    return (
      <div className="card border-l-4 border-yellow-400 shadow-card bg-white bg-opacity-90">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800">No Task Detected</h3>
            <p className="mt-1 text-sm text-neutral-dark">
              No actionable task was detected in the provided content. Please try again with different content or provide more context.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-t-4 border-law-blue shadow-card bg-white bg-opacity-90">
      <h3 className="text-xl font-semibold mb-4 text-law-navy flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-law-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Analysis Results
      </h3>
      
      <div className="space-y-6">
        <div className="bg-neutral-lightest p-4 rounded-lg border border-neutral-light">
          <h4 className="text-sm font-medium text-neutral mb-2">Task Detected</h4>
          <p className="text-lg font-medium text-law-navy">{result.taskDescription}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-lightest p-4 rounded-lg border border-neutral-light">
            <h4 className="text-sm font-medium text-neutral mb-2">Confidence</h4>
            <div className="flex items-center">
              <div className="w-full bg-neutral-light rounded-full h-2.5 mr-2">
                <div
                  className="bg-law-blue h-2.5 rounded-full"
                  style={{ width: formatConfidence(result.confidence) }}
                ></div>
              </div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getConfidenceColor(result.confidence)}`}>
                {formatConfidence(result.confidence)}
              </span>
            </div>
          </div>
          
          <div className="bg-neutral-lightest p-4 rounded-lg border border-neutral-light">
            <h4 className="text-sm font-medium text-neutral mb-2">Specialist</h4>
            <div className="flex items-center">
              {getSpecialistIcon(result.specialist)}
              <p className="font-medium text-law-navy">{result.specialist}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;