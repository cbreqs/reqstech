"use client";

import { useEffect } from "react";
import { useCurrentBusiness, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import type { Business } from "@/lib/types";

const STATIC_THEMES = ['elevated-adventures', 'wands-ledgers', 'reqs-tech'];

/**
 * ThemeHydrator syncs the currentBusinessId with the document's data-theme attribute.
 * For known static themes, applies the CSS class directly.
 * For custom tenants, reads themeConfig from Firestore and injects CSS variables.
 */
export function ThemeHydrator() {
  const { currentBusinessId } = useCurrentBusiness();
  const firestore = useFirestore();

  const businessDocRef = useMemoFirebase(() => {
    if (!firestore || !currentBusinessId || STATIC_THEMES.includes(currentBusinessId)) return null;
    return doc(firestore, 'businesses', currentBusinessId);
  }, [firestore, currentBusinessId]);

  const { data: businessData } = useDoc<Business>(businessDocRef);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (!currentBusinessId) {
      root.removeAttribute("data-theme");
      removeInjectedTheme();
      return;
    }

    if (STATIC_THEMES.includes(currentBusinessId)) {
      root.setAttribute("data-theme", currentBusinessId);
      removeInjectedTheme();
      return;
    }

    // Dynamic theme injection from Firestore
    if (businessData?.themeConfig) {
      root.setAttribute("data-theme", currentBusinessId);
      injectDynamicTheme(currentBusinessId, businessData.themeConfig);
    } else {
      root.removeAttribute("data-theme");
    }
  }, [currentBusinessId, businessData]);

  return null;
}

function removeInjectedTheme() {
  const existing = document.getElementById('flexagenda-dynamic-theme');
  if (existing) existing.remove();
}

function injectDynamicTheme(businessId: string, config: Record<string, string>) {
  removeInjectedTheme();
  const vars = Object.entries(config)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');
  const style = document.createElement('style');
  style.id = 'flexagenda-dynamic-theme';
  style.textContent = `[data-theme='${businessId}'] {\n${vars}\n}`;
  document.head.appendChild(style);
}
