
'use server';

/**
 * @fileOverview AI-powered product recommendation flow based on browsing history.
 *
 * - productRecommendations - A function that generates personalized product recommendations.
 * - ProductRecommendationsInput - The input type for the productRecommendations function.
 * - ProductRecommendationsOutput - The return type for the productRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  browsingHistory: z
    .array(z.string())
    .describe('An array of product IDs representing the user\'s browsing history.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(z.string())
    .describe('An array of product IDs recommended to the user.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

const shouldIncludeProduct = ai.defineTool({
  name: 'shouldIncludeProduct',
  description: 'Determines whether a specific product should be included in the recommendations based on the user browsing history.',
  inputSchema: z.object({
    productId: z.string().describe('The ID of the product to be considered.'),
    browsingHistory: z
      .array(z.string())
      .describe('An array of product IDs representing the user\'s browsing history.'),
  }),
  outputSchema: z.boolean().describe('A boolean value indicating whether the product should be included.'),
},
async (input) => {
  // Implement your logic here to determine if the product should be included.
  // This is a placeholder implementation.
  return !input.browsingHistory.includes(input.productId);
});

export async function productRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  model: 'googleai/gemini-2.0-flash', // Explicitly define the model
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  tools: [shouldIncludeProduct],
  prompt: `You are an expert product recommendation engine.

  Based on the user's browsing history, recommend products they might be interested in. Use the shouldIncludeProduct tool to determine if a specific product should be included in the recommendations.

  Browsing History: {{browsingHistory}}

  Consider a variety of products and use the tool to determine which ones to recommend.
  Only return a list of product IDs.
  {
    "recommendedProducts": [ 
      
    ]
  }`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
