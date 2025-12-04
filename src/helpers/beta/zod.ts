import type { infer as zodInfer, ZodType } from 'zod/v4';
import * as z from 'zod/v4';
import type { BetaRunnableTool, Promisable } from '../../lib/beta/BetaRunnableTool';
import type { ChatCompletionContentPart } from '../../resources';

/**
 * Creates a tool using the provided Zod schema that can be passed
 * into the `.toolRunner()` method. The Zod schema will automatically be
 * converted into JSON Schema when passed to the API. The provided function's
 * input arguments will also be validated against the provided schema.
 *
 * For object schemas, the input arguments are parsed directly and passed to the
 * function. For non-object schemas (primitives, arrays, etc.), the schema is
 * wrapped in an object type before parsing to comply with the function calling
 * format.
 */
export function betaZodFunctionTool<InputSchema extends ZodType>(options: {
  name: string;
  parameters: InputSchema;
  description: string;
  run: (args: zodInfer<InputSchema>) => Promisable<string | ChatCompletionContentPart[]>;
}): BetaRunnableTool<zodInfer<InputSchema>> {
  const jsonSchema = z.toJSONSchema(options.parameters, { reused: 'ref' });

  return {
    type: 'function',
    function: {
      name: options.name,
      description: options.description,
      parameters:
        jsonSchema.type === 'object' ?
          jsonSchema
        : {
            type: 'object',
            properties: {
              [jsonSchema.type as string]: jsonSchema,
            },
          },
    },
    run: options.run,
    parse: (args: unknown) => {
      if (jsonSchema.type === 'object') {
        const parsed = options.parameters.parse(args);
        return parsed;
      } else {
        const result = (args as Record<string, unknown>)[jsonSchema.type as string];
        return result as zodInfer<InputSchema>;
      }
    },
  };
}
