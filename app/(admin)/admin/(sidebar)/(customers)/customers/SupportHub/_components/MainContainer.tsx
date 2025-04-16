// components/Layout/MainContainer.tsx
"use client";

import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.main`
  padding: 2.5rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

interface MainContainerProps {
  children: ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default MainContainer;
