import React from 'react';
import PDFOcr from '../../components/PDFOcr/PDFOcr';

const OCRPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-law-navy">PDF OCR Tool</h1>
      <p className="mb-8 text-neutral-dark max-w-3xl">
        This tool allows you to extract text from PDF documents using Optical Character Recognition (OCR).
        Simply upload a PDF file and click "Extract Text" to process it.
      </p>
      
      <PDFOcr />
    </div>
  );
};

export default OCRPage;