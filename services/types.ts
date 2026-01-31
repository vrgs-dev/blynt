export type TransactionType = 'income' | 'expense';

export type ParsedResponse = { transaction: Transaction } | { transactions: Transaction[] };

export interface Transaction {
    type: TransactionType;
    amount: number;
    currency: string;
    category: string;
    date: string;
    description: string;
}
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface IAService {
    name: string;
    chat(messages: ChatMessage[]): Promise<ParsedResponse>;
}

/**
 * Extracts and parses JSON from LLM response with error handling.
 * Handles cases where the model wraps JSON in markdown code blocks or adds extra text.
 */
export function parseAIResponse(response: string): ParsedResponse {
    let cleaned = response.trim();

    // Remove markdown code blocks if present
    const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
        cleaned = jsonBlockMatch[1].trim();
    }

    // Try to find JSON object in the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error(`No valid JSON object found in response`);
    }

    try {
        const parsed = JSON.parse(jsonMatch[0]);

        // Basic structure validation
        if (!parsed.transaction && !parsed.transactions) {
            throw new Error("Response must contain 'transaction' or 'transactions'");
        }

        return parsed as ParsedResponse;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON in LLM response');
        }
        throw error;
    }
}
