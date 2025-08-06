import { Suspense } from 'react';
import { AnnouncementsSection } from '@/components/page-pilot/announcements-section';
import { BookingSection } from '@/components/page-pilot/booking-section';
import { CharityFocusSection } from '@/components/page-pilot/charity-focus-section';
import { CharityFocusSkeleton } from '@/components/page-pilot/charity-focus-skeleton';
import { GallerySection } from '@/components/page-pilot/gallery-section';
import { ContactSection } from '@/components/page-pilot/contact-section';
import { generatePageContent } from '@/ai/flows/generate-page-content-flow';

// You can change this to any company name to regenerate the page content.
const COMPANY_NAME = "John Doe's Portfolio";

export default async function ProjectsPage() {
  const content = await generatePageContent({ companyName: COMPANY_NAME });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 sm:p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
          {content.companyName}
        </h1>
        <p className="text-muted-foreground mt-2">
          {content.tagline}
        </p>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 p-4 sm:p-6 md:p-8 items-start">
        <aside className="md:col-span-5 lg:col-span-4 xl:col-span-3">
          <div className="md:sticky md:top-8 space-y-8">
            <BookingSection socialLinks={content.socialLinks} />
            <ContactSection content={content} />
          </div>
        </aside>
        <section className="md:col-span-7 lg:col-span-8 xl:col-span-9 space-y-8">
          <AnnouncementsSection content={content} />
          <GallerySection />
          <Suspense fallback={<CharityFocusSkeleton />}>
            <CharityFocusSection />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
