import React, { useState } from 'react';
import FileUpload from '../FileUpload/FileUpload';
import { ocrAPI } from '../../services/api';

const PDFOcr: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (uploadedFiles: File[]) => {
    // Filter out non-PDF files
    const pdfFiles = uploadedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== uploadedFiles.length) {
      setError('Only PDF files are supported for OCR.');
    } else {
      setError(null);
    }
    
    setFiles(pdfFiles);
    setExtractedText(''); // Clear previous results
  };

  const handleExtractText = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file first.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Process the first PDF file
      const response = await ocrAPI.extractTextFromPDF(files[0]);
      setExtractedText(response.data.text);
    } catch (err) {
      console.error('Error extracting text:', err);
      setError('Failed to extract text from PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-law-navy">PDF OCR Tool</h2>
      <p className="mb-6 text-neutral-dark">
        Upload a PDF document and extract text using Optical Character Recognition (OCR).
      </p>
      
      <div className="mb-6">
        <FileUpload onUpload={handleUpload} files={files} />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <button
          onClick={handleExtractText}
          disabled={isLoading || files.length === 0}
          className={`px-4 py-2 rounded-md font-medium ${
            isLoading || files.length === 0
              ? 'bg-neutral-light text-neutral cursor-not-allowed'
              : 'bg-law-blue text-white hover:bg-law-blue-dark'
          } transition-colors duration-200`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Extract Text'
          )}
        </button>
      </div>
      
      {extractedText && (
        <div className="border border-neutral-light rounded-md p-4">
          <h3 className="text-lg font-medium mb-2 text-law-navy">Extracted Text</h3>
          <div className="bg-white p-4 rounded-md border border-neutral-light max-h-96 overflow-y-auto whitespace-pre-wrap">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFOcr;