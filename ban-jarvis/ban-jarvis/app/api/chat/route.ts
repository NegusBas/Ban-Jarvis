import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

const SIDECAR = 'http://localhost:3001';

// Helper to talk to Sidecar
async function callSidecar(endpoint: string, body: any) {
  try {
    const res = await fetch(`${SIDECAR}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e) {
    console.error("Sidecar connection failed:", e);
    return { error: "Sidecar offline" };
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are J.A.R.V.I.S. You control the user's Mac via a local Sidecar.
    - To find files: use 'findFile'.
    - To push code: use 'gitPush'.
    - To apply for jobs or browse: use 'browserAutomate'.
    - For Outlook/Drive: Mock the success for now, but confirm action.`,
    messages,
    tools: {
      findFile: tool({
        description: 'Find a file on the computer.',
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => callSidecar('/system/find', { query })
      }),
      gitPush: tool({
        description: 'Commit and push code changes.',
        parameters: z.object({ 
            message: z.string(), 
            projectPath: z.string().describe("Full path to local repo") 
        }),
        execute: async (args) => callSidecar('/git/ops', { ...args, command: 'push' })
      }),
      browserAutomate: tool({
        description: 'Fill web forms or navigate pages.',
        parameters: z.object({ 
            url: z.string(), 
            action: z.enum(['fill_form', 'view']),
            inputs: z.record(z.string()).optional()
        }),
        execute: async (args) => callSidecar('/browser/act', args)
      }),
    },
  });

  return result.toDataStreamResponse();
}