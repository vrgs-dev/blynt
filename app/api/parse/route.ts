import { generatePrompt } from '@/constants/prompt';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getNextService } from '@/services';
import { validateTransactionOutput } from '@/lib/validators';

const parseInputSchema = z.object({
    input: z.string().min(1).max(1000).trim(),
    currency: z.string().min(1).max(3).toUpperCase().default('USD'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { input, currency } = parseInputSchema.parse(body);

        // Input sanitization - remove potential prompt injection patterns
        const sanitizedInput = input
            .replace(/system:/gi, '')
            .replace(/assistant:/gi, '')
            .replace(/```/g, '');

        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString();

        const prompt = generatePrompt({
            currency,
            currentDate,
            currentTime,
        });

        const service = getNextService();
        const response = await service.chat([
            {
                role: 'system',
                content: prompt,
            },
            {
                role: 'user',
                content: sanitizedInput,
            },
        ]);

        // Validate output structure
        const validated = validateTransactionOutput(response);

        return NextResponse.json({ response: validated });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
        }

        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
