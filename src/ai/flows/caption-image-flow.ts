'use server';
/**
 * @fileOverview An image captioning AI agent.
 *
 * - captionImage - A function that generates a caption for an image.
 * - CaptionImageInput - The input type for the captionImage function.
 * - CaptionImageOutput - The return type for the captionImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CaptionImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CaptionImageInput = z.infer<typeof CaptionImageInputSchema>;

const CaptionImageOutputSchema = z.object({
  caption: z.string().describe('A descriptive caption for the image.'),
});
export type CaptionImageOutput = z.infer<typeof CaptionImageOutputSchema>;

export async function captionImage(input: CaptionImageInput): Promise<CaptionImageOutput> {
  return captionImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'captionImagePrompt',
  input: {schema: CaptionImageInputSchema},
  output: {schema: CaptionImageOutputSchema},
  prompt: `You are a helpful assistant that writes descriptive and engaging captions for photos.

  Generate a short caption for the following image.

  Photo: {{media url=photoDataUri}}`,
});

const captionImageFlow = ai.defineFlow(
  {
    name: 'captionImageFlow',
    inputSchema: CaptionImageInputSchema,
    outputSchema: CaptionImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
