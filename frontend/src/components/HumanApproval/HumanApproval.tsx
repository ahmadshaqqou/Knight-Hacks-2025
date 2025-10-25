import React from 'react';

interface HumanApprovalProps {
  onApprove: () => void;
  onReject: () => void;
}

const HumanApproval: React.FC<HumanApprovalProps> = ({ onApprove, onReject }) => {
  return (
    <div className="card shadow-card hover:shadow-card-hover transition-shadow duration-300 border-t-4 border-law-navy bg-white bg-opacity-90">
      <h2 className="text-xl font-semibold mb-6 text-law-navy flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Human Approval
      </h2>
      
      <div className="bg-neutral-lightest p-4 rounded-lg mb-6">
        <p className="text-neutral-dark">
          Please review the AI's analysis and decide if you want to proceed with the suggested action.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onApprove}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approve
        </button>
        
        <button
          onClick={onReject}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reject
        </button>
      </div>
    </div>
  );
};

export default HumanApproval;