'use client';

import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * VisitorTelemetry
 * 
 * Global edge-based visitor telemetry mounted at root layout.
 * Ensures:
 * 1. Global coverage: Works on all endpoints (/, /reviews, /blog/*, /saas/*, etc.)
 *    even when users land directly from Google search or external links.
 * 2. Production Domain Gating: ONLY records visits on adilrahman.cc and www.adilrahman.cc.
 *    Never marks visits from localhost, 127.0.0.1, or preview deployments.
 * 3. Daily Device Rate-Limiting: Marks a device strictly 1 time per day (24h/calendar day).
 *    Multiple page views, navigations, or refreshes will not trigger duplicate counts.
 * 4. Zero-Cookie & Privacy-First: Extracts ISO country code in-memory at Cloudflare edge.
 *    Never stores IP addresses, browser fingerprints, or cookies.
 */
export default function VisitorTelemetry() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Rule 1: Production Domain Gating (only adilrahman.cc / www.adilrahman.cc)
    const hostname = window.location.hostname.toLowerCase();
    const isProduction = hostname === 'adilrahman.cc' || hostname === 'www.adilrahman.cc';
    if (!isProduction) return;

    const STORAGE_DATE_KEY = 'ar_visit_logged_date';
    const STORAGE_COUNTRY_KEY = 'ar_visit_logged_country';

    const getStorage = (key) => {
      try {
        return localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    };

    const setStorage = (key, val) => {
      try {
        localStorage.setItem(key, val);
      } catch (_) {}
    };

    // Rule 2: Strict 1 visit per device per day across ALL endpoints
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const lastLoggedDate = getStorage(STORAGE_DATE_KEY);

    if (lastLoggedDate === today) {
      return; // Already recorded today on this device
    }

    async function recordVisit() {
      let code = null;

      // Cloudflare edge trace (extracts ISO 2-letter country code)
      try {
        const res = await fetch('/cdn-cgi/trace', { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          const match = text.match(/loc=([A-Za-z]{2})/);
          if (match && match[1]) code = match[1].toUpperCase();
        }
      } catch (_) {}

      // Secondary edge trace fallback
      if (!code) {
        try {
          const res = await fetch('https://cloudflare.com/cdn-cgi/trace', { cache: 'no-store' });
          if (res.ok) {
            const text = await res.text();
            const match = text.match(/loc=([A-Za-z]{2})/);
            if (match && match[1]) code = match[1].toUpperCase();
          }
        } catch (_) {}
      }

      if (code && code !== 'XX') {
        // Lock today's visit on this device immediately
        setStorage(STORAGE_DATE_KEY, today);
        setStorage(STORAGE_COUNTRY_KEY, code);

        // Atomic increment in Supabase
        try {
          const { error: rpcErr } = await supabase.rpc('increment_country', { c_code: code });
          if (rpcErr) {
            // Fallback direct upsert if RPC is pending migration
            const { data: existing } = await supabase
              .from('visitor_countries')
              .select('count')
              .eq('country_code', code)
              .maybeSingle();

            const currentCount = existing ? Number(existing.count) || 0 : 0;
            await supabase.from('visitor_countries').upsert([
              { country_code: code, count: currentCount + 1, last_visited: new Date() }
            ]);
          }
        } catch (err) {
          console.warn('Visitor telemetry notice:', err);
        }
      }
    }

    recordVisit();
  }, []);

  return null;
}

