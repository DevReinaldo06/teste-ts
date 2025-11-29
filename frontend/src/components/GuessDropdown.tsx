import React, { useState } from 'react';

const GuessDropdown: React.FC<{
  label: string;
  options: (string | number)[];
  selectedValue: string | number | null;
  onSelect: (value: string | number) => void;
  isCorrect: boolean | null;
}> = ({ label, options, selectedValue, onSelect, isCorrect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Define a cor da borda baseado no resultado do palpite
  const borderColor = isCorrect === true
    ? 'border-green-500 ring-green-500' // Borda verde para acerto
    : isCorrect === false
      ? 'border-red-500 ring-red-500' // Borda vermelha para erro
      : 'border-gray-300 dark:border-gray-600'; // Borda normal

  const buttonStyle = `w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-200 
                       rounded-lg shadow-lg focus:outline-none focus:ring-4 relative z-10
                       ${borderColor} border-2 ${isCorrect === null ? 'bg-indigo-600 hover:bg-indigo-700' : isCorrect ? 'bg-green-600' : 'bg-gray-400'}`;

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyle}
      >
        {label}: {selectedValue === null ? 'Escolher' : selectedValue}
        <svg className={`w-4 h-4 ml-2 inline transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-600 transition"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuessDropdown;