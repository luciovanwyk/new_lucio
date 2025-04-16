// components/InputField.tsx
import React from 'react';
import { InputFieldProps } from '../_actions/InputField';

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
  label,
  disabled = false, // Add default value
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
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled} // Use the prop
        style={{
          width: '100%',
          padding: '10px',
          border: `2px solid ${focused ? '#3b82f6' : '#e2e8f0'}`,
          borderRadius: '4px',
          fontSize: '16px',
          transition: 'border-color 0.2s',
          backgroundColor: disabled ? '#f1f5f9' : 'white',
        }}
      />
    </div>
  );
};

export default InputField;