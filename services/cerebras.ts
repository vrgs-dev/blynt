/* eslint-disable @typescript-eslint/no-explicit-any */
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { ChatMessage, IAService, ParsedResponse, parseAIResponse } from './types';

const cerebras = new Cerebras();

export const cerebrasService: IAService = {
    name: 'Cerebras',
    async chat(messages: ChatMessage[]): Promise<ParsedResponse> {
        const stream = await cerebras.chat.completions.create({
            messages: messages as any,
            model: 'gpt-oss-120b',
            stream: true,
            max_completion_tokens: 32768,
            temperature: 1,
            top_p: 1,
            reasoning_effort: 'medium',
        });

        let response = '';
        for await (const chunk of stream) {
            response += (chunk as any).choices[0]?.delta?.content || '';
        }
        return parseAIResponse(response);
    },
};
