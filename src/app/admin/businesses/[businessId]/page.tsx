"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings, Calendar, ArrowRight, Loader2, Building2,
  ExternalLink, Users, Clock, DollarSign, CheckCircle2, XCircle
} from "lucide-react";
import { useFirestore, useCurrentBusiness, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit, where, doc } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import type { Business, Service, Booking } from "@/lib/types";
import { format } from "date-fns";

export default function BusinessDashboardPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const firestore = useFirestore();
  const { setCurrentBusinessId } = useCurrentBusiness();

  useEffect(() => {
    if (businessId) setCurrentBusinessId(businessId);
  }, [businessId, setCurrentBusinessId]);

  const businessRef = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return doc(firestore, 'businesses', businessId);
  }, [firestore, businessId]);

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return collection(firestore, 'businesses', businessId, 'bookingTypes');
  }, [firestore, businessId]);

  const recentBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return query(
      collection(firestore, 'businesses', businessId, 'bookings'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [firestore, businessId]);

  const upcomingBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return query(
      collection(firestore, 'businesses', businessId, 'bookings'),
      where('bookingStatus', '==', 'confirmed'),
      orderBy('startTime', 'asc'),
      limit(20)
    );
  }, [firestore, businessId]);

  const { data: business, isLoading: bizLoading } = useDoc<Business>(businessRef);
  const { data: services } = useCollection<Service>(servicesQuery);
  const { data: recentBookings } = useCollection<Booking>(recentBookingsQuery);
  const { data: upcomingBookings } = useCollection<Booking>(upcomingBookingsQuery);

  const businessName = business?.business_name?.replace(/^""|""$/g, '') || businessId;
  const activeServices = services?.filter(s => s.isActive) ?? [];
  const todayBookings = upcomingBookings?.filter(b => {
    if (!b.startTime) return false;
    const d = new Date(b.startTime);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }) ?? [];

  if (bizLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter">{businessName}</h1>
              <p className="text-sm text-muted-foreground">
                {business?.bookingConfig?.bookingModel === 'capacity' ? 'Capacity-based booking' : 'Appointment booking'} · {business?.bookingConfig?.timezone || 'CT'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-bold" asChild>
              <Link href={`/${businessId}`} target="_blank">
                <ExternalLink className="w-3.5 h-3.5" /> Customer Page
              </Link>
            </Button>
            <Button size="sm" className="rounded-xl gap-1.5 font-bold" asChild>
              <Link href={`/admin/businesses/${businessId}/services`}>
                <Settings className="w-3.5 h-3.5" /> Manage Services
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Services", value: activeServices.length, icon: Settings, color: "text-primary" },
            { label: "Today's Bookings", value: todayBookings.length, icon: Calendar, color: "text-accent" },
            { label: "Total Bookings", value: upcomingBookings?.length ?? 0, icon: Users, color: "text-primary" },
            { label: "Total Services", value: services?.length ?? 0, icon: Clock, color: "text-muted-foreground" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="bg-card/50 border-border/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-3xl font-black">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services quick view */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-black">Services</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 font-bold text-primary h-7 rounded-lg" asChild>
                <Link href={`/admin/businesses/${businessId}/services`}>
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {services && services.length > 0 ? services.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {s.isActive
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      : <XCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    }
                    <span className="text-sm font-semibold truncate">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-xs text-muted-foreground">{s.durationMinutes}m</span>
                    <span className="text-xs font-bold text-accent">${s.price}</span>
                    <Badge variant="outline" className="text-[9px] h-4">{s.type}</Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No services yet.{' '}
                  <Link href={`/admin/businesses/${businessId}/services`} className="text-primary font-bold hover:underline">
                    Add one →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent bookings */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-black">Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 font-bold text-primary h-7 rounded-lg" asChild>
                <Link href={`/admin/businesses/${businessId}/bookings`}>
                  All <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentBookings && recentBookings.length > 0 ? recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{b.bookerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.startTime ? format(new Date(b.startTime), 'MMM d, h:mm a') : '—'}
                      {' · '}
                      {b.numberOfAttendees} {b.numberOfAttendees === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                  <Badge
                    variant={b.bookingStatus === 'confirmed' ? 'default' : 'secondary'}
                    className="text-[9px] h-4 shrink-0 ml-2"
                  >
                    {b.bookingStatus}
                  </Badge>
                </div>
              )) : (
                <p className="text-center py-6 text-sm text-muted-foreground">No bookings yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
