"use client";

import React from 'react';
import SubmitForm from './_components/SupportForm';

const SupportPage = () => {
  const pageStyle = {
    maxWidth: '800px',
    margin: '30px auto',
    padding: '40px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center' as 'center',
  };

  const headingStyle = {
    fontSize: '2.8em',
    fontWeight: '700',
    color: '#333',
    marginBottom: '20px',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  };

  const paragraphStyle = {
    fontSize: '1.2em',
    color: '#555',
    marginBottom: '30px',
    lineHeight: '1.6',
    fontStyle: 'italic',
  };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>
        We&apos;re Here to Help!
      </h1>
      <p style={paragraphStyle}>
        Having trouble? No worries! Reach out and let us know what&apos;s going on. We&apos;re here to make your experience awesome!
      </p>
      <SubmitForm />
    </div>
  );
};

export default SupportPage;
