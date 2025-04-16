// components/Layout/SubHeader.tsx
"use client";

import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledSubHeader = styled.p`
  font-size: 1.25rem;
  color: #34495e;
  margin-bottom: 2rem;
  font-weight: 500;
  letter-spacing: 0.02em;
`;

interface SubHeaderProps {
  children: ReactNode;
}

const SubHeader: React.FC<SubHeaderProps> = ({ children }) => {
  return <StyledSubHeader>{children}</StyledSubHeader>;
};

export default SubHeader;
