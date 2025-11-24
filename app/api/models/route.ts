import { NextResponse } from 'next/server';

// List available AI models
export async function GET() {
  return NextResponse.json({
    models: [
      {
        id: 'mixtral-8x7b',
        name: 'Mixtral 8x7B',
        provider: 'Mistral AI',
        type: 'Mixture of Experts',
        capabilities: ['text-generation', 'code', 'reasoning'],
        parameters: '46.7B',
        status: 'available',
      },
      {
        id: 'llama-2-70b',
        name: 'Llama 2 70B',
        provider: 'Meta',
        type: 'Transformer',
        capabilities: ['text-generation', 'chat', 'reasoning'],
        parameters: '70B',
        status: 'available',
      },
      {
        id: 'mistral-7b',
        name: 'Mistral 7B',
        provider: 'Mistral AI',
        type: 'Transformer',
        capabilities: ['text-generation', 'code', 'fast-inference'],
        parameters: '7.3B',
        status: 'available',
      },
      {
        id: 'codellama',
        name: 'Code Llama',
        provider: 'Meta',
        type: 'Code-Specialized',
        capabilities: ['code-generation', 'code-completion', 'debugging'],
        parameters: '34B',
        status: 'available',
      },
      {
        id: 'falcon-180b',
        name: 'Falcon 180B',
        provider: 'TII',
        type: 'Transformer',
        capabilities: ['text-generation', 'reasoning', 'multilingual'],
        parameters: '180B',
        status: 'available',
      },
      {
        id: 'stablelm',
        name: 'StableLM',
        provider: 'Stability AI',
        type: 'Transformer',
        capabilities: ['text-generation', 'chat'],
        parameters: '7B',
        status: 'available',
      },
      {
        id: 'vicuna',
        name: 'Vicuna 13B',
        provider: 'LMSYS',
        type: 'Fine-tuned',
        capabilities: ['chat', 'instruction-following'],
        parameters: '13B',
        status: 'available',
      },
      {
        id: 'gpt4all',
        name: 'GPT4All',
        provider: 'Nomic AI',
        type: 'Edge-Optimized',
        capabilities: ['chat', 'local-inference'],
        parameters: '7B',
        status: 'available',
      },
    ],
    total: 8,
    categories: {
      'Code Generation': ['codellama', 'mixtral-8x7b'],
      'General Purpose': ['llama-2-70b', 'falcon-180b', 'mixtral-8x7b'],
      'Fast Inference': ['mistral-7b', 'stablelm', 'gpt4all'],
      'Chat Optimized': ['vicuna', 'llama-2-70b'],
    },
  });
}
