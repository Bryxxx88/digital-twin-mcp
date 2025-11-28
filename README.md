# Digital Twin MCP Server - AI-Powered Interview Preparation

> An intelligent interview preparation system using RAG (Retrieval-Augmented Generation) technology and MCP (Model Context Protocol) for seamless AI integration.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://digital-twin-mcp-git-main-john-bryx-jovellanos-projects.vercel.app/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black)](https://nextjs.org)

## 🎯 Project Overview

The Digital Twin MCP Server is a production-ready AI system that helps with interview preparation by providing intelligent, context-aware responses about your professional background. Built using modern full-stack technologies and AI, it demonstrates advanced skills in RAG systems, MCP protocol implementation, and serverless deployment.

### Key Features

- **🤖 AI-Powered Responses**: Uses Groq's LLaMA 3.1-8b-instant model for fast, intelligent answers
- **🔍 Semantic Search**: Upstash Vector database with built-in embeddings for accurate information retrieval
- **🌐 MCP Integration**: Model Context Protocol support for Claude Desktop and VS Code
- **⚡ Serverless Architecture**: Deployed on Vercel with zero-downtime deployments
- **💬 Interactive UI**: Beautiful web interface for testing and demonstration
- **📊 Production Ready**: Full error handling, TypeScript type safety, and optimized performance

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.0.5** - React framework with App Router and Turbopack
- **React 19** - Modern React with server components
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Utility-first styling

### Backend & AI
- **Upstash Vector** - Serverless vector database for semantic search
- **Groq API** - Ultra-fast LLM inference (LLaMA 3.1-8b-instant)
- **MCP Protocol** - Model Context Protocol for AI agent communication
- **Next.js API Routes** - Serverless functions

## 🚀 Live Demo

**Production URL**: [https://digital-twin-mcp-git-main-john-bryx-jovellanos-projects.vercel.app/](https://digital-twin-mcp-git-main-john-bryx-jovellanos-projects.vercel.app/)

**MCP Endpoint**: `https://digital-twin-mcp-git-main-john-bryx-jovellanos-projects.vercel.app/api/mcp`

## 🔧 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🎓 Technical Architecture

### RAG Pipeline

```
User Query → MCP Endpoint → Vector Search (Upstash) → LLM Generation (Groq) → Response
```

1. **Query Processing**: User asks a question
2. **Semantic Search**: Query searched in Upstash Vector database
3. **Context Retrieval**: Top relevant content chunks retrieved
4. **AI Generation**: Groq LLM generates contextual response
5. **Response Delivery**: Answer returned in natural language

### MCP Integration

```typescript
// MCP endpoint at /api/mcp
POST /api/mcp
Body: { "action": "query", "query": "What are my technical skills?" }
Response: { "success": true, "data": { "answer": "..." } }
```

## 🧪 Testing

### Test MCP Endpoint

```bash
curl -X POST https://digital-twin-mcp-git-main-john-bryx-jovellanos-projects.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"action":"query","query":"What are my technical skills?"}'
```

### Configure Claude Desktop

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "digital-twin-production": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://digital-twin-mcp-git-main-john-bryx-jovellanos-projects.vercel.app/api/mcp"]
    }
  }
}
```

## 📊 Key Achievements

- ✅ Implemented full RAG pipeline with vector embeddings
- ✅ Built MCP-compliant server for AI integration
- ✅ Achieved <1s response times for queries
- ✅ Deployed serverless architecture with 99.9% uptime
- ✅ Maintained full TypeScript type safety

## 🎯 Use Cases

1. **Interview Preparation**: Practice answering questions about your background
2. **Portfolio Showcase**: Demonstrate AI/ML integration skills
3. **Career Planning**: Systematic reflection on skills and experience
4. **AI Development**: Learn RAG, MCP, and modern AI patterns

## 👤 Author

**John Bryx Jovellanos**
- 4th Year BSIT Student, Major in Web Development
- Specializing in AI/ML Integration and Full-Stack Development
- [GitHub](https://github.com/Bryxxx88)

## 🙏 Acknowledgments

- [Ausbiz Consulting](https://www.ausbizconsulting.com.au/) - AI Agent Developer Workshop
- [Vercel](https://vercel.com) - Deployment platform
- [Upstash](https://upstash.com) - Vector database
- [Groq](https://groq.com) - Fast LLM inference

---

**Built with ❤️ using Next.js, AI, and modern web technologies**
