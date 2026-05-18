import { z } from 'genkit';
import { ai } from './genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Simple chat flow
export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.object({
      message: z.string(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const response = await ai.generate({
      model: googleAI.model('gemini-flash-latest'),
      prompt: input.message,
    });
    return response.text;
  }
);

// Material summarization flow
export const summarizeMaterialFlow = ai.defineFlow(
  {
    name: 'summarizeMaterialFlow',
    inputSchema: z.object({
      title: z.string(),
      text: z.string(),
    }),
    outputSchema: z.object({
      summary: z.string(),
      keyPoints: z.array(z.string()),
    }),
  },
  async (input) => {
    const response = await ai.generate({
      model: googleAI.model('gemini-flash-latest'),
      prompt: `Summarize the following educational material titled "${input.title}". 
      Provide a concise summary and a list of key points.
      
      Material:
      ${input.text}`,
      output: {
        schema: z.object({
          summary: z.string(),
          keyPoints: z.array(z.string()),
        }),
      },
    });
    
    return response.output!;
  }
);
