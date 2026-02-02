import { generatePrompt } from '@/constants/prompt';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getNextService } from '@/services';
import { validateTransactionOutput } from '@/lib/validators';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getActiveSubscription } from '@/lib/subscriptions/getActiveSubscription';
import { canCreateTransactions } from '@/lib/billing/can';

const parseInputSchema = z.object({
    input: z.string().min(1).max(1000).trim(),
    currency: z.string().min(1).max(3).toUpperCase().default('USD'),
});

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check subscription limits BEFORE calling AI
        const subscription = await getActiveSubscription(session.user.id);

        if (!subscription) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 401 });
        }

        // Check if user can create at least 1 transaction (minimum check before AI call)
        const canCreate = await canCreateTransactions(subscription, session.user.id, 1);

        if (!canCreate) {
            return NextResponse.json(
                {
                    error: 'Monthly transaction limit reached. Upgrade to Pro for unlimited transactions.',
                    code: 'LIMIT_REACHED',
                    usage: {
                        limit: subscription.plan.features.maxTransactionsPerMonth,
                    },
                },
                { status: 403 },
            );
        }

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

        // TODO: insert transactions credit into database

        return NextResponse.json({ response: validated });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid LLM output, please try again' }, { status: 400 });
        }
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
