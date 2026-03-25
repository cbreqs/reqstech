"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Calendar, Clock, Users, Search, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useFirestore, useCurrentBusiness, useCollection, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { format } from "date-fns";
import type { Booking } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-primary/10 text-primary border-none",
  pending: "bg-yellow-500/10 text-yellow-500 border-none",
  cancelled: "bg-destructive/10 text-destructive border-none",
};

export default function BookingsPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const firestore = useFirestore();
  const { setCurrentBusinessId } = useCurrentBusiness();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (businessId) setCurrentBusinessId(businessId);
  }, [businessId, setCurrentBusinessId]);

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return query(
      collection(firestore, 'businesses', businessId, 'bookings'),
      orderBy('startTime', 'desc')
    );
  }, [firestore, businessId]);

  const { data: bookings, isLoading } = useCollection<Booking>(bookingsQuery);

  const handleStatusChange = (bookingId: string, newStatus: Booking['bookingStatus']) => {
    if (!firestore || !businessId) return;
    const ref = doc(firestore, 'businesses', businessId, 'bookings', bookingId);
    setDocumentNonBlocking(ref, { bookingStatus: newStatus, updatedAt: new Date().toISOString() }, { merge: true });
  };

  const filtered = bookings?.filter((b) => {
    const matchesSearch =
      !search ||
      b.bookerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookerEmail?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }) ?? [];

  const grouped = filtered.reduce((acc, booking) => {
    const date = booking.startTime
      ? format(new Date(booking.startTime), 'yyyy-MM-dd')
      : 'unknown';
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  const sortedDates = Object.keys(grouped).sort().reverse();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 font-bold">
            <Link href={`/admin/businesses/${businessId}`}><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">Bookings</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sortedDates.length > 0 ? (
          <div className="space-y-6">
            {sortedDates.map((dateKey) => {
              const dateLabel = dateKey === 'unknown' ? 'Unknown Date' :
                format(new Date(dateKey + 'T12:00:00'), 'EEEE, MMMM d, yyyy');
              const isToday = dateKey === format(new Date(), 'yyyy-MM-dd');
              const isPast = dateKey < format(new Date(), 'yyyy-MM-dd');

              return (
                <div key={dateKey}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{dateLabel}</h3>
                    {isToday && <Badge className="text-[9px] h-4 bg-primary">TODAY</Badge>}
                    {isPast && !isToday && <Badge variant="secondary" className="text-[9px] h-4 opacity-50">PAST</Badge>}
                  </div>
                  <div className="space-y-2">
                    {grouped[dateKey].map((booking) => (
                      <Card key={booking.id} className={`border-border/50 ${booking.bookingStatus === 'cancelled' ? 'opacity-50' : ''}`}>
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="text-center shrink-0 w-12">
                                <p className="text-lg font-black leading-none">
                                  {booking.startTime ? format(new Date(booking.startTime), 'h:mm') : '--'}
                                </p>
                                <p className="text-[9px] text-muted-foreground uppercase">
                                  {booking.startTime ? format(new Date(booking.startTime), 'a') : '--'}
                                </p>
                              </div>
                              <div className="w-px h-8 bg-border" />
                              <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{booking.bookerName}</p>
                                <p className="text-xs text-muted-foreground truncate">{booking.bookerEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>{booking.numberOfAttendees}</span>
                              </div>
                              <Badge className={`text-[9px] h-5 ${STATUS_COLORS[booking.bookingStatus] || ''}`}>
                                {booking.bookingStatus}
                              </Badge>
                              <Select
                                value={booking.bookingStatus}
                                onValueChange={(v: any) => handleStatusChange(booking.id, v)}
                              >
                                <SelectTrigger className="h-6 w-6 border-0 bg-muted/50 p-0 rounded" title="Change status">
                                  <span className="sr-only">Change status</span>
                                  <AlertCircle className="w-3 h-3 mx-auto" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="confirmed">
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Confirm</span>
                                  </SelectItem>
                                  <SelectItem value="pending">
                                    <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-yellow-500" /> Pending</span>
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    <span className="flex items-center gap-2"><XCircle className="w-3 h-3 text-destructive" /> Cancel</span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/5">
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-lg font-bold mb-1">No bookings found</p>
            <p className="text-sm text-muted-foreground">
              {search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Bookings will appear here once customers start booking.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
