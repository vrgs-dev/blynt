import { useMutation } from '@tanstack/react-query';
import { parseTransaction, type ParseTransactionRequest, type NormalizedTransaction } from '../parse';

interface UseParseTransactionOptions {
    onSuccess?: (data: NormalizedTransaction[]) => void;
    onError?: (error: Error) => void;
}

export function useParseTransaction(options?: UseParseTransactionOptions) {
    return useMutation({
        mutationFn: (data: ParseTransactionRequest) => parseTransaction(data),
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}
