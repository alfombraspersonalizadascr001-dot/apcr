'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, CartesianGrid, AreaChart, Area } from 'recharts';
import { Users, Calculator, CheckCircle, Clock, Calendar, Briefcase, DollarSign, CreditCard, Banknote, Layers } from 'lucide-react';

interface AgentMetricsProps {
    isDark?: boolean;
}

export default function AgentMetrics({ isDark = false }: AgentMetricsProps) {
    const [loading, setLoading] = useState(true);
    const [loggedInAgent, setLoggedInAgent] = useState<string>("");

    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(1);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState<string>(() => {
        return new Date().toISOString().split('T')[0];
    });

    const [activeAgents, setActiveAgents] = useState<string[]>(['Rolo', 'Freelance']);

    const [allClients, setAllClients] = useState<any[]>([]);
    const [allProformas, setAllProformas] = useState<any[]>([]);
    const [allReceipts, setAllReceipts] = useState<any[]>([]);

    useEffect(() => {
        const agentNameCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("crm_agent_name="));
        if (agentNameCookie) {
            const agent = decodeURIComponent(agentNameCookie.split("=")[1]);
            setLoggedInAgent(agent);
            if (agent === "Freelance") setActiveAgents(['Freelance']);
            else setActiveAgents(['Rolo', 'Freelance']);
        }
        
        fetchRawData();
    }, []);

    // Se extrae data cruda general, calculos luego se hacen en base a las fechas seleccionadas
    const fetchRawData = async () => {
        setLoading(true);
        try {
            const [
                { data: clients },
                { data: proformas },
                { data: receipts }
            ] = await Promise.all([
                supabase.from('crm_users').select('id, created_at, assigned_to, tags').order('created_at', { ascending: false }).limit(3000),
                supabase.from('proformas').select('*').order('created_at', { ascending: false }).limit(2000),
                supabase.from('receipts').select('*').order('created_at', { ascending: false }).limit(2000)
            ]);
            
            setAllClients(clients || []);
            setAllProformas(proformas || []);
            setAllReceipts(receipts || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleAgent = (ag: string) => {
        // Enforce RBAC basically logically. Freelance solo puede verse a si mismo
        if (loggedInAgent === 'Freelance') return; 
        if (loggedInAgent === 'Taina' && ag === 'Freelance') return;

        setActiveAgents(prev => 
            prev.includes(ag) ? prev.filter(x => x !== ag) : [...prev, ag]
        );
    };

    const startD = new Date(`${startDate}T00:00:00-06:00`);
    const endD = new Date(`${endDate}T23:59:59-06:00`);

    // Procesamos Agentes
    const agentStats = useMemo(() => {
        const stats = {
            Rolo: { cerradasCount: 0, vendido: 0, cobrado: 0, saldo: 0 },
            Taina: { cerradasCount: 0, vendido: 0, cobrado: 0, saldo: 0 },
            Freelance: { cerradasCount: 0, vendido: 0, cobrado: 0, saldo: 0 }
        };

        const closedClients = allClients.filter(u => {
            const tagsStr = Array.isArray(u.tags) ? u.tags.join(' ') : String(u.tags);
            return tagsStr.toUpperCase().includes('CERRADA');
        });
        const closedIdsMap = new Map();
        closedClients.forEach(c => closedIdsMap.set(c.id, c.assigned_to));

        allProformas.forEach(p => {
            const pDate = new Date(p.created_at);
            if (pDate >= startD && pDate <= endD) {
                // Si el cliente de la proforma es Venta Cerrada
                if (closedIdsMap.has(p.user_id)) {
                    let assigned = String(closedIdsMap.get(p.user_id) || '').trim().toLowerCase();
                    const group = assigned.includes('rolo') ? 'Rolo' : assigned.includes('taina') ? 'Taina' : 'Freelance';
                    
                    const items = Array.isArray(p.items) ? p.items : [];
                    const matCount = items.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0);
                    
                    stats[group].cerradasCount += matCount;
                    stats[group].vendido += (parseFloat(p.total) || 0);
                }
            }
        });

        allReceipts.forEach(r => {
            const rDate = new Date(r.created_at);
            if (rDate >= startD && rDate <= endD) {
                let agent = String(r.agent || '').trim().toLowerCase();
                const group = agent.includes('rolo') ? 'Rolo' : agent.includes('taina') ? 'Taina' : 'Freelance';
                stats[group].cobrado += (parseFloat(r.amount) || 0);
            }
        });

        Object.keys(stats).forEach(k => {
            const key = k as 'Rolo' | 'Taina' | 'Freelance';
            stats[key].saldo = Math.max(0, stats[key].vendido - stats[key].cobrado);
        });

        return stats;
    }, [allClients, allProformas, allReceipts, startD, endD]);

    // Procesamos Linea de Tiempo para Curva de Productividad
    const timelineData = useMemo(() => {
        const dailyMap = new Map<string, any>();
        
        allClients.forEach(c => {
            const d = new Date(c.created_at);
            if (d >= startD && d <= endD) {
                const dtStr = d.toISOString().split('T')[0];
                if (!dailyMap.has(dtStr)) dailyMap.set(dtStr, { date: dtStr, Creaciones: 0, Proformas: 0, Cobros: 0 });
                dailyMap.get(dtStr).Creaciones += 1;
            }
        });
        
        allProformas.forEach(p => {
            const d = new Date(p.created_at);
            if (d >= startD && d <= endD) {
                const dtStr = d.toISOString().split('T')[0];
                if (!dailyMap.has(dtStr)) dailyMap.set(dtStr, { date: dtStr, Creaciones: 0, Proformas: 0, Cobros: 0 });
                dailyMap.get(dtStr).Proformas += 1;
            }
        });

        allReceipts.forEach(r => {
            const d = new Date(r.created_at);
            if (d >= startD && d <= endD) {
                const dtStr = d.toISOString().split('T')[0];
                if (!dailyMap.has(dtStr)) dailyMap.set(dtStr, { date: dtStr, Creaciones: 0, Proformas: 0, Cobros: 0 });
                dailyMap.get(dtStr).Cobros += 1;
            }
        });

        return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }, [allClients, allProformas, allReceipts, startD, endD]);

    const PFormatter = (num: number) => `₡${num.toLocaleString('es-CR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    if (loading) {
        return (
            <div className="bg-background dark:bg-zinc-950 rounded-2xl shadow-sm border border-zinc-800/40 mt-8 p-12 text-center text-slate-500 font-medium h-64 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin"></div>
                    Cargando rendimiento de agentes...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background dark:bg-zinc-950 rounded-3xl shadow-lg border border-zinc-800/40 overflow-hidden mt-8 mb-12">
            
            {/* Header y Controles */}
            <div className="p-6 md:p-8 bg-zinc-900/10 border-b border-zinc-800/30 flex flex-col xl:flex-row justify-between xl:items-center gap-6">
                <div>
                    <h3 className="text-xl font-black flex items-center gap-3 dark:text-white uppercase tracking-tight">
                        <Briefcase className="w-6 h-6 text-amber-500" /> Rendimiento de Agentes
                    </h3>
                    <p className="text-[10px] text-amber-600/60 font-bold mt-1 uppercase tracking-widest">
                         Analítica individualizada de Venta, Cobro y Productividad
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full xl:w-auto">
                    {/* Botones de Agentes */}
                    <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl shadow-inner w-full md:w-auto flex-wrap">
                        {['Rolo', 'Taina', 'Freelance'].map(ag => {
                            const active = activeAgents.includes(ag);
                            const canToggle = loggedInAgent === 'Rolo' || (loggedInAgent === 'Taina' && ag !== 'Freelance') || (loggedInAgent === 'Freelance' && ag === 'Freelance');
                            
                            // Colores por agente
                            let colorClasses = "hover:bg-zinc-800 text-slate-500";
                            if (active) {
                                if (ag === 'Rolo') colorClasses = "bg-amber-500 text-black shadow-md shadow-amber-500/20";
                                else if (ag === 'Taina') colorClasses = "bg-purple-500 text-white shadow-md shadow-purple-500/20";
                                else colorClasses = "bg-emerald-500 text-white shadow-md shadow-emerald-500/20";
                            }

                            return (
                                <button
                                    key={ag}
                                    onClick={() => toggleAgent(ag)}
                                    disabled={!canToggle}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex-1 min-w-[90px] ${colorClasses} ${!canToggle && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    {ag}
                                </button>
                            );
                        })}
                    </div>

                    {/* Selector de Fechas Nativo */}
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 text-right">Período de Evaluación</p>
                        <div className="flex items-center gap-2 bg-background dark:bg-zinc-900 border-2 border-amber-500/30 p-1.5 rounded-xl justify-end">
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={e => setStartDate(e.target.value)} 
                                style={{ colorScheme: 'dark' }}
                                className="calendar-icon-amber bg-transparent border-none text-xs font-black text-amber-600 dark:text-amber-500 focus:ring-0 cursor-pointer text-center py-1 outline-none" 
                            />
                            <span className="text-amber-500 font-black px-1">-</span>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={e => setEndDate(e.target.value)} 
                                style={{ colorScheme: 'dark' }}
                                className="calendar-icon-amber bg-transparent border-none text-xs font-black text-amber-600 dark:text-amber-500 focus:ring-0 cursor-pointer text-center py-1 outline-none" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix de Agentes Seleccionados */}
            <div className="p-6 md:p-8 space-y-6">
                
                {activeAgents.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                        Selecciona al menos un agente en los controles superiores.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {['Rolo', 'Taina', 'Freelance'].filter(x => activeAgents.includes(x)).map(agent => {
                            const data = agentStats[agent as 'Rolo' | 'Taina' | 'Freelance'];
                            
                            // Visual accents
                            const colorClass = agent === 'Rolo' ? 'text-amber-500 border-amber-500/30' : 
                                               agent === 'Taina' ? 'text-purple-500 border-purple-500/30' : 
                                               'text-emerald-500 border-emerald-500/30';
                            const bgAccent = agent === 'Rolo' ? 'bg-amber-500/5' : 
                                             agent === 'Taina' ? 'bg-purple-500/5' : 
                                             'bg-emerald-500/5';

                            return (
                                <div key={agent} className={`border border-zinc-800 rounded-2xl overflow-hidden ${bgAccent} hover:border-zinc-700 transition-all`}>
                                    <div className={`p-4 border-b border-zinc-800/60 bg-zinc-950`}>
                                        <h4 className={`text-sm font-black uppercase tracking-widest ${colorClass} flex items-center gap-2`}>
                                            {agent === 'Rolo' ? <CheckCircle className="w-4 h-4"/> : <Users className="w-4 h-4"/>}
                                            Métricas de {agent}
                                        </h4>
                                    </div>
                                    <div className="p-5 grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Layers className="w-3 h-3"/> Alfombras Vendidas</p>
                                            <p className="text-2xl font-black text-zinc-200">{data.cerradasCount} <span className="text-[10px] text-zinc-600">uds</span></p>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><DollarSign className="w-3 h-3"/> Ventas</p>
                                            <p className="text-xl font-black text-blue-400">{PFormatter(data.vendido)}</p>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Banknote className="w-3 h-3"/> Total Cobrado</p>
                                            <p className={`text-xl font-black ${data.cobrado > 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>{PFormatter(data.cobrado)}</p>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3"/> Saldo Pendiente</p>
                                            <p className="text-xl font-black text-rose-500">{PFormatter(data.saldo)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Chart: Curva de Productividad */}
            <div className="p-6 md:p-8 border-t border-zinc-800/40 bg-zinc-900/10">
                <div className="flex items-center gap-2 mb-6">
                    <LineChart className="w-5 h-5 text-zinc-500" />
                    <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Curva de Productividad (Línea de Tiempo)</h4>
                </div>
                
                {timelineData.length === 0 ? (
                    <div className="h-48 flex items-center justify-center border border-dashed border-zinc-800/40 rounded-xl text-slate-500 font-medium">
                        No hay actividad registrada en el lapso seleccionado.
                    </div>
                ) : (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCreat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorCob" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(39, 39, 42, 0.4)" : "#e2e8f0"} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: isDark ? '#a1a1aa' : '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                    minTickGap={20}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: isDark ? '#a1a1aa' : '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#18181b' : '#ffffff',
                                        borderRadius: '12px',
                                        border: isDark ? '1px solid #3f3f46' : 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        color: isDark ? '#f4f4f5' : '#1e293b'
                                    }}
                                    itemStyle={{ color: isDark ? '#f4f4f5' : '#1e293b', fontSize: '12px', fontWeight: 600 }}
                                    cursor={{ stroke: isDark ? '#3f3f46' : '#e2e8f0', strokeWidth: 2 }}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 800, paddingTop: '15px', color: isDark ? '#52525b' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                                
                                <Area type="monotone" dataKey="Creaciones" name="Nuevos Clientes" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorCreat)" />
                                <Area type="monotone" dataKey="Proformas" name="Cotizaciones" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
                                <Area type="monotone" dataKey="Cobros" name="Recibos Emitidos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCob)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

        </div>
    );
}

