#!/usr/bin/env -S npm run tsn -T

import OpenAI from 'openai';
import { betaZodFunctionTool } from 'openai/helpers/beta/zod';
import { z } from 'zod';

const client = new OpenAI();

async function main() {
  const runner = client.beta.chat.completions.toolRunner({
    messages: [
      {
        role: 'user',
        content: `What is the weather in SF?`,
      },
    ],
    tools: [
      betaZodFunctionTool({
        name: 'getWeather',
        description: 'Get the weather at a specific location',
        parameters: z.array(z.string().describe('The city and state, e.g. San Francisco, CA')),
        run: (locations) => {
          return `The weather is foggy with a temperature of 20°C in ${locations[0]}.`;
        },
      }),
    ],
    model: 'gpt-4o',
    max_tokens: 1024,
    // the maximum number of iterations to run the tool
    max_iterations: 10,
  });
  const message = await runner;

  console.log('Final response:', message.content);
  console.log('Final response:', runner.params);
}

main();
