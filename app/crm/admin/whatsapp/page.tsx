'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Layers, Globe, Plus, Settings, LogOut, FileText, Calculator, Sun, Moon, 
  MessageCircle, TrendingUp, Users, DollarSign, CreditCard, Book, Upload, 
  BarChart3, Mail, Check, X, Calendar, QrCode, Smartphone, Wifi, Zap, 
  ArrowRight, MousePointer2, GripVertical, Trash2, ArrowLeft, MoreHorizontal,
  Search, Filter
} from 'lucide-react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { supabase } from "@/lib/supabase";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function cn_local(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}

// Componente principal
export default function WhatsAppCRMPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isWAConnected, setIsWAConnected] = useState(false);
  const [isTableReady, setIsTableReady] = useState<boolean | 'loading'>('loading');
  const [qrString, setQrString] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [agentName, setAgentName] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    checkDBTable();
    const savedTheme = localStorage.getItem('crm_theme');
    if (savedTheme === 'dark') setIsDark(true);
    const agent = document.cookie.split('; ').find(row => row.startsWith('crm_agent_name='))?.split('=')[1];
    setAgentName(decodeURIComponent(agent || "Agente"));

    // Fetch inicial de datos reales
    fetchIncomingChats();
    fetchLeads();
    fetchWASettings();

    // SUSCRIPCIÓN EN TIEMPO REAL (REAL REAL) - Supabase Realtime
    const channel = supabase
      .channel('wa-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wa_incoming' }, payload => {
          if (!payload.new.is_converted) {
            setChats(prev => {
              const existingIndex = prev.findIndex(c => c.phone === payload.new.sender_phone);
              const newChat = {
                ...payload.new,
                name: payload.new.sender_name || `+${payload.new.sender_phone}`,
                msg: payload.new.message_text,
                phone: payload.new.sender_phone,
                time: "Ahora"
              };
              
              if (existingIndex !== -1) {
                // Actualizar mensaje, nombre y mover arriba (como WhatsApp real)
                const filtered = prev.filter(c => c.phone !== payload.new.sender_phone);
                return [newChat, ...filtered];
              } else {
                return [newChat, ...prev];
              }
            });
          }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wa_incoming' }, payload => {
          if (payload.new.is_converted) {
            // Si cualquier mensaje de ese teléfono se convierte, quitamos la tarjeta de la lista
            setChats(prev => prev.filter(c => c.phone !== payload.new.sender_phone));
          }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wa_settings' }, (payload: any) => {
          const { session_status, qr_base64 } = payload.new;
          if (session_status === 'connecting') {
            setQrString(qr_base64);
            setShowQRModal(true);
            setIsWAConnected(false);
          } else if (session_status === 'open') {
            setIsWAConnected(true);
            setShowQRModal(false);
            setQrString(null);
          } else if (session_status === 'disconnected' || session_status === 'closed') {
            setIsWAConnected(false);
            setQrString(null);
          }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkDBTable = async () => {
    try {
      const { error } = await supabase.from('wa_incoming').select('count', { count: 'exact', head: true });
      if (error && error.code === '42P01') {
        setIsTableReady(false);
      } else {
        setIsTableReady(true);
      }
    } catch (e) {
      setIsTableReady(false);
    }
  };

  const fetchWASettings = async () => {
    const { data, error } = await supabase.from('wa_settings').select('*').limit(1).single();
    if (!error && data) {
      if (data.session_status === 'open') {
        setIsWAConnected(true);
      } else if (data.session_status === 'connecting' && data.qr_base64) {
        setQrString(data.qr_base64);
      }
    }
  };

  const fetchIncomingChats = async () => {
    try {
      const { data, error } = await supabase
        .from('wa_incoming')
        .select('*')
        .eq('is_converted', false)
        .order('received_at', { ascending: false });

      if (!error && data) {
        // AGRUPAR POR TELÉFONO (Único chat por persona)
        const groupedMap = new Map();
        data.forEach(d => {
          if (!groupedMap.has(d.sender_phone)) {
            groupedMap.set(d.sender_phone, {
              ...d,
              name: d.sender_name || `+${d.sender_phone}`,
              msg: d.message_text,
              phone: d.sender_phone,
              time: new Date(d.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
        });
        setChats(Array.from(groupedMap.values()));
      }
    } catch (e) {
      console.error("Error fetching chats:", e);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_users')
        .select('*')
        .contains('tags', ['vía_whatsapp'])
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLeads(data);
      }
    } catch (e) {
      console.error("Error fetching leads:", e);
    }
  };

  const handleDragStart = (event: any) => setActiveId(event.active.id);

  const handleConvertToLead = async (chat: any) => {
    try {
      // 1. Obtener el último número de cuenta para generar el siguiente consecutivo
      let nextAccountNumber = "1001"; // Default por si falla
      const { data: lastUser } = await supabase
        .from('crm_users')
        .select('account_number')
        .order('account_number', { ascending: false })
        .limit(1);

      if (lastUser && lastUser.length > 0) {
        const lastNum = parseInt(lastUser[0].account_number.replace(/\D/g, ''));
        if (!isNaN(lastNum)) {
          nextAccountNumber = String(lastNum + 1);
        }
      }

      // 2. Crear el Lead en CRM
      const newLead = {
        account_number: nextAccountNumber,
        company_name: "Prospecto (WhatsApp)",
        contact_name: chat.name || `+${chat.phone}`,
        phone: chat.phone,
        role: 'client',
        status: 'active',
        interest_level: 1,
        tags: ['vía_whatsapp'],
        assigned_to: agentName,
        notes: `Lead extraído automáticamente. Cuenta #${nextAccountNumber}. Último mensaje: "${chat.msg}"`
      };

      const { data: leadData, error: leadError } = await supabase.from('crm_users').insert([newLead]).select();
      if (leadError) throw leadError;

      // 3. Marcar como CONVERTIDO TODO el historial de ese teléfono
      const { error: updateError } = await supabase
        .from('wa_incoming')
        .update({ is_converted: true, agent_name: agentName })
        .eq('sender_phone', chat.phone);

      if (updateError) throw updateError;

      // UI update
      setChats(prev => prev.filter(c => c.phone !== chat.phone));
      fetchLeads();
      alert(`✅ ¡Prospecto #${nextAccountNumber} (${chat.name || chat.phone}) creado con éxito!`);
      
    } catch (e: any) {
      console.error(e);
      alert("Error al convertir: " + e.message);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    if (active.data.current?.type === 'chat' && over.id === 'leads-column') {
      const chatId = active.id;
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        handleConvertToLead(chat);
      }
    }
  };

  const handleConnectWA = () => {
    setShowQRModal(true);
    // Ahora dependemos del tiempo real de Supabase 
    // que el servidor local (whatsapp-server) actualizará al generar el QR.
  };

  return (
    <div className={cn_local("min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500 flex flex-col", isDark && "dark")}>
      
      {/* HEADER DINÁMICO */}
      <header className="h-20 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black uppercase tracking-tight dark:text-white">WhatsApp CRM</h1>
              <span className={cn_local("px-2 py-0.5 text-[10px] font-black rounded-full border", 
                isWAConnected ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20")}>
                {isWAConnected ? 'CONECTADO' : 'DESCONECTADO'}
              </span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Motor de Conversión de Leads</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-zinc-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
            <div className="px-3 py-1 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 flex items-center gap-2">
              <div className={cn_local("w-2 h-2 rounded-full", isWAConnected ? "bg-green-500 animate-pulse" : "bg-slate-300")} />
              <span className="text-[10px] font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest">{agentName}</span>
            </div>
            {!isWAConnected && (
              <button onClick={handleConnectWA} className="px-3 py-1.5 text-[10px] font-black uppercase bg-amber-500 text-black rounded-xl hover:bg-amber-600 transition-colors">Vincular</button>
            )}
          </div>
          <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-500 hover:text-amber-500 transition-colors">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-hidden flex flex-col">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="max-w-[1600px] mx-auto w-full flex-1 grid lg:grid-cols-3 gap-8 overflow-hidden pb-8">
            
            {/* COLUMN 1: INCOMING CHATS */}
            <div className="flex flex-col gap-6 h-full overflow-hidden">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-widest dark:text-white">Entrantes (Live)</h3>
                  <span className="bg-slate-200 dark:bg-zinc-800 text-[10px] font-black px-2 py-0.5 rounded-full">{chats.length}</span>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-colors"><Search className="w-4 h-4 text-slate-400"/></button>
                   <button className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-colors"><Filter className="w-4 h-4 text-slate-400"/></button>
                </div>
              </div>

              <div className={cn_local(
                "flex-1 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm overflow-y-auto custom-scrollbar flex flex-col gap-4 relative",
                !isWAConnected && "opacity-60 grayscale-[0.8]"
              )}>
                
                {/* SETUP UI (PARA ROLO) */}
                {isTableReady === false && isWAConnected && (
                  <div className="absolute inset-0 z-[60] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl flex items-center justify-center p-8 text-center rounded-[2.5rem] animate-in fade-in duration-500">
                    <div className="max-w-xs">
                       <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Settings className="w-8 h-8 text-amber-500 animate-[spin_3s_linear_infinite]" />
                       </div>
                       <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">Activar Motor Real</h3>
                       <p className="text-[11px] text-muted-foreground mt-3 font-bold leading-relaxed uppercase opacity-70">Copia este código y pégalo en el <span className="text-slate-900 dark:text-white">SQL Editor</span> de tu Supabase para recibir mensajes en vivo.</p>
                       
                       <div className="mt-8 p-5 bg-slate-900 dark:bg-black rounded-3xl text-left font-mono text-[9px] text-amber-500/90 overflow-hidden shadow-2xl relative border border-white/5">
                          <pre className="opacity-50 select-all">
{`CREATE TABLE wa_incoming (
  id UUID PRIMARY KEY DEFAULT 
  gen_random_uuid(),
  sender_name TEXT,
  sender_phone TEXT,
  message_text TEXT,
  received_at TIMESTAMPTZ 
  DEFAULT NOW(),
  is_converted BOOLEAN 
  DEFAULT FALSE
);`}
                          </pre>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => {
                            navigator.clipboard.writeText(`CREATE TABLE wa_incoming ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), sender_name TEXT, sender_phone TEXT, message_text TEXT, received_at TIMESTAMPTZ DEFAULT NOW(), is_converted BOOLEAN DEFAULT FALSE ); alter publication supabase_realtime add table wa_incoming;`);
                            alert("¡Código Copiado!");
                          }}>
                             <span className="bg-amber-500 text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase">Copiar Código</span>
                          </div>
                       </div>
                       
                       <div className="mt-6 flex flex-col gap-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">¿Ya lo hiciste?</p>
                          <button onClick={() => checkDBTable()} className="w-full py-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-sm hover:scale-105 transition-all">Verificar Conexión</button>
                       </div>
                    </div>
                  </div>
                )}

                {!isWAConnected ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-6">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center relative">
                      <Wifi className="w-10 h-10 text-slate-300" />
                      <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full border-4 border-white dark:border-zinc-900" />
                    </div>
                    <div className="max-w-[200px]">
                      <p className="font-black text-sm uppercase tracking-tighter dark:text-white">Sin Conexión</p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">Escanea el QR para transformar tu WhatsApp en una máquina de ventas.</p>
                    </div>
                    <button onClick={handleConnectWA} className="bg-slate-900 dark:bg-amber-500 text-white dark:text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl font-bold">Vincular Ahora</button>
                  </div>
                ) : (
                  chats.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-6 animate-in fade-in duration-700">
                       <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center opacity-40">
                          <MessageCircle className="w-10 h-10 text-slate-400" />
                       </div>
                       <div className="max-w-[220px]">
                          <p className="font-black text-xs uppercase tracking-widest dark:text-white">Buzón Vacío</p>
                          <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase opacity-60 leading-relaxed">
                             Tu motor real está encendido, pero aún no tienes mensajes nuevos en la base de datos.
                          </p>
                       </div>
                       
                       <div className="flex flex-col gap-3 w-full max-w-[180px]">
                          <button 
                            onClick={async () => {
                               const testChat = {
                                  sender_name: "Cliente de Prueba",
                                  sender_phone: "+506 8000-0000",
                                  message_text: "Hola! Estoy probando el CRM real.",
                                  is_converted: false
                               };
                               await supabase.from('wa_incoming').insert([testChat]);
                               // Re-fetch should happen via realtime
                            }}
                            className="text-[10px] font-black uppercase tracking-widest p-3 bg-amber-500 text-black rounded-xl hover:scale-105 transition-all shadow-md"
                          >
                             Simular Mensaje Nuevo
                          </button>
                          <button 
                            onClick={() => setIsTableReady(false)}
                            className="text-[9px] font-black uppercase text-slate-400 hover:text-amber-500 transition-colors"
                          >
                             Ver Guía de Configuración
                          </button>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {chats.map((chat) => (
                      <DraggableChatCard key={chat.id} chat={chat} onConvert={() => handleConvertToLead(chat)} />
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* COLUMN 2: LEADS PIPELINE */}
            <DroppablePipelineStage id="leads-column" title="Pipeline de Prospectos" count={leads.length} icon={<Zap className="text-amber-500" />}>
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
                {leads.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-[2rem] opacity-30 mt-4">
                    <MousePointer2 className="w-12 h-12 mb-4 text-slate-400" />
                    <p className="text-xs font-black uppercase tracking-widest leading-loose">Arrastra un chat aquí<br/>para crear un Prospecto</p>
                  </div>
                ) : (
                  leads.map((lead: any) => (
                    <div key={lead.id} className="p-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-sm hover:border-amber-500/50 transition-all group relative">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Lead Caliente</span>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-1">{lead.contact_name}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate opacity-80">{lead.notes?.split(':')[1] || lead.notes}</p>
                      
                      <div className="mt-4 pt-4 border-t border-slate-50 dark:border-zinc-800 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                          <Smartphone className="w-3 h-3" /> {lead.phone}
                        </div>
                        <Link href="/admin" className="flex items-center gap-1.5 p-1.5 px-3 bg-slate-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:text-amber-500 transition-colors">
                          Gestionar <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DroppablePipelineStage>

            {/* COLUMN 3: ANALYTICS & STATS */}
            <div className="flex flex-col gap-8 h-full">
              <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
                
                <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-emerald-500" /> Rendimiento de Embudos
                </h3>

                <div className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                      <span className="dark:text-white">Conversión Chat a Lead</span>
                      <span className="text-emerald-500">68%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[68%]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                      <span className="dark:text-white">Tiempo de Respuesta</span>
                      <span className="text-amber-500">4m avg</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[45%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-6 bg-slate-900 dark:bg-white rounded-[2rem] text-white dark:text-black shadow-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Impacto en Ventas</p>
                  <div className="flex items-end gap-2 mt-2">
                    <p className="text-3xl font-black tracking-tighter">+$1,240</p>
                    <span className="text-xs font-black text-green-400 dark:text-green-600 mb-1">HOY</span>
                  </div>
                  <p className="text-[9px] font-bold mt-2 opacity-50 uppercase tracking-widest">Basado en 14 nuevos prospectos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-auto">
                 <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl flex items-center gap-4 group hover:border-blue-500 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                       <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-black text-sm uppercase tracking-tight dark:text-white">Cotizador Inteligente</h4>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Proformas automáticas</p>
                    </div>
                 </div>
              </div>
            </div>

          </div>

          <DragOverlay>
            {activeId ? (
              <div className="w-80 p-5 bg-white dark:bg-zinc-900 border-2 border-amber-500 rounded-3xl shadow-2xl scale-105 rotate-3 z-[1000]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black font-black text-lg">
                    {chats.find(c => c.id === activeId)?.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-sm dark:text-white">{chats.find(c => c.id === activeId)?.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">Categorizando Lead...</p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* MODAL QR */}
      {showQRModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] border border-slate-200 dark:border-zinc-800 shadow-2xl p-10 text-center flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <button onClick={() => setShowQRModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8">
              <QrCode className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-3 dark:text-white">Conexión Segura</h3>
            <p className="text-sm text-muted-foreground font-medium mb-10 leading-relaxed">Escanea el código para centralizar tu WhatsApp en el <span className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-widest">Mando Central</span></p>
            
            <div className="relative p-8 bg-white rounded-[2.5rem] border-2 border-slate-100 dark:border-zinc-200 shadow-inner group">
              {qrString ? (
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden p-6 bg-white shadow-2xl border-4 border-zinc-100 flex items-center justify-center">
                    <QRCode
                       value={qrString}
                       viewBox={`0 0 256 256`}
                       style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                     <div className="p-4 bg-white rounded-full shadow-2xl">
                        <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
                     </div>
                  </div>
                </div>
              ) : (
                <div className="w-[220px] h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl animate-pulse border-2 border-dashed border-slate-200 dark:border-zinc-800">
                  <Smartphone className="w-10 h-10 text-slate-300" />
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Generando QR...</p>
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col gap-4 w-full text-center">
              <div className="flex flex-col items-center gap-2 justify-center text-amber-600 font-black text-[10px] uppercase tracking-widest animate-pulse">
                <div className="flex items-center gap-2">
                   {qrString ? <QrCode className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                   {qrString ? 'Listo para escanear' : 'Conectando con servidor local...'}
                </div>
                {qrString && <span className="opacity-40 font-medium lowercase">id: {qrString.substring(0, 10)}...</span>}
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Asegúrate de ejecutar el servidor local</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUBCOMPONENTS ---

function DraggableChatCard({ chat, onConvert }: { chat: any, onConvert: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: chat.id,
    data: { type: 'chat' }
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn_local(
        "p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] shadow-sm hover:border-amber-500/50 transition-all group overflow-hidden relative",
        isDragging && "opacity-50 ring-2 ring-amber-500 shadow-2xl scale-95 z-[100]"
      )}
    >
      <div className="flex justify-between items-start mb-2" {...listeners} {...attributes}>
        <h5 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">
          {chat.name || `+${chat.phone}`}
        </h5>
        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{chat.time}</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-100 truncate leading-relaxed font-bold opacity-100 mb-4" {...listeners} {...attributes}>
        {chat.msg}
      </p>
      
      <div className="flex items-center justify-between border-t border-slate-50 dark:border-zinc-800 pt-4">
        <div className="flex items-center gap-2">
           <Zap size={12} className="text-green-500" />
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">En Vivo</span>
        </div>
        <button 
           onClick={(e) => {
             e.stopPropagation();
             onConvert();
           }}
           className="bg-amber-500 text-black px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md z-50 relative"
        >
          Conv. Lead
        </button>
      </div>
    </div>
  );
}

function DroppablePipelineStage({ id, title, count, icon, children }: any) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-black text-sm uppercase tracking-widest dark:text-white">{title}</h3>
          <span className="bg-amber-500 text-black text-[10px] font-black px-3 py-0.5 rounded-full uppercase">{count}</span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-slate-400" />
      </div>

      <div
        ref={setNodeRef}
        className={cn_local(
          "flex-1 bg-slate-100/50 dark:bg-zinc-900/30 border-2 border-dashed rounded-[3rem] p-6 shadow-inner flex flex-col gap-4 overflow-y-auto custom-scrollbar transition-all",
          isOver ? "border-amber-500 bg-amber-500/10 scale-[1.02] shadow-2xl shadow-amber-500/10" : "border-slate-200 dark:border-zinc-800"
        )}
      >
        {children}
      </div>
    </div>
  );
}