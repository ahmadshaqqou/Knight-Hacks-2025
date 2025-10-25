import React, { useState } from 'react';

interface CreateCaseProps {
  onCaseCreated?: (caseData: CaseData) => void;
}

interface CaseData {
  id: string;
  name: string;
  caseNumber?: string;
  summary: string;
  createdAt: Date;
}

const CreateCase: React.FC<CreateCaseProps> = ({ onCaseCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseName, setCaseName] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseSummary, setCaseSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    summary?: string;
  }>({});

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCaseName('');
    setCaseNumber('');
    setCaseSummary('');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; summary?: string } = {};
    let isValid = true;

    if (!caseName.trim()) {
      newErrors.name = 'Case name is required';
      isValid = false;
    }

    if (!caseSummary.trim()) {
      newErrors.summary = 'Case summary is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to create case
    setTimeout(() => {
      const newCase: CaseData = {
        id: `case-${Date.now()}`,
        name: caseName,
        caseNumber: caseNumber || undefined,
        summary: caseSummary,
        createdAt: new Date(),
      };

      if (onCaseCreated) {
        onCaseCreated(newCase);
      }

      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-law-navy hover:bg-law-blue text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Case
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-neutral-light p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-law-navy">Create New Case</h2>
              <button
                onClick={closeModal}
                className="text-neutral-dark hover:text-neutral-darkest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="caseName" className="block text-sm font-medium text-neutral-dark mb-1">
                  Case Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="caseName"
                  type="text"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-law-navy ${
                    errors.name ? 'border-red-500' : 'border-neutral-light'
                  }`}
                  placeholder="Enter case name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="caseNumber" className="block text-sm font-medium text-neutral-dark mb-1">
                  Case Number <span className="text-neutral">(Optional)</span>
                </label>
                <input
                  id="caseNumber"
                  type="text"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-law-navy"
                  placeholder="Enter case number (optional)"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="caseSummary" className="block text-sm font-medium text-neutral-dark mb-1">
                  Case Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="caseSummary"
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-law-navy ${
                    errors.summary ? 'border-red-500' : 'border-neutral-light'
                  }`}
                  placeholder="Enter case summary"
                ></textarea>
                {errors.summary && <p className="mt-1 text-sm text-red-500">{errors.summary}</p>}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-neutral-light rounded-md text-neutral-dark hover:bg-neutral-lightest transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-law-navy hover:bg-law-blue text-white rounded-md transition-colors duration-200 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Case'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateCase;