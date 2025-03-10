import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  hidden?: boolean;
}

export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  hidden = false,
}: InputFieldProps) {
  if (hidden) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
          focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          text-sm px-4 py-2 border ${className}`}
      />
    </div>
  );
}