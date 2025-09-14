'use server';
/**
 * @fileOverview Customer management AI agent.
 *
 * - manageCustomer - A function that handles the customer management process.
 * - ManageCustomerInput - The input type for the manageCustomer function.
 * - ManageCustomerOutput - The return type for the manageCustomer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { customers } from '@/lib/data';
import { Customer } from '@/lib/types';

const ManageCustomerInputSchema = z.object({
  query: z.string().describe("The user's request for customer management."),
});
export type ManageCustomerInput = z.infer<typeof ManageCustomerInputSchema>;

const ManageCustomerOutputSchema = z.object({
  response: z.string().describe('The response to the user\'s request.'),
});
export type ManageCustomerOutput = z.infer<typeof ManageCustomerOutputSchema>;

const CreateCustomerInputSchema = z.object({
    name: z.string().describe("The customer's full name."),
    email: z.string().describe("The customer's email address."),
    phone: z.string().describe("The customer's phone number."),
});

const createCustomerTool = ai.defineTool(
    {
        name: 'createCustomer',
        description: 'Creates a new customer profile. Use this when the user wants to add a new customer.',
        inputSchema: CreateCustomerInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        const newCustomer: Customer = {
            id: `cus-${customers.length + 1}`,
            name: input.name,
            email: input.email,
            phone: input.phone,
            avatarUrl: `https://picsum.photos/seed/${customers.length + 1}/100/100`,
            createdAt: new Date().toISOString(),
            identities: [
                { channel: 'Phone', identifier: input.phone },
                { channel: 'Email', identifier: input.email },
            ],
            interactions: [],
            orders: [],
            tags: ['New Customer'],
        };
        customers.push(newCustomer);
        return `Successfully created customer: ${newCustomer.name} with ID ${newCustomer.id}.`;
    }
);


const prompt = ai.definePrompt({
  name: 'customerManagementPrompt',
  input: {schema: ManageCustomerInputSchema},
  output: {schema: ManageCustomerOutputSchema},
  system: "You are an assistant for managing customers. Use the available tools to handle user requests. If you create a customer, confirm it in the response.",
  tools: [createCustomerTool],
});

const manageCustomerFlow = ai.defineFlow(
  {
    name: 'manageCustomerFlow',
    inputSchema: ManageCustomerInputSchema,
    outputSchema: ManageCustomerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function manageCustomer(input: ManageCustomerInput): Promise<ManageCustomerOutput> {
    return manageCustomerFlow(input);
}
