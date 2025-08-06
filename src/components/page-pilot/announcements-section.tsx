'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { GeneratePageContentOutput } from '@/ai/flows/generate-page-content-flow';
import { Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AnnouncementsSectionProps {
  content: GeneratePageContentOutput;
}

export function AnnouncementsSection({ content }: AnnouncementsSectionProps) {
  const [month, setMonth] = useState('');

  useEffect(() => {
    setMonth(new Date().toLocaleString('default', { month: 'long' }));
  }, []);

  return (
    <Card className="animate-in fade-in-0 duration-1000">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Megaphone className="text-primary" />
          {month} Announcements
        </CardTitle>
        <CardDescription>
          Updates, news, and highlights for this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        {content.announcements.map((announcement, index) => (
          <p key={index}>{announcement}</p>
        ))}
      </CardContent>
    </Card>
  );
}
