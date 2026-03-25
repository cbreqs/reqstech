"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { ArrowRight, Loader2, Sparkles, Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCollection, useMemoFirebase, useFirestore, useCurrentBusiness, useUser } from '@/firebase';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { useDoc } from "@/firebase/firestore/use-doc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Business, Service, Booking } from "@/lib/types";

export default function BusinessPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const firestore = useFirestore();
  const { setCurrentBusinessId } = useCurrentBusiness();
  const { user } = useUser();

  // Set business context from URL — this is the key change from context-only approach
  useEffect(() => {
    if (businessId) {
      setCurrentBusinessId(businessId);
    }
  }, [businessId, setCurrentBusinessId]);

  const businessDocRef = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return doc(firestore, 'businesses', businessId);
  }, [firestore, businessId]);

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return query(
      collection(firestore, 'businesses', businessId, 'bookingTypes'),
      where('isActive', '==', true)
    );
  }, [firestore, businessId]);

  const userBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !businessId) return null;
    return query(
      collection(firestore, 'businesses', businessId, 'bookings'),
      where('grandclientId', '==', user.uid),
      where('bookingStatus', '==', 'confirmed'),
      orderBy('startTime', 'asc')
    );
  }, [firestore, user, businessId]);

  const { data: business, isLoading: businessLoading } = useDoc<Business>(businessDocRef);
  const { data: services, isLoading: servicesLoading } = useCollection<Service>(servicesQuery);
  const { data: myBookings } = useCollection<Booking>(userBookingsQuery);

  const businessName = business?.business_name?.replace(/^""|""$/g, '') || businessId.replace(/-/g, ' ');

  if (businessLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!business && !businessLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <h1 className="text-2xl font-bold">Business not found</h1>
          <p className="text-muted-foreground">No booking page exists for "{businessId}".</p>
          <Button asChild><Link href="/">Go Home</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 px-4 bg-gradient-to-b from-primary/10 via-background to-background overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl animate-pulse delay-700" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-black mb-8 border border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-4">
              <Sparkles className="w-3.5 h-3.5" />
              {businessName.toUpperCase()}
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
              Book with <span className="text-primary underline underline-offset-8 decoration-primary/20">{businessName}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed font-medium">
              Select a service below to get started.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="rounded-2xl px-10 font-bold h-14 text-base shadow-2xl hover:scale-105 transition-transform" asChild>
                <a href="#services">Browse Services</a>
              </Button>
              {!user?.isAnonymous && !user && (
                <Button size="lg" variant="outline" className="rounded-2xl px-10 h-14 text-base font-bold" asChild>
                  <Link href="/login">
                    Sign In <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Upcoming Bookings for logged-in user */}
        {user && !user.isAnonymous && myBookings && myBookings.length > 0 && (
          <section className="py-10 px-4 bg-muted/20 border-y border-border">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-black tracking-tight">Your Upcoming Bookings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myBookings.map((booking) => (
                  <Card key={booking.id} className="border-primary/10 bg-card/50 overflow-hidden group">
                    <div className="h-1 bg-primary" />
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold">CONFIRMED</Badge>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-base mt-2">{booking.bookerName}</CardTitle>
                      <CardDescription className="text-xs">{booking.numberOfAttendees} attendee{booking.numberOfAttendees > 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-semibold">
                          {booking.startTime ? new Date(booking.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-semibold">
                          {booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Services */}
        <section id="services" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-black tracking-tighter">Available Services</h2>
                <p className="text-muted-foreground mt-1">Select a service to begin your booking.</p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent mb-3 hidden md:block" />
            </div>

            {servicesLoading ? (
              <div className="flex flex-col items-center py-32 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="animate-pulse font-black text-primary tracking-widest uppercase text-xs">Loading Services...</p>
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} businessId={businessId} />
                ))}
              </div>
            ) : (
              <div className="text-center py-28 border-2 border-dashed rounded-2xl bg-muted/5 flex flex-col items-center gap-4">
                <Sparkles className="w-10 h-10 text-muted-foreground opacity-50" />
                <p className="text-lg font-bold text-muted-foreground">No active services listed yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t bg-muted/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {businessName}
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{' '}
            <a href="https://flexagenda.reqs.tech" className="text-primary font-bold hover:underline">
              FlexAgenda
            </a>
            {' '}by{' '}
            <a href="https://reqs.tech" className="hover:underline">REQS.TECH</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
