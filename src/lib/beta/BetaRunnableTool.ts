import type { ChatCompletionContentPart, ChatCompletionToolMessageParam } from '../../resources';
import type { infer as zodInfer, ZodType } from 'zod/v4';
import type {
  ResponseCustomToolCallOutput,
  ResponseInputItem,
  ResponseInputText,
  FunctionTool as ResponsesFunctionTool,
} from '../../resources/responses/responses';

export type Promisable<T> = T | Promise<T>;

// These types are just extensions of ChatCompletionFunctionTool with a run and parse method
// that will be called by `toolRunner()` helpers

export type BetaRunnableChatFunctionToolReturnType = ChatCompletionToolMessageParam['content'];

export type BetaRunnableResponsesFunctionToolReturnType = ResponseCustomToolCallOutput['output'];

export type BetaRunnableResponsesFunctionTool<
  Input,
  Output extends BetaRunnableResponsesFunctionToolReturnType,
> = ResponsesFunctionTool & {
  run: RunFunction<Input, Output>;
  parse: (content: unknown) => Input;
};

export type RunFunction<InputSchema, OutputSchema extends BetaRunnableResponsesFunctionToolReturnType> = (
  args: InputSchema,
) => Promisable<OutputSchema>;

export type ChatAndResponsesSharedOutput = string | ResponseInputText[];

export type ChatOnlyBetaRunnableFunctionTool = BetaRunnableResponsesFunctionTool<
  any,
  ChatAndResponsesSharedOutput
>;
