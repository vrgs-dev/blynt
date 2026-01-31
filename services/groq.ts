import { Groq } from 'groq-sdk';
import { ChatMessage, IAService, ParsedResponse, parseAIResponse } from './types';

const groq = new Groq();

export const groqService: IAService = {
    name: 'Groq',
    async chat(messages: ChatMessage[]): Promise<ParsedResponse> {
        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: 'moonshotai/kimi-k2-instruct',
            temperature: 0.6,
            max_completion_tokens: 4096,
            top_p: 1,
            stream: true,
            stop: null,
        });

        let response = '';
        for await (const chunk of chatCompletion) {
            response += chunk.choices[0]?.delta?.content || '';
        }
        return parseAIResponse(response);
    },
};
