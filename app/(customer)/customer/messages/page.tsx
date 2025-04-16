"use client";

import React, { useEffect, useState } from "react";

interface Message {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  name: string;
  email: string;
}

export default function CustomerMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch("/api/support/messages");
        if (!response.ok) {
          throw new Error("Unable to retrieve your messages at this time.");
        }
        const data = await response.json();
        console.log("Fetched messages data:", data);
        setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(
          "Oops! Something went wrong while loading your messages. Please try refreshing the page."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <main className="p-8 max-w-4xl mx-auto text-center text-gray-600">
        <p className="text-lg animate-pulse text-teal-600">
          📬 Fetching your messages... one moment please!
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 max-w-4xl mx-auto text-center text-red-600">
        <p className="text-lg font-semibold">
          🚨 {error}
          <button
            className="ml-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-teal-600 tracking-wide">
        Your Support Messages
      </h1>

      {messages.length === 0 ? (
        <p className="text-center text-gray-500 italic text-lg">
          You haven’t sent any messages yet. Whenever you need help, we’re just a click away!
        </p>
      ) : (
        <ul className="space-y-8">
          {messages.map(({ id, title, message, createdAt }) => (
            <li
              key={id}
              className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <h2 className="text-2xl font-semibold mb-3 text-teal-700">{title}</h2>
              <p className="mb-4 text-gray-800 whitespace-pre-line leading-relaxed">{message}</p>
              <time
                className="block text-sm text-gray-400 text-right"
                dateTime={createdAt}
                aria-label={`Sent on ${new Date(createdAt).toLocaleString()}`}
              >
                📅 Sent on {new Date(createdAt).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
