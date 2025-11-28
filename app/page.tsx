'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'query',
          query: query
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setResponse(data.data.answer);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 John Bryx&apos;s Digital Twin
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI-Powered Interview Preparation System
          </p>
          <p className="text-sm text-gray-500">
            MCP Server for Claude Desktop & VS Code
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleQuery} className="space-y-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                Ask me anything about John Bryx&apos;s background:
              </label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., Tell me about your University Clearance Management System project"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '🔄 Thinking...' : '💬 Ask Question'}
            </button>
          </form>

          {/* Response */}
          {response && (
            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">
                🤖 John Bryx:
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {response}
              </p>
            </div>
          )}
        </div>

        {/* Example Questions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            💭 Try asking:
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'What are your technical skills?',
              'Tell me about your Laravel experience',
              'Describe your education background',
              'What are your career goals?',
              'Tell me about the University Clearance System',
              'What AI/ML experience do you have?'
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="text-left p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg text-sm text-gray-700 hover:text-indigo-700 transition-colors border border-gray-200 hover:border-indigo-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Built with Next.js 15, TypeScript, Groq API, and Tailwind CSS</p>
          <p className="mt-2">
            MCP Server • AI Agent Developer Workshop • Week 8 Project
          </p>
        </div>
      </div>
    </div>
  );
}
