import React from 'react';

interface AnalysisResultProps {
  result: {
    taskDetected: boolean;
    taskDescription?: string;
    id?: string;
  };
}

const AnalysisResults: React.FC<AnalysisResultProps> = ({ result }) => {

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
          <h3 className="text-sm uppercase tracking-wider text-neutral font-medium mb-2">Task Details</h3>
          <p className="text-lg font-medium text-law-navy">{result.taskDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;