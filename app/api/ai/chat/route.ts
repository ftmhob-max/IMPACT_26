import { NextResponse } from 'next/server';
import { runFlow } from 'genkit';
import { chatFlow, summarizeMaterialFlow } from '@/lib/ai/flows';

export async function POST(req: Request) {
  try {
    const { flowName, input } = await req.json();

    let flow;
    switch (flowName) {
      case 'chatFlow':
        flow = chatFlow;
        break;
      case 'summarizeMaterialFlow':
        flow = summarizeMaterialFlow;
        break;
      default:
        return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    const result = await flow(input);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to run AI flow', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
