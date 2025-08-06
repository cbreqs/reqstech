import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialLinks } from './social-links';
import { Calendar } from 'lucide-react';
import type { GeneratePageContentOutput } from '@/ai/flows/generate-page-content-flow';

interface BookingSectionProps {
  socialLinks: GeneratePageContentOutput['socialLinks'];
}

export function BookingSection({ socialLinks }: BookingSectionProps) {
  return (
    <Card className="w-full shadow-md animate-in fade-in-0 duration-1000">
      <CardHeader>
        <CardTitle className="font-headline">Book a Consultation</CardTitle>
        <CardDescription>Schedule your appointment below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="aspect-[4/3] w-full bg-muted/50 rounded-lg flex items-center justify-center border-dashed border-2 p-4">
          <div className="text-center text-muted-foreground">
            <Calendar className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm font-medium">
              Embedded calendar system
            </p>
            <p className="text-xs">
              e.g., Google Calendar, Calendly
            </p>
          </div>
        </div>
        <SocialLinks socialLinks={socialLinks} />
      </CardContent>
    </Card>
  );
}
