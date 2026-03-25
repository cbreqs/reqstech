"use client";

import { useState, useEffect, useMemo } from "react";
import { Service } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CheckCircle2, User, Loader2, Calendar as CalendarIcon, Clock, Users, AlertTriangle } from "lucide-react";
import {
  useFirestore, addDocumentNonBlocking, setDocumentNonBlocking,
  useCurrentBusiness, useUser, useCollection, useMemoFirebase
} from "@/firebase";
import { collection, doc, query, where } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BookingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  businessId?: string;
}

export function BookingWizard({ open, onOpenChange, service, businessId: propBusinessId }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [attendees, setAttendees] = useState(1);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const { currentBusinessId } = useCurrentBusiness();
  const businessId = propBusinessId || currentBusinessId;

  // Default time slots — can be made configurable per business later
  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

  useEffect(() => {
    setMounted(true);
    if (user && user.email && !user.isAnonymous) {
      setCustomer(prev => ({ ...prev, email: user.email || "", name: user.displayName || "" }));
    }
  }, [user]);

  // Capacity check: fetch all confirmed bookings for this service+date
  const dateStr = date ? format(date, 'yyyy-MM-dd') : null;

  const existingBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !businessId || !dateStr || !service.id) return null;
    return query(
      collection(firestore, 'businesses', businessId, 'bookings'),
      where('bookingTypeId', '==', service.id),
      where('bookingStatus', '==', 'confirmed')
    );
  }, [firestore, businessId, dateStr, service.id]);

  const { data: existingBookings } = useCollection(existingBookingsQuery);

  // Calculate remaining seats per time slot
  const slotAvailability = useMemo(() => {
    return timeSlots.map((slot) => {
      const slotDateTime = dateStr ? `${dateStr}T${slot}:00` : null;
      const bookingsForSlot = existingBookings?.filter((b: any) => {
        if (!b.startTime || !slotDateTime) return false;
        return b.startTime.startsWith(slotDateTime.substring(0, 16));
      }) ?? [];
      const seatsBooked = bookingsForSlot.reduce((sum: number, b: any) => sum + (b.numberOfAttendees || 1), 0);
      const remaining = service.maxCapacity - seatsBooked;
      return {
        time: slot,
        remaining,
        totalCapacity: service.maxCapacity,
        isAvailable: remaining > 0,
        seatsBooked,
      };
    });
  }, [existingBookings, dateStr, service.maxCapacity, timeSlots]);

  const selectedSlot = slotAvailability.find(s => s.time === time);
  const maxSelectableAttendees = Math.min(selectedSlot?.remaining ?? service.maxCapacity, service.maxCapacity, 12);

  const isGroupBooking = service.type === 'group' || service.maxCapacity > 1;

  const handleSubmit = async () => {
    if (!firestore || !businessId) {
      toast({ title: "Configuration Error", description: "No business selected.", variant: "destructive" });
      return;
    }
    if (selectedSlot && attendees > selectedSlot.remaining) {
      toast({ title: "Not enough seats", description: `Only ${selectedSlot.remaining} seats remain for this slot.`, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const grandclientId = user && !user.isAnonymous
        ? user.uid
        : customer.email.toLowerCase().replace(/[^a-z0-9]/g, '');
      const grandclientRef = doc(firestore, 'grandclients', grandclientId);
      const nameParts = customer.name.split(' ');

      setDocumentNonBlocking(grandclientRef, {
        "g-client_email": customer.email,
        "g-client_first": nameParts[0] || "Client",
        "g-client_last": nameParts.slice(1).join(' ') || "",
        updatedAt: new Date().toISOString(),
        uid: user?.uid || null,
      }, { merge: true });

      const bookingsCol = collection(firestore, 'businesses', businessId, 'bookings');
      addDocumentNonBlocking(bookingsCol, {
        bookingTypeId: service.id,
        businessId,
        grandclientId,
        bookerName: customer.name,
        bookerEmail: customer.email,
        bookerPhoneNumber: customer.phone,
        numberOfAttendees: attendees,
        bookingStatus: 'confirmed',
        startTime: date ? `${format(date, 'yyyy-MM-dd')}T${time}:00` : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setStep(4);
    } catch (error) {
      console.error("Booking error:", error);
      toast({ title: "Error", description: "Could not complete booking.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setTime("");
      if (!user || user.isAnonymous) {
        setCustomer({ name: "", email: "", phone: "" });
      }
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-muted flex">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-full flex-1 transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-transparent'}`} />
            ))}
          </div>

          <div className="p-6 overflow-y-auto">
            <DialogHeader className="mb-5">
              <DialogTitle className="text-xl font-bold">
                {step < 4 ? `Book: ${service.name}` : "Confirmed!"}
              </DialogTitle>
              {isGroupBooking && step === 1 && (
                <p className="text-xs text-muted-foreground">
                  Max {service.maxCapacity} people per tour · Multiple groups can share a slot
                </p>
              )}
            </DialogHeader>

            {/* Step 1: Date + Time */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-muted-foreground tracking-wider">Select Date</Label>
                  <div className="border rounded-xl p-2 bg-muted/10 flex justify-center">
                    {mounted ? (
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => { setDate(d); setTime(""); }}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    ) : (
                      <div className="h-[280px] flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-muted-foreground tracking-wider">Select Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {slotAvailability.map((slot) => {
                      const isSelected = time === slot.time;
                      const isFull = !slot.isAvailable;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={isFull}
                          onClick={() => !isFull && setTime(slot.time)}
                          className={cn(
                            "flex flex-col items-center py-2.5 px-2 rounded-xl border transition-all text-sm",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary font-bold"
                              : isFull
                              ? "bg-muted/20 text-muted-foreground border-border/30 cursor-not-allowed opacity-50"
                              : "bg-muted/30 border-border hover:bg-muted/50 cursor-pointer"
                          )}
                        >
                          <span className="font-bold">{slot.time}</span>
                          {isGroupBooking && (
                            <span className={cn(
                              "text-[9px] mt-0.5 font-medium",
                              isSelected ? "text-primary-foreground/70" : isFull ? "text-destructive" : "text-muted-foreground"
                            )}>
                              {isFull ? "FULL" : `${slot.remaining} left`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Customer info + attendees */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input id="name" placeholder="Jane Doe" className="pl-10 h-11 rounded-xl" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jane@example.com" className="h-11 rounded-xl" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} disabled={!!(user && !user.isAnonymous && user.email)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" type="tel" placeholder="(555) 000-0000" className="h-11 rounded-xl" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                </div>

                {isGroupBooking && (
                  <div className="space-y-2">
                    <Label>Party Size</Label>
                    {selectedSlot && selectedSlot.remaining < service.maxCapacity && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-500 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Only {selectedSlot.remaining} seat{selectedSlot.remaining !== 1 ? 's' : ''} remaining at {time}
                      </div>
                    )}
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: Math.min(12, maxSelectableAttendees) }, (_, i) => i + 1).map((num) => (
                        <Button
                          key={num}
                          type="button"
                          variant={attendees === num ? "default" : "outline"}
                          className="h-11 rounded-lg font-bold p-0"
                          onClick={() => setAttendees(num)}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedSlot
                        ? `${selectedSlot.remaining} of ${service.maxCapacity} seats available`
                        : `Max ${service.maxCapacity} per booking`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-primary">{service.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <CalendarIcon className="w-3 h-3" />
                        {date ? format(date, 'PPPP') : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {time}
                      </p>
                    </div>
                    <p className="text-xl font-black text-primary">${service.price}</p>
                  </div>
                  <div className="border-t border-primary/10 pt-3 space-y-1">
                    <p className="text-xs uppercase font-black text-muted-foreground tracking-widest">Customer</p>
                    <p className="font-bold">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
                    {isGroupBooking && (
                      <p className="text-sm font-bold flex items-center gap-1.5 pt-1">
                        <Users className="w-4 h-4 text-primary" />
                        {attendees} {attendees === 1 ? 'person' : 'people'}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                  Booking is confirmed immediately upon submission
                </p>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="py-10 text-center space-y-5 animate-in zoom-in duration-400">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">You're booked!</h3>
                  <p className="text-muted-foreground mt-1 max-w-[220px] mx-auto text-sm">
                    <span className="text-foreground font-bold">{service.name}</span>
                    {' '}on{' '}
                    {date ? format(date, 'MMM d') : ''} at {time}
                    {isGroupBooking && ` · ${attendees} ${attendees === 1 ? 'person' : 'people'}`}
                  </p>
                </div>
                <Button className="w-full h-11 rounded-xl font-bold" onClick={handleClose}>
                  Done
                </Button>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="p-5 bg-muted/10 border-t flex justify-between">
              {step > 1 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)} className="font-bold">Back</Button>
              ) : <div />}
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!time || !date)) ||
                    (step === 2 && (!customer.name || !customer.email))
                  }
                  className="px-8 rounded-xl font-bold shadow-md"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 rounded-xl font-bold shadow-md"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Confirm Booking
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
