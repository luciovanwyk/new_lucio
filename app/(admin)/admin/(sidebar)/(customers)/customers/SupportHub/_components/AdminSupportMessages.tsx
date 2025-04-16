"use client";

import React, { useState, useEffect } from "react";

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  title: string;
  message: string;
  createdAt: string;
}

const AdminSupportMessages: React.FC = () => {
  const [messages, setMessages] = useState<SupportMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/support/messages");
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p>Loading support messages...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!messages || messages.length === 0) {
    return <p>No support messages found.</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
      <h2>Support Messages</h2>
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            backgroundColor: "#fafafa",
          }}
        >
          <p>
            <strong>Name:</strong> {msg.name}
          </p>
          <p>
            <strong>Email:</strong> {msg.email}
          </p>
          <p>
            <strong>Title:</strong> {msg.title}
          </p>
          <p>
            <strong>Message:</strong> {msg.message}
          </p>
          <p style={{ fontSize: 12, color: "#666" }}>
            <em>Received: {new Date(msg.createdAt).toLocaleString()}</em>
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminSupportMessages;
