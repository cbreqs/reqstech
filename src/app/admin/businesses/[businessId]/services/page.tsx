"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Loader2, Trash2, Edit2, CheckCircle2, XCircle, Users, Clock, DollarSign } from "lucide-react";
import { useFirestore, useCurrentBusiness, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/lib/types";

const EMPTY_SERVICE = {
  name: "",
  description: "",
  durationMinutes: 60,
  maxCapacity: 1,
  price: 0,
  isActive: true,
  type: "appointment" as Service["type"],
};

export default function ServicesPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const firestore = useFirestore();
  const { setCurrentBusinessId } = useCurrentBusiness();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_SERVICE });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (businessId) setCurrentBusinessId(businessId);
  }, [businessId, setCurrentBusinessId]);

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return collection(firestore, 'businesses', businessId, 'bookingTypes');
  }, [firestore, businessId]);

  const { data: services, isLoading } = useCollection<Service>(servicesQuery);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !businessId) return;
    setIsSubmitting(true);

    const data = {
      ...form,
      durationMinutes: Number(form.durationMinutes),
      maxCapacity: Number(form.maxCapacity),
      price: Number(form.price),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const ref = doc(firestore, 'businesses', businessId, 'bookingTypes', editingId);
        setDocumentNonBlocking(ref, data, { merge: true });
        toast({ title: "Service updated" });
      } else {
        const col = collection(firestore, 'businesses', businessId, 'bookingTypes');
        addDocumentNonBlocking(col, { ...data, createdAt: new Date().toISOString() });
        toast({ title: "Service created" });
      }
      setForm({ ...EMPTY_SERVICE });
      setEditingId(null);
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setForm({
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      maxCapacity: service.maxCapacity,
      price: service.price,
      isActive: service.isActive,
      type: service.type,
    });
    setEditingId(service.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (serviceId: string) => {
    if (!firestore || !businessId) return;
    if (!confirm("Delete this service? This cannot be undone.")) return;
    const ref = doc(firestore, 'businesses', businessId, 'bookingTypes', serviceId);
    deleteDocumentNonBlocking(ref);
    toast({ title: "Service deleted" });
  };

  const handleToggleActive = (service: Service) => {
    if (!firestore || !businessId) return;
    const ref = doc(firestore, 'businesses', businessId, 'bookingTypes', service.id);
    setDocumentNonBlocking(ref, { isActive: !service.isActive, updatedAt: new Date().toISOString() }, { merge: true });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="gap-1.5 font-bold">
              <Link href={`/admin/businesses/${businessId}`}><ArrowLeft className="w-4 h-4" /> Dashboard</Link>
            </Button>
            <div>
              <h1 className="text-2xl font-black tracking-tighter">Services</h1>
              <p className="text-xs text-muted-foreground">Manage what customers can book</p>
            </div>
          </div>
          {!showForm && (
            <Button className="rounded-xl font-bold gap-2" onClick={() => { setForm({ ...EMPTY_SERVICE }); setEditingId(null); setShowForm(true); }}>
              <Plus className="w-4 h-4" /> New Service
            </Button>
          )}
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <Card className="mb-8 border-primary/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">{editingId ? "Edit Service" : "New Service"}</CardTitle>
              <CardDescription>
                {editingId ? "Update this service's details." : "Add a bookable service for your customers."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input id="name" placeholder="e.g. Trail Tour, Tax Consultation" className="rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="What should customers know about this service?" className="rounded-xl" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="durationMinutes">Duration (min)</Label>
                    <Input id="durationMinutes" type="number" min={15} step={15} className="rounded-xl" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Max Capacity</Label>
                    <Input id="maxCapacity" type="number" min={1} max={100} className="rounded-xl" value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })} />
                    <p className="text-[10px] text-muted-foreground">People per slot</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" min={0} step={0.01} className="rounded-xl" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="group">Group / Tour</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Switch id="isActive" checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                  <Label htmlFor="isActive" className="cursor-pointer">Active (visible to customers)</Label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="rounded-xl font-bold" disabled={isSubmitting || !form.name}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {editingId ? "Save Changes" : "Create Service"}
                  </Button>
                  <Button type="button" variant="ghost" className="rounded-xl font-bold" onClick={() => { setShowForm(false); setEditingId(null); setForm({ ...EMPTY_SERVICE }); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Services List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="space-y-3">
            {services.map((service) => (
              <Card key={service.id} className={`border-border/50 transition-all ${!service.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="pt-0.5">
                        {service.isActive
                          ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          : <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                        }
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm">{service.name}</h3>
                          <Badge variant="outline" className="text-[9px] h-4">{service.type}</Badge>
                        </div>
                        {service.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.durationMinutes}m</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max {service.maxCapacity}</span>
                          <span className="flex items-center gap-1 font-bold text-accent"><DollarSign className="w-3 h-3" /> {service.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={() => handleToggleActive(service)}
                        className="scale-75"
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => handleEdit(service)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/5">
            <p className="text-lg font-bold mb-2">No services yet</p>
            <p className="text-sm text-muted-foreground mb-6">Add your first service so customers can start booking.</p>
            <Button className="rounded-xl font-bold gap-2" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
