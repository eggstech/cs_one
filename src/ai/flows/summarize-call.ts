'use server';

/**
 * @fileOverview Automatically summarizes call recordings, extracting key discussion points and sentiment.
 *
 * - summarizeCall - A function that handles the call summarization process.
 * - SummarizeCallInput - The input type for the summarizeCall function.
 * - SummarizeCallOutput - The return type for the summarizeCall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCallInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of a phone call, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeCallInput = z.infer<typeof SummarizeCallInputSchema>;

const SummarizeCallOutputSchema = z.object({
  summary: z.string().describe('A summary of the call.'),
  sentiment: z.string().describe('The overall sentiment expressed in the call.'),
  keyTopics: z.string().describe('Key topics discussed during the call.'),
});
export type SummarizeCallOutput = z.infer<typeof SummarizeCallOutputSchema>;

export async function summarizeCall(input: SummarizeCallInput): Promise<SummarizeCallOutput> {
  return summarizeCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCallPrompt',
  input: {schema: SummarizeCallInputSchema},
  output: {schema: SummarizeCallOutputSchema},
  prompt: `You are an AI expert in summarizing phone calls and detecting the sentiment expressed in them.

  Analyze the provided call recording and extract the key discussion points, overall sentiment, and provide a concise summary.

  Call Recording: {{media url=audioDataUri}}`,
});

const summarizeCallFlow = ai.defineFlow(
  {
    name: 'summarizeCallFlow',
    inputSchema: SummarizeCallInputSchema,
    outputSchema: SummarizeCallOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
