import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
          My Portfolio
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Welcome to my collection of projects.
        </p>
      </div>
      <div className="w-full max-w-md">
        <Card className="hover:border-primary transition-colors duration-300">
          <Link href="/projects.html" className="block">
            <CardHeader>
              <CardTitle className="font-headline flex items-center justify-between">
                <span>PagePilot Project</span>
                <ArrowRight className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                An AI-powered, dynamically generated landing page.
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
