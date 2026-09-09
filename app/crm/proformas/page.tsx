'use client';

import React, { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { supabase } from '@/lib/supabase';
import { 
  FileText, Search, Printer, Pencil, Trash2, X, Eye, 
  ArrowLeft, Download, RefreshCw, Calendar, DollarSign, User, Briefcase, MessageCircle, ExternalLink, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

const PRODUCTION_STATUSES = [
  "IMPRESION DE STANCIL",
  "CORTE DE LOGO",
  "CORTE DE LOGOS",
  "CORTE DE ALFOMBRA DE FONDO",
  "ARMADO DE ALFOMBRA",
  "PEGADO DE LONA DE RESPALDO",
  "INSTALACIÓN DE BORDE DE HULE",
  "ENVÍO REALIZADO"
];

interface ProductItem {
  id: string;
  productCode: string;
  productName: string;
  width: number;
  height: number;
  quantity: number;
  description: string;
  unitPrice: number;
  total: number;
  hasRubberBorder: boolean;
  backgroundColor: string;
}

interface ClientData {
  id: string;
  account_number?: string;
  company_name: string;
  contact_name: string;
  cedula: string;
  phone: string;
  email: string;
  province: string;
  canton: string;
  district: string;
  neighborhood: string;
  activity_code: string;
  tags?: string[];
}

const AVAILABLE_TAGS = [
  { id: "cotizado", label: "Cotizado", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "urgente", label: "Urgente", color: "bg-red-500 text-white border-red-600" },
  { id: "venta_cerrada", label: "Venta cerrada", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "muerto", label: "Cliente Muerto", color: "bg-slate-200 text-slate-700 border-slate-300" },
  { id: "no_contesta", label: "No contesta", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { id: "entregado_ss", label: "Entregado súper seco", color: "bg-green-500 text-white border-green-600" },
  { id: "garantia", label: "Garantía", color: "bg-orange-500 text-white border-orange-600" },
  { id: "cotizado_ss", label: "Cotizado súper seco", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { id: "cliente_hp", label: "Cliente Conflictivo / Bloqueado", color: "bg-red-100 text-red-700 border-red-200" },
  { id: "proveedor", label: "Proveedor", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { id: "envio_ss_pendiente", label: "Súper seco envío pendiente", color: "bg-sky-500 text-white border-sky-600" },
  { id: "pendiente_pago", label: "Pendiente pago", color: "bg-lime-100 text-lime-700 border-lime-200" },
  { id: "rh", label: "Recursos humanos", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "entregado_am", label: "Entregado atrapamugre", color: "bg-green-100 text-green-700 border-green-200" }
];

interface Proforma {
  id: string;
  proforma_number: string;
  date: string;
  subtotal: number;
  iva: number;
  total: number;
  comments: string;
  items: ProductItem[];
  crm_users: ClientData | null;
  created_at: string;
  status?: string;
  approved_at?: string;
  production_status?: string;
  production_history?: any[];
  delivery_time_days?: number;
}

function numeroALetras(num: number): string {
  if (!num || isNaN(num)) return 'CERO COLONES';
  const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });
  return `SON: ${formatter.format(num).replace('CRC', '').trim()} COLONES EXACTOS`;
}

export default function ProformasPage() {
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [selectedProforma, setSelectedProforma] = useState<Proforma | null>(null);

  const emisor = {
    name: "YULIAN MARIA SANDOVAL JIMENEZ",
    businessName: "ALFOMBRAS PERSONALIZADAS DE COSTA RICA",
    id: "2-0643-0221",
    activity: "1393.0",
    email: "ventas@apcr.online",
    phone: "6063-8062"
  };

  useEffect(() => {
    fetchProformas();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && proformas.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') || params.get('id');
      if (viewParam) {
        const found = proformas.find(p => p.id === viewParam || p.proforma_number === viewParam);
        if (found) {
          setSelectedProforma(found);
        }
      }
    }
  }, [proformas]);

  const fetchProformas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proformas')
      .select('*, crm_users(*)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProformas(data as any);
    } else if (error) {
      console.error("Error al obtener proformas:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar abrir el modal
    if (confirm("¿Está seguro de que desea eliminar esta cotización de forma permanente?")) {
      const { error } = await supabase.from('proformas').delete().eq('id', id);
      if (!error) {
        setProformas(proformas.filter(p => p.id !== id));
        if (selectedProforma?.id === id) {
          setSelectedProforma(null);
        }
      } else {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  const sendWhatsAppForProforma = (proforma: Proforma, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let phone = (proforma.crm_users?.phone || '').replace(/[^0-9]/g, '');
    if (!phone) {
      const inputPhone = prompt("Por favor ingresa el número de WhatsApp del cliente (ej: 88888888):");
      if (!inputPhone) return;
      phone = inputPhone.replace(/[^0-9]/g, '');
    }

    if (phone.length === 8) {
      phone = '506' + phone;
    }

    const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://crm-plus-2-1.vercel.app';
    const pdfLink = `${appOrigin}/proformas?view=${proforma.proforma_number || proforma.id}`;

    const clientName = proforma.crm_users?.contact_name || proforma.crm_users?.company_name || 'Estimado(a) Cliente';
    const itemsText = (proforma.items || []).map((item, index) => 
      `• *Ítem ${index + 1}:* ${item.quantity}x ${item.description || item.productName} (${item.width}x${item.height}cm) - ₡${item.total?.toLocaleString()}`
    ).join('\n');

    const message = `¡Hola *${clientName}*! 👋

Le compartimos el detalle de su cotización de *Alfombras Personalizadas CR*:

📋 *Proforma Nº:* ${proforma.proforma_number}
📅 *Fecha:* ${proforma.date || new Date(proforma.created_at).toLocaleDateString('es-CR')}
⏳ *Tiempo de entrega:* ${proforma.delivery_time_days || 12} días hábiles

📦 *Detalle de Productos:*
${itemsText || '• Confección de alfombra personalizada con logo'}

💰 *Subtotal:* ₡${(proforma.subtotal || 0).toLocaleString()}
📊 *IVA (13%):* ₡${(proforma.iva || 0).toLocaleString()}
💵 *TOTAL:* ₡${(proforma.total || 0).toLocaleString()}

✨ *Condiciones de Venta:*
${proforma.comments || '✓ 50% de adelanto para confección y 50% contra entrega.\n✓ Garantía de 2 años contra defectos de fábrica.\n✓ Entrega gratuita en GAM, Guanacaste y Limón.'}

📄 *Ver y Descargar Documento Oficial (PDF):*
${pdfLink}

📱 *Seguimiento de Producción:* Puede consultar el avance de su pedido en tiempo real desde nuestra app móvil o portal web con su cuenta.

¿Gusta que procedamos con la confección y diseño preliminar? Quedamos a sus órdenes. 🤝`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const toggleTag = async (proformaId: string, clientId: string, tagId: string) => {
    const proforma = proformas.find(p => p.id === proformaId);
    if (!proforma || !proforma.crm_users) return;

    const currentTags = Array.isArray(proforma.crm_users.tags) ? proforma.crm_users.tags : [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(t => t !== tagId)
      : [...currentTags, tagId];

    const { error } = await supabase
      .from('crm_users')
      .update({ tags: newTags, updated_at: new Date().toISOString() })
      .eq('id', clientId);

    if (!error) {
      setProformas(prev => prev.map(p => 
        p.crm_users?.id === clientId 
          ? { ...p, crm_users: { ...p.crm_users, tags: newTags } } 
          : p
      ));
    } else {
      alert("Error al actualizar etiqueta: " + error.message);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    if (selectedProforma) {
      document.title = `PROFORMA ${selectedProforma.proforma_number}`;
    }
    window.print();
    document.title = originalTitle;
  };

  const fmt = (amount: number) =>
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 2 }).format(amount);

  // Proformas que requieren seguimiento (+48h)
  const nowMs = Date.now();
  const fortyEightHoursMs = 48 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  const followUp48Proformas = proformas.filter(p => {
    const status = (p.status || '').toLowerCase();
    if (status === 'aprobada' || status === 'venta_cerrada' || status === 'cancelada' || p.approved_at) return false;
    const createdDate = new Date(p.created_at || p.date || Date.now()).getTime();
    const elapsed = nowMs - createdDate;
    return elapsed >= fortyEightHoursMs && elapsed <= thirtyDaysMs;
  });

  // Filtrado reactivo en cliente (nombre, cédula, teléfono, empresa), cotización (número, fecha, total, comentarios) o ítems
  const filteredProformas = proformas.filter(proforma => {
    // 1. Filtro por Seguimiento 48h o Etiquetas de Cliente
    if (activeTag === 'followup48') {
      const status = (proforma.status || '').toLowerCase();
      if (status === 'aprobada' || status === 'venta_cerrada' || status === 'cancelada' || proforma.approved_at) return false;
      const createdDate = new Date(proforma.created_at || proforma.date || Date.now()).getTime();
      const elapsed = nowMs - createdDate;
      if (!(elapsed >= fortyEightHoursMs && elapsed <= thirtyDaysMs)) return false;
    } else {
      const clientTags = proforma.crm_users?.tags || [];
      const matchesTag = activeTag === 'all' 
        ? true 
        : activeTag === 'none'
          ? (!proforma.crm_users || clientTags.length === 0)
          : clientTags.includes(activeTag);

      if (!matchesTag) return false;
    }

    // 2. Filtro por caja de búsqueda
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const numMatch = proforma.proforma_number?.toLowerCase().includes(query);
    const dateMatch = proforma.date?.toLowerCase().includes(query);
    const totalMatch = proforma.total?.toString().includes(query);
    const commentsMatch = proforma.comments?.toLowerCase().includes(query);

    const client = proforma.crm_users;
    const clientNameMatch = client?.company_name?.toLowerCase().includes(query) || 
                            client?.contact_name?.toLowerCase().includes(query);
    const clientCedulaMatch = client?.cedula?.toLowerCase().includes(query);
    const clientPhoneMatch = client?.phone?.toLowerCase().includes(query);
    const clientEmailMatch = client?.email?.toLowerCase().includes(query);

    const itemsMatch = proforma.items?.some(item => 
      item.productName?.toLowerCase().includes(query) || 
      item.description?.toLowerCase().includes(query) ||
      item.productCode?.toLowerCase().includes(query)
    );

    return numMatch || dateMatch || totalMatch || commentsMatch || 
           clientNameMatch || clientCedulaMatch || clientPhoneMatch || clientEmailMatch || 
           itemsMatch;
  });

  return (
    <SidebarLayout title="Historial de Cotizaciones" badge="BÚSQUEDA" badgeColor="amber" activeModule="proformas">
      <div className="flex flex-col gap-6">
        
        {/* BUSCADOR Y ACCIONES (Se ocultan al imprimir) */}
        <div className="flex flex-col bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm gap-4 print:hidden">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
            <div className="relative w-full md:w-96">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500">
                <Search className="w-5 h-5" />
              </span>
              <input 
                type="text" 
                placeholder="Buscar por cotización, cédula, nombre, teléfono, fecha..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <button 
                onClick={fetchProformas} 
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-slate-600 dark:text-zinc-300 transition-all"
                title="Refrescar Listado"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <Link 
                href="/crm/cotizador"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                Nueva Cotización
              </Link>
            </div>
          </div>

          {/* FILTRO DE ETIQUETAS Y SEGUIMIENTO 48H */}
          <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-4">
            <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>Filtros rápidos y etiquetas:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
              <button
                onClick={() => setActiveTag('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  activeTag === 'all'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm scale-105'
                    : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-850 hover:bg-slate-100'
                }`}
              >
                Todas ({proformas.length})
              </button>

              {followUp48Proformas.length > 0 && (
                <button
                  onClick={() => setActiveTag(activeTag === 'followup48' ? 'all' : 'followup48')}
                  className={`px-3 py-1 rounded-full text-xs font-black transition-all border flex items-center gap-1.5 ${
                    activeTag === 'followup48'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105 animate-pulse'
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <span>🔥 Requieren Seguimiento (+48h)</span>
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                    {followUp48Proformas.length}
                  </span>
                </button>
              )}

              <button
                onClick={() => setActiveTag('none')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  activeTag === 'none'
                    ? 'bg-slate-800 text-white border-slate-900 shadow-sm scale-105'
                    : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-850 hover:bg-slate-100'
                }`}
              >
                Sin etiqueta ({proformas.filter(p => !p.crm_users?.tags || p.crm_users.tags.length === 0).length})
              </button>
              {AVAILABLE_TAGS.map(t => {
                const count = proformas.filter(p => p.crm_users?.tags?.includes(t.id)).length;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTag(t.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                      activeTag === t.id
                        ? `${t.color.split(' ')[0]} ${t.color.split(' ')[1]} ring-2 ring-offset-2 ring-blue-500/50 scale-105`
                        : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-850 hover:bg-slate-100'
                    }`}
                  >
                    {t.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TABLA DE PROFORMAS (Se oculta al imprimir cuando el modal está abierto) */}
        <div className={`bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden print:hidden ${selectedProforma ? 'hidden' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4">Nº Proforma</th>
                  <th className="p-4">Cliente / Empresa</th>
                  <th className="p-4">Etiqueta</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Detalle</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Producción</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-zinc-500 italic">Cargando cotizaciones...</td>
                  </tr>
                ) : filteredProformas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-zinc-500 italic">No se encontraron cotizaciones con ese criterio.</td>
                  </tr>
                ) : (
                  filteredProformas.map(proforma => (
                    <tr 
                      key={proforma.id} 
                      onClick={() => setSelectedProforma(proforma)}
                      className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-mono font-bold text-amber-600">
                        <div className="flex items-center gap-1.5">
                          <span>{proforma.proforma_number}</span>
                          {Array.isArray(proforma.production_history) && proforma.production_history.some((h: any) => h.type === 'AUDIT_LOG') && (
                            <span 
                              className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/30 uppercase tracking-tighter"
                              title="Esta cotización fue modificada con registro de auditoría"
                            >
                              Editada
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        {proforma.crm_users?.id ? (
                          <Link 
                            href={`/crm/admin?client=${proforma.crm_users.id}&search=${encodeURIComponent(proforma.crm_users.account_number || proforma.crm_users.company_name || '')}`}
                            className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline group"
                            title="Ir al expediente / cuenta del cliente en el CRM"
                          >
                            <span>{proforma.crm_users.company_name || proforma.crm_users.contact_name || 'Cliente sin Nombre'}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ) : (
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            {proforma.crm_users?.company_name || proforma.crm_users?.contact_name || 'Cliente sin Nombre'}
                          </div>
                        )}
                        <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">
                          {proforma.crm_users?.cedula || 'Sin Cédula'} • Tel: {proforma.crm_users?.phone || '-'}
                        </div>
                      </td>
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col gap-1.5 w-32">
                          <div className="flex flex-wrap gap-1">
                            {proforma.crm_users?.tags?.map(tagId => {
                              const tag = AVAILABLE_TAGS.find(t => t.id === tagId);
                              if (!tag) return null;
                              return (
                                <span
                                  key={tagId}
                                  onClick={() => toggleTag(proforma.id, proforma.crm_users!.id, tagId)}
                                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase cursor-pointer hover:opacity-75 transition-all border ${tag.color}`}
                                  title="Clic para quitar etiqueta"
                                >
                                  {tag.label}
                                </span>
                              );
                            })}
                          </div>
                          {proforma.crm_users && (
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  toggleTag(proforma.id, proforma.crm_users!.id, e.target.value);
                                  e.target.value = "";
                                }
                              }}
                              className="text-[9px] font-bold bg-transparent border-none outline-none text-slate-400 hover:text-amber-500 cursor-pointer transition-colors max-w-[100px]"
                              defaultValue=""
                            >
                              <option value="" disabled>+ Agregar</option>
                              {AVAILABLE_TAGS.filter(t => !(proforma.crm_users?.tags || []).includes(t.id)).map(tag => (
                                <option key={tag.id} value={tag.id} className="dark:bg-zinc-900">{tag.label}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-zinc-400">{proforma.date}</td>
                      <td className="p-4 text-xs text-slate-500 dark:text-zinc-400 max-w-xs truncate">
                        {proforma.items?.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{fmt(proforma.total)}</td>
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <select
                          value={proforma.production_status || "COTIZACION"}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            
                            // Log to history
                            const currentHistory = proforma.production_history || [];
                            const exists = currentHistory.some((h: any) => h.status === newStatus);
                            let updatedHistory = [...currentHistory];
                            if (!exists) {
                              updatedHistory.push({
                                status: newStatus,
                                completed_at: new Date().toISOString()
                              });
                            }

                            const { error } = await supabase
                              .from('proformas')
                              .update({ 
                                production_status: newStatus,
                                production_history: updatedHistory,
                                updated_at: new Date().toISOString()
                              })
                              .eq('id', proforma.id);
                            if (!error) {
                              setProformas(prev => prev.map(p => p.id === proforma.id ? { ...p, production_status: newStatus, production_history: updatedHistory } : p));
                            } else {
                              alert("Error al actualizar estado de producción: " + error.message);
                            }
                          }}
                          className="text-xs font-bold border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg px-2.5 py-1.5 outline-none text-slate-800 dark:text-zinc-200 cursor-pointer shadow-xs max-w-[200px]"
                        >
                          <optgroup label="🟡 Cotización">
                            <option value="COTIZACION">🟡 Cotización (Sin Iniciar)</option>
                          </optgroup>
                          <optgroup label="🟢 Venta / Finanzas">
                            <option value="ABONO_50">🟢 Abonado 50% / Confirmado</option>
                          </optgroup>
                          <optgroup label="🎨 Pre-Taller / Diseño">
                            <option value="IMPRESION DE STANCIL">🎨 Impresión de Stencil</option>
                          </optgroup>
                          <optgroup label="🧵 Confección en Taller (6 Pasos)">
                            <option value="CORTE DE LOGO">1. ✂️ Corte de Logo</option>
                            <option value="CORTE DE LOGOS">2. 🎨 Corte de Logos Extra</option>
                            <option value="CORTE DE ALFOMBRA DE FONDO">3. 📐 Corte Alfombra Fondo</option>
                            <option value="ARMADO DE ALFOMBRA">4. 🧩 Armado e Incrustación</option>
                            <option value="PEGADO DE LONA DE RESPALDO">5. 🧱 Pegado Lona Respaldo</option>
                            <option value="INSTALACIÓN DE BORDE DE HULE">6. ⬛ Instalación Borde Hule</option>
                          </optgroup>
                          <optgroup label="🚚 Despacho y Entrega">
                            <option value="ENVÍO REALIZADO">🚚 Envío Realizado / Despacho</option>
                            <option value="ENTREGADO">🏁 Entregado y Cancelado 100%</option>
                          </optgroup>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={(e) => sendWhatsAppForProforma(proforma, e)}
                            className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                            title="Enviar por WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedProforma(proforma)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Ver Detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedProforma(proforma);
                              setTimeout(() => {
                                window.print();
                              }, 150);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            title="Imprimir Proforma"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <Link 
                            href={`/crm/cotizador?edit=${proforma.id}`}
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg transition-colors inline-block"
                            title="Editar en Cotizador"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={(e) => handleDelete(proforma.id, e)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar Proforma"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL DE DETALLE Y VISTA DE IMPRESIÓN */}
        {selectedProforma && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-4 print:p-0 print:static print:bg-transparent print:backdrop-blur-none">
            
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl w-full max-w-4xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:my-0 print:rounded-none">
              
              {/* Encabezado del Modal (Oculto al imprimir) */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-100">Proforma N° {selectedProforma.proforma_number}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => sendWhatsAppForProforma(selectedProforma)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105"
                    title="Enviar proforma al WhatsApp del cliente"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar WhatsApp
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir Proforma
                  </button>
                  <Link 
                    href={`/crm/cotizador?edit=${selectedProforma.id}`}
                    className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Link>
                  <button 
                    onClick={() => setSelectedProforma(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* CONTENIDO IMPRIMIBLE DE LA HOJA A4 (Fuerza fondo blanco y texto oscuro al imprimir) */}
              <div className="p-12 print:p-0 bg-slate-50 dark:bg-zinc-950 flex justify-center print:bg-white">
                <div className="w-[210mm] bg-white p-12 text-slate-900 border border-slate-200 shadow-md print:border-none print:shadow-none print:p-4 text-[11px] leading-tight font-sans">
                  
                  {/* Header Factura */}
                  <header className="flex justify-between items-start mb-8">
                    <div className="w-1/3">
                      <img src="/logo.png" alt="APCR Logo" className="w-48 h-auto object-contain mb-4" />
                    </div>
                    <div className="w-1/2 text-right space-y-1">
                      <h2 className="text-lg font-bold uppercase">{emisor.name}</h2>
                      <p className="font-bold text-slate-500 italic mb-4 text-xs">{emisor.businessName}</p>
                      <div className="grid grid-cols-[1fr_2fr] gap-x-2 text-[10px]">
                        <span className="font-bold">Cédula Física:</span><span>{emisor.id}</span>
                        <span className="font-bold">Actividad:</span><span>{emisor.activity}</span>
                        <span className="font-bold">Correo:</span><span className="lowercase">{emisor.email}</span>
                        <span className="font-bold">Teléfono:</span><span>{emisor.phone}</span>
                      </div>
                    </div>
                  </header>

                  {/* Meta Info */}
                  <div className="bg-slate-50 border-y border-slate-200 py-3 px-6 mb-6 text-[10px]">
                    <div className="grid grid-cols-2">
                      <div>
                        <p><span className="font-bold">Proforma Nº:</span> <span className="ml-2 font-mono font-bold text-amber-600">{selectedProforma.proforma_number}</span></p>
                        <p className="mt-1"><span className="font-bold">Fecha:</span> <span className="ml-2">{selectedProforma.date}</span></p>
                        <p className="mt-1"><span className="font-bold">Tiempo de Entrega:</span> <span className="ml-2">{selectedProforma.delivery_time_days || 12} días naturales</span></p>
                      </div>
                      <div className="text-right">
                        <p><span className="font-bold">Estado:</span> <span className="ml-2 font-bold">COTIZACIÓN</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="mb-8 pb-4 border-b border-slate-100">
                    <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 items-center">
                      <span className="font-bold uppercase text-slate-400 text-[9px]">Cliente</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm uppercase">{selectedProforma.crm_users?.company_name || selectedProforma.crm_users?.contact_name || 'Cliente sin Nombre'}</span>
                        {selectedProforma.crm_users?.id && (
                          <Link 
                            href={`/crm/admin?client=${selectedProforma.crm_users.id}&search=${encodeURIComponent(selectedProforma.crm_users.account_number || selectedProforma.crm_users.company_name || '')}`}
                            target="_blank"
                            className="no-print inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-900 transition-colors shadow-xs"
                            title="Abrir expediente completo y cuenta en el CRM"
                          >
                            <span>Ver Cuenta CRM</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      <span className="font-bold uppercase text-slate-400 text-[9px]">Cédula</span>
                      <span>{selectedProforma.crm_users?.cedula || '-'}</span>
                      <span className="font-bold uppercase text-slate-400 text-[9px]">Teléfono</span>
                      <span>{selectedProforma.crm_users?.phone || '-'}</span>
                    </div>
                  </div>

                  {/* Tabla de Items */}
                  <table className="w-full text-[10px] mb-8 border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white uppercase text-[9px] tracking-widest">
                        <th className="py-2.5 px-3 text-left w-24">Código</th>
                        <th className="py-2.5 px-3 text-center w-12">Cant.</th>
                        <th className="py-2.5 px-3 text-right w-24">Precio</th>
                        <th className="py-2.5 px-3 text-left">Descripción / Producto</th>
                        <th className="py-2.5 px-3 text-right w-24">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedProforma.items?.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}>
                          <td className="py-3 px-3 align-top font-bold">
                            {item.productCode}{item.width && item.height ? `-${item.width}X${item.height}` : ''}
                          </td>
                          <td className="py-3 px-3 text-center align-top">{item.quantity}</td>
                          <td className="py-3 px-3 text-right align-top">{fmt(item.unitPrice)}</td>
                          <td className="py-3 px-3 uppercase align-top leading-relaxed text-[9px]">
                            {item.description}
                            <div className="text-[8px] text-slate-500 mt-1 font-bold">
                              COLOR: {item.backgroundColor.toUpperCase()} • {item.hasRubberBorder ? 'CON BORDE DE HULE' : 'SIN BORDE DE HULE'}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right align-top font-bold">{fmt(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Footer y Totales */}
                  <div className="flex justify-between items-start mt-8">
                    <div className="w-7/12">
                      <h4 className="font-bold text-[9px] uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">Términos y Condiciones</h4>
                      <div className="whitespace-pre-wrap text-[9px] uppercase leading-relaxed text-slate-600 font-mono pr-12">
                        {selectedProforma.comments}
                      </div>
                    </div>
                    <div className="w-5/12">
                      <div className="space-y-2 mb-4 border-b border-slate-100 pb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500 uppercase font-bold text-[9px]">Subtotal Gravado</span>
                          <span className="font-bold">{fmt(selectedProforma.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 uppercase font-bold text-[9px]">Impuesto (13%)</span>
                          <span className="font-bold">{fmt(selectedProforma.iva)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-slate-900 text-white rounded">
                        <span className="font-black uppercase tracking-widest text-[10px]">Total Neto</span>
                        <span className="font-black text-lg">{fmt(selectedProforma.total)}</span>
                      </div>
                      <p className="mt-3 text-[9px] font-bold text-right text-slate-400 italic">
                        {numeroALetras(selectedProforma.total)}
                      </p>
                    </div>
                  </div>

                  {/* Cuentas Bancarias */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-[9px] grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">BAC SAN JOSÉ:</span>
                      <p><span className="font-bold">IBAN Colones:</span> CR24010200009581177624</p>
                      <p><span className="font-bold">Cuenta Cliente:</span> 10200009581177624</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">BANCO NACIONAL:</span>
                      <p><span className="font-bold">IBAN Colones:</span> CR27015108420010077873</p>
                      <p><span className="font-bold">SINPE Móvil:</span> 6063-8062</p>
                    </div>
                  </div>

                  {/* Despedida */}
                  <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">¡Gracias por confiar en APCR!</p>
                    <div className="border-t border-slate-100 pt-4 text-[8px] text-slate-400 uppercase tracking-widest">
                      Autorizado mediante resolución MH-DGT-RES-0027-2024. Versión 4.4
                    </div>
                  </div>

                </div>
              </div>

              {/* Bitácora de Modificaciones y Auditoría (Oculto al imprimir) */}
              {Array.isArray(selectedProforma.production_history) && selectedProforma.production_history.filter((h: any) => h.type === 'AUDIT_LOG').length > 0 && (
                <div className="p-6 bg-amber-50/60 dark:bg-amber-950/20 border-t border-amber-200/70 dark:border-amber-900/40 print:hidden">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Bitácora de Modificaciones ({selectedProforma.production_history.filter((h: any) => h.type === 'AUDIT_LOG').length})
                  </h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {selectedProforma.production_history.filter((h: any) => h.type === 'AUDIT_LOG').map((log: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs shadow-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-slate-800 dark:text-zinc-200 uppercase text-[11px]">
                            Modificado por: <span className="text-amber-600 dark:text-amber-400">{log.agent || 'Administrador'}</span>
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                            {new Date(log.date).toLocaleString('es-CR')}
                          </span>
                        </div>
                        {log.changes_summary ? (
                          <p className="text-slate-600 dark:text-zinc-400 text-[11px] font-medium">{log.changes_summary}</p>
                        ) : (
                          <p className="text-slate-600 dark:text-zinc-400 text-[11px] font-medium">
                            Total previo: <span className="line-through text-red-500 font-bold">₡{Number(log.previous_total).toLocaleString('es-CR')}</span>
                            <span className="mx-2 font-bold">➔</span>
                            Nuevo total: <span className="text-emerald-600 dark:text-emerald-400 font-black">₡{Number(log.new_total).toLocaleString('es-CR')}</span>
                          </p>
                        )}
                        {log.message && <p className="text-slate-400 dark:text-zinc-500 text-[10px] mt-1 italic">{log.message}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
