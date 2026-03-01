'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Simple Supabase client for analytics (anonymous)
const supabaseUrl = 'https://dhlskitfujcyxbbancad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobHNraXRmdWpjeXhiYmFuY2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MDI3MjAsImV4cCI6MjA1MjM3ODcyMH0.kWVcG8ZYzjmYhHNOMKUtBQ_y8UKdZkk';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const viewIdRef = useRef<string | null>(null);

    useEffect(() => {
        // Session ID handling
        let sessionId = localStorage.getItem('apcr_analytics_session');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem('apcr_analytics_session', sessionId);
        }

        const logPageView = async () => {
            const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

            const { data, error } = await supabase
                .from('analytics_page_views')
                .insert({
                    path: fullPath,
                    session_id: sessionId,
                    referrer: document.referrer,
                    user_agent: navigator.userAgent
                })
                .select()
                .single();

            if (!error && data) {
                viewIdRef.current = data.id;
            }
        };

        logPageView();

        // Heartbeat to measure duration
        const interval = setInterval(async () => {
            if (viewIdRef.current) {
                await supabase
                    .from('analytics_page_views')
                    .update({ view_duration: Math.floor((Date.now() - startTime) / 1000) })
                    .eq('id', viewIdRef.current);
            }
        }, 15000); // Every 15 seconds

        const startTime = Date.now();

        return () => {
            clearInterval(interval);
        };
    }, [pathname, searchParams]);

    return null;
}
