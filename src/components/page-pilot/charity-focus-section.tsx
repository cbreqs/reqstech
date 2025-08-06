import { selectCharity } from '@/ai/flows/select-charity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartHandshake } from 'lucide-react';

export async function CharityFocusSection() {
  // This must be done on the server as client-side `new Date()` can cause hydration mismatch.
  const month = new Date().toLocaleString('default', { month: 'long' });
  const charity = await selectCharity({ month });

  return (
    <Card className="animate-in fade-in-0 duration-1000 bg-gradient-to-tr from-card to-secondary/30">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-3">
          <HeartHandshake className="text-primary h-6 w-6" />
          Charitable Focus: {month}
        </CardTitle>
        <CardDescription className="font-semibold text-lg text-primary">{charity.charityName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-foreground">Our Mission</h4>
          <p className="text-muted-foreground">{charity.mission}</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">Current Needs</h4>
          <p className="text-muted-foreground">{charity.needs}</p>
        </div>
      </CardContent>
    </Card>
  );
}
