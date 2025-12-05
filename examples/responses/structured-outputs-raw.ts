#!/usr/bin/env -S npm run tsn -T

import { OpenAI } from 'openai';

const client = new OpenAI();

async function main() {
  const rsp = await client.responses.parse({
    input: 'solve 8x + 31 = 2',
    model: 'gpt-4o-2024-08-06',
    text: {
      format: {
        type: 'json_schema',
        name: 'math_solution',
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            steps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  explanation: {
                    type: 'string',
                  },
                  output: {
                    type: 'string',
                  },
                },
                required: ['explanation', 'output'],
                additionalProperties: false,
              },
            },
            final_answer: {
              type: 'string',
            },
          },
          required: ['steps', 'final_answer'],
          additionalProperties: false,
        },
      },
    },
  });

  if (rsp.output_parsed) {
    console.log(rsp.output_parsed);
  }
  // console.log('answer: ', rsp.output_parsed?.final_answer);
}

main().catch(console.error);
