'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackView = async () => {
      // Get or create session ID using built-in crypto.randomUUID
      let sessionId = localStorage.getItem('crm_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('crm_session_id', sessionId);
      }

      try {
        // Get location info
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();

        // Insert into Supabase
        const { error } = await supabase.from('analytics_page_views').insert({
          path: pathname,
          session_id: sessionId,
          referrer: document.referrer || 'Direct',
          user_agent: navigator.userAgent,
          country: geoData.country_name || 'Unknown',
          region: geoData.region || 'Unknown',
          city: geoData.city || 'Unknown'
        });
        
        if (error) throw error;
      } catch (error: any) {
        // Fallback without geo info (in case ipapi was blocked by AdBlock or similar)
        try {
          const { error: fallbackError } = await supabase.from('analytics_page_views').insert({
            path: pathname || '/',
            session_id: sessionId,
            referrer: document.referrer || 'Direct',
            user_agent: navigator.userAgent || 'Unknown'
          });
          
          if (fallbackError) {
            // Un-comment the line below if we ever need to debug Supabase tracking directly
            // console.warn('Analytics table missing or tracking disabled:', fallbackError.message || fallbackError);
          }
        } catch (e) {
           // Silent catch to prevent dev console flooding
        }
      }
    };

    trackView();
  }, [pathname]);

  return null;
}