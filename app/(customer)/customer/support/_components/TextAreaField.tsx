// components/TextAreaField.tsx
import React from 'react';
import { TextAreaFieldProps } from '../_actions/TextAreaField';

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
  label,
  rows,
}) => {
  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={rows}
        style={{
          width: '100%',
          padding: '10px',
          border: `2px solid ${focused ? '#3b82f6' : '#e2e8f0'}`,
          borderRadius: '4px',
          fontSize: '16px',
          transition: 'border-color 0.2s',
          resize: 'vertical',
        }}
      />
    </div>
  );
};

export default TextAreaField;