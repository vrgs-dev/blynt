import { cerebrasService } from './cerebras';
import { groqService } from './groq';

import type { IAService } from './types';

const services: IAService[] = [groqService, cerebrasService];
let currentServiceIndex = 0;

export function getNextService(): IAService {
    const service = services[currentServiceIndex];
    currentServiceIndex = (currentServiceIndex + 1) % services.length;
    return service;
}
