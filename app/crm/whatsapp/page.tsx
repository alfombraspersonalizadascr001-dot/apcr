'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Sun, Moon, MessageCircle, 
  Send, Calculator, Edit3, Trash2, CheckCircle2, 
  User, Phone, Clock, ArrowRight, ShieldCheck, 
  Sparkles, RefreshCw, X, Check, ExternalLink,
  ChevronRight, Smartphone, AlertCircle, MessageSquare,
  QrCode, Wifi, LogOut, CheckCircle, ListFilter, Tag,
  ChevronDown
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { supabase } from "@/lib/supabase";

interface ChatItem {
  id: string | number;
  name: string;
  phone: string;
  msg: string;
  time: string;
  received_at?: string;
  is_converted?: boolean;
}

interface LeadItem {
  id: string;
  account_number: string;
  company_name: string;
  contact_name: string;
  phone: string;
  province?: string;
  tags?: string[];
  created_at: string;
  notes?: string;
}

export const AVAILABLE_TAGS = [
  { id: 'nuevo_prospecto', label: 'Nuevo', emoji: '🟢', activeBg: 'bg-emerald-500/20', activeText: 'text-emerald-700 dark:text-emerald-300', activeBorder: 'border-emerald-500/40' },
  { id: 'cotizado', label: 'Cotizado', emoji: '🟡', activeBg: 'bg-amber-500/20', activeText: 'text-amber-700 dark:text-amber-300', activeBorder: 'border-amber-500/40' },
  { id: 'en_negociacion', label: 'En Negociación', emoji: '🔵', activeBg: 'bg-blue-500/20', activeText: 'text-blue-700 dark:text-blue-300', activeBorder: 'border-blue-500/40' },
  { id: 'pago_pendiente', label: 'Pago Pendiente', emoji: '🟠', activeBg: 'bg-orange-500/20', activeText: 'text-orange-700 dark:text-orange-300', activeBorder: 'border-orange-500/40' },
  { id: 'en_produccion', label: 'En Confección', emoji: '🟣', activeBg: 'bg-purple-500/20', activeText: 'text-purple-700 dark:text-purple-300', activeBorder: 'border-purple-500/40' },
  { id: 'cliente_vip', label: 'VIP', emoji: '⭐', activeBg: 'bg-yellow-500/20', activeText: 'text-yellow-700 dark:text-yellow-300', activeBorder: 'border-yellow-500/40' }
];

export const QUICK_REPLIES = [
  { label: 'Saludo & Logo', emoji: '👋', text: '¡Hola! Gracias por comunicarte con Alfombras Personalizadas CR. ¿Con qué medidas (ancho x largo) deseas cotizar y cuentas con el logo en imagen o vector?' },
  { label: 'Alfombra 124x75', emoji: '📐', text: 'Nuestra medida más vendida para entradas principales es de 124cm x 75cm en rizo vinilo atrapamugre con base de hule antiderrapante y logo personalizado.' },
  { label: 'Cuentas / SINPE', emoji: '💳', text: 'Para iniciar la confección requerimos el 50% de anticipo. Nuestro SINPE Móvil oficial es 6063-8062 a nombre de Alfombras Personalizadas CR.' },
  { label: 'Tiempos & Garantía', emoji: '🚚', text: 'El tiempo de confección es de 10 a 12 días hábiles y entregamos con 2 años de garantía contra defectos de fábrica.' },
  { label: 'Proforma Lista', emoji: '📄', text: 'Tu cotización formal ya fue generada. Puedes revisarla para confirmar los detalles y proceder con el pedido.' }
];

export default function WhatsAppTwoColumnsPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [agentName, setAgentName] = useState<string>("Rolo");
  const [isWAConnected, setIsWAConnected] = useState<boolean>(false);
  const [connectedPhone, setConnectedPhone] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [qrString, setQrString] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<boolean>(false);

  const SYS_WHATSAPP_ID = 'b1d9eaf7-e220-4bce-80bc-fc4778b5fd52';

  // Datos de las 2 columnas
  const [incomingChats, setIncomingChats] = useState<ChatItem[]>([]);
  const [crmLeads, setCrmLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Búsqueda en cada columna
  const [searchIncoming, setSearchIncoming] = useState('');
  const [searchLeads, setSearchLeads] = useState('');

  // Chat / Lead seleccionado para ver detalle
  const [selectedContact, setSelectedContact] = useState<{
    tipo: 'incoming' | 'lead';
    data: any;
  } | null>(null);

  // Estado para responder mensaje por WhatsApp
  const [replyText, setReplyText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [showListMenuDropdown, setShowListMenuDropdown] = useState(false);

  // Modal para editar cliente
  const [editingLead, setEditingLead] = useState<LeadItem | null>(null);
  const [editForm, setEditForm] = useState({
    company_name: '',
    contact_name: '',
    phone: '',
    notes: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('crm_theme') || 'light';
    setIsDark(savedTheme === 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Cargar agente
    const agent = document.cookie.split('; ').find(row => row.startsWith('crm_agent_name='))?.split('=')[1];
    if (agent) setAgentName(decodeURIComponent(agent));

    // Cargar datos completos iniciales
    cargarDatosCompletos();

    // Auto-actualización continua en segundo plano cada 2.5s (100% automático sin parpadeos ni botones)
    const interval = setInterval(async () => {
      await checkServerStatus();
      await cargarChatsEntrantes();
    }, 2500);

    // Suscripción en tiempo real a Supabase (Cloud Bridge WhatsApp + Clientes)
    const channel = supabase
      .channel('realtime-whatsapp-crm')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_users' }, (payload: any) => {
        const u = payload.new;
        if (u && u.account_number === 'SYS_WHATSAPP') {
          const connected = u.company_name === 'open';
          setIsWAConnected(connected);
          if (u.contact_name) setQrString(u.contact_name);
          if (connected) {
            setShowQRModal(false);
            if (u.phone) setConnectedPhone(u.phone);
          }
        } else {
          cargarLeadsDesdeSupabase();
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'client_designs',
        filter: `client_id=eq.${SYS_WHATSAPP_ID}`
      }, () => {
        cargarChatsEntrantes();
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const checkServerStatus = async () => {
    try {
      // 1. Consultar estado en Supabase (Cloud Bridge: 100% inmune a restricciones CORS y loopback)
      const { data: sysUser } = await supabase
        .from('crm_users')
        .select('company_name, contact_name, phone, updated_at')
        .eq('account_number', 'SYS_WHATSAPP')
        .maybeSingle();

      if (sysUser) {
        const connected = sysUser.company_name === 'open';
        setIsWAConnected(connected);
        if (sysUser.contact_name) {
          setQrString(sysUser.contact_name);
        }
        if (connected) {
          setShowQRModal(false);
          if (sysUser.phone) setConnectedPhone(sysUser.phone);
        }
        return;
      }

      // 2. Fallback local directo
      const res = await fetch('http://localhost:4000/status').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        const connected = data.status === 'open';
        setIsWAConnected(connected);
        setQrString(data.qr || null);
        if (connected) {
          setShowQRModal(false);
        }
      }
    } catch {
      // mantener estado actual
    }
  };

  const handleDisconnectWhatsApp = async () => {
    if (!confirm('¿Deseas desvincular este número de WhatsApp para conectar otro?')) return;
    setDisconnecting(true);
    try {
      // Notificar a Supabase para que el servicio genere un nuevo QR limpio
      await supabase
        .from('crm_users')
        .update({
          province: 'logout',
          company_name: 'connecting',
          contact_name: '',
          updated_at: new Date().toISOString()
        })
        .eq('account_number', 'SYS_WHATSAPP');

      fetch('http://localhost:4000/api/logout', { method: 'POST' }).catch(() => null);
      setIsWAConnected(false);
      setQrString(null);
      setShowQRModal(true);
      setTimeout(checkServerStatus, 2000);
    } catch (err) {
      console.error('Error al desvincular:', err);
      alert('Error comunicando con la nube para desvincular.');
    } finally {
      setDisconnecting(false);
    }
  };

  const cargarDatosCompletos = async () => {
    setLoading(true);
    await Promise.all([
      cargarChatsEntrantes(),
      cargarLeadsDesdeSupabase()
    ]);
    setLoading(false);
  };

  // Columna 1: Cargar chats entrantes desde Supabase Cloud Bridge (con fallback local)
  const cargarChatsEntrantes = async () => {
    try {
      // 1. Leer desde Supabase Cloud Bridge
      const { data } = await supabase
        .from('client_designs')
        .select('url')
        .eq('client_id', SYS_WHATSAPP_ID)
        .eq('category', 'wa_incoming_chats')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && data.url) {
        try {
          const chats = JSON.parse(data.url);
          if (Array.isArray(chats)) {
            const formatted: ChatItem[] = chats.map((c: any, idx: number) => ({
              id: c.phone || idx,
              name: c.name || `+${c.phone}`,
              phone: c.phone,
              msg: c.lastMessage || 'Mensaje recibido',
              time: new Date(c.lastTimestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              received_at: c.lastTimestamp
            }));
            setIncomingChats(formatted);
            return;
          }
        } catch (e) {}
      }

      // 2. Fallback local si el navegador estuviera en la misma red
      const resLocal = await fetch('http://localhost:4000/api/chats').catch(() => null);
      if (resLocal && resLocal.ok) {
        const localData = await resLocal.json();
        if (Array.isArray(localData.chats)) {
          const formatted: ChatItem[] = localData.chats.map((c: any, idx: number) => ({
            id: c.phone || idx,
            name: c.name || `+${c.phone}`,
            phone: c.phone,
            msg: c.lastMessage || 'Mensaje recibido',
            time: new Date(c.lastTimestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            received_at: c.lastTimestamp
          }));
          setIncomingChats(formatted);
          return;
        }
      }
      setIncomingChats([]);
    } catch (e) {
      console.error('Error cargando chats entrantes:', e);
      setIncomingChats([]);
    }
  };

  // Columna 2: Cargar prospectos en atención de Supabase (calificados manualmente)
  const cargarLeadsDesdeSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (!error && data) {
        // Filtrar exclusivamente los que fueron calificados o puestos en atención
        const filtrados = data.filter(u => 
          Array.isArray(u.tags) && (
            u.tags.includes('en_atencion') || 
            u.tags.includes('prospecto_calificado') ||
            (u.tags.includes('vía_whatsapp') && !u.tags.includes('nuevo_prospecto'))
          )
        );
        setCrmLeads(filtrados);
      }
    } catch (e) {
      console.error('Error cargando leads:', e);
    }
  };

  // Descartar chat entrante (spam, proveedor, etc.) con un clic
  const handleDescartarChat = async (chat: ChatItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Eliminar de inmediato del estado visual
    setIncomingChats(prev => prev.filter(c => c.phone !== chat.phone && c.id !== chat.id));
    if (selectedContact?.data?.phone === chat.phone) {
      setSelectedContact(null);
    }

    try {
      const cleanPhone = String(chat.phone).replace(/\D/g, '');
      await fetch(`http://localhost:4000/api/chat/${cleanPhone}`, {
        method: 'DELETE'
      }).catch(() => null);
    } catch (err: any) {
      console.error('Error descartando chat:', err);
    }
  };

  // PASAR MANUALMENTE DE LA COLUMNA 1 A LA COLUMNA 2
  const handlePasarAAtencion = async (chat: ChatItem) => {
    try {
      const cleanPhone = String(chat.phone).replace(/\D/g, '');
      const cleanName = (chat.name || `Cliente ${cleanPhone}`).trim().toUpperCase();

      // Generar consecutivo
      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const now = new Date();
      const basePrefix = `${months[now.getMonth()]}${String(now.getFullYear()).slice(-2)}`;

      const { data: users } = await supabase
        .from('crm_users')
        .select('account_number')
        .ilike('account_number', `${basePrefix}%`)
        .order('account_number', { ascending: false })
        .limit(50);

      let maxNum = 0;
      (users || []).forEach(u => {
        if (u.account_number) {
          const n = parseInt(u.account_number.replace(basePrefix, ''), 10);
          if (!isNaN(n) && n > maxNum) maxNum = n;
        }
      });
      const nextAccount = `${basePrefix}${String(maxNum + 1).padStart(3, '0')}`;

      // Insertar o actualizar en Supabase
      const newLeadData = {
        account_number: nextAccount,
        company_name: cleanName,
        contact_name: cleanName,
        phone: cleanPhone,
        role: 'client',
        password: 'Admin' + nextAccount,
        tags: ['vía_whatsapp', 'en_atencion', 'prospecto_calificado'],
        province: `Atendido desde chat: "${chat.msg}"`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('crm_users')
        .insert([newLeadData])
        .select();

      if (error) {
        alert("Error al pasar a atención: " + error.message);
        return;
      }

      // Quitar de columna 1 en UI y en el almacén local del servidor
      setIncomingChats(prev => prev.filter(c => c.phone !== chat.phone && c.id !== chat.id));
      fetch(`http://localhost:4000/api/chat/${cleanPhone}`, { method: 'DELETE' }).catch(() => null);

      // Agregar a columna 2
      if (data && data.length > 0) {
        setCrmLeads(prev => [data[0], ...prev]);
        setSelectedContact({ tipo: 'lead', data: data[0] });
      }

    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  // Enviar mensaje por WhatsApp vía Cloud Bridge
  const handleEnviarRespuesta = async () => {
    if (!replyText.trim() || !selectedContact) return;
    const phone = selectedContact.data.phone;
    if (!phone) return;

    setSendingMsg(true);
    try {
      // 1. Encolar en Supabase Cloud Bridge (funciona en cualquier navegador y red)
      const { error: queueErr } = await supabase.from('client_designs').insert([{
        client_id: SYS_WHATSAPP_ID,
        category: 'wa_outgoing_queue',
        url: JSON.stringify({ phone, text: replyText.trim() })
      }]);

      if (queueErr) {
        throw new Error(queueErr.message);
      }

      // 2. Fallback local instantáneo
      fetch('http://localhost:4000/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, text: replyText.trim() })
      }).catch(() => null);

      setReplyText('');
      alert('✅ Mensaje enviado exitosamente a WhatsApp');
    } catch (err: any) {
      alert('⚠️ Error enviando mensaje: ' + err.message);
    } finally {
      setSendingMsg(false);
    }
  };

  // Asignar o remover etiquetas interactivas de un contacto
  const handleToggleTag = async (tagId: string) => {
    if (!selectedContact?.data) return;
    const currentTags: string[] = Array.isArray(selectedContact.data.tags) ? selectedContact.data.tags : [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(t => t !== tagId)
      : [...currentTags, tagId];

    // Actualizar en el estado de selectedContact
    setSelectedContact(prev => prev ? {
      ...prev,
      data: { ...prev.data, tags: newTags }
    } : null);

    // Si es lead en Supabase, guardar en base de datos
    if (selectedContact.data.id && selectedContact.tipo === 'lead') {
      try {
        await supabase
          .from('crm_users')
          .update({ tags: newTags, updated_at: new Date().toISOString() })
          .eq('id', selectedContact.data.id);

        setCrmLeads(prev => prev.map(l => l.id === selectedContact.data.id ? { ...l, tags: newTags } : l));
      } catch (e) {
        console.error('Error actualizando etiqueta en Supabase:', e);
      }
    }
  };

  // Enviar mensaje de lista interactivo nativo de WhatsApp
  const handleSendInteractiveList = async (listType: 'catalogo' | 'pagos' | 'logistica') => {
    if (!selectedContact?.data?.phone) return;
    const phone = selectedContact.data.phone;

    let listData: any = null;

    if (listType === 'catalogo') {
      listData = {
        title: "Catálogo Oficial • Alfombras Personalizadas CR",
        text: "Estimado cliente, seleccione una de las opciones para brindarle atención inmediata sobre modelos y medidas:",
        footer: "Garantía de Fábrica 2 Años • APCR Costa Rica",
        buttonText: "📋 Ver Opciones",
        sections: [
          {
            title: "Modelos Más Cotizados",
            rows: [
              { title: "Atrapamugre 124x75cm", rowId: "mat_124_75", description: "Medida comercial para entradas de alto tránsito con borde de hule" },
              { title: "Atrapamugre 60x40cm", rowId: "mat_60_40", description: "Medida estándar para oficinas o residencias" },
              { title: "Rizo Vinilo a la Medida", rowId: "mat_custom", description: "Confección en cualquier medida personalizada con logo" }
            ]
          },
          {
            title: "Gestión Comercial",
            rows: [
              { title: "Solicitar Proforma Oficial PDF", rowId: "cmd_proforma", description: "Documento formal con desglose de IVA y tiempos" },
              { title: "Cuentas Bancarias y SINPE", rowId: "cmd_pago", description: "Datos para pago de anticipo del 50%" },
              { title: "Tiempos de Entrega & Envío", rowId: "cmd_entrega", description: "10 a 12 días hábiles a todo Costa Rica" }
            ]
          }
        ]
      };
    } else if (listType === 'pagos') {
      listData = {
        title: "Información de Pagos y Facturación",
        text: "Para iniciar la confección se requiere un 50% de anticipo. Seleccione la opción de su preferencia:",
        footer: "Alfombras Personalizadas CR",
        buttonText: "💳 Ver Cuentas",
        sections: [
          {
            title: "Métodos Oficiales de Pago",
            rows: [
              { title: "SINPE Móvil 6063-8062", rowId: "pay_sinpe", description: "A nombre de Alfombras Personalizadas CR" },
              { title: "Cuenta IBAN BAC Credomatic", rowId: "pay_bac", description: "Transferencia bancaria en colones" },
              { title: "Cuenta IBAN Banco Nacional", rowId: "pay_bn", description: "Transferencia bancaria en colones" },
              { title: "Factura Electrónica", rowId: "pay_factura", description: "Solicitar envío de factura con cédula jurídica" }
            ]
          }
        ]
      };
    } else if (listType === 'logistica') {
      listData = {
        title: "Plazos, Envíos y Respaldo",
        text: "Detalles sobre nuestros plazos de producción, garantía y cobertura:",
        footer: "Alfombras Personalizadas CR",
        buttonText: "🚚 Ver Información",
        sections: [
          {
            title: "Entrega y Garantía",
            rows: [
              { title: "Tiempos de Producción", rowId: "info_tiempos", description: "10 a 12 días hábiles de confección especializada" },
              { title: "Envíos a Todo Costa Rica", rowId: "info_envios", description: "Por Correos de CR o servicio de encomienda" },
              { title: "Garantía de 2 Años", rowId: "info_garantia", description: "Respaldo contra defectos y desgaste prematuro" }
            ]
          }
        ]
      };
    }

    try {
      await supabase.from('client_designs').insert([{
        client_id: SYS_WHATSAPP_ID,
        category: 'wa_outgoing_queue',
        url: JSON.stringify({ phone, type: 'list', listData })
      }]);
      alert(`✅ Lista interactiva "${listData.title}" enviada exitosamente al cliente por WhatsApp`);
    } catch (err: any) {
      alert("Error enviando lista: " + err.message);
    }
  };

  // Guardar edición de datos de cliente
  const handleGuardarEdicion = async () => {
    if (!editingLead) return;
    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from('crm_users')
        .update({
          company_name: editForm.company_name.toUpperCase(),
          contact_name: editForm.contact_name.toUpperCase(),
          phone: editForm.phone,
          province: editForm.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingLead.id);

      if (error) throw error;

      // Actualizar en el estado local
      setCrmLeads(prev => prev.map(l => l.id === editingLead.id ? {
        ...l,
        company_name: editForm.company_name.toUpperCase(),
        contact_name: editForm.contact_name.toUpperCase(),
        phone: editForm.phone,
        province: editForm.notes
      } : l));

      if (selectedContact?.data?.id === editingLead.id) {
        setSelectedContact(prev => prev ? {
          ...prev,
          data: {
            ...prev.data,
            company_name: editForm.company_name.toUpperCase(),
            contact_name: editForm.contact_name.toUpperCase(),
            phone: editForm.phone,
            province: editForm.notes
          }
        } : null);
      }

      setEditingLead(null);
    } catch (e: any) {
      alert('Error al guardar datos: ' + e.message);
    } finally {
      setSavingEdit(false);
    }
  };

  // Abrir modal de edición
  const abrirEdicion = (lead: LeadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingLead(lead);
    setEditForm({
      company_name: lead.company_name || '',
      contact_name: lead.contact_name || '',
      phone: lead.phone || '',
      notes: lead.province || lead.notes || ''
    });
  };

  // Filtrados
  const filteredIncoming = useMemo(() => {
    if (!searchIncoming.trim()) return incomingChats;
    const q = searchIncoming.toLowerCase();
    return incomingChats.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.phone.includes(q) || 
      c.msg.toLowerCase().includes(q)
    );
  }, [incomingChats, searchIncoming]);

  const filteredLeads = useMemo(() => {
    if (!searchLeads.trim()) return crmLeads;
    const q = searchLeads.toLowerCase().replace('#', '');
    return crmLeads.filter(l => 
      (l.company_name && l.company_name.toLowerCase().includes(q)) ||
      (l.contact_name && l.contact_name.toLowerCase().includes(q)) ||
      (l.account_number && l.account_number.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q)) ||
      (Array.isArray(l.tags) && l.tags.some(t => t.toLowerCase().includes(q)))
    );
  }, [crmLeads, searchLeads]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('crm_theme', next ? 'dark' : 'light');
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col font-sans overflow-hidden ${isDark ? 'dark bg-[#111b21] text-zinc-100' : 'bg-[#f0f2f5] text-slate-900'}`}>
      
      {/* HEADER SUPERIOR TIPO WHATSAPP WEB */}
      <header className={`h-14 border-b flex items-center justify-between px-6 z-20 flex-shrink-0 ${isDark ? 'bg-[#202c33] border-[#222e35]' : 'bg-[#00a884] border-[#009575] text-white'}`}>
        <div className="flex items-center gap-4">
          <Link href="/crm" className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-white/10 text-white'}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h1 className="text-base font-bold tracking-tight">WhatsApp CRM — Alfombras Personalizadas CR</h1>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ml-2 ${isWAConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'}`}>
              <span className={`w-2 h-2 rounded-full ${isWAConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isWAConnected ? 'En Vivo' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* BOTÓN VINCULACIÓN NATIVA QR */}
          <button
            onClick={() => setShowQRModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              isWAConnected 
                ? (isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30' : 'bg-white/20 text-white border-white/40 hover:bg-white/30') 
                : 'bg-amber-400 text-black border-amber-300 hover:bg-amber-300 shadow-md font-black animate-pulse'
            }`}
            title={isWAConnected ? "Gestionar o cambiar número de WhatsApp" : "Vincular WhatsApp con código QR"}
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">{isWAConnected ? 'Dispositivo Vinculado' : 'Vincular WhatsApp (QR)'}</span>
          </button>

          <button 
            onClick={cargarDatosCompletos} 
            title="Refrescar datos"
            className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-semibold ${isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-white/10 text-white'}`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refrescar</span>
          </button>
          <button 
            onClick={toggleTheme} 
            title="Cambiar tema"
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-white/10 text-white'}`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* CUERPO PRINCIPAL EN 2 COLUMNAS COMPACTAS */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ============================================================ */}
        {/* COLUMNA 1: WHATSAPP ENTRANTES (TODOS LOS CHATS)               */}
        {/* ============================================================ */}
        <div className={`w-1/2 flex flex-col border-r overflow-hidden ${isDark ? 'bg-[#111b21] border-[#222e35]' : 'bg-white border-slate-200'}`}>
          
          {/* Cabecera Columna 1 */}
          <div className={`p-3 border-b flex flex-col gap-2 ${isDark ? 'bg-[#202c33] border-[#222e35]' : 'bg-[#f0f2f5] border-slate-200'}`}>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-wider">1. Chats Entrantes (WhatsApp)</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-800 text-emerald-400' : 'bg-slate-200 text-slate-700'}`}>
                {filteredIncoming.length} chats
              </span>
            </div>

            {/* Barra de búsqueda estilo WhatsApp */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${isDark ? 'bg-[#111b21] border-zinc-700 text-zinc-200' : 'bg-white border-slate-300 text-slate-800'}`}>
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input 
                type="text" 
                value={searchIncoming} 
                onChange={e => setSearchIncoming(e.target.value)}
                placeholder="Buscar o empezar un chat..." 
                className="w-full bg-transparent border-none outline-none text-xs"
              />
              {searchIncoming && (
                <button onClick={() => setSearchIncoming('')}><X className="w-3.5 h-3.5 text-slate-400"/></button>
              )}
            </div>
          </div>

          {/* Banner de alerta si WhatsApp no está conectado */}
          {!isWAConnected && (
            <div 
              onClick={() => setShowQRModal(true)}
              className="m-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:bg-amber-500/20 transition-all text-amber-300 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-400">WhatsApp no vinculado</p>
                  <p className="text-[11px] text-muted-foreground dark:text-zinc-400">Toca aquí para escanear el código QR nativo</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-black text-[11px]">Escanear QR</span>
            </div>
          )}

          {/* Lista Compacta de Chats (Estilo WhatsApp Web: ~68px de alto) */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
                <span>Cargando mensajes...</span>
              </div>
            ) : filteredIncoming.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <p className="font-semibold">No hay chats pendientes en la bandeja de entrada</p>
                <p className="text-[11px] opacity-70">Apenas te escriban a WhatsApp aparecerán en esta columna.</p>
              </div>
            ) : (
              filteredIncoming.map((chat) => {
                const isSelected = selectedContact?.data?.phone === chat.phone;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedContact({ tipo: 'incoming', data: chat })}
                    className={`h-[68px] px-3 flex items-center gap-3 cursor-pointer transition-colors relative group ${
                      isSelected 
                        ? (isDark ? 'bg-[#2a3942]' : 'bg-[#f0f2f5]') 
                        : (isDark ? 'hover:bg-[#202c33]' : 'hover:bg-slate-50')
                    }`}
                  >
                    {/* Avatar circular WhatsApp */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                      {chat.name ? chat.name.charAt(0).toUpperCase() : 'W'}
                    </div>

                    {/* Texto del chat */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-bold text-xs truncate dark:text-zinc-100 text-slate-900">
                          {chat.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate leading-snug">
                        {chat.msg}
                      </p>
                    </div>

                    {/* BOTONES DE ACCIÓN: DESCARTAR (BASURA) Y ATENDER */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={(e) => handleDescartarChat(chat, e)}
                        title="Descartar chat (spam, proveedor, etc.)"
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark 
                            ? 'hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400' 
                            : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePasarAAtencion(chat);
                        }}
                        title="Atender este cliente y pasarlo a Prospectos Calificados"
                        className="opacity-95 hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all flex-shrink-0 active:scale-95"
                      >
                        <span>Atender</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* COLUMNA 2: PROSPECTOS EN ATENCIÓN (CALIFICADOS CRM)          */}
        {/* ============================================================ */}
        <div className={`w-1/2 flex flex-col overflow-hidden ${isDark ? 'bg-[#111b21]' : 'bg-slate-50/60'}`}>
          
          {/* Cabecera Columna 2 */}
          <div className={`p-3 border-b flex flex-col gap-2 ${isDark ? 'bg-[#202c33] border-[#222e35]' : 'bg-[#f0f2f5] border-slate-200'}`}>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider">2. Prospectos en Atención (CRM)</h2>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isDark ? 'bg-zinc-800 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
                {filteredLeads.length} activos
              </span>
            </div>

            {/* Barra de búsqueda de prospectos */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${isDark ? 'bg-[#111b21] border-zinc-700 text-zinc-200' : 'bg-white border-slate-300 text-slate-800'}`}>
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input 
                type="text" 
                value={searchLeads} 
                onChange={e => setSearchLeads(e.target.value)}
                placeholder="Buscar prospectos calificados por nombre, cuenta o teléfono..." 
                className="w-full bg-transparent border-none outline-none text-xs"
              />
              {searchLeads && (
                <button onClick={() => setSearchLeads('')}><X className="w-3.5 h-3.5 text-slate-400"/></button>
              )}
            </div>
          </div>

          {/* Lista Compacta de Prospectos en Atención (68px de alto) */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60 custom-scrollbar">
            {crmLeads.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-zinc-800 flex items-center justify-center text-blue-500">
                  <User className="w-6 h-6" />
                </div>
                <p className="font-semibold">Aún no has pasado contactos a esta columna</p>
                <p className="text-[11px] opacity-70">Haz clic en <b>"Atender"</b> en cualquier chat de la izquierda para gestionarlo aquí.</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No se encontraron prospectos con esa búsqueda.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedContact?.data?.id === lead.id || selectedContact?.data?.phone === lead.phone;
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedContact({ tipo: 'lead', data: lead })}
                    className={`h-[68px] px-3 flex items-center gap-3 cursor-pointer transition-colors relative group ${
                      isSelected 
                        ? (isDark ? 'bg-[#2a3942]' : 'bg-[#e8f0fe]') 
                        : (isDark ? 'hover:bg-[#202c33]' : 'hover:bg-white')
                    }`}
                  >
                    {/* Avatar con inicial */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-sm">
                      {lead.company_name ? lead.company_name.charAt(0) : 'C'}
                    </div>

                    {/* Datos del Prospecto */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2 truncate">
                          <h3 className="font-bold text-xs truncate dark:text-zinc-100 text-slate-900">
                            {lead.company_name || lead.contact_name}
                          </h3>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold">
                            {lead.account_number}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                          {lead.phone ? `+${lead.phone}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate leading-snug flex-1">
                          {lead.province || 'En seguimiento para cotización'}
                        </p>
                        {Array.isArray(lead.tags) && lead.tags.filter(t => !['vía_whatsapp', 'en_atencion', 'nuevo_prospecto'].includes(t)).slice(0, 2).map(tid => {
                          const tagObj = AVAILABLE_TAGS.find(at => at.id === tid);
                          return tagObj ? (
                            <span key={tid} className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border flex-shrink-0 ${tagObj.activeBg} ${tagObj.activeText} ${tagObj.activeBorder}`}>
                              {tagObj.emoji} {tagObj.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN RÁPIDA (COTIZAR & EDITAR) */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Link
                        href={`/crm/cotizador?cliente=${encodeURIComponent(lead.company_name || lead.contact_name)}&telefono=${encodeURIComponent(lead.phone || '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm transition-all active:scale-95"
                        title="Crear Cotización"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Cotizar</span>
                      </Link>

                      <button
                        onClick={(e) => abrirEdicion(lead, e)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-700 text-zinc-300' : 'hover:bg-slate-200 text-slate-600'}`}
                        title="Editar Datos del Cliente"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* PANEL FLOTANTE DE DETALLE / CONVERSACIÓN DEL CONTACTO         */}
      {/* ============================================================ */}
      {selectedContact && (
        <div className="fixed inset-y-0 right-0 w-[420px] z-40 shadow-2xl flex flex-col border-l animate-in slide-in-from-right duration-200"
          style={{ background: isDark ? '#111b21' : '#ffffff', borderColor: isDark ? '#222e35' : '#cbd5e1' }}
        >
          {/* Header del detalle */}
          <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'bg-[#202c33] border-[#222e35]' : 'bg-[#f0f2f5] border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow">
                {(selectedContact.data.company_name || selectedContact.data.name || 'W').charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs truncate max-w-[220px]">
                  {selectedContact.data.company_name || selectedContact.data.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  +{selectedContact.data.phone} {selectedContact.data.account_number ? `• #${selectedContact.data.account_number}` : ''}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedContact(null)}
              className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo de conversación estilo burbujas de WhatsApp */}
          <div 
            className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar"
            style={{
              backgroundColor: isDark ? '#0b141a' : '#efeae2',
              backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          >
            {/* Mensaje original del cliente */}
            <div className="flex justify-start">
              <div className={`max-w-[85%] rounded-2xl rounded-tl-sm p-3.5 shadow-sm text-xs leading-relaxed ${isDark ? 'bg-[#202c33] text-zinc-100' : 'bg-white text-slate-900'}`}>
                <p className="font-semibold mb-1 text-[10px] text-emerald-500 uppercase tracking-wider">Mensaje Recibido</p>
                <p className="text-xs whitespace-pre-wrap">{selectedContact.data.province || selectedContact.data.msg || 'Hola, me interesa una cotización de alfombras.'}</p>
                <div className="flex justify-end mt-1 text-[9px] text-slate-400 font-medium">
                  {selectedContact.data.time || 'Reciente'}
                </div>
              </div>
            </div>

            {/* Ficha rápida de datos con etiquetas interactivas */}
            <div className={`p-3 rounded-xl border text-[11px] space-y-2 my-3 ${isDark ? 'bg-[#182229] border-zinc-800 text-zinc-300' : 'bg-white/90 border-slate-200 text-slate-700'}`}>
              <div className="flex justify-between font-bold text-[10px] uppercase text-emerald-600 pb-1 border-b border-slate-100 dark:border-zinc-800">
                <span>Ficha del Prospecto</span>
                <span>{selectedContact.data.account_number || 'Por calificar'}</span>
              </div>
              <p><b>Teléfono:</b> +{selectedContact.data.phone || 'No indicado'}</p>
              <p><b>Estado:</b> {selectedContact.tipo === 'lead' ? 'Calificado en Atención' : 'Entrante por calificar'}</p>

              {/* Selector de Etiquetas / Labels */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[10px] uppercase text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-emerald-500" />
                    <span>Etiquetas de Estado:</span>
                  </span>
                  <span className="text-[9px] text-slate-400">1 clic para alternar</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {AVAILABLE_TAGS.map(t => {
                    const active = Array.isArray(selectedContact.data.tags) && selectedContact.data.tags.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTag(t.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                          active
                            ? `${t.activeBg} ${t.activeText} ${t.activeBorder} shadow-xs scale-102`
                            : 'bg-transparent text-slate-400 border-slate-200 dark:border-zinc-700 hover:border-slate-400'
                        }`}
                        title={`Alternar etiqueta ${t.label}`}
                      >
                        {t.emoji} {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Barra inferior para responder WhatsApp o Cotizar */}
          <div className={`p-3 border-t flex flex-col gap-2 ${isDark ? 'bg-[#202c33] border-[#222e35]' : 'bg-[#f0f2f5] border-slate-200'}`}>
            
            {/* Barra de Respuestas Rápidas (Canned Responses) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 flex-shrink-0 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Rápidas:</span>
              </span>
              {QUICK_REPLIES.map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReplyText(qr.text)}
                  className={`flex-shrink-0 px-2 py-1 rounded-lg border font-medium text-[10px] flex items-center gap-1 transition-all ${
                    isDark 
                      ? 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-white' 
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
                  }`}
                  title={qr.text}
                >
                  <span>{qr.emoji}</span>
                  <span>{qr.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 relative">
              {/* Botón de Menús de Lista Interactivos */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowListMenuDropdown(!showListMenuDropdown)}
                  className="px-2.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-500/30 transition-all flex-shrink-0"
                  title="Enviar menú interactivo de opciones a WhatsApp del cliente"
                >
                  <ListFilter className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Menú Lista</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {showListMenuDropdown && (
                  <div className={`absolute bottom-full mb-2 left-0 w-72 rounded-2xl shadow-2xl border p-2 z-50 flex flex-col gap-1 ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Listas Interactivas de WhatsApp
                    </div>
                    <button
                      type="button"
                      onClick={() => { handleSendInteractiveList('catalogo'); setShowListMenuDropdown(false); }}
                      className="text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-500/10 hover:text-emerald-500 font-semibold flex flex-col gap-0.5 transition-colors"
                    >
                      <span className="font-bold flex items-center gap-1.5">📋 Catálogo & Modelos Oficiales</span>
                      <span className="text-[10px] font-normal text-muted-foreground">Medidas 124x75, 60x40 y personalizadas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { handleSendInteractiveList('pagos'); setShowListMenuDropdown(false); }}
                      className="text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-500/10 hover:text-emerald-500 font-semibold flex flex-col gap-0.5 transition-colors"
                    >
                      <span className="font-bold flex items-center gap-1.5">💳 Métodos de Pago & SINPE</span>
                      <span className="text-[10px] font-normal text-muted-foreground">Cuentas BAC, BN y SINPE 6063-8062</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { handleSendInteractiveList('logistica'); setShowListMenuDropdown(false); }}
                      className="text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-500/10 hover:text-emerald-500 font-semibold flex flex-col gap-0.5 transition-colors"
                    >
                      <span className="font-bold flex items-center gap-1.5">🚚 Plazos de Entrega & Garantía</span>
                      <span className="text-[10px] font-normal text-muted-foreground">10 a 12 días confección y 2 años garantía</span>
                    </button>
                  </div>
                )}
              </div>

              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEnviarRespuesta()}
                placeholder="Escribe un mensaje de WhatsApp..."
                className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none ${isDark ? 'bg-[#2a3942] border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
              />
              <button
                onClick={handleEnviarRespuesta}
                disabled={sendingMsg || !replyText.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow flex-shrink-0"
                title="Enviar por WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/crm/cotizador?cliente=${encodeURIComponent(selectedContact.data.company_name || selectedContact.data.name)}&telefono=${encodeURIComponent(selectedContact.data.phone || '')}`}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Calculator className="w-4 h-4" />
                <span>Generar Cotización</span>
              </Link>

              {selectedContact.tipo === 'incoming' && (
                <button
                  onClick={() => handlePasarAAtencion(selectedContact.data)}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <span>Mover a Atención</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL PARA EDITAR INFORMACIÓN DE CLIENTE                     */}
      {/* ============================================================ */}
      {editingLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${isDark ? 'bg-[#1f2c34] border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-700">
              <h3 className="font-bold text-sm">Editar Información del Cliente</h3>
              <button onClick={() => setEditingLead(null)} className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Nombre / Empresa:</label>
                <input
                  type="text"
                  value={editForm.company_name}
                  onChange={e => setEditForm({ ...editForm, company_name: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border outline-none font-medium ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Nombre de Contacto:</label>
                <input
                  type="text"
                  value={editForm.contact_name}
                  onChange={e => setEditForm({ ...editForm, contact_name: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border outline-none font-medium ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Teléfono:</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border outline-none font-medium ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Notas de Interés / Producto:</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border outline-none font-medium ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-200 dark:border-zinc-700">
              <button
                onClick={() => setEditingLead(null)}
                className={`px-4 py-2 rounded-lg font-bold text-xs ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarEdicion}
                disabled={savingEdit}
                className="px-5 py-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow"
              >
                {savingEdit ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL NATIVO COMERCIAL: VINCULAR WHATSAPP (SAAS READY)         */}
      {/* ============================================================ */}
      {showQRModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className={`w-full max-w-lg rounded-[2.5rem] border shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center relative overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            {/* Botón cerrar */}
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowQRModal(false)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Icono Cabecera */}
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
              <MessageCircle className="w-9 h-9 text-emerald-500" />
            </div>

            <h3 className="text-2xl font-black tracking-tight mb-2">
              {isWAConnected ? 'WhatsApp Conectado' : 'Vincular WhatsApp Oficial'}
            </h3>
            <p className="text-xs text-muted-foreground font-medium mb-6 max-w-sm leading-relaxed">
              {isWAConnected 
                ? (connectedPhone ? `Conectado al número +${connectedPhone}. Sincronizando chats en tiempo real con el CRM.` : 'Tu número oficial está activo y sincronizando chats en tiempo real con el CRM.')
                : 'Escanea el código QR desde tu celular para centralizar tus mensajes y proformas.'}
            </p>

            {/* Contenedor del Código QR o Estado */}
            <div className="relative p-5 bg-white rounded-3xl border-2 border-slate-100 shadow-inner flex items-center justify-center">
              {isWAConnected ? (
                <div className="w-[220px] h-[220px] flex flex-col items-center justify-center gap-3 text-emerald-600 bg-emerald-50 rounded-2xl">
                  <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
                  <span className="font-black text-sm uppercase tracking-wider text-emerald-700">¡Conexión Activa!</span>
                  <span className="text-[11px] text-emerald-600/80 font-bold">
                    {connectedPhone ? `+${connectedPhone}` : 'Listo para recibir y cotizar'}
                  </span>
                </div>
              ) : qrString ? (
                <div className="relative flex flex-col items-center">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <QRCode
                      value={qrString}
                      size={220}
                      level="M"
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-[220px] h-[220px] flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-2xl">
                  <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-xs font-bold text-slate-500">Generando código QR...</p>
                  <p className="text-[10px] text-slate-400 max-w-[200px]">Conectando de forma segura con el servicio de WhatsApp</p>
                </div>
              )}
            </div>

            {/* Badge de estado en tiempo real */}
            <div className="mt-5">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                isWAConnected 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isWAConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {isWAConnected 
                  ? (connectedPhone ? `🟢 Conectado (+${connectedPhone})` : '🟢 Listo y funcionando') 
                  : qrString ? '🟡 Esperando escaneo desde tu celular...' : 'Generando código QR...'}
              </span>
            </div>

            {/* Pasos para el usuario */}
            {!isWAConnected && (
              <div className={`text-left mt-6 p-4 rounded-2xl text-xs w-full max-w-sm ${isDark ? 'bg-zinc-800/60 text-zinc-300' : 'bg-slate-50 text-slate-600'}`}>
                <p className="font-bold text-slate-900 dark:text-zinc-100 mb-2 uppercase text-[10px] tracking-widest">
                  Pasos sencillos:
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] leading-relaxed">
                  <li>Abre <b>WhatsApp</b> en tu celular.</li>
                  <li>Toca <b>Ajustes</b> o los <b>3 puntos</b> arriba.</li>
                  <li>Entra en <b>Dispositivos vinculados</b>.</li>
                  <li>Toca <b>Vincular un dispositivo</b> y apunta la cámara a este código QR.</li>
                </ol>
              </div>
            )}

            {/* Botones de acción */}
            <div className="mt-6 flex items-center gap-3 w-full max-w-sm justify-center">
              {isWAConnected ? (
                <button
                  onClick={handleDisconnectWhatsApp}
                  disabled={disconnecting}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{disconnecting ? 'Desvinculando...' : 'Desvincular / Cambiar Teléfono'}</span>
                </button>
              ) : (
                <button
                  onClick={handleDisconnectWhatsApp}
                  disabled={disconnecting}
                  className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${disconnecting ? 'animate-spin' : ''}`} />
                  <span>{disconnecting ? 'Generando...' : 'Generar Nuevo QR'}</span>
                </button>
              )}

              <button
                onClick={() => setShowQRModal(false)}
                className="py-2 px-5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
              >
                {isWAConnected ? 'Continuar al CRM' : 'Cerrar'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}