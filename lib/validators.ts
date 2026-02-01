import { z } from 'zod';
import { ParsedResponse } from '@/services/types';

export const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    // @ts-expect-error - Zod coerce is not typed
    amount: z.union([z.number(), z.string()]).pipe(z.coerce.number().positive().min(0.01)),
    currency: z.string().length(3).toUpperCase().default('USD'),
    category: z.string().min(1).max(50),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .default(new Date().toISOString().split('T')[0]),
    description: z.string().min(1).max(500),
});

const parsedResponseSchema = z.union([
    z.object({ transaction: transactionSchema }),
    z.object({ transactions: z.array(transactionSchema).min(1).max(10) }),
]);

export function validateTransactionOutput(response: ParsedResponse): ParsedResponse {
    try {
        return parsedResponseSchema.parse(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            // @ts-expect-error - ZodError has an errors property
            throw new Error(`Invalid LLM output: ${error.errors[0].message}`);
        }
        throw error;
    }
}
