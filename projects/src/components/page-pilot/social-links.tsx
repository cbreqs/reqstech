'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { GeneratePageContentOutput } from '@/ai/flows/generate-page-content-flow';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

interface SocialLinksProps {
  socialLinks: GeneratePageContentOutput['socialLinks'];
}

export function SocialLinks({ socialLinks }: SocialLinksProps) {
  return (
    <div className="space-y-4">
       <Separator />
      <h3 className="text-sm font-medium text-muted-foreground text-center">
        Connect with us
      </h3>
      <div className="flex justify-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a href={socialLinks.twitter} aria-label="Twitter" className="text-muted-foreground hover:text-primary">
            <Twitter className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={socialLinks.instagram} aria-label="Instagram" className="text-muted-foreground hover:text-primary">
            <Instagram className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a href={socialLinks.linkedin} aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
            <Linkedin className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
