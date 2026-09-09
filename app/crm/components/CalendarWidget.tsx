'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, CheckSquare, Plus, Check, 
  ChevronLeft, ChevronRight, Pencil, Trash2, X, Calculator,
  Clock, Package, FileText, Phone, MessageCircle, ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

const INTEREST_LEVELS = [
  { level: 1, label: "Contacto Inicial", bg: "bg-slate-100 dark:bg-zinc-800", text: "text-slate-600 dark:text-zinc-400" },
  { level: 2, label: "Seguimiento Básico", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
  { level: 3, label: "Interesado", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400" },
  { level: 4, label: "Cotizado", bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400" },
  { level: 5, label: "Cierre / Urgente", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" },
];

export default function CalendarWidget() {
  const [calendarView, setCalendarView] = useState<"month" | "twoweeks" | "week" | "day">("month");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [clients, setClients] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proformas, setProformas] = useState<any[]>([]);

  // Filtros de calendario
  const [filterMode, setFilterMode] = useState<'all' | 'cotizaciones' | 'ventas' | 'entregas'>('all');

  // Todo List State (Guardado localmente)
  const [todos, setTodos] = useState<Record<string, { id: string, text: string, done: boolean }[]>>({});
  const [todoInput, setTodoInput] = useState("");
  const [todosLoaded, setTodosLoaded] = useState(false);
  
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoInput, setEditTodoInput] = useState("");

  useEffect(() => {
    // Al cargar el calendario por primera vez, recuperar las tareas guardadas del usuario
    const savedTodos = localStorage.getItem('crm_calendar_todos');
    if (savedTodos) {
      try {
        const loadedTodos = JSON.parse(savedTodos);
        
        // --- Lógica de Roll-over Robusta ---
        const now = new Date();
        const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayKey = `${nowLocal.getFullYear()}-${nowLocal.getMonth() + 1}-${nowLocal.getDate()}`;
        
        const newTodosState = { ...loadedTodos };
        let hasChanges = false;

        // Clasificar tareas pendientes de días pasados
        Object.keys(loadedTodos).forEach(dateKey => {
          if (dateKey === todayKey) return;
          
          const parts = dateKey.split('-');
          if (parts.length !== 3) return;
          
          const y = parseInt(parts[0]);
          const m = parseInt(parts[1]);
          const d = parseInt(parts[2]);
          
          const todoDate = new Date(y, m - 1, d);
          
          if (todoDate.getTime() < nowLocal.getTime()) {
            const dayItems = loadedTodos[dateKey];
            if (!Array.isArray(dayItems)) return;

            const pending = dayItems.filter((t: any) => !t.done);
            if (pending.length > 0) {
              if (!newTodosState[todayKey]) newTodosState[todayKey] = [];
              
              const todayIds = new Set(newTodosState[todayKey].map((t: any) => t.id));
              const itemsToMove = pending.filter((t: any) => !todayIds.has(t.id));

              if (itemsToMove.length > 0) {
                newTodosState[todayKey] = [...newTodosState[todayKey], ...itemsToMove];
                newTodosState[dateKey] = dayItems.filter((t: any) => t.done);
                
                if (newTodosState[dateKey].length === 0) {
                  delete newTodosState[dateKey];
                }
                hasChanges = true;
              }
            }
          }
        });

        if (hasChanges) {
          setTodos(newTodosState);
        } else {
          setTodos(loadedTodos);
        }
      } catch (e) {
        console.error("Error al cargar recordatorios:", e);
      }
    }
    setTodosLoaded(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: clientsData } = await supabase
        .from('crm_users')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });
        
      if (clientsData) {
        setClients(clientsData);
      }

      const { data: proformasData } = await supabase
        .from('proformas')
        .select('*, crm_users(*)');

      if (proformasData) {
        setProformas(proformasData);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadReceipts() {
      const saved = localStorage.getItem('crm_receipts');
      if (saved) {
        try { setReceipts(JSON.parse(saved)); } catch(e) {}
      }
      
      const { data } = await supabase.from('crm_receipts').select('*');
      if (data && data.length > 0) {
        setReceipts(data);
        localStorage.setItem('crm_receipts', JSON.stringify(data));
      }
    }
    loadReceipts();
  }, []);

  useEffect(() => {
    if (todosLoaded) {
      localStorage.setItem('crm_calendar_todos', JSON.stringify(todos));
    }
  }, [todos, todosLoaded]);

  const handleDayClick = (dayNum: number) => {
    const newSelected = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), dayNum);
    setSelectedDate(newSelected);
  };

  const changeMonth = (offset: number) => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const changeDay = (offset: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + offset);
      setCalendarDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
      return newDate;
    });
  };

  const getDayKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getDate() === d2.getDate() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getFullYear() === d2.getFullYear();

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    const key = getDayKey(selectedDate);
    const newTodo = { id: crypto.randomUUID(), text: todoInput.trim(), done: false };
    
    setTodos(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newTodo]
    }));
    
    setTodoInput("");
  };

  const toggleTodo = (key: string, id: string) => {
    setTodos(prev => ({
      ...prev,
      [key]: prev[key].map(todo => 
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    }));
  };

  const deleteTodo = (key: string, id: string) => {
    setTodos(prev => ({
      ...prev,
      [key]: prev[key].filter(todo => todo.id !== id)
    }));
  };

  const startEditing = (id: string, currentText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTodoId(id);
    setEditTodoInput(currentText);
  };

  const saveEdit = (key: string, id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editTodoInput.trim()) return;

    setTodos(prev => ({
      ...prev,
      [key]: prev[key].map(todo => 
        todo.id === id ? { ...todo, text: editTodoInput.trim() } : todo
      )
    }));
    setEditingTodoId(null);
  };

  const selectedKey = getDayKey(selectedDate);
  const todaysTodos = todos[selectedKey] || [];

  // Datos específicos del día seleccionado (para la vista Día)
  const selectedDayProformas = proformas.filter(p => p.created_at && isSameDay(new Date(p.created_at), selectedDate));
  const selectedDayApprovals = proformas.filter(p => p.approved_at && isSameDay(new Date(p.approved_at), selectedDate));
  const selectedDayDeliveries = proformas.filter(p => {
    if (!p.approved_at) return false;
    const appDate = new Date(p.approved_at);
    const delDate = new Date(appDate.getTime() + (p.delivery_time_days || 12) * 24 * 60 * 60 * 1000);
    return isSameDay(delDate, selectedDate);
  });
  const selectedDayReceipts = receipts.filter(r => {
    const d = new Date(r.date + "T12:00:00");
    return isSameDay(d, selectedDate);
  });

  return (
    <div className="bg-zinc-950 dark:bg-zinc-950 rounded-3xl shadow-xl w-full border border-zinc-800/40 flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden h-full shadow-amber-500/5">
      {/* SECCIÓN IZQUIERDA: CALENDARIO */}
      <div className="flex-1 flex flex-col min-w-0 md:min-w-[60%]">
        <div className="p-4 sm:p-6 border-b border-zinc-800/40 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 flex-shrink-0">
              <CalendarIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
                Calendario de Seguimiento
              </h3>
              
              {calendarView === "day" ? (
                <div className="flex items-center gap-2 mt-1">
                  <button 
                    onClick={() => changeDay(-1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                    title="Día anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wide leading-none capitalize">
                    {selectedDate.toLocaleDateString("es-CR", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <button 
                    onClick={() => changeDay(1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                    title="Día siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <button 
                    onClick={() => changeMonth(-1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                    title="Mes anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none w-32 text-center">
                    {calendarDate.toLocaleString("es-CR", { month: 'long', year: 'numeric' })}
                  </p>
                  <button 
                    onClick={() => changeMonth(1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                    title="Mes siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Selector de Vistas: Mes | 15 Días | Semana | Día */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 shadow-inner flex-wrap">
            <button
              onClick={() => setCalendarView("month")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all",
                calendarView === "month" ? "bg-amber-500 text-white shadow-sm" : "hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400"
              )}
            >
              Mes
            </button>
            <button
              onClick={() => setCalendarView("twoweeks")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all",
                calendarView === "twoweeks" ? "bg-amber-500 text-white shadow-sm" : "hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400"
              )}
            >
              15 Días
            </button>
            <button
              onClick={() => setCalendarView("week")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all",
                calendarView === "week" ? "bg-amber-500 text-white shadow-sm" : "hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400"
              )}
            >
              Semana
            </button>
            <button
              onClick={() => setCalendarView("day")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-1",
                calendarView === "day" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400"
              )}
            >
              <span>Día</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>
        </div>

        {/* CONTENIDO DEL CALENDARIO */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto scrollbar-thin scrollbar-thumb-amber-500/20 bg-zinc-950/40">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
              Cargando eventos agendados...
            </div>
          ) : calendarView === "day" ? (
            /* --- VISTA DE DÍA (ESPECIAL PARA CELULAR Y AGENDA DIARIA) --- */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Tarjeta de Encabezado del Día */}
              <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/60 p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-1">
                    Agenda del Día
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white capitalize">
                    {selectedDate.toLocaleDateString("es-CR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const today = new Date();
                      setSelectedDate(today);
                      setCalendarDate(new Date(today.getFullYear(), today.getMonth(), 1));
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    Ir a Hoy
                  </button>
                </div>
              </div>

              {/* Métricas rápidas del día */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider block">Cotizaciones</span>
                  <span className="text-xl font-black text-white">{selectedDayProformas.length}</span>
                </div>
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Ventas Aprobadas</span>
                  <span className="text-xl font-black text-white">{selectedDayApprovals.length}</span>
                </div>
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">Entregas</span>
                  <span className="text-xl font-black text-white">{selectedDayDeliveries.length}</span>
                </div>
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">Recibos</span>
                  <span className="text-xl font-black text-white">{selectedDayReceipts.length}</span>
                </div>
              </div>

              {/* Eventos Detallados del Día */}
              <div className="space-y-4">
                
                {/* 1. Entregas Programadas */}
                {selectedDayDeliveries.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Package className="w-4 h-4" /> Entregas Programadas para Hoy
                    </h5>
                    {selectedDayDeliveries.map(p => (
                      <div key={`del-${p.id}`} className="bg-indigo-950/30 border border-indigo-900/50 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{p.crm_users?.company_name || p.crm_users?.contact_name || 'Cliente'}</span>
                            <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">Proforma #{p.proforma_number}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Total: <strong className="text-indigo-300 font-mono">₡{Number(p.total).toLocaleString('es-CR')}</strong>
                          </p>
                        </div>
                        {p.crm_users?.phone && (
                          <a 
                            href={`https://wa.me/${p.crm_users.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Cliente
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Ventas / Aprobaciones */}
                {selectedDayApprovals.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Ventas Aprobadas en este Día
                    </h5>
                    {selectedDayApprovals.map(p => (
                      <div key={`app-${p.id}`} className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white text-sm">{p.crm_users?.company_name || p.crm_users?.contact_name || 'Cliente'}</span>
                          <p className="text-xs text-slate-400 mt-0.5">Proforma #{p.proforma_number} • Total: <strong className="text-emerald-400 font-mono">₡{Number(p.total).toLocaleString('es-CR')}</strong></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Cotizaciones Realizadas */}
                {selectedDayProformas.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Cotizaciones Emitidas
                    </h5>
                    {selectedDayProformas.map(p => (
                      <div key={`prof-${p.id}`} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <span className="font-bold text-white text-sm">{p.crm_users?.company_name || p.crm_users?.contact_name || 'Cliente'}</span>
                          <p className="text-xs text-slate-400 mt-0.5">Proforma #{p.proforma_number} • Total: <strong className="text-amber-400 font-mono">₡{Number(p.total).toLocaleString('es-CR')}</strong></p>
                        </div>
                        <a 
                          href={`/crm/proformas?view=${p.proforma_number || p.id}`}
                          className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1"
                        >
                          Ver Proforma <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Recibos de Dinero */}
                {selectedDayReceipts.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Calculator className="w-4 h-4" /> Recibos de Dinero Emitidos
                    </h5>
                    {selectedDayReceipts.map(r => (
                      <div key={`rec-${r.id}`} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white text-sm">{r.client_name || 'Cliente'}</span>
                          <p className="text-xs text-slate-400 mt-0.5">{r.description || 'Abono / Pago'}</p>
                        </div>
                        <span className="text-sm font-mono font-black text-emerald-400">₡{Number(r.amount).toLocaleString('es-CR')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedDayDeliveries.length === 0 && selectedDayApprovals.length === 0 && selectedDayProformas.length === 0 && selectedDayReceipts.length === 0 && (
                  <div className="py-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800/40 p-6">
                    <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No hay movimientos comerciales registrados en este día.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Puedes agregar tareas o recordatorios en el panel de la derecha.</p>
                  </div>
                )}

              </div>
            </div>
          ) : (
            /* --- VISTA DE CUADRÍCULA (Mes / 15 Días / Semana con desplazamiento horizontal en celular) --- */
            <div className="overflow-x-auto">
              <div className={cn(
                "grid gap-1.5 min-w-[650px] md:min-w-0",
                "grid-cols-7"
              )}>
                {/* Calendar Headers */}
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                  <div key={day} className="py-2 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-zinc-800">
                    {day}
                  </div>
                ))}

                {/* Calendar Cells */}
                {Array.from({ length: calendarView === "month" ? 35 : calendarView === "twoweeks" ? 14 : 7 }).map((_, i) => {
                  const dayNum = i + 1;
                  const todayDate = new Date();
                  const isToday = todayDate.getDate() === dayNum && todayDate.getMonth() === calendarDate.getMonth() && todayDate.getFullYear() === calendarDate.getFullYear();
                  const isSelected = selectedDate.getDate() === dayNum && selectedDate.getMonth() === calendarDate.getMonth();
                  const cellDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), dayNum);
                  const cellKey = getDayKey(cellDate);
                  const pendingTodos = (todos[cellKey] || []).filter(t => !t.done).length;
                  
                  const dayReceipts = receipts.filter(r => {
                      const d = new Date(r.date + "T12:00:00");
                      return d.getDate() === cellDate.getDate() && 
                             d.getMonth() === cellDate.getMonth() && 
                             d.getFullYear() === cellDate.getFullYear();
                  });

                  const dayProformas = proformas.filter(p => p.created_at && isSameDay(new Date(p.created_at), cellDate));
                  const dayApprovals = proformas.filter(p => p.approved_at && isSameDay(new Date(p.approved_at), cellDate));
                  const dayDeliveries = proformas.filter(p => {
                      if (!p.approved_at) return false;
                      const appDate = new Date(p.approved_at);
                      const delDate = new Date(appDate.getTime() + (p.delivery_time_days || 12) * 24 * 60 * 60 * 1000);
                      return isSameDay(delDate, cellDate);
                  });

                  return (
                    <div 
                      key={i} 
                      onClick={() => handleDayClick(dayNum)}
                      className={cn(
                        "min-h-[120px] border p-2 rounded-xl transition-all group flex flex-col shadow-sm cursor-pointer",
                        isToday && !isSelected ? "bg-emerald-50/50 border-emerald-400 dark:bg-emerald-900/10 dark:border-emerald-600 ring-1 ring-emerald-500/30" : "",
                        isSelected 
                          ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700 ring-2 ring-indigo-500/20" 
                          : !isToday ? "bg-zinc-900 border-zinc-800/80 hover:bg-zinc-800" : ""
                      )}
                    >
                      <span className={cn(
                        "text-[10px] font-bold transition-colors mb-1 flex items-center gap-1.5 flex-wrap",
                        isSelected ? "text-indigo-600 dark:text-indigo-400" : isToday ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-zinc-500 group-hover:text-amber-500"
                      )}>
                        <span>{dayNum}</span>
                        {isToday && <span className="text-[8px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 px-1 py-0.5 rounded uppercase tracking-widest hidden sm:inline">Hoy</span>}
                        {pendingTodos > 0 && (
                          <span className="text-[8px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 px-1 py-0.5 rounded font-black shadow-sm animate-pulse shadow-amber-500/10 flex items-center gap-0.5">
                            <CheckSquare className="w-2.5 h-2.5" /> {pendingTodos}
                          </span>
                        )}
                      </span>
                      <div className="mt-1 space-y-1.5 overflow-hidden">
                        {/* 1. COTIZACIONES */}
                        {(filterMode === 'all' || filterMode === 'cotizaciones') && dayProformas.map(p => (
                          <div 
                            key={`p-${p.id}`}
                            className="text-[9px] font-bold px-2 py-1 rounded-md border border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-700/50 dark:bg-orange-900/30 dark:text-orange-400 truncate shadow-sm relative z-10"
                            title={`Cotización #${p.proforma_number}: ${p.crm_users?.company_name || p.crm_users?.contact_name}`}
                          >
                            📄 Cot. #{p.proforma_number} - {p.crm_users?.company_name || p.crm_users?.contact_name || "Cliente"}
                          </div>
                        ))}

                        {/* 2. VENTAS CERRADAS */}
                        {(filterMode === 'all' || filterMode === 'ventas') && dayApprovals.map(p => (
                          <div 
                            key={`app-${p.id}`}
                            className="text-[9px] font-bold px-2 py-1 rounded-md border border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-400 truncate shadow-sm relative z-10"
                            title={`Venta Cerrada #${p.proforma_number}: ₡${Number(p.total).toLocaleString('es-CR')}`}
                          >
                            🤝 Venta #{p.proforma_number} - {p.crm_users?.company_name || p.crm_users?.contact_name || "Cliente"}
                          </div>
                        ))}

                        {/* 3. ENTREGAS */}
                        {(filterMode === 'all' || filterMode === 'entregas') && dayDeliveries.map(p => (
                          <div 
                            key={`del-${p.id}`}
                            className="text-[9px] font-bold px-2 py-1 rounded-md border border-indigo-300 bg-indigo-100 text-indigo-700 dark:border-indigo-700/50 dark:bg-indigo-900/30 dark:text-indigo-400 truncate shadow-sm relative z-10"
                            title={`Entrega Programada #${p.proforma_number}: ${p.crm_users?.company_name || p.crm_users?.contact_name}`}
                          >
                            🚚 Entrega #{p.proforma_number} - {p.crm_users?.company_name || p.crm_users?.contact_name || "Cliente"}
                          </div>
                        ))}

                        {/* 4. RECIBOS */}
                        {dayReceipts.map(receipt => (
                          <div 
                            key={receipt.id}
                            className="text-[9px] font-bold px-2 py-1 rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-900/30 dark:text-indigo-400 truncate flex items-center gap-1 shadow-sm"
                            title={`RECIBO Nº ${receipt.receipt_number}: ₡${receipt.amount.toLocaleString()}`}
                          >
                            <Calculator className="w-2.5 h-2.5" /> {receipt.client_name || "Pago"}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Barra de Filtros Inferior */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/50 bg-zinc-900/50 overflow-x-auto">
          <div className="flex flex-nowrap sm:flex-wrap gap-2 sm:gap-4 min-w-max">
            <button 
              onClick={() => setFilterMode('all')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                filterMode === 'all' ? "border-slate-300 bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 text-slate-800 dark:text-white" : "border-slate-800 bg-zinc-900 text-slate-500 opacity-60 hover:opacity-100"
              )}
            >
              Ver Todo
            </button>

            <button 
              onClick={() => setFilterMode('cotizaciones')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                filterMode === 'cotizaciones' ? "border-orange-500 bg-orange-900/30 text-orange-400" : "border-slate-800 bg-zinc-900 text-slate-500 opacity-60 hover:opacity-100"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></div>
              Cotizaciones
            </button>
            
            <button 
              onClick={() => setFilterMode('ventas')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                filterMode === 'ventas' ? "border-emerald-500 bg-emerald-900/30 text-emerald-400" : "border-slate-800 bg-zinc-900 text-slate-500 opacity-60 hover:opacity-100"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
              Ventas Cerradas
            </button>

            <button 
              onClick={() => setFilterMode('entregas')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                filterMode === 'entregas' ? "border-indigo-500 bg-indigo-900/30 text-indigo-400" : "border-slate-800 bg-zinc-900 text-slate-500 opacity-60 hover:opacity-100"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></div>
              Entregas Programadas
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: TO-DO LIST DEL DÍA */}
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex flex-col">
        <div className="p-4 sm:p-6 border-b border-zinc-800/30 bg-zinc-950">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-5 h-5 text-amber-500" />
            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Plan del Día</h4>
          </div>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize">
            {selectedDate.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="flex-1 p-4 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
          {todaysTodos.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center justify-center opacity-50">
              <CheckSquare className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Día Libre</p>
              <p className="text-xs text-slate-400 mt-1">No hay tareas programadas para este día.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysTodos.map(todo => (
                <div 
                  key={todo.id} 
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border transition-all group",
                    todo.done 
                      ? "bg-slate-100 dark:bg-zinc-800/50 border-transparent opacity-60" 
                      : "bg-zinc-900 border-zinc-800 shadow-sm hover:border-amber-500/50"
                  )}
                >
                  {editingTodoId === todo.id ? (
                      <form 
                        onSubmit={(e) => saveEdit(selectedKey, todo.id, e)}
                        className="flex-1 flex items-center gap-2"
                      >
                         <input 
                            type="text" 
                            autoFocus
                            value={editTodoInput}
                            onChange={(e) => setEditTodoInput(e.target.value)}
                            className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-amber-500 rounded-lg px-2 py-1 text-sm outline-none text-slate-800 dark:text-zinc-200"
                         />
                         <button type="submit" className="p-1 rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors" title="Guardar">
                           <Check className="w-3.5 h-3.5" />
                         </button>
                         <button type="button" onClick={() => setEditingTodoId(null)} className="p-1 rounded bg-slate-200 dark:bg-zinc-700 text-slate-500 dark:text-zinc-300 hover:bg-slate-300 transition-colors" title="Cancelar">
                           <X className="w-3.5 h-3.5" />
                         </button>
                      </form>
                  ) : (
                    <>
                      <div className={cn(
                        "w-5 h-5 rounded flex items-center justify-center mt-0.5 border flex-shrink-0 transition-colors cursor-pointer",
                        todo.done ? "bg-green-500 border-green-500" : "border-slate-300 dark:border-zinc-600 hover:border-green-500"
                      )}
                      onClick={() => toggleTodo(selectedKey, todo.id)}
                      >
                        {todo.done && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={cn(
                        "text-sm font-medium transition-all flex-1 cursor-pointer",
                        todo.done ? "line-through text-slate-400 dark:text-zinc-500" : "text-slate-700 dark:text-zinc-300"
                      )}
                      onClick={() => toggleTodo(selectedKey, todo.id)}
                      >
                        {todo.text}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={(e) => startEditing(todo.id, todo.text, e)}
                           className="p-1.5 rounded-md text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-zinc-700 transition-colors"
                           title="Editar tarea"
                         >
                           <Pencil className="w-3.5 h-3.5" />
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); deleteTodo(selectedKey, todo.id); }}
                           className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-zinc-700 transition-colors"
                           title="Eliminar tarea"
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800/30 bg-zinc-950">
          <form onSubmit={handleAddTodo} className="relative">
            <input 
              type="text" 
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              placeholder="Añadir una nueva tarea..."
              className="w-full bg-slate-100 dark:bg-zinc-800 border-none rounded-xl py-3 pl-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white dark:placeholder-zinc-500"
            />
            <button 
              type="submit"
              disabled={!todoInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:hover:bg-amber-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}