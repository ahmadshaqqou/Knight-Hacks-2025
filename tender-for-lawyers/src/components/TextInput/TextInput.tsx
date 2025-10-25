import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          className="textarea h-48 w-full border-2 border-neutral-light focus:border-law-blue rounded-lg p-4 focus:outline-none transition-colors duration-200 bg-white bg-opacity-90"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Enter text here...'}
          aria-label="Text input"
        />
        <div className="absolute top-2 right-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className="px-2 py-1 text-xs font-medium text-neutral-dark bg-white hover:bg-neutral-lightest border border-neutral-light rounded-l-lg focus:z-10 focus:ring-2 focus:ring-law-blue"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  textarea.style.fontSize = '0.875rem';
                }
              }}
            >
              A-
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs font-medium text-neutral-dark bg-white hover:bg-neutral-lightest border-t border-b border-neutral-light focus:z-10 focus:ring-2 focus:ring-law-blue"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  textarea.style.fontSize = '1rem';
                }
              }}
            >
              A
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs font-medium text-neutral-dark bg-white hover:bg-neutral-lightest border border-neutral-light rounded-r-lg focus:z-10 focus:ring-2 focus:ring-law-blue"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  textarea.style.fontSize = '1.125rem';
                }
              }}
            >
              A+
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-neutral">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {value.length} characters
        </span>
        {value.length > 0 && (
          <button
            className="text-neutral hover:text-red-500 transition-colors duration-200 flex items-center"
            onClick={() => onChange('')}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;