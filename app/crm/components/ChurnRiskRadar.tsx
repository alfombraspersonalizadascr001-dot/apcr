'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Clock, MessageCircle, RefreshCw, 
  Users, ChevronDown, ChevronUp, Tag, ShieldAlert, Sparkles, Building
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AtRiskClient {
  id: string;
  account_number: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email?: string;
  created_at: string;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  totalSpent: number;
  ordersCount: number;
  tags?: string[];
}

export default function ChurnRiskRadar({ isDark = false }: { isDark?: boolean }) {
  const [atRiskList, setAtRiskList] = useState<AtRiskClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAtRiskClients();
  }, []);

  const loadAtRiskClients = async () => {
    setLoading(true);
    try {
      // 1. Cargar clientes
      const { data: clientsData, error: clientsErr } = await supabase
        .from('crm_users')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      // 2. Cargar proformas históricas
      const { data: proformasData, error: profErr } = await supabase
        .from('proformas')
        .select('id, user_id, total, created_at, date, status, approved_at');

      if (!clientsErr && clientsData) {
        const now = Date.now();
        const oneYearMs = 365 * 24 * 60 * 60 * 1000;

        // Mapear proformas por user_id
        const userProformasMap: Record<string, any[]> = {};
        (proformasData || []).forEach(p => {
          if (p.user_id) {
            if (!userProformasMap[p.user_id]) userProformasMap[p.user_id] = [];
            userProformasMap[p.user_id].push(p);
          }
        });

        const atRisk: AtRiskClient[] = [];

        clientsData.forEach(client => {
          const userProfs = userProformasMap[client.id] || [];
          
          let latestDateMs = new Date(client.created_at || Date.now()).getTime();
          let totalSpent = 0;

          userProfs.forEach(p => {
            totalSpent += Number(p.total || 0);
            const pDateMs = new Date(p.created_at || p.date || client.created_at).getTime();
            if (pDateMs > latestDateMs) {
              latestDateMs = pDateMs;
            }
          });

          const elapsedMs = now - latestDateMs;

          // Si pasaron más de 365 días (1 año) sin nueva cotización/compra
          if (elapsedMs >= oneYearMs) {
            const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
            atRisk.push({
              id: client.id,
              account_number: client.account_number,
              company_name: client.company_name || 'Sin Empresa',
              contact_name: client.contact_name || '',
              phone: client.phone || '',
              email: client.email || '',
              created_at: client.created_at,
              lastOrderDate: new Date(latestDateMs).toLocaleDateString('es-CR'),
              daysSinceLastOrder: days,
              totalSpent,
              ordersCount: userProfs.length,
              tags: client.tags || []
            });
          }
        });

        // Ordenar por clientes con mayor valor histórico primero
        atRisk.sort((a, b) => b.totalSpent - a.totalSpent);
        setAtRiskList(atRisk);
      }
    } catch (e) {
      console.error('Error al calcular clientes en riesgo de abandono:', e);
    }
    setLoading(false);
  };

  const sendReactivationWhatsApp = (client: AtRiskClient) => {
    let phone = (client.phone || '').replace(/[^0-9]/g, '');
    if (!phone) {
      const inputPhone = prompt("Por favor ingresa el número de WhatsApp del cliente:");
      if (!inputPhone) return;
      phone = inputPhone.replace(/[^0-9]/g, '');
    }
    if (phone.length === 8) phone = '506' + phone;

    const name = client.company_name || client.contact_name || 'Estimado(a) Cliente';
    const yearsText = Math.floor(client.daysSinceLastOrder / 365);
    const monthsText = Math.floor((client.daysSinceLastOrder % 365) / 30);
    const timePhrase = yearsText > 1 ? `más de ${yearsText} años` : monthsText > 0 ? `más de 1 año y ${monthsText} meses` : `más de 1 año`;

    const message = `¡Hola *${name}*! 👋🇨🇷

Le saludamos cordialmente de *Alfombras Personalizadas de Costa Rica*.

Revisando nuestro registro histórico, vemos que ya se cumplió *${timePhrase}* desde que confeccionamos su alfombra de entrada con logo. 🧵✨

Las alfombras de alto tránsito acumulan desgaste natural por el paso constante de visitas y tráfico diario. Como parte de nuestro programa de *Fidelidad Comercial*, este mes queremos ofrecerle un **15% de descuento especial de cliente frecuente** en la renovación o confección de nuevas alfombras para su negocio.

¿Le gustaría que le preparemos un fotomontaje actualizado con su logo o una propuesta formal sin compromiso? Quedamos a sus órdenes. 🤝`;

    setContactedIds(prev => new Set(prev).add(client.id));
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return null;
  }

  if (atRiskList.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent border border-red-500/30 dark:border-red-500/20 rounded-3xl p-5 sm:p-6 shadow-xl shadow-red-500/5 animate-in fade-in slide-in-from-top-4 duration-300">
      
      {/* Encabezado */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0 animate-bounce">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Radar de Retención: Clientes en Riesgo de Abandono (+1 Año)
              </h3>
              <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                {atRiskList.length} clientes
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
              Clientes que compraron hace más de 12 meses y requieren renovación de alfombras con logo. Reactívalos con 1 clic.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAtRiskClients}
            className="p-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl transition-colors"
            title="Refrescar lista de riesgo"
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

      {/* Lista de Clientes en Riesgo */}
      {isExpanded && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {atRiskList.slice(0, 12).map((client) => {
              const isContacted = contactedIds.has(client.id);
              const years = Math.floor(client.daysSinceLastOrder / 365);
              const months = Math.floor((client.daysSinceLastOrder % 365) / 30);

              return (
                <div
                  key={client.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isContacted 
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : "bg-background/90 dark:bg-zinc-900/90 border-red-500/20 hover:border-red-500/50 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono">
                        #{client.account_number}
                      </span>
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-red-500" />
                        hace {years > 0 ? `${years}a ${months}m` : `${months} meses`}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {client.company_name || client.contact_name}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      <span>Último pedido: <strong className="text-slate-700 dark:text-zinc-300">{client.lastOrderDate}</strong></span>
                      {client.totalSpent > 0 && (
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ₡{client.totalSpent.toLocaleString('es-CR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center gap-2">
                    <button
                      onClick={() => sendReactivationWhatsApp(client)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 transition-all hover:scale-105"
                      title="Enviar mensaje de renovación de alfombra con descuento"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isContacted ? "Reactivar de Nuevo" : "Reactivar WhatsApp (-15%)"}</span>
                    </button>

                    <a
                      href={`/crm/admin?search=${encodeURIComponent(client.account_number || client.company_name)}`}
                      className="p-2 bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
                      title="Ver Perfil del Cliente"
                    >
                      <Building className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {atRiskList.length > 12 && (
            <div className="text-center pt-2">
              <a 
                href="/crm/admin" 
                className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>Ver los {atRiskList.length} clientes en riesgo de abandono en Clientes y Cuentas</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
