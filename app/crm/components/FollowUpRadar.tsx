'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, Clock, MessageCircle, CheckCircle, RefreshCw, 
  ArrowRight, ShieldAlert, FileText, ChevronDown, ChevronUp 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PendingFollowUp {
  id: string;
  proforma_number: string;
  created_at: string;
  date: string;
  total: number;
  comments?: string;
  status: string;
  hoursElapsed: number;
  daysElapsed: number;
  crm_users?: {
    id: string;
    company_name?: string;
    contact_name?: string;
    phone?: string;
    email?: string;
  };
}

export default function FollowUpRadar({ isDark = false }: { isDark?: boolean }) {
  const [pendingList, setPendingList] = useState<PendingFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [successActionId, setSuccessActionId] = useState<string | null>(null);

  useEffect(() => {
    loadPendingFollowUps();
  }, []);

  const loadPendingFollowUps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('proformas')
        .select('*, crm_users(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const now = new Date().getTime();
        const fortyEightHoursMs = 48 * 60 * 60 * 1000;
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

        const filtered: PendingFollowUp[] = [];

        data.forEach((p: any) => {
          // Si ya está aprobada, venta cerrada o cancelada, se ignora
          const status = (p.status || '').toLowerCase();
          if (status === 'aprobada' || status === 'venta_cerrada' || status === 'cancelada' || p.approved_at) {
            return;
          }

          const createdDate = new Date(p.created_at || p.date || Date.now()).getTime();
          const elapsed = now - createdDate;

          // Si pasaron 48 horas o más (y menos de 30 días)
          if (elapsed >= fortyEightHoursMs && elapsed <= thirtyDaysMs) {
            const hours = Math.floor(elapsed / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);
            filtered.push({
              ...p,
              hoursElapsed: hours,
              daysElapsed: days,
            });
          }
        });

        // Ordenar por las más urgentes (de 2 a 5 días)
        filtered.sort((a, b) => a.hoursElapsed - b.hoursElapsed);
        setPendingList(filtered);
      }
    } catch (e) {
      console.error('Error al cargar cotizaciones para seguimiento 48h:', e);
    }
    setLoading(false);
  };

  const sendFollowUpWhatsApp = (p: PendingFollowUp) => {
    let phone = (p.crm_users?.phone || '').replace(/[^0-9]/g, '');
    if (!phone) {
      const inputPhone = prompt("Ingresa el WhatsApp del cliente para enviar el seguimiento:");
      if (!inputPhone) return;
      phone = inputPhone.replace(/[^0-9]/g, '');
    }
    if (phone.length === 8) phone = '506' + phone;

    const clientName = p.crm_users?.contact_name || p.crm_users?.company_name || 'Estimado(a) Cliente';
    const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://crm-plus-2-1.vercel.app';
    const pdfLink = `${appOrigin}/proformas?view=${p.proforma_number || p.id}`;

    const message = `¡Hola *${clientName}*! 👋

Le saludamos de *Alfombras Personalizadas de Costa Rica* para darle un cordial seguimiento a su cotización:

📋 *Proforma Nº:* ${p.proforma_number}
💵 *Monto:* ₡${Number(p.total).toLocaleString('es-CR')}

¿Pudo revisar la propuesta? Estamos planificando los turnos de confección en taller para estos días y nos encantaría coordinar el fotomontaje y confección de su alfombra con logo. 🧵✨

📄 *Puede ver y descargar su proforma oficial aquí:*
${pdfLink}

¿Gusta que le reservemos el espacio en producción? Quedamos a su entera disposición. 🤝`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const markAsClosed = async (id: string) => {
    const { error } = await supabase
      .from('proformas')
      .update({ 
        status: 'APROBADA', 
        approved_at: new Date().toISOString(),
        production_status: 'Pendiente de Confección' 
      })
      .eq('id', id);

    if (!error) {
      setSuccessActionId(id);
      setTimeout(() => {
        setPendingList(prev => prev.filter(p => p.id !== id));
        setSuccessActionId(null);
      }, 1200);
    }
  };

  if (loading) {
    return null;
  }

  if (pendingList.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 dark:border-amber-500/20 rounded-3xl p-5 sm:p-6 shadow-xl shadow-amber-500/5 animate-in fade-in slide-in-from-top-4 duration-300">
      
      {/* Encabezado del Radar */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0 animate-pulse">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Radar de Seguimiento Automático (+48 Horas)
              </h3>
              <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                {pendingList.length} pendientes
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
              Cotizaciones emitidas hace más de 48h sin respuesta. Envía un toque amable con 1 clic para cerrar la venta.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPendingFollowUps}
            className="p-2 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl transition-colors"
            title="Refrescar radar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-background dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-xl transition-colors border border-slate-200 dark:border-zinc-700"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Lista de Cotizaciones que requieren Seguimiento */}
      {isExpanded && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingList.map((p) => {
              const isClosed = successActionId === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isClosed 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-95"
                      : "bg-background/90 dark:bg-zinc-900/90 border-amber-500/20 hover:border-amber-500/50 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-mono">
                        Proforma #{p.proforma_number}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        hace {p.daysElapsed > 0 ? `${p.daysElapsed}d ${p.hoursElapsed % 24}h` : `${p.hoursElapsed}h`}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {p.crm_users?.company_name || p.crm_users?.contact_name || 'Cliente sin Nombre'}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Total: <strong className="text-slate-800 dark:text-zinc-100 font-mono">₡{Number(p.total).toLocaleString('es-CR')}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                    <button
                      onClick={() => sendFollowUpWhatsApp(p)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                      title="Enviar mensaje de seguimiento amable por WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp (+48h)</span>
                    </button>

                    <button
                      onClick={() => markAsClosed(p.id)}
                      className="p-2 bg-indigo-600/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 rounded-xl transition-all"
                      title="Marcar como Venta Aprobada"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>

                    <a
                      href={`/crm/proformas?view=${p.proforma_number || p.id}`}
                      className="p-2 bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
                      title="Ver Proforma"
                    >
                      <FileText className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
