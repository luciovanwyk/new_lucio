// components/Layout/Header.tsx
"use client";

import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledHeader = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface HeaderProps {
  children: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return <StyledHeader>{children}</StyledHeader>;
};

export default Header;
