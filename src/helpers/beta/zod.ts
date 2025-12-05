import type { infer as zodInfer, ZodType } from 'zod/v4';
import * as z from 'zod/v4';
import type {
  BetaRunnableResponsesFunctionTool,
  BetaRunnableResponsesFunctionToolReturnType,
  RunFunction,
} from '../../lib/beta/BetaRunnableTool';

/**
 * Creates a tool using the provided Zod schema that can be passed
 * into the `.toolRunner()` method. The Zod schema will automatically be
 * converted into JSON Schema when passed to the API. The provided function's
 * input arguments will also be validated against the provided schema.
 *
 * This helper works for creating function tools for both the chat and responses
 * API.
 */
export function betaZodFunctionTool<
  InputSchema extends ZodType,
  Output extends BetaRunnableResponsesFunctionToolReturnType,
>(options: {
  name: string;
  parameters: InputSchema;
  description: string;
  run: RunFunction<zodInfer<InputSchema>, Output>;
}): BetaRunnableResponsesFunctionTool<zodInfer<InputSchema>, Output> {
  const jsonSchema = z.toJSONSchema(options.parameters, { reused: 'ref' });

  return {
    strict: true,
    type: 'function',
    name: options.name,
    parameters: jsonSchema,
    description: options.description,
    run: options.run,
    parse: (args: unknown) => options.parameters.parse(args),
  };
}
