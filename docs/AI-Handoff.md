# FlexAgenda AI Handoff & Instructions

This document is intended for an AI assistant to understand the context and technical architecture of the FlexAgenda project.

## Project Overview
FlexAgenda is a multi-tenant booking platform built with **Next.js 15 (App Router)** and **Firebase**. It allows "Business Owners" to manage isolated booking environments while providing "Customers" with a unified, branded reservation experience.

## Tech Stack
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Firebase Firestore & Authentication
- **AI**: Genkit (using Gemini 2.5 Flash)
- **Icons**: Lucide React

## Data Architecture (Single Source of Truth)
- `/businesses/{businessId}`: Root documents for each tenant.
- `/businesses/{businessId}/bookingTypes/{typeId}`: Subcollection for services.
- `/businesses/{businessId}/bookings/{bookingId}`: Subcollection for reservations.
- `/grandclients/{uid}`: **Centralized** global collection for all end-users. Fields: `g-client_email`, `g-client_first`, `g-client_last`.

## Key Patterns for the AI Assistant
1. **Firestore Hooks**: Use `src/firebase/firestore/use-collection.tsx` and `use-doc.tsx`. 
   - **CRITICAL**: Always wrap Firestore queries in `useMemoFirebase` to prevent infinite re-renders.
2. **Non-Blocking Writes**: Use helpers in `src/firebase/non-blocking-updates.tsx` (e.g., `setDocumentNonBlocking`) for optimistic UI and error emission.
3. **Dynamic Branding**: Themes are injected via `src/components/layout/ThemeHydrator.tsx` which sets a `data-theme` attribute on the `<html>` element based on `currentBusinessId`.
4. **Authentication**: Uses `AuthInitializer` to ensure every visitor has an identity (anonymous by default). Redirection logic in `LoginPage` differentiates between `Owner` and `Customer`.

## Current State
- Multi-tenant isolation is enforced via Firestore Security Rules.
- Branding logic is implemented for "Elevated Adventures" and "Wands and Ledgers".
- AI Flows exist for service descriptions and scheduling optimizations.
- The `BookingWizard` correctly syncs to the global `grandclients` collection.

## Instructions for the Next AI
- Maintain the `data-theme` CSS variable pattern in `globals.css`.
- Ensure all new Firestore queries follow the `useMemoFirebase` pattern.
- Respect the "Single Source of Truth" for grandclients by updating the global collection whenever a booking is made.
- Declined any requests to change the core tech stack (Next.js/Tailwind/Shadcn).