import React from 'react';
import MainContainer from './_components/MainContainer';
import Header from './_components/Header';
import SubHeader from './_components/SubHeader';
import AdminSupportMessages from './_components/AdminSupportMessages';


export default function AdminPage() {
  return (
    <MainContainer>
      <Header>🚀 Admin Support Hub</Header>
      <SubHeader>
        Your command center for managing support messages — smooth, simple, and effective.
      </SubHeader>
      <AdminSupportMessages />
    </MainContainer>
  );
}
