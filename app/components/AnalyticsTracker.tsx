'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Detect if current visitor is the owner / admin
    let isOwner = false;
    try {
      if (window.location.search.includes('owner=true')) {
        localStorage.setItem('apcr_is_owner', 'true');
        isOwner = true;
      } else if (localStorage.getItem('apcr_is_owner') === 'true') {
        isOwner = true;
      } else if (localStorage.getItem('apcr_user')?.includes('"admin"')) {
        localStorage.setItem('apcr_is_owner', 'true');
        isOwner = true;
      } else if (pathname?.startsWith('/admin') || pathname?.startsWith('/crm') || pathname === '/login') {
        localStorage.setItem('apcr_is_owner', 'true');
        isOwner = true;
      } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        isOwner = true;
      }
    } catch {
      // Ignore storage access errors
    }

    // Get or create session ID
    let sessionId = '';
    try {
      sessionId = localStorage.getItem('apcr_analytics_session') || '';
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('apcr_analytics_session', sessionId);
      }
    } catch {
      sessionId = 'anon_' + Math.random().toString(36).substring(2, 10);
    }

    // Tag admin sessions explicitly
    const finalSessionId = isOwner && !sessionId.startsWith('admin_') 
      ? `admin_${sessionId}` 
      : sessionId;

    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    const trackPageView = async () => {
      let geoData: any = {};
      try {
        const geoRes = await fetch('https://ipapi.co/json/', { cache: 'force-cache' });
        if (geoRes.ok) {
          geoData = await geoRes.json();
        }
      } catch {
        // Fallback gracefully
      }

      const referrerText = isOwner 
        ? 'Admin (Owner)' 
        : (document.referrer || 'Direct');

      try {
        await supabase.from('analytics_page_views').insert({
          path: fullPath || '/',
          session_id: finalSessionId,
          referrer: referrerText,
          user_agent: navigator.userAgent,
          country: geoData.country_name || (isOwner ? 'Costa Rica (Owner)' : 'Unknown'),
          region: geoData.region || 'Unknown',
          city: geoData.city || 'Unknown'
        });
      } catch {
        // Silent catch to prevent dev console flooding
      }
    };

    trackPageView();
  }, [pathname, searchParams]);

  return null;
}
