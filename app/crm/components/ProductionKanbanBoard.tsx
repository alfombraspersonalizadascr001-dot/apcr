'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent,
  useDraggable,
  useDroppable 
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { 
  Layers, Package, Palette, Scissors, Truck, CheckCircle2, 
  MessageCircle, Clock, FileText, Search, RefreshCw, GripVertical, 
  ChevronRight, AlertTriangle, ArrowRight, Zap, ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface WorkshopSubStage {
  id: string;
  step: number;
  label: string;
  short: string;
  icon: string;
}

export const WORKSHOP_SUBSTAGES: WorkshopSubStage[] = [
  { id: "CORTE DE LOGO", step: 1, label: "1. ✂️ Corte de Logo", short: "Corte Logo", icon: "✂️" },
  { id: "CORTE DE LOGOS", step: 2, label: "2. 🎨 Corte de Logos Extra", short: "Logos Extra", icon: "🎨" },
  { id: "CORTE DE ALFOMBRA DE FONDO", step: 3, label: "3. 📐 Corte Alfombra Fondo", short: "Corte Fondo", icon: "📐" },
  { id: "ARMADO DE ALFOMBRA", step: 4, label: "4. 🧩 Armado e Incrustación", short: "Armado", icon: "🧩" },
  { id: "PEGADO DE LONA DE RESPALDO", step: 5, label: "5. 🧱 Pegado Lona Respaldo", short: "Lona Respaldo", icon: "🧱" },
  { id: "INSTALACIÓN DE BORDE DE HULE", step: 6, label: "6. ⬛ Instalación Borde Hule", short: "Borde Hule", icon: "⬛" }
];

interface KanbanColumn {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

const ALL_KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'cotizado',
    emoji: '🟡',
    title: 'Cotizado',
    subtitle: 'En Negociación',
    color: 'bg-amber-500/5',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-500'
  },
  {
    id: 'abono_50',
    emoji: '🟢',
    title: 'Abonado 50%',
    subtitle: 'Venta Cerrada / Recibo',
    color: 'bg-emerald-500/5',
    borderColor: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-500'
  },
  {
    id: 'fotomontaje',
    emoji: '🎨',
    title: 'Stencil',
    subtitle: 'Plantilla de Diseño',
    color: 'bg-purple-500/5',
    borderColor: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-500'
  },
  {
    id: 'confeccion',
    emoji: '🧵',
    title: 'En Taller',
    subtitle: '6 Sub-etapas de Confección',
    color: 'bg-blue-500/5',
    borderColor: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-500'
  },
  {
    id: 'despacho',
    emoji: '🚚',
    title: 'Listo Ruta',
    subtitle: 'Despacho',
    color: 'bg-indigo-500/5',
    borderColor: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-500'
  },
  {
    id: 'entregado_pago_pendiente',
    emoji: '📦',
    title: 'Entregado - Pendiente de Pago',
    subtitle: 'Cobro Pendiente',
    color: 'bg-rose-500/5',
    borderColor: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-500'
  }
];

const CONFIRMED_KANBAN_COLUMNS: KanbanColumn[] = ALL_KANBAN_COLUMNS.filter(c => c.id !== 'cotizado');

export default function ProductionKanbanBoard({ isDark = false }: { isDark?: boolean }) {
  const [proformas, setProformas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'confirmed' | 'all'>('confirmed');
  const [receiptProformaIds, setReceiptProformaIds] = useState<Set<string>>(new Set());
  const [receiptClientIds, setReceiptClientIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    loadProformas();
  }, []);

  const loadProformas = async () => {
    setLoading(true);
    try {
      const [proformasRes, receiptsRes] = await Promise.all([
        supabase
          .from('proformas')
          .select('*, crm_users(*)')
          .order('created_at', { ascending: false }),
        supabase
          .from('receipts')
          .select('proforma_id, client_id')
      ]);

      if (receiptsRes.data) {
        const pIds = new Set<string>();
        const cIds = new Set<string>();
        receiptsRes.data.forEach((r: any) => {
          if (r.proforma_id) pIds.add(r.proforma_id);
          if (r.client_id) cIds.add(r.client_id);
        });
        setReceiptProformaIds(pIds);
        setReceiptClientIds(cIds);
      }

      if (!proformasRes.error && proformasRes.data) {
        setProformas(proformasRes.data);
      }
    } catch (e) {
      console.error('Error al cargar órdenes de producción:', e);
    }
    setLoading(false);
  };

  const hasDirectReceipt = (p: any): boolean => {
    // Solo recibos reales de la tabla receipts (con ID de proforma registrado)
    if (receiptProformaIds.has(p.id)) return true;
    // O entradas de tipo RECEIPT en historial con monto real
    if (Array.isArray(p.production_history)) {
      return p.production_history.some((h: any) => h.type === 'RECEIPT' && h.amount && Number(h.amount) > 0);
    }
    return false;
  };

  const hasVentaCerradaTag = (p: any): boolean => {
    const clientTags = Array.isArray(p.crm_users?.tags) ? p.crm_users.tags : [];
    return clientTags.includes('venta_cerrada');
  };

  const hasPagoPendienteTag = (p: any): boolean => {
    const clientTags = Array.isArray(p.crm_users?.tags) ? p.crm_users.tags : [];
    return clientTags.includes('pago_pendiente') || clientTags.includes('pendiente_pago');
  };

  const hasEntregadoTag = (p: any): boolean => {
    const clientTags = Array.isArray(p.crm_users?.tags) ? p.crm_users.tags : [];
    const prodStatus = (p.production_status || '').toUpperCase();
    const status = (p.status || '').toUpperCase();
    return (
      clientTags.includes('entregado_am') || 
      clientTags.includes('entregado_ss') || 
      clientTags.includes('entregado') ||
      prodStatus === 'ENTREGADO' || 
      status === 'ENTREGADO' || 
      prodStatus === 'ENTREGADO_PAGO_PENDIENTE'
    );
  };

  const getProformaStage = (p: any): string => {
    const prodStatus = (p.production_status || '').toUpperCase();
    const isPendingPayment = hasPagoPendienteTag(p) || prodStatus === 'ENTREGADO_PAGO_PENDIENTE';
    const isEntregado = hasEntregadoTag(p);

    // 1. Si tiene la etiqueta de pendiente de pago -> Columna 'entregado_pago_pendiente'
    if (isPendingPayment) {
      return 'entregado_pago_pendiente';
    }

    // 2. Si está entregado y cancelado (ej. entregado_am sin pendiente de pago) -> Sacar del tablero (completado_archivado)
    if (isEntregado) {
      return 'completado_archivado';
    }

    // REGLA ESTRICTA: Solo proformas formalmente APROBADAS por su estado individual pueden avanzar en taller.
    // La etiqueta venta_cerrada del CLIENTE no aplica aquí — cada proforma debe estar aprobada individualmente.
    const isCotizacionExplicit =
      (p.status || '').toLowerCase() === 'cotización' ||
      (p.status || '').toLowerCase() === 'cotizacion' ||
      (p.status || '').toLowerCase() === 'enviada' ||
      (p.status || '').toLowerCase() === 'pendiente';

    const isApproved =
      p.status === 'APROBADA' ||
      p.status === 'aprobada' ||
      Boolean(p.approved_at) ||
      hasDirectReceipt(p) ||
      // Solo si la proforma avanzó en producción individualmente (no por etiqueta del cliente)
      (!isCotizacionExplicit && prodStatus !== 'COTIZACION' && prodStatus !== '');

    // Si NO está aprobada individualmente -> Se mantiene en COTIZADO (nunca entra a Abonados/Stencil)
    if (!isApproved) {
      return 'cotizado';
    }

    // 3. Despacho / Listo en Ruta
    if (
      prodStatus === 'ENVÍO REALIZADO' || 
      prodStatus === 'ENVIO REALIZADO' || 
      prodStatus === 'DESPACHO' || 
      prodStatus.includes('RUTA')
    ) {
      return 'despacho';
    }
    
    // 4. Sub-etapas de Taller / Confección
    if (
      WORKSHOP_SUBSTAGES.some(s => s.id === prodStatus) || 
      prodStatus === 'CONFECCION' || 
      prodStatus === 'TALLER' || 
      prodStatus.includes('CORTE') || 
      prodStatus.includes('ARMADO') || 
      prodStatus.includes('LONA') || 
      prodStatus.includes('HULE')
    ) {
      return 'confeccion';
    }

    // 5. Stencil / Diseño
    if (
      prodStatus === 'IMPRESION DE STANCIL' || 
      prodStatus === 'IMPRESIÓN DE STENCIL' || 
      prodStatus === 'STENCIL' || 
      prodStatus === 'FOTOMONTAJE' || 
      prodStatus === 'DISENO'
    ) {
      return 'fotomontaje';
    }
    
    // 6. Abonado 50%: Cualquier orden aprobada individualmente que aún no ha avanzado a Stencil o Taller
    return 'abono_50';
  };

  const isConfirmedOrder = (p: any): boolean => {
    const stage = getProformaStage(p);
    return stage !== 'cotizado' && stage !== 'completado_archivado';
  };

  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const proformaId = active.id as string;
    let targetColumnId = over.id as string;

    // Si se soltó sobre otra tarjeta y no directamente sobre el contenedor de la columna
    if (!ALL_KANBAN_COLUMNS.some(col => col.id === targetColumnId)) {
      const overProforma = proformas.find(p => p.id === targetColumnId);
      if (overProforma) {
        targetColumnId = getProformaStage(overProforma);
      }
    }

    let newProductionStatus = targetColumnId;
    if (targetColumnId === 'fotomontaje') newProductionStatus = 'IMPRESION DE STANCIL';
    else if (targetColumnId === 'confeccion') newProductionStatus = 'CORTE DE LOGO';
    else if (targetColumnId === 'despacho') newProductionStatus = 'ENVÍO REALIZADO';
    else if (targetColumnId === 'entregado_pago_pendiente') newProductionStatus = 'ENTREGADO_PAGO_PENDIENTE';
    else if (targetColumnId === 'abono_50') newProductionStatus = 'ABONO_50';
    else if (targetColumnId === 'cotizado') newProductionStatus = 'COTIZACION';

    // Actualización optimista inmediata en UI
    setProformas(prev => prev.map(p => {
      if (p.id === proformaId) {
        const currentHistory = p.production_history || [];
        const updatedHistory = [...currentHistory, { status: newProductionStatus, completed_at: new Date().toISOString() }];
        return {
          ...p,
          production_status: newProductionStatus,
          production_history: updatedHistory,
          ...(targetColumnId === 'cotizado' ? { status: 'COTIZACIÓN', approved_at: null } : {}),
          ...(targetColumnId === 'abono_50' && !p.approved_at ? { approved_at: new Date().toISOString(), status: 'APROBADA' } : {}),
          ...(targetColumnId === 'entregado_pago_pendiente' ? { status: 'ENTREGADO' } : {})
        };
      }
      return p;
    }));

    // Guardar en Supabase
    try {
      const p = proformas.find(item => item.id === proformaId);
      const currentHistory = p?.production_history || [];
      const updatedHistory = [...currentHistory, { status: newProductionStatus, completed_at: new Date().toISOString() }];

      const updatePayload: any = {
        production_status: newProductionStatus,
        production_history: updatedHistory,
        updated_at: new Date().toISOString()
      };

      if (targetColumnId === 'cotizado') {
        updatePayload.status = 'COTIZACIÓN';
        updatePayload.approved_at = null;
      } else if (targetColumnId === 'abono_50' || targetColumnId === 'confeccion' || targetColumnId === 'fotomontaje') {
        updatePayload.status = 'APROBADA';
        if (!p?.approved_at) updatePayload.approved_at = new Date().toISOString();
      } else if (targetColumnId === 'entregado_pago_pendiente') {
        updatePayload.status = 'ENTREGADO';
        if (p?.crm_users?.id) {
          const currentTags = Array.isArray(p.crm_users.tags) ? p.crm_users.tags : [];
          const newTags = Array.from(new Set([...currentTags, 'pago_pendiente', 'entregado_am']));
          await supabase.from('crm_users').update({ tags: newTags, updated_at: new Date().toISOString() }).eq('id', p.crm_users.id);
        }
      }

      await supabase
        .from('proformas')
        .update(updatePayload)
        .eq('id', proformaId);

    } catch (e) {
      console.error('Error al actualizar estado en Kanban:', e);
    }
  };

  const handleSubStageChange = async (proformaId: string, newSubStage: string) => {
    // Actualización optimista
    setProformas(prev => prev.map(p => {
      if (p.id === proformaId) {
        const currentHistory = p.production_history || [];
        const updatedHistory = [...currentHistory, { status: newSubStage, completed_at: new Date().toISOString() }];
        return {
          ...p,
          production_status: newSubStage,
          production_history: updatedHistory
        };
      }
      return p;
    }));

    try {
      const p = proformas.find(item => item.id === proformaId);
      const currentHistory = p?.production_history || [];
      const updatedHistory = [...currentHistory, { status: newSubStage, completed_at: new Date().toISOString() }];

      await supabase
        .from('proformas')
        .update({
          production_status: newSubStage,
          production_history: updatedHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', proformaId);
    } catch (e) {
      console.error('Error al actualizar sub-etapa de taller:', e);
    }
  };

  const handleNextSubStage = async (proforma: any) => {
    const currentStatus = (proforma.production_status || '').toUpperCase();
    const currentIndex = WORKSHOP_SUBSTAGES.findIndex(s => s.id === currentStatus);
    
    if (currentIndex >= 0 && currentIndex < WORKSHOP_SUBSTAGES.length - 1) {
      const nextStage = WORKSHOP_SUBSTAGES[currentIndex + 1].id;
      await handleSubStageChange(proforma.id, nextStage);
    } else if (currentIndex === WORKSHOP_SUBSTAGES.length - 1) {
      // Si completó el último paso de taller (Borde de Hule), pasar a Despacho
      await handleSubStageChange(proforma.id, 'ENVÍO REALIZADO');
    } else {
      // Iniciar en el primer paso
      await handleSubStageChange(proforma.id, WORKSHOP_SUBSTAGES[0].id);
    }
  };

  const moveToStencil = async (proformaId: string) => {
    await handleSubStageChange(proformaId, 'IMPRESION DE STANCIL');
  };

  // Regla de Alerta: Más de 24 horas en Abonado 50% sin pasar a Stencil
  const nowMs = Date.now();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;

  const isDelayedInAbono = (p: any): boolean => {
    const stage = getProformaStage(p);
    if (stage !== 'abono_50') return false;
    const approvedTime = new Date(p.approved_at || p.updated_at || p.created_at || Date.now()).getTime();
    const elapsed = nowMs - approvedTime;
    return elapsed >= twentyFourHoursMs;
  };

  const getDelayHoursText = (p: any): string => {
    const approvedTime = new Date(p.approved_at || p.updated_at || p.created_at || Date.now()).getTime();
    const elapsed = nowMs - approvedTime;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return days > 0 ? `hace ${days}d ${hours % 24}h` : `hace ${hours}h`;
  };

  const delayedAbonoProformas = proformas.filter(isDelayedInAbono);
  const confirmedCount = proformas.filter(isConfirmedOrder).length;
  const activeColumns = filterMode === 'confirmed' ? CONFIRMED_KANBAN_COLUMNS : ALL_KANBAN_COLUMNS;

  const filteredProformas = proformas.filter(p => {
    if (filterMode === 'confirmed' && !isConfirmedOrder(p)) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const num = (p.proforma_number || '').toLowerCase();
    const client = (p.crm_users?.company_name || p.crm_users?.contact_name || '').toLowerCase();
    const phone = (p.crm_users?.phone || '').toLowerCase();
    return num.includes(q) || client.includes(q) || phone.includes(q);
  });

  const activeProforma = activeDragId ? proformas.find(p => p.id === activeDragId) : null;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300 w-full">
      
      {/* ALERTA DE CUELLO DE BOTELLA: Pedidos en Abonado > 24h sin pasar a Stencil */}
      {delayedAbonoProformas.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md shadow-orange-500/5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                ⚠️ Alerta de Taller: {delayedAbonoProformas.length} {delayedAbonoProformas.length === 1 ? 'pedido lleva' : 'pedidos llevan'} más de 24 horas abonados sin pasar a Stencil
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                Pasa las órdenes a Stencil para no retrasar la fecha de entrega del cliente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-orange-500 text-white px-2.5 py-1 rounded-lg">
              {delayedAbonoProformas.length} URGENTES
            </span>
          </div>
        </div>
      )}

      {/* Barra de Encabezado y Métricas */}
      <div className="bg-background dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Tablero de Pedidos (Ventas y Producción)
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                {filterMode === 'confirmed' ? 'Mostrando únicamente pedidos activos confirmados (ventas cerradas o con recibo).' : 'Mostrando todas las cotizaciones del sistema.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Selector de Filtro: Solo Confirmados vs Todas */}
          <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl border border-slate-200 dark:border-zinc-700/70 text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => setFilterMode('confirmed')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                filterMode === 'confirmed'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pedidos Confirmados ({confirmedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                filterMode === 'all'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Todas las Cotizaciones ({proformas.length})</span>
            </button>
          </div>

          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o Nº..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={loadProformas}
            className="p-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-600 dark:text-zinc-300 rounded-xl transition-colors"
            title="Refrescar tablero"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tablero Kanban Completo */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${filterMode === 'confirmed' ? 'xl:grid-cols-5' : 'xl:grid-cols-6'} gap-2.5 sm:gap-3 w-full pb-6 items-start`}>
          {activeColumns.map(col => {
            const colProformas = filteredProformas.filter(p => getProformaStage(p) === col.id);
            const totalSum = colProformas.reduce((sum, p) => sum + Number(p.total || 0), 0);
            const hasDelayedOrders = col.id === 'abono_50' && colProformas.some(isDelayedInAbono);

            return (
              <DroppableColumn
                key={col.id}
                column={col}
                count={colProformas.length}
                totalSum={totalSum}
                hasDelayedOrders={hasDelayedOrders}
              >
                {colProformas.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-zinc-800/80 rounded-2xl flex flex-col items-center justify-center p-3 text-center">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
                      Sin órdenes
                    </p>
                    <p className="text-[9px] text-slate-400/60 dark:text-zinc-700 mt-0.5">Arrastra aquí</p>
                  </div>
                ) : (
                  colProformas.map(p => (
                    <DraggableOrderCard 
                      key={p.id} 
                      proforma={p} 
                      columnId={col.id}
                      isDelayed={isDelayedInAbono(p)}
                      delayText={isDelayedInAbono(p) ? getDelayHoursText(p) : undefined}
                      onSubStageChange={(sub) => handleSubStageChange(p.id, sub)}
                      onNextSubStage={() => handleNextSubStage(p)}
                      onMoveToStencil={() => moveToStencil(p.id)}
                    />
                  ))
                )}
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeProforma ? (
            <div className="transform rotate-2 scale-105 shadow-2xl opacity-90 w-[240px]">
              <OrderCardContent 
                proforma={activeProforma} 
                columnId={getProformaStage(activeProforma)} 
                isOverlay 
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

    </div>
  );
}

function DroppableColumn({ 
  column, 
  count, 
  totalSum, 
  hasDelayedOrders = false,
  children 
}: { 
  column: KanbanColumn; 
  count: number; 
  totalSum: number; 
  hasDelayedOrders?: boolean;
  children: React.ReactNode; 
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl p-2.5 sm:p-3 border transition-all w-full min-w-0 ${
        isOver
          ? 'bg-amber-500/10 border-amber-500 scale-[1.01] shadow-xl'
          : hasDelayedOrders
            ? 'bg-orange-500/5 dark:bg-orange-950/10 border-orange-500/40 shadow-sm'
            : 'bg-slate-50/70 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800'
      }`}
    >
      {/* Encabezado de Columna */}
      <div className="p-2 border-b border-slate-200 dark:border-zinc-800/80 mb-2.5">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-sm flex-shrink-0">{column.emoji}</span>
            <span className="font-black text-xs text-slate-800 dark:text-white uppercase tracking-tight truncate">
              {column.title}
            </span>
          </div>
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${column.badgeBg} ${column.badgeText}`}>
            {count}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 pl-4 font-mono font-bold">
          <span>₡{totalSum.toLocaleString('es-CR')}</span>
          {hasDelayedOrders && (
            <span className="text-[9px] font-black text-orange-500 animate-pulse">
              ⚠️ Alerta +24h
            </span>
          )}
        </div>
      </div>

      {/* Tarjetas */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar pr-0.5">
        {children}
      </div>
    </div>
  );
}

function DraggableOrderCard({ 
  proforma, 
  columnId,
  isDelayed = false,
  delayText,
  onSubStageChange,
  onNextSubStage,
  onMoveToStencil
}: { 
  proforma: any; 
  columnId: string;
  isDelayed?: boolean;
  delayText?: string;
  onSubStageChange?: (sub: string) => void;
  onNextSubStage?: () => void;
  onMoveToStencil?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: proforma.id,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`transition-all ${isDragging ? 'opacity-30' : ''}`}
    >
      <OrderCardContent 
        proforma={proforma} 
        columnId={columnId}
        isDelayed={isDelayed}
        delayText={delayText}
        dragHandleProps={listeners} 
        onSubStageChange={onSubStageChange}
        onNextSubStage={onNextSubStage}
        onMoveToStencil={onMoveToStencil}
      />
    </div>
  );
}

function OrderCardContent({ 
  proforma, 
  columnId,
  isDelayed = false,
  delayText,
  isOverlay = false,
  dragHandleProps,
  onSubStageChange,
  onNextSubStage,
  onMoveToStencil
}: { 
  proforma: any; 
  columnId: string;
  isDelayed?: boolean;
  delayText?: string;
  isOverlay?: boolean;
  dragHandleProps?: any;
  onSubStageChange?: (sub: string) => void;
  onNextSubStage?: () => void;
  onMoveToStencil?: () => void;
}) {
  const firstItem = proforma.items && proforma.items[0];
  const itemsCount = (proforma.items || []).length;

  const currentProdStatus = (proforma.production_status || '').toUpperCase();
  const currentSubStageIndex = WORKSHOP_SUBSTAGES.findIndex(s => s.id === currentProdStatus);
  const activeSubStage = currentSubStageIndex >= 0 ? WORKSHOP_SUBSTAGES[currentSubStageIndex] : WORKSHOP_SUBSTAGES[0];
  const isWorkshopColumn = columnId === 'confeccion';
  const isAbonoColumn = columnId === 'abono_50';

  const sendWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    let phone = (proforma.crm_users?.phone || '').replace(/[^0-9]/g, '');
    if (!phone) return;
    if (phone.length === 8) phone = '506' + phone;

    const name = proforma.crm_users?.company_name || proforma.crm_users?.contact_name || 'Estimado(a) Cliente';
    const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://crm-plus-2-1.vercel.app';
    const link = `${appOrigin}/proformas?view=${proforma.proforma_number || proforma.id}`;

    const msg = `¡Hola *${name}*! 👋\nLe saludamos de *Alfombras Personalizadas CR* respecto a su orden *Proforma #${proforma.proforma_number}*.\n\nPuede consultar el avance de fabricación aquí:\n${link}\n\nQuedamos a su orden. 🤝`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className={`p-3 bg-white dark:bg-zinc-900 rounded-xl border transition-all group flex flex-col gap-2 ${
      isDelayed 
        ? 'border-orange-500/60 shadow-md shadow-orange-500/10' 
        : 'border-slate-200 dark:border-zinc-800/90 shadow-sm hover:shadow-md'
    } ${isOverlay ? 'border-amber-500 shadow-2xl ring-2 ring-amber-500/20' : ''}`}>
      
      {/* Top Header Card */}
      <div className="flex justify-between items-start gap-1">
        <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">
          #{proforma.proforma_number}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold text-slate-400">
            {proforma.date || new Date(proforma.created_at).toLocaleDateString('es-CR')}
          </span>
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-0.5 text-slate-300 hover:text-slate-600 dark:hover:text-zinc-200">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* ALERTA VISUAL: +24H EN ABONADO SIN STENCIL */}
      {isAbonoColumn && isDelayed && (
        <div className="bg-orange-500/15 border border-orange-500/30 rounded-lg p-2 flex flex-col gap-1.5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0" />
              <span>Abonado {delayText}</span>
            </span>
          </div>

          {onMoveToStencil && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveToStencil();
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded-md text-[9px] font-black flex items-center justify-center gap-1 shadow-sm transition-all hover:scale-102"
              title="Pasar esta orden a la etapa de Stencil de inmediato"
            >
              <Palette className="w-3 h-3" />
              <span>🎨 Pasar a Stencil Ahora</span>
            </button>
          )}
        </div>
      )}

      {/* Cliente y Producto */}
      <div>
        {proforma.crm_users?.id ? (
          <Link
            href={`/admin?client=${proforma.crm_users.id}&search=${encodeURIComponent(proforma.crm_users.account_number || proforma.crm_users.company_name || '')}`}
            onClick={(e) => e.stopPropagation()}
            className="font-bold text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline line-clamp-1 uppercase inline-flex items-center gap-1 group"
            title="Ir al expediente / cuenta del cliente en el CRM"
          >
            <span>{proforma.crm_users?.company_name || proforma.crm_users?.contact_name || 'Cliente sin Nombre'}</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </Link>
        ) : (
          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 uppercase">
            {proforma.crm_users?.company_name || proforma.crm_users?.contact_name || 'Cliente sin Nombre'}
          </h4>
        )}
        {firstItem && (
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
            {firstItem.quantity}x {firstItem.description || firstItem.productName} 
            {firstItem.width && firstItem.height ? ` (${firstItem.width}x${firstItem.height}cm)` : ''}
            {itemsCount > 1 ? ` (+${itemsCount - 1})` : ''}
          </p>
        )}
      </div>

      {/* SUB-ETAPAS DE TALLER INTERACTIVAS EN LA TARJETA */}
      {isWorkshopColumn && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 flex flex-col gap-1.5 mt-0.5">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs">{activeSubStage.icon}</span>
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 truncate uppercase">
                {activeSubStage.step}/6 {activeSubStage.short}
              </span>
            </div>

            {onNextSubStage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNextSubStage();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-0.5 rounded text-[9px] font-black flex items-center gap-0.5 shadow-sm transition-all hover:scale-105"
                title="Avanzar a la siguiente sub-etapa de confección"
              >
                <span>Avanzar</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Selector desplegable directo de Sub-etapas */}
          <select
            value={currentSubStageIndex >= 0 ? currentProdStatus : WORKSHOP_SUBSTAGES[0].id}
            onChange={(e) => {
              e.stopPropagation();
              if (onSubStageChange) onSubStageChange(e.target.value);
            }}
            className="w-full text-[9px] font-bold bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-900/50 rounded py-1 px-1.5 outline-none text-slate-700 dark:text-zinc-200 cursor-pointer"
          >
            {WORKSHOP_SUBSTAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Mini Barra de Progreso (1 al 6) */}
          <div className="w-full bg-blue-200/50 dark:bg-blue-950/40 h-1.5 rounded-full overflow-hidden flex">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentSubStageIndex >= 0 ? currentSubStageIndex + 1 : 1) / 6) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Monto y Acciones */}
      <div className="pt-1.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono font-black text-slate-900 dark:text-zinc-100">
          ₡{Number(proforma.total || 0).toLocaleString('es-CR')}
        </span>

        <div className="flex items-center gap-1">
          {proforma.crm_users?.phone && (
            <button
              onClick={sendWhatsApp}
              className="p-1 hover:bg-emerald-500/10 text-emerald-600 rounded transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={`/proformas?view=${proforma.proforma_number || proforma.id}`}
            className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded transition-colors"
            title="Ver Proforma"
          >
            <FileText className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
}
