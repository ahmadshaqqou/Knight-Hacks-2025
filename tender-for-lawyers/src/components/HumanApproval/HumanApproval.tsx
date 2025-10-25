import React from 'react';

interface HumanApprovalProps {
  onApprove: () => void;
  onReject: () => void;
}

const HumanApproval: React.FC<HumanApprovalProps> = ({ onApprove, onReject }) => {
  return (
    <div className="card border-t-2 border-neutral-light shadow-card bg-white bg-opacity-90 mt-6">
      <h3 className="text-xl font-semibold mb-4 text-law-navy flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-law-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Human Approval
      </h3>
      
      <div className="mb-6 bg-law-cream bg-opacity-30 p-4 rounded-lg border border-law-gold border-opacity-30">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-law-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-neutral-dark">
            Please review the AI's analysis and decide if you want to approve or reject this task. Approving will route the task to the appropriate specialist.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
        <button
          className="btn bg-law-navy hover:bg-law-blue text-white flex items-center justify-center px-6 py-3 rounded-md transition-all duration-300 shadow-sm"
          onClick={onApprove}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approve Task
        </button>
        
        <button
          className="btn border border-neutral-dark text-neutral-dark hover:bg-neutral-dark hover:text-white flex items-center justify-center px-6 py-3 rounded-md transition-all duration-300"
          onClick={onReject}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reject Analysis
        </button>
      </div>
    </div>
  );
};

export default HumanApproval;