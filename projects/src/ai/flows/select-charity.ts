'use server';

/**
 * @fileOverview Charity selection AI agent.
 *
 * - selectCharity - A function that handles the selection of a charity for the month.
 * - SelectCharityInput - The input type for the selectCharity function.
 * - SelectCharityOutput - The return type for the selectCharity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelectCharityInputSchema = z.object({
  month: z.string().describe('The current month.'),
});
export type SelectCharityInput = z.infer<typeof SelectCharityInputSchema>;

const SelectCharityOutputSchema = z.object({
  charityName: z.string().describe('The name of the selected charity.'),
  mission: z.string().describe('A brief description of the charity\'s mission.'),
  needs: z.string().describe('The current needs of the charity.'),
});
export type SelectCharityOutput = z.infer<typeof SelectCharityOutputSchema>;

export async function selectCharity(input: SelectCharityInput): Promise<SelectCharityOutput> {
  return selectCharityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selectCharityPrompt',
  input: {schema: SelectCharityInputSchema},
  output: {schema: SelectCharityOutputSchema},
  prompt: `You are a helpful assistant that selects a charity to spotlight for the month.

  Given the current month, select a charity from the list below that aligns with the month's themes or has urgent needs.

  Charity List:
  - American Red Cross: Provides disaster relief and humanitarian aid.
  - Doctors Without Borders: Offers medical care in conflict zones and countries affected by endemic diseases.
  - Environmental Defense Fund: Works on environmental problems.
  - Girls Who Code: Closes the gender gap in technology.

  For the selected charity, provide its name, a brief description of its mission, and its current needs.

  Current Month: {{{month}}}

  Format your response as a JSON object that conforms to the SelectCharityOutputSchema schema.  The descriptions from the schema are:
  ${JSON.stringify(SelectCharityOutputSchema.describe())}`,
});

const selectCharityFlow = ai.defineFlow(
  {
    name: 'selectCharityFlow',
    inputSchema: SelectCharityInputSchema,
    outputSchema: SelectCharityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
