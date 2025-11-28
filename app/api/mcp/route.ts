/**
 * MCP Server API Route
 * Handles requests from Claude Desktop and VS Code
 */

import { NextRequest, NextResponse } from 'next/server';

// Types for MCP protocol
interface MCPRequest {
  action: string;
  query?: string;
  context?: Record<string, any>;
}

interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Query the fallback JSON profile
 */
async function queryProfile(question: string): Promise<string> {
  try {
    // Load profile from JSON file
    const fs = require('fs');
    const path = require('path');
    const profilePath = path.join(process.cwd(), '..', 'digitaltwin.json');
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));

    // Extract key sections
    const sections = [];
    if (profile.personal) {
      sections.push(`Personal: ${JSON.stringify(profile.personal)}`);
    }
    if (profile.skills_and_experience) {
      sections.push(`Skills: ${JSON.stringify(profile.skills_and_experience)}`);
    }
    if (profile.education) {
      sections.push(`Education: ${JSON.stringify(profile.education)}`);
    }
    if (profile.projects_portfolio) {
      sections.push(`Projects: ${JSON.stringify(profile.projects_portfolio)}`);
    }
    if (profile.career_goals) {
      sections.push(`Career Goals: ${JSON.stringify(profile.career_goals)}`);
    }

    const context = sections.join('\n\n');

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are John Bryx Jovellanos\' AI digital twin. Answer questions as if you are John, speaking in first person about your background, skills, and experience. Be professional, confident, and provide specific examples.'
          },
          {
            role: 'user',
            content: `Based on the following information about yourself, answer the question.\n\nYour Information:\n${context}\n\nQuestion: ${question}\n\nProvide a helpful response:`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error querying profile:', error);
    throw error;
  }
}

/**
 * Handle MCP requests
 */
export async function POST(request: NextRequest) {
  try {
    const body: MCPRequest = await request.json();
    const { action, query, context } = body;

    // Validate request
    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Missing action parameter',
        timestamp: new Date().toISOString()
      } as MCPResponse, { status: 400 });
    }

    // Handle different actions
    switch (action) {
      case 'query':
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Missing query parameter',
            timestamp: new Date().toISOString()
          } as MCPResponse, { status: 400 });
        }

        const answer = await queryProfile(query);
        
        return NextResponse.json({
          success: true,
          data: {
            question: query,
            answer: answer,
            source: 'digital_twin_profile'
          },
          timestamp: new Date().toISOString()
        } as MCPResponse);

      case 'health':
        return NextResponse.json({
          success: true,
          data: {
            status: 'healthy',
            service: 'John Bryx Digital Twin MCP Server',
            version: '1.0.0'
          },
          timestamp: new Date().toISOString()
        } as MCPResponse);

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          timestamp: new Date().toISOString()
        } as MCPResponse, { status: 400 });
    }
  } catch (error) {
    console.error('MCP Server Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    } as MCPResponse, { status: 500 });
  }
}

/**
 * Handle GET requests (health check)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'John Bryx Digital Twin MCP Server',
      version: '1.0.0',
      endpoints: {
        query: 'POST /api/mcp with action=query&query=<your_question>',
        health: 'POST /api/mcp with action=health'
      }
    },
    timestamp: new Date().toISOString()
  } as MCPResponse);
}
