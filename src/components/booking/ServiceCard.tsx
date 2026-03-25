"use client";

import { Service } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";
import { BookingWizard } from "./BookingWizard";

interface ServiceCardProps {
  service: Service;
  businessId?: string;
}

const TYPE_LABELS: Record<string, string> = {
  group: "Group / Tour",
  appointment: "Appointment",
  consultation: "Consultation",
};

export function ServiceCard({ service, businessId }: ServiceCardProps) {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm flex flex-col">
        {/* Color accent bar — uses primary CSS variable so it respects theme */}
        <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />

        <CardHeader className="pb-2 pt-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">
              {service.name}
            </CardTitle>
            <Badge className="bg-accent/10 text-accent border-none shrink-0 font-bold text-xs">
              ${service.price}
            </Badge>
          </div>
          <Badge variant="secondary" className="self-start text-[10px] mt-1">
            {TYPE_LABELS[service.type] || service.type}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem] leading-relaxed">
            {service.description || "No description provided."}
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {service.durationMinutes} min
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              {service.maxCapacity > 1 ? `Up to ${service.maxCapacity}` : '1 person'}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-4">
          <Button
            className="w-full rounded-xl gap-2 font-bold shadow-md"
            onClick={() => setShowWizard(true)}
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </Button>
        </CardFooter>
      </Card>

      <BookingWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        service={service}
        businessId={businessId}
      />
    </>
  );
}
