'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, MousePointer2, Clock, Globe, BarChart3, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsView() {
    const [stats, setStats] = useState({
        totalViews: 0,
        uniqueSessions: 0,
        avgDuration: 0,
        topPages: [] as { path: string; count: number }[],
        topLocations: [] as { location: string; count: number; country: string }[],
        topRegions: [] as { region: string; count: number }[],
        recentViews: [] as any[],
        dailyStats: [] as { date: string; views: number; displayDate: string }[],
        dateRange: { start: '', end: '' }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        // 1. Get Page Views
        const { data: views, error: viewsError } = await supabase
            .from('analytics_page_views')
            .select('*')
            .order('created_at', { ascending: false });

        if (views) {
            const totalViews = views.length;
            const uniqueSessions = new Set(views.map(v => v.session_id)).size;
            const totalDuration = views.reduce((acc, v) => acc + (v.view_duration || 0), 0);
            const avgDuration = totalViews > 0 ? Math.round(totalDuration / totalViews) : 0;

            let dateRange = { start: 'Hoy', end: 'Hoy' };
            if (views.length > 0) {
                // Views are ordered descending (newest first, oldest last)
                const oldest = new Date(views[views.length - 1].created_at);
                const newest = new Date(views[0].created_at);
                
                const fmt = (d: Date) => d.toLocaleDateString('es-CR', { month: 'short', day: 'numeric' });
                dateRange = { start: fmt(oldest), end: fmt(newest) };
            }

            // Top Pages
            const pageCounts: Record<string, number> = {};
            const locationCounts: Record<string, { count: number, country: string }> = {};
            const regionCounts: Record<string, number> = {};

            views.forEach(v => {
                pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
                
                if (v.country && v.country !== 'Unknown') {
                    locationCounts[v.country] = { 
                        count: (locationCounts[v.country]?.count || 0) + 1,
                        country: v.country
                    };
                    
                    if (v.region && v.region !== 'Unknown') {
                        const regionName = `${v.region}, ${v.country}`;
                        regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
                    }
                }
            });

            const topPages = Object.entries(pageCounts)
                .map(([path, count]) => ({ path, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            const topLocations = Object.entries(locationCounts)
                .map(([_, data]) => data)
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map(d => ({ location: d.country, count: d.count, country: d.country }));

            const topRegions = Object.entries(regionCounts)
                .map(([region, count]) => ({ region, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // 15-Day Daily Stats Aggregation
            const last15Days = Array.from({ length: 15 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (14 - i));
                return d.toISOString().split('T')[0];
            });

            const dailyCounts: Record<string, number> = {};
            views.forEach(v => {
                const dateKey = new Date(v.created_at).toISOString().split('T')[0];
                if (last15Days.includes(dateKey)) {
                    dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
                }
            });

            const dailyStats = last15Days.map(date => ({
                date,
                views: dailyCounts[date] || 0,
                displayDate: new Date(date + 'T00:00:00').toLocaleDateString('es-CR', { month: 'short', day: 'numeric' })
            }));

            setStats({
                totalViews,
                uniqueSessions,
                avgDuration,
                topPages,
                topLocations,
                topRegions,
                recentViews: views.slice(0, 10),
                dailyStats,
                dateRange
            });
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                <span className="ml-3 text-slate-500">Cargando métricas...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Visitas Totales"
                    value={stats.totalViews.toLocaleString()}
                    icon={<MousePointer2 className="text-blue-500" />}
                    trend="+12%"
                    subtitle={stats.totalViews > 0 ? `${stats.dateRange.start} - ${stats.dateRange.end}` : ''}
                />
                <StatCard
                    title="Sesiones Únicas"
                    value={stats.uniqueSessions.toLocaleString()}
                    icon={<Users className="text-green-500" />}
                    trend="+5%"
                />
                <StatCard
                    title="Tiempo Promedio"
                    value={`${Math.floor(stats.avgDuration / 60)}m ${stats.avgDuration % 60}s`}
                    icon={<Clock className="text-amber-500" />}
                    trend="Estable"
                />
                <StatCard
                    title="Páginas / Sesión"
                    value={(stats.totalViews / (stats.uniqueSessions || 1)).toFixed(1)}
                    icon={<BarChart3 className="text-purple-500" />}
                    trend="+0.2"
                />
            </div>
            
            {/* 15 Day Traffic Chart */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                            <BarChart3 className="w-5 h-5 text-amber-500" />
                            Tendencia de Tráfico (Últimos 15 días)
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 uppercase tracking-widest font-bold">Resumen de visitas diarias</p>
                    </div>
                </div>
                
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.dailyStats}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.1} />
                            <XAxis 
                                dataKey="displayDate" 
                                fontSize={10} 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#71717a' }}
                            />
                            <YAxis 
                                fontSize={10} 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#71717a' }} 
                            />
                            <RechartsTooltip 
                                contentStyle={{ 
                                    backgroundColor: '#18181b', 
                                    border: 'none', 
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    color: '#fff'
                                }}
                                cursor={{ fill: 'rgba(217, 119, 6, 0.05)' }}
                            />
                            <Bar 
                                dataKey="views" 
                                radius={[6, 6, 0, 0]} 
                                barSize={25}
                            >
                                {stats.dailyStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === stats.dailyStats.length - 1 ? '#f59e0b' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Popular Pages */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        Páginas Populares
                    </h3>
                    <div className="space-y-4">
                        {stats.topPages.map((page, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm font-medium truncate max-w-[200px] dark:text-zinc-200">{page.path === '/' ? '/ (Inicio)' : page.path}</span>
                                <span className="bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-zinc-400">
                                    {page.count} views
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                        <Globe className="w-5 h-5 text-blue-500" />
                        Tráfico Internacional
                    </h3>
                    <div className="space-y-4">
                        {stats.topLocations.length === 0 ? (
                            <p className="text-sm text-slate-400 dark:text-zinc-500">No hay datos de ubicación suficientes.</p>
                        ) : stats.topLocations.map((loc, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">{loc.location}</span>
                                </div>
                                <span className="bg-blue-50 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-black text-blue-600 dark:text-blue-400">
                                    {loc.count} <span className="text-[10px] font-medium text-slate-400 ml-1">vistas</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Regions (State/Province) */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                        <Users className="w-5 h-5 text-green-500" />
                        Regiones Principales
                    </h3>
                    <div className="space-y-4">
                        {stats.topRegions.length === 0 ? (
                            <p className="text-sm text-slate-400 dark:text-zinc-500">Recopilando datos geolocalizados locales...</p>
                        ) : stats.topRegions.map((loc, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <span className="text-sm font-bold text-slate-700 dark:text-zinc-200 truncate pr-2" title={loc.region}>{loc.region}</span>
                                <span className="bg-green-50 dark:bg-zinc-800 px-2.5 py-1 rounded-md text-xs font-black text-green-600 dark:text-green-400">
                                    {loc.count} <span className="text-[10px] font-medium text-slate-400 ml-1">vistas</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                        <Calendar className="w-5 h-5 text-amber-500" />
                        Actividad Reciente
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-slate-500 dark:text-zinc-400 border-b dark:border-zinc-800">
                                    <th className="pb-3 font-medium">Fecha/Hora</th>
                                    <th className="pb-3 font-medium">Página</th>
                                    <th className="pb-3 font-medium">Ubicación</th>
                                    <th className="pb-3 font-medium">Referer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-zinc-800">
                                {stats.recentViews.map((view, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="py-3 text-slate-400 dark:text-zinc-500">{new Date(view.created_at).toLocaleString()}</td>
                                        <td className="py-3 font-medium dark:text-zinc-200">{view.path}</td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg">
                                                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 dark:text-zinc-200">{view.country || 'Unknown'}</span>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 leading-none">{view.region || 'Unknown'}, {view.city || 'Unknown'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-slate-400 dark:text-zinc-500 truncate max-w-[150px]">{view.referrer || 'Directo'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, subtitle }: { title: string, value: string, icon: React.ReactNode, trend: string, subtitle?: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                    {icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                    {trend}
                </span>
            </div>
            <h4 className="text-slate-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">{title}</h4>
            <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-black dark:text-white leading-none">{value}</p>
                {subtitle && <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-zinc-500 mb-0.5 tracking-wide">{subtitle}</span>}
            </div>
        </div>
    );
}
