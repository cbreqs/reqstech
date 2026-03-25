"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useFirestore, useUser, setDocumentNonBlocking } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function NewBusinessPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    client_first: "",
    client_last: "",
    client_email: "",
    client_pseudo: "",
    url: "",
    bookingModel: "appointment" as "appointment" | "capacity",
    timezone: "America/Chicago",
  });

  const slugify = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || user.isAnonymous) return;
    setIsSubmitting(true);

    try {
      const businessId = slugify(form.business_name);
      if (!businessId) {
        toast({ title: "Invalid name", description: "Please enter a valid business name.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      const businessRef = doc(firestore, 'businesses', businessId);
      setDocumentNonBlocking(businessRef, {
        business_name: form.business_name,
        client_first: form.client_first,
        client_last: form.client_last,
        client_email: form.client_email,
        client_pseudo: form.client_pseudo,
        url: form.url,
        members: { [user.uid]: 'admin' },
        bookingConfig: {
          bookingModel: form.bookingModel,
          timezone: form.timezone,
          slotStartHour: 9,
          slotEndHour: 17,
          slotIntervalMinutes: form.bookingModel === 'capacity' ? 60 : 30,
          availableDays: [1, 2, 3, 4, 5],
        },
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
      }, { merge: false });

      setDone(true);
      setTimeout(() => router.push(`/admin/businesses/${businessId}`), 1500);
    } catch (err) {
      toast({ title: "Error", description: "Could not create business.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black">Business Created!</h2>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <Button variant="ghost" asChild className="mb-6 gap-2 font-bold">
          <Link href="/admin/businesses"><ArrowLeft className="w-4 h-4" /> Back</Link>
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">Add a Business</h1>
            <p className="text-sm text-muted-foreground">This creates a new tenant in FlexAgenda.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Business Details</CardTitle>
                <CardDescription>Basic information about this business profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    placeholder="Elevated Adventures KC"
                    className="rounded-xl"
                    value={form.business_name}
                    onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                    required
                  />
                  {form.business_name && (
                    <p className="text-[11px] text-muted-foreground">
                      Booking URL: <code className="text-primary font-mono">/{ slugify(form.business_name) }</code>
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="client_first">Contact First Name</Label>
                    <Input id="client_first" placeholder="Verletta" className="rounded-xl" value={form.client_first} onChange={(e) => setForm({ ...form, client_first: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_last">Contact Last Name</Label>
                    <Input id="client_last" placeholder="Martin" className="rounded-xl" value={form.client_last} onChange={(e) => setForm({ ...form, client_last: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Contact Email</Label>
                  <Input id="client_email" type="email" placeholder="hello@yourbusiness.com" className="rounded-xl" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input id="url" placeholder="https://yourbusiness.com" className="rounded-xl" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Booking Configuration</CardTitle>
                <CardDescription>How should bookings work for this business?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Booking Model</Label>
                  <Select value={form.bookingModel} onValueChange={(v: any) => setForm({ ...form, bookingModel: v })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment">
                        <div className="flex flex-col items-start">
                          <span className="font-bold">Appointment</span>
                          <span className="text-xs text-muted-foreground">One booking per time slot (consultations, sessions)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="capacity">
                        <div className="flex flex-col items-start">
                          <span className="font-bold">Capacity</span>
                          <span className="text-xs text-muted-foreground">Multiple bookings share a slot up to max capacity (tours, classes)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="America/Phoenix">Arizona (MST, no DST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base shadow-lg" disabled={isSubmitting || !form.business_name}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Create Business
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
}
