'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Layers, Globe, Plus, Settings, LogOut, FileText, Calculator, Sun, Moon, 
  MessageCircle, TrendingUp, Users, DollarSign, CreditCard, Book, Upload, 
  BarChart3, Mail, Check, X, Calendar, QrCode, Smartphone, Wifi, Zap, 
  ArrowRight, MousePointer2, GripVertical, Trash2, Package, Menu, Printer,
  ShoppingBag, Store, Sparkles, Percent, ExternalLink, Tag, Phone, ShieldCheck,
  Award, MapPin, Gift, Bell, Clock, CheckCircle, Building2, UtensilsCrossed,
  Stethoscope, Wrench, Dumbbell, Shirt, Truck, Headphones, Receipt
} from 'lucide-react';
import Link from 'next/link';
import ChatImporter from './components/ChatImporter';
import { WhatsAppMessage } from './components/WhatsAppParser';
import AnalyticsView from './components/AnalyticsView';
import EmailClient from './components/EmailClient';
import CalendarWidget from './components/CalendarWidget';
import FollowUpRadar from './components/FollowUpRadar';
import ChurnRiskRadar from './components/ChurnRiskRadar';
import ProductionKanbanBoard from './components/ProductionKanbanBoard';
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
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

// Mock inicial
const INITIAL_CHATS = [
  { id: 1, name: "Carlos M.", phone: "+506 8888-1111", msg: "Hola, me interesa una alfombra...", time: "2m", unread: true },
  { id: 2, name: "Restaurante La Casona", phone: "+506 7777-2222", msg: "¿Me pueden enviar la factura?", time: "15m", unread: false },
  { id: 3, name: "Hotel Marriott", phone: "+506 6666-3333", msg: "Gracias, quedó perfecto.", time: "1h", unread: false },
  { id: 4, name: "Mariana S.", phone: "+506 5555-4444", msg: "Cotización #4402 aprobada.", time: "3h", unread: false },
  { id: 5, name: "Gym Pro", phone: "+506 4444-5555", msg: "¿Tienen color rojo?", time: "5h", unread: false },
];

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [leads, setLeads] = useState<any[]>([]); // New Leads stage
  const [showImporter, setShowImporter] = useState(false);
  const [importedChats, setImportedChats] = useState<{ name: string, messages: WhatsAppMessage[] }[]>([]);
  const [activeModule, setActiveModule] = useState<'dashboard' | 'analytics' | 'email' | 'calendar' | 'kanban'>('dashboard');
  const [clientActiveTab, setClientActiveTab] = useState<'quotes' | 'status' | 'catalog' | 'directory' | 'support'>('quotes');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [agentName, setAgentName] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Logic to move from WhatsApp to Leads
    if (active.data.current?.type === 'chat' && over.id === 'leads-column') {
      const chatId = active.id;
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        // 1. Create real lead in Supabase
        const newLead = {
          company_name: "Prospecto (WhatsApp)",
          contact_name: chat.name,
          phone: chat.phone || "",
          role: 'client',
          status: 'active',
          interest_level: 1,
          tags: ['vía_whatsapp'],
          assigned_to: agentName,
          notes: `Convertido desde chat: "${chat.msg}"`
        };

        const { data, error } = await supabase.from('crm_users').insert([newLead]).select();
        
        if (!error && data) {
          // 2. Remove from incoming chats
          setChats(prev => prev.filter(c => c.id !== chatId));
          // 3. Add to local leads state
          setLeads(prev => [data[0], ...prev]);
          alert(`🎉 ¡${chat.name} ahora es un Prospecto en el CRM!`);
        } else {
          alert("Error al crear el prospecto: " + (error?.message || "Desconocido"));
        }
      }
    }
  };


  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('crm_theme') || 'light';
      setIsDark(savedTheme === 'dark');
    };
    window.addEventListener('themechange', handleThemeChange);
    handleThemeChange();
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('crm_theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  // Function to handle invoice generation
  const handleInvoiceClick = async () => {
    try {
      alert("🔗 Conectando con GTI (Entorno de Pruebas)...\n\nPara facturar realmente, necesitamos configurar el usuario y contraseña en el archivo .env.");
    } catch (e) {
      alert("Error al conectar con GTI");
    }
  };

  const handleImportChat = (name: string, messages: WhatsAppMessage[]) => {
    // Agregar a la lista de "chats importados" y también a la vista previa
    const lastMsg = messages[messages.length - 1];
    const newChatPreview = {
      id: Date.now(),
      name: name,
      phone: "+506 8888-0000", // Default or extracted
      msg: lastMsg ? lastMsg.content : "Sin mensajes",
      time: "Importado",
      unread: true
    };

    setChats([newChatPreview, ...chats]);
    setImportedChats(prev => [...prev, { name, messages }]);

    // Aquí podríamos guardar en localStorage o BD real
    alert(`✅ Chat "${name}" importado con éxito (${messages.length} mensajes).`);
  };

  const [userRole, setUserRole] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Get role from cookie
    const role = document.cookie.split('; ').find(row => row.startsWith('crm_role='))?.split('=')[1];
    const agent = document.cookie.split('; ').find(row => row.startsWith('crm_agent_name='))?.split('=')[1];
    
    setUserRole(role || 'admin'); // Default to admin for legacy/master login
    setAgentName(decodeURIComponent(agent || ""));

    console.log('Dashboard loaded, search params:', window.location.search);

    // Handle search params for activeModule and OAuth2 redirects
    const params = new URLSearchParams(window.location.search);
    const activeMod = params.get('activeModule') || params.get('module');
    if (activeMod && ['dashboard', 'inventory', 'clients', 'calculator', 'proformas', 'analytics', 'calendar', 'email', 'kanban'].includes(activeMod)) {
      setActiveModule(activeMod as any);
    }

    const success = params.get('success');
    const error = params.get('error');
    const details = params.get('details');
    const step = params.get('step');

    if (success) {
      setActiveModule('email');
      if (success === 'outlook_connected') {
        setStatusMessage({ type: 'success', text: '¡Cuenta de Outlook conectada con éxito! 🎉' });
      } else if (success === 'gmail_connected') {
        setStatusMessage({ type: 'success', text: '¡Cuenta de Gmail conectada con éxito! 🎉' });
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      setActiveModule('email');
      setStatusMessage({ type: 'error', text: `Error de conexión (Paso ${step || '?'}): ${error}${details ? ` - ${details}` : ''}` });
      // Keep search params for debugging if it's an error
    }
  }, []);

  const handleLogout = () => {
    // Clear all auth cookies
    document.cookie = "crm_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
    document.cookie = "crm_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
    document.cookie = "crm_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
    localStorage.removeItem('crm_authenticated');
    router.push('/login');
    router.refresh();
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDark ? 'bg-zinc-950 dark' : 'bg-card'} text-foreground selection:bg-blue-600/30`}>

      {/* Top Notification */}
      {statusMessage && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${statusMessage.type === 'success' ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600'
          }`}>
          <div className="bg-background/20 p-1 rounded-full">
            {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </div>
          <span className="font-bold text-sm tracking-wide">{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="ml-2 hover:bg-background/20 p-1 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 bg-background flex-col transition-colors duration-300">
        <div className="h-20 flex items-center px-6 border-b border-slate-200 gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="AP Logo"
              fill
              className="object-contain invert dark:invert-0 drop-shadow-md"
            />
          </div>
          <div>
            <span className="font-bold tracking-wide block leading-tight text-lg text-slate-900">CRM Plus</span>
            <span className="text-[10px] text-green-500 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {/* Resumen/Dashboard - Solo para Staff Interno */}
          {userRole !== 'client' && agentName !== 'Freelance' && (
            <button onClick={() => setActiveModule('dashboard')} className="w-full text-left">
              <NavItem icon={<Layers />} label="Resumen General" active={activeModule === 'dashboard'} />
            </button>
          )}

          {userRole !== 'client' && (
            <>
              <div className="pt-4 pb-2 px-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Herramientas</div>
              
              <Link href="/crm/inventory">
                <NavItem icon={<Package />} label="Inventario" />
              </Link>
              
              <Link href="/crm/admin">
                <NavItem icon={<Users />} label={agentName === 'Freelance' ? "Mis Clientes" : "Clientes y Cuentas"} />
              </Link>

              <Link href="/crm/cotizador">
                <NavItem icon={<Calculator />} label="Cotizador" />
              </Link>

              <Link href="/crm/proformas">
                <NavItem icon={<FileText />} label="Cotizaciones" />
              </Link>

              <button onClick={() => setActiveModule('kanban')} className="w-full text-left">
                <NavItem icon={<Layers className="text-amber-500" />} label="Tablero de Pedidos" active={activeModule === 'kanban'} />
              </button>

              <Link href="/">
                <NavItem icon={<Globe />} label="Sitio Web" />
              </Link>

              <Link href="/crm/admin/knowledge">
                <NavItem icon={<Book />} label="Base de Conocimiento" />
              </Link>
            </>
          )}

          {/* Sistemas - Solo Staff Interno */}
          {userRole !== 'client' && agentName !== 'Freelance' && (
            <>
              <div className="pt-4 pb-2 px-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Sistemas</div>
              
              <button onClick={() => setActiveModule('analytics')} className="w-full text-left">
                <NavItem icon={<BarChart3 />} label="Analítica Web" active={activeModule === 'analytics'} />
              </button>

              <button onClick={() => setActiveModule('calendar')} className="w-full text-left mt-1">
                <NavItem icon={<Calendar />} label="Calendario Seguimiento" active={activeModule === 'calendar'} />
              </button>
            </>
          )}

          {userRole === 'client' && (
            <>
              <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Portal de Cliente</div>
              <button onClick={() => setClientActiveTab('quotes')} className="w-full text-left">
                <NavItem icon={<FileText className="text-blue-600 dark:text-blue-400" />} label="Cotizaciones y Recibos" active={clientActiveTab === 'quotes'} />
              </button>
              <button onClick={() => setClientActiveTab('status')} className="w-full text-left">
                <NavItem icon={<TrendingUp className="text-emerald-600 dark:text-emerald-400" />} label="Estatus del Pedido" active={clientActiveTab === 'status'} />
              </button>
              <button onClick={() => setClientActiveTab('catalog')} className="w-full text-left">
                <NavItem icon={<ShoppingBag className="text-blue-600 dark:text-blue-400" />} label="Catálogo" active={clientActiveTab === 'catalog'} />
              </button>
              <button onClick={() => setClientActiveTab('directory')} className="w-full text-left">
                <NavItem icon={<Building2 className="text-emerald-600 dark:text-emerald-400" />} label="Empresas" active={clientActiveTab === 'directory'} />
              </button>
              <button onClick={() => setClientActiveTab('support')} className="w-full text-left">
                <NavItem icon={<MessageCircle className="text-blue-600 dark:text-blue-400" />} label="Soporte" active={clientActiveTab === 'support'} />
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-muted-foreground hover:text-red-500 transition-colors px-3 py-2 w-full rounded-lg text-sm font-medium hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-200" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside 
            className="w-64 h-full bg-background border-r border-slate-200 flex flex-col animate-in slide-in-from-left duration-250" 
            onClick={e => e.stopPropagation()}
          >
            <div className="h-20 flex items-center px-6 border-b border-slate-200 gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="AP Logo"
                  fill
                  className="object-contain invert dark:invert-0 drop-shadow-md"
                />
              </div>
              <div>
                <span className="font-bold tracking-wide block leading-tight text-lg text-slate-900">CRM Plus</span>
                <span className="text-[10px] text-green-500 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {userRole !== 'client' && agentName !== 'Freelance' && (
                <button onClick={() => { setActiveModule('dashboard'); setIsMobileMenuOpen(false); }} className="w-full text-left">
                  <NavItem icon={<Layers />} label="Resumen General" active={activeModule === 'dashboard'} />
                </button>
              )}

              {userRole !== 'client' && (
                <>
                  <div className="pt-4 pb-2 px-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Herramientas</div>
                  
                  <Link href="/crm/inventory" onClick={() => setIsMobileMenuOpen(false)}>
                    <NavItem icon={<Package />} label="Inventario" />
                  </Link>
                  
                  <Link href="/crm/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <NavItem icon={<Users />} label={agentName === 'Freelance' ? "Mis Clientes" : "Clientes y Cuentas"} />
                  </Link>

                  <Link href="/crm/cotizador" onClick={() => setIsMobileMenuOpen(false)}>
                    <NavItem icon={<Calculator />} label="Cotizador" />
                  </Link>

                  <Link href="/crm/proformas" onClick={() => setIsMobileMenuOpen(false)}>
                    <NavItem icon={<FileText />} label="Cotizaciones" />
                  </Link>

                  <button onClick={() => { setActiveModule('kanban'); setIsMobileMenuOpen(false); }} className="w-full text-left">
                    <NavItem icon={<Layers className="text-amber-500" />} label="Tablero de Pedidos" active={activeModule === 'kanban'} />
                  </button>

                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <NavItem icon={<Globe />} label="Sitio Web" />
                  </Link>

                  <Link href="/crm/admin/knowledge" onClick={() => setIsMobileMenuOpen(false)}>
                    <NavItem icon={<Book />} label="Base de Conocimiento" />
                  </Link>
                </>
              )}

              {userRole === 'client' && (
                <>
                  <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Portal de Cliente</div>
                  <button onClick={() => { setClientActiveTab('quotes'); setIsMobileMenuOpen(false); }} className="w-full text-left">
                    <NavItem icon={<FileText className="text-blue-600 dark:text-blue-400" />} label="Cotizaciones y Recibos" active={clientActiveTab === 'quotes'} />
                  </button>
                  <button onClick={() => { setClientActiveTab('status'); setIsMobileMenuOpen(false); }} className="w-full text-left">
                    <NavItem icon={<TrendingUp className="text-emerald-600 dark:text-emerald-400" />} label="Estatus del Pedido" active={clientActiveTab === 'status'} />
                  </button>
                  <button onClick={() => { setClientActiveTab('catalog'); setIsMobileMenuOpen(false); }} className="w-full text-left">
                    <NavItem icon={<ShoppingBag className="text-blue-600 dark:text-blue-400" />} label="Catálogo" active={clientActiveTab === 'catalog'} />
                  </button>
                  <button onClick={() => { setClientActiveTab('directory'); setIsMobileMenuOpen(false); }} className="w-full text-left">
                    <NavItem icon={<Building2 className="text-emerald-600 dark:text-emerald-400" />} label="Empresas" active={clientActiveTab === 'directory'} />
                  </button>
                  <button onClick={() => { setClientActiveTab('support'); setIsMobileMenuOpen(false); }} className="w-full text-left">
                    <NavItem icon={<MessageCircle className="text-blue-600 dark:text-blue-400" />} label="Soporte" active={clientActiveTab === 'support'} />
                  </button>
                </>
              )}
            </nav>

            <div className="p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-muted-foreground hover:text-red-500 transition-colors px-3 py-2 w-full rounded-lg text-sm font-medium hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-6 md:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-700 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-850 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-base md:text-xl font-black tracking-tight text-slate-800 uppercase">
              {userRole === 'client' ? 'Portal de Cliente' : 'Panel de Control'}
            </h1>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-200">LIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-background dark:bg-zinc-900/50 p-1 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-amber-500 hover:bg-background dark:hover:bg-zinc-900 transition-all"
                title={isDark ? 'Modo Día' : 'Modo Noche'}
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button
                onClick={() => alert("Configuraciones próximamente...")}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-amber-500 hover:bg-background dark:hover:bg-zinc-900 transition-all"
                title="Configuración del Sistema"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="hidden sm:flex h-10 px-4 rounded-xl border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 items-center justify-center gap-2 transition-all text-red-600 dark:text-red-400 font-bold text-[10px] uppercase tracking-widest bg-background dark:bg-zinc-900 shadow-sm"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            {userRole === 'client' ? (
              <ClientPortalView activeTab={clientActiveTab} onTabChange={setClientActiveTab} isDark={isDark} />
            ) : activeModule === 'dashboard' ? (
              <>
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <div>
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Comando Central</h2>
                    <p className="text-muted-foreground font-medium">Gestiona conversaciones y prospectos en tiempo real.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                      <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Estado del Sistema</p>
                      <p className="text-[10px] text-muted-foreground font-bold">Resincronizado hace 2m</p>
                    </div>
                  </div>
                </div>

                <FollowUpRadar isDark={isDark} />

                <ChurnRiskRadar isDark={isDark} />

                <FinancialSummary agentName={agentName} isDark={isDark} />
              </>
            ) : activeModule === 'analytics' ? (
              <AnalyticsView />
            ) : activeModule === 'calendar' ? (
              <CalendarWidget />
            ) : activeModule === 'kanban' ? (
              <ProductionKanbanBoard isDark={isDark} />
            ) : (
              <EmailClient />
            )}
          </div>
        </div>

        {/* --- MODALS --- */}
        {showImporter && (
          <ChatImporter
            onImport={handleImportChat}
            onClose={() => setShowImporter(false)}
          />
        )}
      </main>

    </div>
  );
}

// --- SUBCOMPONENTS ---

function DraggableChatCard({ chat }: { chat: any }) {
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
      {...listeners}
      {...attributes}
      className={cn(
        "p-4 bg-background dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm cursor-grab active:cursor-grabbing hover:border-amber-500/50 transition-all group",
        isDragging && "opacity-50 ring-2 ring-amber-500 shadow-2xl scale-95 z-[100]"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <h5 className="font-black text-xs text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">{chat.name}</h5>
        <span className="text-[9px] text-muted-foreground font-bold uppercase">{chat.time}</span>
      </div>
      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate leading-relaxed font-medium">
        {chat.msg}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
           <div className="w-5 h-5 rounded-full bg-green-500 items-center justify-center flex text-[8px] text-white font-bold"><Zap size={10} /></div>
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">En tiempo real</span>
        </div>
        <GripVertical className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

function DroppablePipelineStage({ id, title, count, icon, children }: any) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-black text-sm uppercase tracking-widest">{title}</h3>
          <span className="bg-card dark:bg-zinc-800/50 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{count}</span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-card/50 dark:bg-zinc-900/30 border-2 border-dashed rounded-[2.5rem] p-4 shadow-inner min-h-[500px] flex flex-col gap-3 transition-all",
          isOver ? "border-amber-500 bg-amber-500/10 scale-[1.01] shadow-xl shadow-amber-500/5" : "border-zinc-800/30"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
        active
          ? 'bg-blue-600 text-white font-black shadow-sm'
          : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
      )}>
      {React.cloneElement(icon, { size: 18 })}
      <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
    </div>
  );
}

function StatCard({ title, value, change, icon, active = false }: any) {
  return (
    <div className={cn(
      "p-6 rounded-[2rem] border transition-all",
      active 
        ? 'bg-amber-500 text-black border-amber-600 shadow-xl shadow-amber-500/20' 
        : 'bg-background dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm'
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl", active ? 'bg-black/10' : 'bg-zinc-800 text-foreground')}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className={cn("text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest", active ? 'bg-black/10 text-black' : 'bg-green-500/10 text-green-600')}>
          {change}
        </span>
      </div>
      <div>
        <p className={cn("text-3xl font-black tracking-tight", active ? 'text-black' : 'text-slate-900 dark:text-white')}>{value}</p>
        <p className={cn("text-[10px] font-black uppercase tracking-widest mt-1", active ? 'text-black/70' : 'text-muted-foreground')}>{title}</p>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, color, ...props }: any) {
  return (
    <div
      {...props}
      className={cn(
        "p-5 rounded-[2rem] border bg-background dark:bg-zinc-900 cursor-pointer transition-all hover:scale-[1.02] shadow-sm hover:shadow-md group",
        color
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-card dark:bg-zinc-800 flex items-center justify-center group-hover:bg-background dark:group-hover:bg-zinc-700 transition-colors shadow-inner">
          {icon}
        </div>
        <div>
          <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">{title}</h4>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-70">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function FinancialSummary({ agentName, isDark }: { agentName: string; isDark: boolean }) {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    ventasActivasTotal: 0,
    ventasActivasCount: 0,
    totalCobrado: 0,
    recibosCount: 0,
    saldoPendiente: 0,
  });
  const [recentReceipts, setRecentReceipts] = React.useState<any[]>([]);
  const [closedClients, setClosedClients] = React.useState<any[]>([]);
  const [allClosedProformas, setAllClosedProformas] = React.useState<any[]>([]);
  const [roloStartDate, setRoloStartDate] = React.useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [roloEndDate, setRoloEndDate] = React.useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  React.useEffect(() => {
    fetchData();
  }, [agentName]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: proformas, error: pError } = await supabase
        .from('proformas')
        .select('*, crm_users(*)')
        .order('created_at', { ascending: false });

      if (pError) console.error("Error fetching proformas:", pError);

      let activeProformas: any[] = [];
      let totalActiveSales = 0;
      let totalCollected = 0;
      let totalReceiptsCount = 0;
      let allCollectedReceipts: any[] = [];

      (proformas || []).forEach((p: any) => {
        const clientTags: string[] = Array.isArray(p.crm_users?.tags)
          ? p.crm_users.tags
          : (p.crm_users?.tags ? [p.crm_users.tags] : []);

        // 1. Exclusión de entregado (entregado_am, entregado_ss, entregado) o estado ENTREGADO
        const isEntregado = clientTags.some(t => typeof t === 'string' && t.toLowerCase().includes('entregado')) ||
                            (p.production_status || '').toUpperCase() === 'ENTREGADO' ||
                            (p.status || '').toLowerCase() === 'entregado';

        if (isEntregado) {
          return; // Ya finalizado, no suma en ventas activas ni en cobrado activo
        }

        // 2. Inclusión: Venta cerrada o Pendiente Pago
        const isCotizacionExplicit = (p.status || '').toLowerCase() === 'cotización' || 
                                     (p.status || '').toLowerCase() === 'cotizacion' || 
                                     (p.status || '').toLowerCase() === 'enviada' || 
                                     (p.status || '').toLowerCase() === 'pendiente';
        
        const isApprovedProforma = (p.status || '').toLowerCase() === 'aprobada' || 
                                   (p.status || '').toLowerCase() === 'venta_cerrada' || 
                                   Boolean(p.approved_at) ||
                                   (p.production_status && p.production_status !== 'COTIZACION');

        const hasReceiptEntry = Array.isArray(p.production_history) && p.production_history.some((h: any) => (h.type === 'RECEIPT' || h.status === 'ABONO_50') && Number(h.amount) > 0);

        const isVentaCerrada = isApprovedProforma || hasReceiptEntry || (!isCotizacionExplicit && clientTags.some(t => typeof t === 'string' && (t.toLowerCase().includes('venta_cerrada') || t.toLowerCase().includes('cerrada'))));

        const isPendientePago = clientTags.some(t => typeof t === 'string' && (t.toLowerCase().includes('pendiente_pago') || t.toLowerCase().includes('pago')));

        // Sumar a Ventas Activas si es venta cerrada
        if (isVentaCerrada) {
          activeProformas.push(p);
          totalActiveSales += Number(p.total || 0);
        }

        // Sumar a Total Cobrado — SOLO recibos reales (type='RECEIPT' con monto) o de la tabla receipts
        if (isVentaCerrada || isPendientePago) {
          let proformaCollected = 0;

          if (Array.isArray(p.production_history)) {
            p.production_history.forEach((h: any) => {
              // Solo recibos reales ingresados por un humano con monto explícito
              if (h.type === 'RECEIPT' && h.amount && Number(h.amount) > 0) {
                proformaCollected += Number(h.amount);
                totalReceiptsCount++;
                allCollectedReceipts.push({
                  id: `rec-${p.id}-${h.receipt_number || h.id}`,
                  receipt_number: h.receipt_number || `REC-${p.proforma_number}`,
                  client_name: p.crm_users?.company_name || p.crm_users?.contact_name || 'Cliente',
                  user_id: p.crm_users?.id || p.user_id,
                  amount: Number(h.amount),
                  payment_method: h.payment_method || 'Transferencia',
                  created_at: h.completed_at || p.approved_at || p.created_at
                });
              }
            });
          }

          totalCollected += proformaCollected;
        }
      });

      const saldoPendiente = Math.max(0, totalActiveSales - totalCollected);

      setStats({
        ventasActivasTotal: totalActiveSales,
        ventasActivasCount: activeProformas.length,
        totalCobrado: totalCollected,
        recibosCount: totalReceiptsCount,
        saldoPendiente: saldoPendiente,
      });

      const proformasEnriquecidas = activeProformas.map((p: any) => ({
        ...p,
        client_name: p.crm_users?.company_name || p.crm_users?.contact_name || 'Cliente',
        assigned_to: p.crm_users?.assigned_to
      }));

      setAllClosedProformas(proformasEnriquecidas);
      setRecentReceipts(allCollectedReceipts.slice(0, 5));
      setWeeklyData(buildWeeklyData(allCollectedReceipts));
      setClosedClients(proformasEnriquecidas.slice(0, 5));
    } catch (e) {
      console.error('FinancialSummary error:', e);
    } finally {
      setLoading(false);
    }
  };

  const salesByAgent = React.useMemo(() => {
    if (agentName !== 'Rolo') return { Rolo: 0, Freelance: 0, Total: 0 };
    
    const startDate = new Date(`${roloStartDate}T00:00:00-06:00`);
    const endDate = new Date(`${roloEndDate}T23:59:59-06:00`);

    const result = { Rolo: 0, Freelance: 0, Total: 0 };

    allClosedProformas.forEach((p) => {
      const pDate = new Date(p.created_at);
      if (pDate >= startDate && pDate <= endDate) {
        const items = Array.isArray(p.items) ? p.items : [];
        const matCount = items.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0);
        
        result.Total += matCount;
        
        const agent = String(p.assigned_to || '').trim().toLowerCase();
        if (agent.includes('freelance')) {
          result.Freelance += matCount;
        } else {
          result.Rolo += matCount;
        }
      }
    });
    return result;
  }, [allClosedProformas, roloStartDate, roloEndDate, agentName]);

  const [weeklyData, setWeeklyData] = React.useState<any[]>([]);

  const buildWeeklyData = (receipts: any[]) => {
    const weeks: { label: string; Cobrado: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() - i * 7);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      const label = `S${8 - i}`;
      const Cobrado = (receipts || [])
        .filter((r: any) => {
          const d = new Date(r.created_at);
          return d >= start && d <= end;
        })
        .reduce((sum: number, r: any) => sum + (parseFloat(r.amount) || 0), 0);
      weeks.push({ label, Cobrado });
    }
    return weeks;
  };

  const fmt = (n: number) => `₡${n.toLocaleString('es-CR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const startOfWeek1 = React.useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, []);

  const endOfWeek1 = React.useMemo(() => {
    const sunday = new Date(startOfWeek1);
    sunday.setDate(startOfWeek1.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
  }, [startOfWeek1]);

  const startOfWeek2 = React.useMemo(() => {
    const nextMonday = new Date(startOfWeek1);
    nextMonday.setDate(startOfWeek1.getDate() + 7);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  }, [startOfWeek1]);

  const endOfWeek2 = React.useMemo(() => {
    const nextSunday = new Date(startOfWeek2);
    nextSunday.setDate(startOfWeek2.getDate() + 6);
    nextSunday.setHours(23, 59, 59, 999);
    return nextSunday;
  }, [startOfWeek2]);

  const week1Deliveries = React.useMemo(() => {
    return allClosedProformas.filter(p => {
      if (!p.approved_at) return false;
      const appDate = new Date(p.approved_at);
      const delDate = new Date(appDate.getTime() + (p.delivery_time_days || 12) * 24 * 60 * 60 * 1000);
      return delDate >= startOfWeek1 && delDate <= endOfWeek1;
    }).sort((a, b) => {
      const delA = new Date(new Date(a.approved_at).getTime() + (a.delivery_time_days || 12) * 24 * 60 * 60 * 1000).getTime();
      const delB = new Date(new Date(b.approved_at).getTime() + (b.delivery_time_days || 12) * 24 * 60 * 60 * 1000).getTime();
      return delA - delB;
    });
  }, [allClosedProformas, startOfWeek1, endOfWeek1]);

  const week2Deliveries = React.useMemo(() => {
    return allClosedProformas.filter(p => {
      if (!p.approved_at) return false;
      const appDate = new Date(p.approved_at);
      const delDate = new Date(appDate.getTime() + (p.delivery_time_days || 12) * 24 * 60 * 60 * 1000);
      return delDate >= startOfWeek2 && delDate <= endOfWeek2;
    }).sort((a, b) => {
      const delA = new Date(new Date(a.approved_at).getTime() + (a.delivery_time_days || 12) * 24 * 60 * 60 * 1000).getTime();
      const delB = new Date(new Date(b.approved_at).getTime() + (b.delivery_time_days || 12) * 24 * 60 * 60 * 1000).getTime();
      return delA - delB;
    });
  }, [allClosedProformas, startOfWeek2, endOfWeek2]);

  const getRemainingDaysText = (approvedAt: string, deliveryDays: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appDate = new Date(approvedAt);
    const delDate = new Date(appDate.getTime() + (deliveryDays || 12) * 24 * 60 * 60 * 1000);
    delDate.setHours(0, 0, 0, 0);
    const diffTime = delDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoy ⏰";
    if (diffDays === 1) return "Mañana 🚚";
    if (diffDays > 1) return `En ${diffDays} días`;
    return `Atrasado por ${Math.abs(diffDays)} días ⚠️`;
  };

  const getDeliveryDateFormatted = (approvedAt: string, deliveryDays: number) => {
    const appDate = new Date(approvedAt);
    const delDate = new Date(appDate.getTime() + (deliveryDays || 12) * 24 * 60 * 60 * 1000);
    return delDate.toLocaleDateString('es-CR', { weekday: 'short', day: '2-digit', month: 'short' });
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-background dark:bg-zinc-900 p-8 flex items-center justify-center h-48">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-sm font-bold uppercase tracking-widest">Cargando resumen financiero...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" /> Resumen Financiero
          </h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
            Ventas activas en curso · Cobros · Saldo pendiente
          </p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-amber-500 transition-all" title="Actualizar">
          <TrendingUp className="w-5 h-5" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-amber-500 text-black shadow-xl shadow-amber-500/20 border border-amber-600">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Ventas Activas</p>
          <p className="text-3xl font-black tracking-tight">{fmt(stats.ventasActivasTotal)}</p>
          <p className="text-[10px] font-bold mt-1 opacity-60">{stats.ventasActivasCount} proformas activas en curso</p>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 border border-emerald-600">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Total Cobrado</p>
          <p className="text-3xl font-black tracking-tight">{fmt(stats.totalCobrado)}</p>
          <p className="text-[10px] font-bold mt-1 opacity-70">{stats.recibosCount} recibos de pedidos activos</p>
        </div>
        <div className="p-5 rounded-2xl bg-purple-600 text-white shadow-xl shadow-purple-600/20 border border-purple-700">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Saldo Pendiente</p>
          <p className="text-3xl font-black tracking-tight">{fmt(stats.saldoPendiente)}</p>
          <p className="text-[10px] font-bold mt-1 opacity-70">Por cobrar de pedidos en curso</p>
        </div>
      </div>
 
      {/* Cronograma de Entregas de 2 Semanas */}
      <div className="bg-background dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800/60 bg-slate-50 dark:bg-zinc-850">
          <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-slate-800 dark:text-white">
            <Calendar className="w-4 h-4 text-indigo-500" /> Cronograma de Entregas — Próximas 2 Semanas
          </h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-zinc-950/20">
          {/* Semana 1: Actual */}
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-black uppercase text-amber-500 tracking-wider">Esta Semana</span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-tight">
                {startOfWeek1.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })} - {endOfWeek1.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {week1Deliveries.map(p => (
                <div key={p.id} className="p-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800/80 rounded-xl flex justify-between items-center group hover:border-amber-500/30 transition-all shadow-sm">
                  <div>
                    <Link 
                      href={`/crm/admin?client=${p.user_id || ''}&search=${encodeURIComponent(p.client_name || '')}`}
                      className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase leading-none mb-1 hover:text-amber-500 transition-colors inline-block"
                      title="Ver cuenta del cliente en el CRM"
                    >
                      {p.client_name}
                    </Link>
                    <p className="text-[9px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-tight">
                      Cot. #{p.proforma_number} • <span className="text-amber-600 dark:text-amber-400 font-black">{getRemainingDaysText(p.approved_at, p.delivery_time_days)}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider font-mono">
                    {getDeliveryDateFormatted(p.approved_at, p.delivery_time_days)}
                  </span>
                </div>
              ))}
              {week1Deliveries.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-zinc-600 italic text-center py-6 font-medium">No hay entregas programadas para esta semana</p>
              )}
            </div>
          </div>

          {/* Semana 2: Próxima */}
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-black uppercase text-amber-500 tracking-wider">Próxima Semana</span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-tight">
                {startOfWeek2.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })} - {endOfWeek2.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {week2Deliveries.map(p => (
                <div key={p.id} className="p-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800/80 rounded-xl flex justify-between items-center group hover:border-amber-500/30 transition-all shadow-sm">
                  <div>
                    <Link 
                      href={`/crm/admin?client=${p.user_id || ''}&search=${encodeURIComponent(p.client_name || '')}`}
                      className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase leading-none mb-1 hover:text-amber-500 transition-colors inline-block"
                      title="Ver cuenta del cliente en el CRM"
                    >
                      {p.client_name}
                    </Link>
                    <p className="text-[9px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-tight">
                      Cot. #{p.proforma_number} • <span className="text-amber-600 dark:text-amber-400 font-black">{getRemainingDaysText(p.approved_at, p.delivery_time_days)}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider font-mono">
                    {getDeliveryDateFormatted(p.approved_at, p.delivery_time_days)}
                  </span>
                </div>
              ))}
              {week2Deliveries.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-zinc-600 italic text-center py-6 font-medium">No hay entregas programadas para la próxima semana</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="bg-background dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800/30">
          <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" /> Cobros por Semana — Últimas 8 Semanas
          </h4>
        </div>
        <div className="p-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#3f3f46" : "#e2e8f0"} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: isDark ? '#a1a1aa' : '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? '#a1a1aa' : '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₡${(v/1000).toFixed(0)}k`} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '10px', border: isDark ? '1px solid #3f3f46' : 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: isDark ? '#f4f4f5' : '#1e293b' }}
                formatter={(value: any) => [`₡${Number(value).toLocaleString('es-CR')}`, 'Cobrado']}
              />
              <Bar dataKey="Cobrado" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Activas */}
        <div className="bg-background dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800/30 flex items-center justify-between">
            <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" /> Proformas — Ventas Activas
            </h4>
            <Link href="/crm/admin" className="text-[10px] text-amber-500 font-black uppercase tracking-widest hover:underline">Ver todas →</Link>
          </div>
          <div className="divide-y divide-zinc-800/30">
            {closedClients.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground text-center font-medium">Sin ventas activas en curso</p>
            ) : closedClients.map((p: any) => (
              <div key={p.id} className="px-4 py-3 flex items-center justify-between hover:bg-card dark:hover:bg-zinc-800/30 transition-colors">
                <div>
                  <Link 
                    href={`/crm/admin?client=${p.user_id || ''}&search=${encodeURIComponent(p.client_name || '')}`}
                    className="text-xs font-black text-slate-900 dark:text-white hover:text-amber-500 transition-colors inline-block"
                    title="Ver cuenta del cliente en el CRM"
                  >
                    {p.client_name}
                  </Link>
                  <p className="text-[10px] text-muted-foreground">{p.proforma_number} · {new Date(p.created_at).toLocaleDateString('es-CR')}</p>
                </div>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">{fmt(parseFloat(p.total) || 0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Receipts */}
        <div className="bg-background dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800/30 flex items-center justify-between">
            <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" /> Últimos Recibos
            </h4>
            <Link href="/crm/admin" className="text-[10px] text-amber-500 font-black uppercase tracking-widest hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-zinc-800/30">
            {recentReceipts.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground text-center font-medium">Sin recibos registrados</p>
            ) : recentReceipts.map((r: any, idx: number) => (
              <div key={r.id || `receipt-${r.receipt_number}-${idx}`} className="px-4 py-3 flex items-center justify-between hover:bg-card dark:hover:bg-zinc-800/30 transition-colors">
                <div>
                  <Link
                    href={`/crm/admin?client=${r.user_id || ''}&search=${encodeURIComponent(r.client_name || '')}`}
                    className="text-xs font-black text-slate-900 dark:text-white hover:text-amber-500 transition-colors inline-block"
                    title="Ver cuenta del cliente en el CRM"
                  >
                    {r.client_name}
                  </Link>
                  <p className="text-[10px] text-muted-foreground">{r.receipt_number} · {r.payment_method}</p>
                </div>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{fmt(parseFloat(r.amount) || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CLIENT PORTAL SUBCOMPONENT ---

const APCR_CATALOG_PRODUCTS = [
  {
    id: "atrapa_mugre",
    name: "Alfombras Atrapa-Mugre con Logotipo",
    category: "Entradas & Exterior",
    badge: "Alto Tránsito",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60",
    description: "Tapete de rizo de vinil de alto tránsito con logotipo incrustado milimétricamente y borde de hule vulcanizado de máxima seguridad.",
    specs: [
      "100% Rizo de vinil no poroso lavable",
      "Borde de hule biselado antideslizante",
      "Garantía de confección por 2 años",
      "Especial para atrapar agua, barro y polvo"
    ],
    priceText: "Desde ₡35,000 / m²",
    whatsappMsg: "Hola APCR, me interesa cotizar una Alfombra Atrapa-Mugre con mi logotipo."
  },
  {
    id: "dry_max",
    name: "Alfombras Dry Max Ultra-Absorbentes",
    category: "Interiores & Recepciones",
    badge: "Máxima Absorción",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=60",
    description: "Fibras densas de polipropileno termo-fijado con base de PVC impermeable. Retiene hasta 4 litros de agua por metro cuadrado.",
    specs: [
      "Fibras de polipropileno ultra-absorbente",
      "Base de PVC impermeable y flexible",
      "Secado rápido y fácil aspirado diario",
      "Recomendado para recepciones y pasillos"
    ],
    priceText: "Desde ₡45,000 / m²",
    whatsappMsg: "Hola APCR, me gustaría cotizar una Alfombra Dry Max para interiores."
  },
  {
    id: "panos_hoteleros",
    name: "Paños y Toallas Hoteleras Premium",
    category: "Línea Textil Hotelera",
    badge: "100% Algodón Peinado",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=60",
    description: "Toallas de cuerpo, manos y piscina de 600 GSM con bordado computarizado de alta definición para hoteles, gimnasios y spas.",
    specs: [
      "100% Algodón peinado de 600 gramos",
      "Bordado computarizado ultra-resistente",
      "Resistente a lavados industriales continuos",
      "Paquetes por docena y corporativos"
    ],
    priceText: "Precios especiales por docena",
    whatsappMsg: "Hola APCR, me interesa cotizar un pedido de Paños y Toallas Hoteleras bordadas."
  },
  {
    id: "pisos_antifatiga",
    name: "Pisos y Tapetes Antifatiga Ergonómicos",
    category: "Industrial & Gastronomía",
    badge: "Línea Ergonómica",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=60",
    description: "Tapetes amortiguantes de caucho celular con superficie antideslizante. Reduce el dolor de espalda y articulaciones en un 60%.",
    specs: [
      "Espuma de caucho de alta densidad",
      "Superficie texturizada antiderrame",
      "Disminuye fatiga muscular en jornadas de pie",
      "Ideal para cocinas de restaurantes y cajas"
    ],
    priceText: "Desde ₡28,000 por módulo",
    whatsappMsg: "Hola APCR, deseo cotizar Pisos Antifatiga para mi equipo de trabajo."
  }
];

const APCR_PROMOTIONS = [
  {
    title: "Renovación de Alfombra con Logotipo",
    discount: "15% OFF",
    desc: "Si ya eres cliente de APCR y deseas renovar o reponer tu alfombra de entrada, obtienes 15% de descuento inmediato.",
    code: "RENOVA-APCR",
    btnText: "Aplicar Descuento"
  },
  {
    title: "Combo Alfombra + Línea Hotelera",
    discount: "10% EXTRA",
    desc: "Al comprar 2 o más alfombras atrapa-mugre, recibe un 10% adicional en toallas y paños bordados para tu negocio.",
    code: "COMBO-HOTEL",
    btnText: "Aprovechar Combo"
  },
  {
    title: "Envío Express Gratuito",
    discount: "GRATIS",
    desc: "Envío sin costo adicional a cualquier punto del Gran Área Metropolitana en pedidos superiores a ₡120,000.",
    code: "ENVIO-GRATIS",
    btnText: "Consultar Cobertura"
  }
];

const COMMUNITY_BUSINESS_ADS = [
  {
    id: "fatima",
    name: "Restaurante & Cafetería Fatima",
    category: "Gastronomía",
    tag: "Gastronomía",
    iconType: "utensils",
    description: "Cortes de carne, desayunos típicos, repostería artesanal y café gourmet de altura.",
    benefit: "10% de descuento en tu consumo mostrando tu cuenta APCR",
    location: "Heredia / San José",
    whatsapp: "50688880001",
    verified: true
  },
  {
    id: "dental_sj",
    name: "Clínica Dental San José",
    category: "Salud",
    tag: "Odontología & Salud",
    iconType: "stethoscope",
    description: "Diseño de sonrisa, implantes, ortodoncia invisible y limpieza ultrasónica con especialistas.",
    benefit: "Valoración dental y radiografía panorámica de cortesía",
    location: "San José Centro",
    whatsapp: "50688880002",
    verified: true
  },
  {
    id: "taller_gigante",
    name: "Taller & Repuestos El Gigante",
    category: "Automotriz",
    tag: "Mecánica & Repuestos",
    iconType: "wrench",
    description: "Mantenimiento preventivo, frenos, scanner computarizado y alineado láser multimarcas.",
    benefit: "Diagnóstico por scanner gratis al realizar cambio de aceite",
    location: "Alajuela",
    whatsapp: "50688880003",
    verified: true
  },
  {
    id: "gym_fitness",
    name: "Gym City Fitness & Spa",
    category: "Deporte",
    tag: "Gimnasio & Salud",
    iconType: "dumbbell",
    description: "Zona de pesas, clases funcionales, spinning y sauna con entrenadores certificados.",
    benefit: "Matrícula exonerada + Pase de cortesía por 3 días",
    location: "Curridabat",
    whatsapp: "50688880004",
    verified: true
  },
  {
    id: "boutique_ilsy",
    name: "Boutique & Uniformes ILSY",
    category: "Moda",
    tag: "Moda & Uniformes",
    iconType: "shirt",
    description: "Uniformes ejecutivos, ropa casual de diseño y asesoría de imagen corporativa.",
    benefit: "15% de descuento en confección de uniformes de equipo",
    location: "San Ramón / Palmares",
    whatsapp: "50688880005",
    verified: true
  },
  {
    id: "servica_logistica",
    name: "Grupo Servica Logística",
    category: "Servicios",
    tag: "Transporte & Envíos",
    iconType: "truck",
    description: "Mensajería corporativa, distribución de paquetería y fletes seguros en todo el territorio nacional.",
    benefit: "Tarifa corporativa preferencial en rutas de entrega",
    location: "San José",
    whatsapp: "50688880006",
    verified: true
  }
];

interface ClientPortalViewProps {
  activeTab: 'quotes' | 'status' | 'catalog' | 'directory' | 'support';
  onTabChange?: (tab: 'quotes' | 'status' | 'catalog' | 'directory' | 'support') => void;
  isDark: boolean;
}

function ClientPortalView({ activeTab, onTabChange, isDark }: ClientPortalViewProps) {
  const [clientData, setClientData] = useState<any>(null);
  const [clientProformas, setClientProformas] = useState<any[]>([]);
  const [clientReceipts, setClientReceipts] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [designs, setDesigns] = useState<any[]>([]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProforma, setSelectedProforma] = useState<any>(null);
  const [selectedDirectoryCategory, setSelectedDirectoryCategory] = useState<string>("all");
  const [quoteSubTab, setQuoteSubTab] = useState<'quotes' | 'receipts'>('quotes');
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [notificationPermission, setNotificationPermission] = useState<string>("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIos(/iphone|ipad|ipod/.test(userAgent));
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true);
      if ('Notification' in window) setNotificationPermission(Notification.permission);
      window.addEventListener('beforeinstallprompt', (e: any) => { e.preventDefault(); setDeferredPrompt(e); });
    }
  }, []);

  const handleInstallApp = async () => {
    if (isIos) { setShowIosGuide(true); } else if (deferredPrompt) { deferredPrompt.prompt(); setDeferredPrompt(null); } else { setShowIosGuide(true); }
  };

  const handleRequestNotifications = async () => {
    const perm = await Notification.requestPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') sendTestNotification();
  };

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('APCR: Actualización de Confección', {
        body: '¡Tu alfombra personalizada con logotipo avanzó a la etapa de Armado y Vulcanizado!',
        icon: '/logo.png',
        badge: '/favicon.svg'
      });
    } else {
      handleRequestNotifications();
    }
  };

  const STAGES = [
    { id: "IMPRESION DE STANCIL", label: "Impresión de Stencil", desc: "Preparación de la plantilla de diseño" },
    { id: "CORTE DE LOGO", label: "Corte de Logo", desc: "Corte de las piezas del logotipo" },
    { id: "CORTE DE LOGOS", label: "Corte de Logos", desc: "Corte de logotipos adicionales" },
    { id: "CORTE DE ALFOMBRA DE FONDO", label: "Corte Alfombra Fondo", desc: "Corte de la base principal" },
    { id: "ARMADO DE ALFOMBRA", label: "Armado de Alfombra", desc: "Montaje e incrustación de piezas" },
    { id: "PEGADO DE LONA DE RESPALDO", label: "Pegado Lona Respaldo", desc: "Adhesión de base reforzada" },
    { id: "INSTALACIÓN DE BORDE DE HULE", label: "Instalación Borde Hule", desc: "Acabados y vulcanizado de bordes" },
    { id: "ENVÍO REALIZADO", label: "Envío Realizado", desc: "Su alfombra va en camino o lista para retiro" }
  ];

  const fetchPortalData = async () => {
    try {
      const cookies = document.cookie.split('; ');
      const userId = cookies.find(row => row.startsWith('crm_user_id='))?.split('=')[1];
      if (!userId) return;
      const { data: user } = await supabase.from('crm_users').select('*').eq('id', userId).single();
      setClientData(user);
      const { data: profs } = await supabase.from('proformas').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      setClientProformas(profs || []);
      const { data: recs } = await supabase.from('receipts').select('*').eq('client_id', userId).order('date', { ascending: false });
      setClientReceipts(recs || []);
      const { data: desData } = await supabase.from('client_designs').select('*').eq('client_id', userId).order('created_at', { ascending: true });
      setDesigns(desData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPortalData(); }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const existingLogo = designs.find(d => d.category === 'logo');
        if (existingLogo) {
          await supabase.from('client_designs').update({ url: base64, created_at: new Date().toISOString() }).eq('id', existingLogo.id);
        } else {
          const cookies = document.cookie.split('; ');
          const userId = cookies.find(row => row.startsWith('crm_user_id='))?.split('=')[1];
          await supabase.from('client_designs').insert([{ client_id: userId, category: 'logo', url: base64 }]);
        }
        await fetchPortalData();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error uploading logo:", err);
      alert("Error al subir el archivo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const getActiveStageIndex = (status: string) => {
    const index = STAGES.findIndex(s => s.id === status);
    return index === -1 ? 0 : index;
  };

  const getDeliveryDateStr = (approvedAt: string, deliveryDays: number) => {
    const baseDate = approvedAt ? new Date(approvedAt) : new Date();
    const deliveryDate = new Date(baseDate.getTime() + (deliveryDays || 12) * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRemainingDaysText = (approvedAt: string, deliveryDays: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appDate = approvedAt ? new Date(approvedAt) : new Date();
    const delDate = new Date(appDate.getTime() + (deliveryDays || 12) * 24 * 60 * 60 * 1000);
    delDate.setHours(0, 0, 0, 0);
    const diffTime = delDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Mañana";
    if (diffDays > 1) return `En ${diffDays} días`;
    return `Atrasado por ${Math.abs(diffDays)} días`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-zinc-400">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold uppercase tracking-widest">Cargando tu Portal...</span>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="p-8 text-center text-red-600 font-bold bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl">
        Error al cargar la información de la cuenta. Por favor inicia sesión nuevamente.
      </div>
    );
  }

  const approvedProformas = clientProformas.filter(p => p.status === 'aprobada');
  const totalApproved = approvedProformas.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
  const totalPaid = clientReceipts.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const remainingBalance = Math.max(0, totalApproved - totalPaid);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300 pb-20 md:pb-8 font-sans">
      {/* Smart PWA Install Banner for iPhone & Android */}
      {!isStandalone && showInstallBanner && (
        <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {isIos ? "Instala la App en tu iPhone" : "Instala la App Oficial APCR"}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase border border-blue-200 dark:border-blue-800">
                  Acceso Rápido
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5 leading-snug">
                {isIos 
                  ? "Agrégala a tu pantalla de inicio de iPhone para recibir alertas de tus pedidos a pantalla completa."
                  : "Descarga e instala la app en tu teléfono para revisar tus pedidos y catálogo en 1 toque."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleInstallApp}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isIos ? "Ver Cómo Instalar" : "Instalar App Ahora"}</span>
            </button>
          </div>
        </div>
      )}

      {/* iOS Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Instalar en tu iPhone (iOS)</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Solo toma 10 segundos desde Safari</p>
                </div>
              </div>
              <button onClick={() => setShowIosGuide(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700 dark:text-zinc-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">1</span>
                <p>En Safari de tu iPhone, presiona el botón <strong className="text-blue-600 dark:text-blue-400 font-bold">Compartir</strong> (icono de cuadrado con flecha hacia arriba al pie de la pantalla).</p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">2</span>
                <p>Baja en las opciones del menú y toca <strong className="text-blue-600 dark:text-blue-400 font-bold">"Agregar a Inicio"</strong>.</p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">3</span>
                <p>Presiona <strong className="text-emerald-600 dark:text-emerald-400 font-bold">"Agregar"</strong> en la esquina superior derecha. Ya tienes la app en tu pantalla.</p>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-wider transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-6 md:p-7 rounded-3xl bg-blue-600 dark:bg-blue-700 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1">Portal Oficial de Cliente</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{clientData.contact_name || clientData.company_name}</h2>
          <p className="text-xs text-blue-100 mt-1 font-medium">Cuenta #{clientData.account_number || "APCR-001"} · Seguimiento en vivo de tus pedidos y cotizaciones.</p>
        </div>
      </div>

      {/* TAB 1: COTIZACIONES Y RECIBOS (PROFORMAS + RECIBOS OFICIALES) */}
      {activeTab === 'quotes' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Tarjetas de Información de Cuenta y Métricas Financieras */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Account Info */}
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm md:col-span-3">
              <h3 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Información de Cuenta</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block mb-0.5">Empresa</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white uppercase">{clientData.company_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block mb-0.5">Número de Cuenta</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white font-mono">{clientData.account_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block mb-0.5">Teléfono</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{clientData.phone || 'No registrado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 block mb-0.5">Correo Electrónico</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">{clientData.email || 'No registrado'}</span>
                </div>
              </div>
            </div>

            {/* Push Notifications Minimal Card */}
            <div className="p-4 md:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm md:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-800">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Alertas Push de Fabricación
                    </h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                      notificationPermission === 'granted' 
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" 
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700"
                    )}>
                      {notificationPermission === 'granted' ? "Activas" : "Inactivas"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Recibe notificaciones inmediatas en tu teléfono cuando tu alfombra avance de etapa o se emita un recibo.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {notificationPermission === 'granted' ? (
                  <button
                    onClick={sendTestNotification}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Probar Alerta en mi Celular</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRequestNotifications}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Activar Notificaciones</span>
                  </button>
                )}
              </div>
            </div>

            {/* Total Contratado */}
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Total Contratado</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">₡{totalApproved.toLocaleString()}</p>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1 block">
                {approvedProformas.length} pedidos aprobados
              </span>
            </div>

            {/* Monto Cancelado */}
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Monto Cancelado</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₡{totalPaid.toLocaleString()}</p>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1 block">
                {clientReceipts.length} recibos oficiales
              </span>
            </div>

            {/* Saldo Pendiente */}
            <div className={cn(
              "p-5 rounded-3xl bg-white dark:bg-zinc-900 border shadow-sm",
              remainingBalance > 0 ? "border-emerald-500/40 dark:border-emerald-500/30" : "border-slate-200 dark:border-zinc-800"
            )}>
              <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Saldo Pendiente</span>
              <p className={cn(
                "text-2xl font-black",
                remainingBalance > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-500"
              )}>
                ₡{remainingBalance.toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1 block">
                {remainingBalance > 0 ? 'Pendiente de liquidar' : 'Cancelado al 100%'}
              </span>
            </div>
          </div>

          {/* Selector de Sub-Pestaña: Cotizaciones vs Recibos */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-zinc-800/80 rounded-2xl border border-slate-200 dark:border-zinc-700/80 w-fit">
            <button
              onClick={() => setQuoteSubTab('quotes')}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer",
                quoteSubTab === 'quotes'
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-zinc-700"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>Cotizaciones y Proformas ({clientProformas.length})</span>
            </button>
            <button
              onClick={() => setQuoteSubTab('receipts')}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer",
                quoteSubTab === 'receipts'
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-zinc-700"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              )}
            >
              <Receipt className="w-4 h-4" />
              <span>Recibos Oficiales ({clientReceipts.length})</span>
            </button>
          </div>

          {/* Sub-Vista: Lista de Cotizaciones */}
          {quoteSubTab === 'quotes' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {clientProformas.map(p => (
                    <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/20 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase font-mono">Proforma #{p.proforma_number}</h4>
                          <span className={cn(
                            "px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase border",
                            p.status === 'aprobada'
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                              : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                          )}>
                            {p.status === 'aprobada' ? 'Venta Cerrada' : 'Cotización Pendiente'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                          Fecha: {new Date(p.created_at).toLocaleDateString('es-CR')} · Ítems: {(p.items || []).length}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                          ₡{parseFloat(p.total).toLocaleString()}
                        </span>
                        <button
                          onClick={() => setSelectedProforma(p)}
                          className="px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 transition-all cursor-pointer"
                        >
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  ))}
                  {clientProformas.length === 0 && (
                    <p className="p-8 text-xs text-slate-500 italic text-center font-medium">Aún no se registran cotizaciones para tu cuenta.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Vista: Lista de Recibos Oficiales */}
          {quoteSubTab === 'receipts' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {clientReceipts.map(r => (
                    <div key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/20 transition-colors">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase font-mono">Recibo #{r.receipt_number}</h4>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                            Fecha: {new Date(r.date || r.created_at || new Date().toISOString()).toLocaleDateString('es-CR')} · Método: {r.payment_method?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                          ₡{parseFloat(r.amount || 0).toLocaleString()}
                        </span>
                        <button
                          onClick={() => setSelectedReceipt(r)}
                          className="px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer"
                        >
                          Ver Comprobante
                        </button>
                      </div>
                    </div>
                  ))}
                  {clientReceipts.length === 0 && (
                    <p className="p-8 text-xs text-slate-500 italic text-center font-medium">Aún no se registran comprobantes de abono para tu cuenta.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ESTATUS DEL PEDIDO (TRACKING 8 ETAPAS + ENTREGA + DISEÑOS) */}
      {activeTab === 'status' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Estatus de Producción de tu Pedido</h3>
          </div>
          
          {approvedProformas.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-sm text-slate-600 dark:text-zinc-400 font-bold mb-1">Aún no tienes pedidos en producción activa.</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-md mx-auto">Una vez que tu cotización sea aprobada por nuestro equipo, verás la línea de tiempo de confección detallada aquí.</p>
            </div>
          ) : (
            approvedProformas.map(p => {
              const activeIndex = getActiveStageIndex(p.production_status || 'ABONO_50');
              return (
                <div key={p.id} className="p-6 md:p-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-800/60">
                    <div>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">Orden en Taller</span>
                      <h4 className="text-lg font-black text-slate-800 dark:text-white mt-0.5 font-mono">Proforma #{p.proforma_number}</h4>
                    </div>
                  </div>

                  {/* Tarjeta de Fecha de Entrega */}
                  <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block mb-0.5">Fecha de Entrega Estimada</span>
                      <p className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-tight capitalize">
                        {getDeliveryDateStr(p.approved_at, p.delivery_time_days)}
                      </p>
                      <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 mt-1 block">
                        Tiempo restante: <strong className="text-emerald-700 dark:text-emerald-400 font-black">{getRemainingDaysText(p.approved_at, p.delivery_time_days)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Timeline steps */}
                  <div className="space-y-6">
                    <p className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Progreso de Fabricación</p>
                    
                    <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-zinc-800">
                      {STAGES.map((stage, idx) => {
                        const isCompleted = idx < activeIndex;
                        const isActive = idx === activeIndex;
                        
                        const historyEntry = (p.production_history || []).find((h: any) => h.status === stage.id);
                        const completionTime = historyEntry ? new Date(historyEntry.completed_at).toLocaleString('es-CR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }) : null;
                        
                        return (
                          <div key={stage.id} className="relative flex items-start gap-4">
                            <div className={cn(
                              "absolute -left-[27px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300",
                              isCompleted
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : isActive
                                  ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/20"
                                  : "bg-white dark:bg-zinc-950 border-slate-300 dark:border-zinc-700"
                            )}>
                              {isCompleted ? (
                                <Check className="w-3 h-3 stroke-[3]" />
                              ) : isActive ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              ) : null}
                            </div>

                            <div>
                              <h5 className={cn(
                                "text-sm font-black transition-colors duration-300 uppercase tracking-tight",
                                isCompleted ? "text-emerald-700 dark:text-emerald-400 font-medium" : isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-zinc-600"
                              )}>
                                {stage.label}
                                {isActive && (
                                  <span className="ml-2.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800">
                                    En Proceso
                                  </span>
                                )}
                              </h5>
                              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5 leading-relaxed font-medium">{stage.desc}</p>
                              {completionTime && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mt-1 block">
                                  Completado: {completionTime} ✓
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Galería del Pedido */}
          <div className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">Galería de Diseños e Imágenes</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Col 1: Logotipo */}
              <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between min-h-[300px]">
                <div>
                  <h4 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Mi Logotipo</h4>
                  {designs.some(d => d.category === 'logo') ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4 h-48">
                      <img 
                        src={designs.find(d => d.category === 'logo').url} 
                        alt="Logotipo del Cliente" 
                        className="max-h-full max-w-full object-contain cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setLightboxImg(designs.find(d => d.category === 'logo').url)}
                      />
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-6 text-center h-48 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-950/20">
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold mb-2">¿Tienes el diseño o logotipo?</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 max-w-[200px] mb-3">Súbelo directamente aquí para que nuestro equipo empiece a diseñar.</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="flex items-center justify-center gap-2 cursor-pointer bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all w-full">
                    {uploadingLogo ? (
                      <span className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                      <span>{designs.some(d => d.category === 'logo') ? "Actualizar mi Logotipo" : "Subir mi Logotipo"}</span>
                    )}
                    <input type="file" onChange={handleLogoUpload} accept="image/*" className="hidden" disabled={uploadingLogo} />
                  </label>
                </div>
              </div>

              {/* Col 2: Propuestas de Diseño */}
              <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm md:col-span-1 min-h-[300px]">
                <h4 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Propuestas de Diseño</h4>
                {designs.filter(d => d.category === 'proposal').length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-48 pr-1 custom-scrollbar">
                    {designs.filter(d => d.category === 'proposal').map((d, idx) => (
                      <div key={d.id} className="relative group rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-1 aspect-square">
                        <img 
                          src={d.url} 
                          alt={`Propuesta ${idx + 1}`} 
                          className="max-h-full max-w-full object-contain cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => setLightboxImg(d.url)}
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">#{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-6 text-center h-48 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-950/20">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold mb-1">Propuestas de Confección</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 max-w-[200px]">Nuestro taller está diseñando tus propuestas digitales. Las verás aquí muy pronto.</p>
                  </div>
                )}
              </div>

              {/* Col 3: Alfombra Terminada */}
              <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm min-h-[300px]">
                <h4 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Alfombra Terminada</h4>
                {designs.some(d => d.category === 'final') ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-emerald-200/60 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/20 flex flex-col items-center justify-center p-3 h-52">
                    <img 
                      src={designs.find(d => d.category === 'final').url} 
                      alt="Alfombra Terminada" 
                      className="max-h-[85%] max-w-full object-contain cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setLightboxImg(designs.find(d => d.category === 'final').url)}
                    />
                    <span className="mt-2 text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">¡Lista en Taller!</span>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-6 text-center h-48 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-zinc-950/20">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold mb-1">Resultado Final</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 max-w-[200px]">Una vez que confeccionemos tu alfombra, subiremos una fotografía de alta resolución de su acabado aquí.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATÁLOGO DE PRODUCTOS & PROMOCIONES */}
      {activeTab === 'catalog' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header & Promos Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block">Catálogo Oficial de Fabricación</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Alfombras de Alto Tránsito & Línea Textil</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                Conoce nuestros productos estrella, materiales de grado comercial garantizados y aprovecha descuentos especiales en la renovación de tus pedidos.
              </p>
            </div>

            {/* Promociones del Mes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
              {APCR_PROMOTIONS.map((promo, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono">{promo.code}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-200 dark:border-emerald-800">{promo.discount}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{promo.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-snug">{promo.desc}</p>
                  </div>
                  <a
                    href={`https://wa.me/50672495018?text=Hola%20APCR,%20deseo%20aplicar%20el%20cupón%20de%20promoción%20${promo.code}%20(${promo.title})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{promo.btnText}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de Productos Oficiales */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Nuestros Productos Estrella</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">Garantía oficial de fábrica APCR</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {APCR_CATALOG_PRODUCTS.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Imagen con Badge */}
                    <div className="relative h-48 w-full bg-slate-100 dark:bg-zinc-950 overflow-hidden">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm backdrop-blur-md", prod.badgeColor)}>
                          {prod.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-900/90 text-white font-mono text-[11px] font-black shadow-md">
                          {prod.priceText}
                        </span>
                      </div>
                    </div>

                    {/* Contenido del Producto */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{prod.category}</span>
                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">{prod.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{prod.description}</p>
                      
                      {/* Especificaciones */}
                      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2">
                        {prod.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-zinc-400 font-bold">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botón de Cotización */}
                  <div className="p-5 pt-0">
                    <a
                      href={`https://wa.me/50672495018?text=${encodeURIComponent(prod.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Cotizar por WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RED DE EMPRESAS (DIRECTORIO COMERCIAL) */}
      {activeTab === 'directory' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header Vitrina Comercial */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">Comunidad Comercial APCR</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Directorio de Empresas Clientes</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed font-medium">
                Conoce a otras empresas de nuestra comunidad, descubre beneficios exclusivos entre clientes y promociona tu propio negocio a más de 1,700 empresas en todo Costa Rica.
              </p>
            </div>

            {/* Botón de Auto-Anuncio */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/50672495018?text=Hola%20APCR,%20quiero%20publicar%20mi%20empresa%20en%20la%20Red%20Comercial%20de%20Clientes.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar mi Negocio Gratis</span>
              </a>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold">Exclusivo para clientes de APCR</span>
            </div>
          </div>

          {/* Filtros de Categoría */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { id: "all", label: "Todos los Sectores" },
              { id: "Gastronomía", label: "Gastronomía" },
              { id: "Salud", label: "Salud & Clínicas" },
              { id: "Automotriz", label: "Automotriz & Talleres" },
              { id: "Deporte", label: "Deporte & Gimnasios" },
              { id: "Moda", label: "Moda & Uniformes" },
              { id: "Servicios", label: "Logística & Servicios" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedDirectoryCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight whitespace-nowrap transition-all border cursor-pointer",
                  selectedDirectoryCategory === cat.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-slate-300"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid de Anuncios de Empresas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_BUSINESS_ADS
              .filter(ad => selectedDirectoryCategory === "all" || ad.category === selectedDirectoryCategory)
              .map((biz) => {
                const getBizIcon = () => {
                  switch (biz.iconType) {
                    case 'utensils': return <UtensilsCrossed className="w-5 h-5" />;
                    case 'stethoscope': return <Stethoscope className="w-5 h-5" />;
                    case 'wrench': return <Wrench className="w-5 h-5" />;
                    case 'dumbbell': return <Dumbbell className="w-5 h-5" />;
                    case 'shirt': return <Shirt className="w-5 h-5" />;
                    case 'truck': return <Truck className="w-5 h-5" />;
                    default: return <Building2 className="w-5 h-5" />;
                  }
                };

                return (
                  <div
                    key={biz.id}
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Header de la Ficha */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                            {getBizIcon()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{biz.name}</h4>
                              {biz.verified && (
                                <span title="Cliente Verificado APCR" className="text-blue-600 dark:text-blue-400">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">{biz.tag}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                        {biz.description}
                      </p>

                      {/* Beneficio para la Red */}
                      <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-start gap-2">
                        <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{biz.benefit}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{biz.location}</span>
                      </div>
                    </div>

                    {/* Botón de Contacto */}
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                      <a
                        href={`https://wa.me/${biz.whatsapp}?text=Hola%20${encodeURIComponent(biz.name)},%20los%20contacto%20a%20través%20del%20Directorio%20de%20Clientes%20APCR.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-slate-900 dark:bg-zinc-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Contactar por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 5: SOPORTE VIP */}
      {activeTab === 'support' && (
        <div className="p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm text-center max-w-xl mx-auto space-y-6 py-12">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800 shadow-sm">
            <Headphones className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">Atención Prioritaria</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Soporte y Asesoría VIP</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
              ¿Tienes consultas sobre las medidas, materiales, logotipos o fecha de entrega de tu pedido? Nuestro equipo técnico está listo para atenderte en nuestra línea corporativa directa.
            </p>
          </div>
          <a
            href={`https://wa.me/50672495018?text=Hola,%20tengo%20una%20consulta%20acerca%20de%20mi%20pedido%20con%20la%20cuenta%20${clientData.account_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-700 shadow-sm active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat de WhatsApp VIP</span>
          </a>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <button className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            <X className="w-6 h-6" />
          </button>
          <img 
            src={lightboxImg} 
            alt="Ampliación de Diseño" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
          />
        </div>
      )}

      {/* Proforma View Modal */}
      {selectedProforma && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-zinc-800">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800/60 flex justify-between items-center bg-slate-50 dark:bg-zinc-850">
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase font-mono">Detalles de Proforma #{selectedProforma.proforma_number}</h4>
              <button onClick={() => setSelectedProforma(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Lista de Artículos</p>
                <div className="divide-y divide-slate-100 dark:divide-zinc-800/40 border border-slate-100 dark:border-zinc-800/60 rounded-2xl overflow-hidden">
                  {(selectedProforma.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-zinc-900/40 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-zinc-200">{item.name || item.description}</p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">Cant: {item.quantity} · Dim: {item.width || 0}x{item.height || 0}m</p>
                      </div>
                      <span className="font-mono font-bold text-slate-800 dark:text-white">₡{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-4 flex flex-col items-end gap-1.5 text-xs">
                <div className="flex gap-10">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">₡{parseFloat(selectedProforma.subtotal || 0).toLocaleString()}</span>
                </div>
                {parseFloat(selectedProforma.discount) > 0 && (
                  <div className="flex gap-10 text-red-500">
                    <span>Descuento:</span>
                    <span className="font-mono font-bold">-₡{parseFloat(selectedProforma.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex gap-10 border-t border-slate-100 dark:border-zinc-800/60 pt-2 text-sm">
                  <span className="font-black text-slate-800 dark:text-white">Total:</span>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400">₡{parseFloat(selectedProforma.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt View Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-8 font-sans animate-in zoom-in-95 duration-200">
            <div className="w-full flex justify-end mb-4 no-print">
              <button onClick={() => setSelectedReceipt(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-650">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div id="printable-receipt" className="w-full p-8 border-4 border-slate-900 bg-white">
              <div className="flex justify-between items-start border-b-4 border-slate-900 pb-4 mb-6">
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">Recibo de Dinero</h1>
                  <p className="text-[10px] font-bold text-slate-500">APCR Online - Alfombras Personalizadas</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black">Nº {selectedReceipt.receipt_number}</p>
                  <p className="text-xs font-bold text-slate-600">
                    {new Date(selectedReceipt.date || selectedReceipt.created_at || new Date().toISOString()).toLocaleDateString('es-CR')}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex border-b border-slate-100 pb-2">
                  <span className="font-black uppercase w-28 shrink-0">Recibimos de:</span>
                  <span className="font-medium text-slate-800 uppercase">{selectedReceipt.client_name}</span>
                </div>
                <div className="flex border-b border-slate-100 pb-2">
                  <span className="font-black uppercase w-28 shrink-0">La suma de:</span>
                  <span className="text-base font-black text-emerald-600">₡{parseFloat(selectedReceipt.amount || 0).toLocaleString('es-CR')}</span>
                </div>
                <div className="flex border-b border-slate-100 pb-2">
                  <span className="font-black uppercase w-28 shrink-0">Por concepto de:</span>
                  <span className="font-medium text-slate-800">{selectedReceipt.description || 'Abono de proforma'}</span>
                </div>
                <div className="flex border-b border-slate-100 pb-2">
                  <span className="font-black uppercase w-28 shrink-0">Método:</span>
                  <span className="font-medium text-slate-800 uppercase italic">{selectedReceipt.payment_method}</span>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t-2 border-slate-900 relative text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Comprobante Oficial Emitido Digitalmente
                </p>
                <p className="text-[9px] text-slate-400 mt-1">
                  Alfombras Personalizadas de Costa Rica (Cédula: 2-0643-0221)
                </p>
              </div>
            </div>

            <div className="mt-6 w-full no-print">
              <button 
                onClick={() => {
                  const oldTitle = document.title;
                  document.title = `Recibo_${selectedReceipt.receipt_number}`;
                  const restoreTitle = () => { document.title = oldTitle; window.removeEventListener('afterprint', restoreTitle); };
                  window.addEventListener('afterprint', restoreTitle);
                  setTimeout(() => { window.print(); }, 100);
                }}
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md cursor-pointer text-xs"
              >
                <Printer className="w-4 h-4" /> Imprimir Comprobante
              </button>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                .no-print { display: none !important; }
                body { background: white !important; color: black !important; }
                #printable-receipt { border: none !important; padding: 0 !important; width: 100% !important; margin: 0 !important; box-shadow: none !important; }
                @page { size: auto; margin: 10mm; }
              }
            `}} />
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar (iPhone & Android) - Clean Single-Color Icons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 px-2 py-2 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {[
          { id: 'quotes', label: 'Cotizaciones', icon: FileText },
          { id: 'status', label: 'Estatus', icon: TrendingUp },
          { id: 'catalog', label: 'Catálogo', icon: ShoppingBag },
          { id: 'directory', label: 'Empresas', icon: Building2 },
          { id: 'support', label: 'Soporte', icon: MessageCircle }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange && onTabChange(tab.id as any)}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative",
                isActive 
                  ? "text-blue-600 dark:text-blue-400 font-black scale-105" 
                  : "text-slate-400 dark:text-zinc-500 font-semibold hover:text-slate-600"
              )}
            >
              <IconComp className={cn("w-5 h-5 mb-0.5", isActive && "stroke-[2.5]")} />
              <span className="text-[9px] uppercase tracking-tighter">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 absolute bottom-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}