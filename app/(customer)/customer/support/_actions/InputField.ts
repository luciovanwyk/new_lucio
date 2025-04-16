// _actions/InputField.ts

import React from 'react';

export interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  label: string;
  disabled?: boolean;
}
