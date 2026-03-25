"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, ExternalLink, Settings, Calendar, Loader2, Users, ArrowRight } from "lucide-react";
import { useCollection, useMemoFirebase, useFirestore, useUser, useCurrentBusiness } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Business } from "@/lib/types";

export default function BusinessesPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { setCurrentBusinessId } = useCurrentBusiness();
  const router = useRouter();

  const businessesQuery = useMemoFirebase(() => {
    if (!firestore || !user || user.isAnonymous) return null;
    return query(
      collection(firestore, 'businesses'),
      where(`members.${user.uid}`, 'in', ['admin', 'editor', 'viewer'])
    );
  }, [firestore, user]);

  const { data: businesses, isLoading } = useCollection<Business>(businessesQuery);

  const handleSelectBusiness = (businessId: string) => {
    setCurrentBusinessId(businessId);
    router.push(`/admin/businesses/${businessId}`);
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-black mb-2">Owner Portal</h1>
            <p className="text-muted-foreground">Sign in to manage your business profiles.</p>
          </div>
          <Button asChild size="lg" className="rounded-xl font-bold">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Your Businesses</h1>
            <p className="text-muted-foreground mt-1">Select a profile to manage services and bookings.</p>
          </div>
          <Button asChild className="rounded-xl font-bold gap-2">
            <Link href="/admin/businesses/new">
              <Plus className="w-4 h-4" /> Add Business
            </Link>
          </Button>
        </div>

        {businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => {
              const name = biz.business_name?.replace(/^""|""$/g, '') || biz.id;
              const role = biz.members?.[user.uid] || 'viewer';
              return (
                <Card
                  key={biz.id}
                  className="group border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm overflow-hidden"
                  onClick={() => handleSelectBusiness(biz.id)}
                >
                  <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase font-black tracking-wider"
                      >
                        {role}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-3 group-hover:text-primary transition-colors">
                      {name}
                    </CardTitle>
                    {biz.url && (
                      <CardDescription className="text-xs truncate">{biz.url.replace(/^""|""$/g, '')}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{biz.client_email?.replace(/^""|""$/g, '') || '—'}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2 pt-2">
                    <Button size="sm" className="flex-1 rounded-lg font-bold gap-1.5" onClick={(e) => { e.stopPropagation(); handleSelectBusiness(biz.id); }}>
                      <Settings className="w-3.5 h-3.5" /> Manage
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg gap-1.5" asChild onClick={(e) => e.stopPropagation()}>
                      <Link href={`/${biz.id}`} target="_blank">
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed rounded-2xl bg-muted/5 flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-black mb-2">No businesses yet</p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Add your first business profile to start managing bookings.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-xl font-bold gap-2">
              <Link href="/admin/businesses/new">
                <Plus className="w-4 h-4" /> Add Your First Business
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
