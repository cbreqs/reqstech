'use server';
/**
 * @fileOverview An AI agent for generating dynamic page content.
 *
 * - generatePageContent - A function that creates content for a landing page based on a company name.
 * - GeneratePageContentInput - The input type for the generatePageContent function.
 * - GeneratePageContentOutput - The return type for the generatePageContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePageContentInputSchema = z.object({
  companyName: z.string().describe('The name of the company for which to generate page content.'),
});
export type GeneratePageContentInput = z.infer<typeof GeneratePageContentInputSchema>;

const GeneratePageContentOutputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  tagline: z.string().describe('A catchy tagline for the company.'),
  contactInfo: z.object({
    address: z.string().describe('The physical address of the company.'),
    phone: z.string().describe('The contact phone number for the company.'),
    email: z.string().describe('The contact email address for the company.'),
  }),
  announcements: z.array(z.string()).describe('A list of 2-3 brief announcements or highlights for the current month.'),
   socialLinks: z.object({
    twitter: z.string().describe('The full URL to the company\'s Twitter/X profile.'),
    instagram: z.string().describe('The full URL to the company\'s Instagram profile.'),
    linkedin: z.string().describe('The full URL to the company\'s LinkedIn profile.'),
  }),
});
export type GeneratePageContentOutput = z.infer<typeof GeneratePageContentOutputSchema>;

export async function generatePageContent(input: GeneratePageContentInput): Promise<GeneratePageContentOutput> {
  return generatePageContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePageContentPrompt',
  input: {schema: GeneratePageContentInputSchema},
  output: {schema: GeneratePageContentOutputSchema},
  prompt: `You are an expert branding and marketing assistant. Your task is to generate all the necessary content for a company's landing page based on its name.

The company is: {{{companyName}}}

Generate the following content:
1.  **Company Name**: Use the provided name.
2.  **Tagline**: Create a short, memorable tagline.
3.  **Contact Information**: Invent a plausible-sounding physical address, a phone number in (123) 456-7890 format, and an email address (e.g., hello@company.com).
4.  **Announcements**: Write 2-3 engaging announcements for the current month. For example, you could announce new products, upcoming events, or special promotions.
5.  **Social Media Links**: Provide fictional but valid-looking URLs for Twitter/X, Instagram, and LinkedIn.

Please provide a complete response, even if the company name seems generic. Be creative and professional.
`,
});

const generatePageContentFlow = ai.defineFlow(
  {
    name: 'generatePageContentFlow',
    inputSchema: GeneratePageContentInputSchema,
    outputSchema: GeneratePageContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
