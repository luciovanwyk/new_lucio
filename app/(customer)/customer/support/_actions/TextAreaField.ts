// _actions/TextAreaField.ts

import React from 'react';

export interface TextAreaFieldProps {
  id: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  label: string;
  rows?: number;
}
