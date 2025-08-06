import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building, Mail, MapPin, Phone } from 'lucide-react';
import type { GeneratePageContentOutput } from '@/ai/flows/generate-page-content-flow';

interface ContactSectionProps {
  content: GeneratePageContentOutput;
}

export function ContactSection({ content }: ContactSectionProps) {
  return (
    <Card className="w-full shadow-md animate-in fade-in-0 duration-1000">
      <CardHeader>
        <CardTitle className="font-headline">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center gap-4">
          <Building className="h-5 w-5 text-primary" />
          <span className="font-medium">{content.companyName}</span>
        </div>
        <Separator />
        <div className="flex items-start gap-4">
          <MapPin className="h-5 w-5 text-primary mt-1" />
          <div className="text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>
            {content.contactInfo.address}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="h-5 w-5 text-primary" />
          <a
            href={`tel:${content.contactInfo.phone.replace(/\D/g, '')}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {content.contactInfo.phone}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Mail className="h-5 w-5 text-primary" />
          <a
            href={`mailto:${content.contactInfo.email}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {content.contactInfo.email}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
