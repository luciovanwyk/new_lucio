"use client";

import React, { useState, useEffect } from 'react';

interface SupportFormData {
  name: string;
  email: string;
  title: string;
  message: string;
}

interface SubmitFormProps {
  userName?: string;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ userName }) => {
  const [formData, setFormData] = useState<SupportFormData>({
    name: '',
    email: '',
    title: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (userName) {
      setFormData(prev => ({ ...prev, name: userName }));
    }
  }, [userName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setStatus(result.message);
      setFormData({ name: '', email: '', title: '', message: '' });
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '30px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box' as 'border-box',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '15px',
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const statusStyle = {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '16px',
    textAlign: 'center' as 'center',  // Correct textAlign
  };

  const successStyle = {
    ...statusStyle,
    color: '#155724',
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  };

  const errorStyle = {
    ...statusStyle,
    color: '#721c24',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle} noValidate>
      {userName && (
        <div style={{ marginBottom: '25px', fontSize: '1.3em', color: '#2e7d32', fontWeight: 'bold', textAlign: 'center' as 'center' }}>
          Welcome, {userName}! Were here to help!
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="name" style={labelStyle}>Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required placeholder="Your Name" />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="email" style={labelStyle}>Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required placeholder="Your Email" />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="title" style={labelStyle}>Subject:</label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} style={inputStyle} required placeholder="Briefly describe your issue" />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="message" style={labelStyle}>Message:</label>
        <textarea id="message" name="message" value={formData.message} onChange={handleChange} style={{ ...inputStyle, height: '150px', resize: 'vertical' }} required placeholder="Describe your issue in detail" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          ...buttonStyle,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          backgroundColor: isHovered ? '#1e40af' : '#2563eb',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSubmitting ? 'Sending...' : 'Submit'}
      </button>

      {status && (
        <p style={status.startsWith('Error') ? errorStyle : successStyle}>
          {status}
        </p>
      )}
    </form>
  );
};

export default SubmitForm;
