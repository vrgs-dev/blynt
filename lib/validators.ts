import { z } from 'zod';
import { ParsedResponse } from '@/services/types';

const TransactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive().finite(),
    currency: z.string().length(3).toUpperCase(),
    category: z.string().min(1).max(50),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    description: z.string().min(1).max(500),
});

const ParsedResponseSchema = z.union([
    z.object({ transaction: TransactionSchema }),
    z.object({ transactions: z.array(TransactionSchema).min(1).max(10) }),
]);

export function validateTransactionOutput(response: ParsedResponse): ParsedResponse {
    try {
        return ParsedResponseSchema.parse(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            // @ts-expect-error - ZodError has an errors property
            throw new Error(`Invalid LLM output: ${error.errors[0].message}`);
        }
        throw error;
    }
}
