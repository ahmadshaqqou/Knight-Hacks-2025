import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="w-full">
      <textarea
        className="w-full h-40 p-4 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-law-navy focus:border-transparent resize-none bg-white transition-shadow duration-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter text here..."}
      ></textarea>
      <div className="mt-2 flex justify-between items-center text-xs text-neutral">
        <div>
          {value.length > 0 ? (
            <span>
              {value.length} character{value.length !== 1 ? 's' : ''}
              {' • '}
              {value.split(/\s+/).filter(Boolean).length} word{value.split(/\s+/).filter(Boolean).length !== 1 ? 's' : ''}
            </span>
          ) : (
            <span>No text entered</span>
          )}
        </div>
        {value.length > 0 && (
          <button
            className="text-neutral hover:text-red-500 transition-colors duration-200"
            onClick={() => onChange('')}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;