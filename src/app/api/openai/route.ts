import { openai } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userText } = await req.json();
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a funny chatbot, please reply this: "' + userText + '"',
      },
    ],
    model: 'gpt-3.5-turbo',
  });
  return NextResponse.json(
    { message: completion.choices[0].message.content },
    { status: 200 }
  );
}
