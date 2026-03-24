# FlexAgenda Multi-Tenant Booking Platform

FlexAgenda is a sophisticated, multi-tenant scheduling solution built with Next.js 15, Firebase (Firestore & Auth), and Genkit AI. It allows "Business Owners" to manage isolated booking environments while providing "Customers" with a unified, branded reservation experience.

## 🚀 Project Summary
- **Multi-Tenant Isolation**: Each business operates in its own secure data silo.
- **Dynamic Branding**: The UI transforms based on the active business profile (e.g., Elevated Adventures vs. Wands and Ledgers).
- **Single Source of Truth**: Customer data is centralized in a master `grandclients` collection while keeping bookings business-specific.
- **AI-Powered**: Integrated Genkit flows for service generation and schedule optimization.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database/Auth**: Firebase (Firestore, Authentication)
- **AI**: Firebase Genkit with Gemini
- **UI/Styling**: Tailwind CSS, Shadcn UI, Lucide Icons

## 🤖 AI Collaboration
If you are using an AI assistant to help develop this project, please point it to `docs/AI_HANDOFF.md`. That file contains specific instructions on the coding patterns and data architecture used in this repository.

## 📦 Getting Started
1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Create a `.env` file with your Firebase and Google GenAI keys.
3. **Run Development**: `npm run dev`

---
Built with ⚡ and designed for high-scale multi-tenant operations.