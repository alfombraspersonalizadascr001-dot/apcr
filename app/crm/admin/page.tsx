"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import {
  Users,
  TrendingUp,
  UserCheck,
  Plus,
  Search,
  Moon,
  Sun,
  Volume2,
  Trash2,
  FileText,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  MessageCircle,
  Calendar,
  Archive,
  Inbox,
  MapPin,
  MessageSquare,
  ChevronRight,
  Star,
  Clock,
  AlertTriangle,
  Download,
  Building,
  Settings,
  Database,
  ArrowLeft,
  LogOut,
  Book,
  Edit,
  Pencil,
  Eye,
  X,
  Tag,
  Upload,
  Calculator,
  ShieldAlert,
  Layers,
  Globe,
  BarChart3,
  Mail,
  Save,
  CheckCircle,
  DollarSign,
  CreditCard,
  Printer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SidebarLayout from "../components/SidebarLayout";
import { logout } from "@/lib/storage";
import * as XLSX from "xlsx";
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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}

const emisor = {
  name: "YULIAN MARIA SANDOVAL JIMENEZ",
  businessName: "ALFOMBRAS PERSONALIZADAS DE COSTA RICA",
  id: "2-0643-0221",
  activity: "1393.0",
  email: "ventas@apcr.online",
  phone: "6063-8062"
};

function numeroALetras(num: number): string {
  if (!num || isNaN(num)) return 'CERO COLONES';
  const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });
  return `SON: ${formatter.format(num).replace('CRC', '').trim()} COLONES EXACTOS`;
}

const MAX_CAPACITY = 5000;

// Interfaces matching Supabase schema
const AGENTS = ["Rolo", "Freelance"] as const;
type Agent = (typeof AGENTS)[number];

interface CRMUser {
  id: string;
  account_number: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
  assigned_to?: string;
  activity_code?: string;
  cedula?: string;
  province?: string;
  canton?: string;
  district?: string;
  neighborhood?: string;
  notes?: string;
  status: "active" | "inactive";
  interest_level: number;
  tags: string[];
  created_at: string;
  updated_at?: string;
  archived?: boolean;
}

const INTEREST_LEVELS = [
  {
    level: 1,
    label: "Muy Frío",
    color: "bg-blue-500",
    text: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    level: 2,
    label: "Frío",
    color: "bg-cyan-400",
    text: "text-cyan-500",
    bg: "bg-cyan-50",
  },
  {
    level: 3,
    label: "Tibio",
    color: "bg-yellow-400",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    level: 4,
    label: "Caliente",
    color: "bg-orange-500",
    text: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    level: 5,
    label: "URGENTE",
    color: "bg-red-600",
    text: "text-red-600",
    bg: "bg-red-50",
  },
];

const AVAILABLE_TAGS = [
  {
    id: "cotizado",
    label: "Cotizado",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    id: "urgente",
    label: "Urgente",
    color: "bg-red-500 text-white border-red-600",
  },
  {
    id: "venta_cerrada",
    label: "Venta cerrada",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "muerto",
    label: "Cliente Muerto",
    color: "bg-slate-200 text-slate-700 border-slate-300",
  },
  {
    id: "no_contesta",
    label: "No contesta",
    color: "bg-teal-100 text-teal-700 border-teal-200",
  },
  {
    id: "entregado_ss",
    label: "Entregado Super Seco",
    color: "bg-green-500 text-white border-green-600",
  },
  {
    id: "garantia",
    label: "Garantía",
    color: "bg-orange-500 text-white border-orange-600",
  },
  {
    id: "cotizado_ss",
    label: "Cotizado súper seco",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  {
    id: "cliente_hp",
    label: "Cliente Conflictivo - Bloqueado",
    color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
  },
  {
    id: "proveedor",
    label: "Proveedor",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  {
    id: "envio_ss_pendiente",
    label: "súper seco envío pendiente",
    color: "bg-sky-500 text-white border-sky-600",
  },
  {
    id: "pendiente_pago",
    label: "Pendiente pago",
    color: "bg-lime-100 text-lime-700 border-lime-200",
  },
  {
    id: "rh",
    label: "RH",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "entregado_am",
    label: "Entregado Atrapa-Mugre",
    color: "bg-green-100 text-green-700 border-green-200",
  },
];

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

const DEFAULT_BUSINESS_TYPES = [
  "Restaurante",
  "Panadería / Repostería",
  "Clínica Odontológica",
  "Taller Mecánico / Automotriz",
  "Banco / Financiera",
  "Aseguradora",
  "Dealer de Vehículos / Agencia",
  "Tienda de Ropa / Boutique",
  "Bufete de Abogados",
  "Supermercado / Mini-súper",
  "Farmacia",
  "Gimnasio / Centro Deportivo",
  "Salón de Belleza / Spa",
  "Veterinaria / Pet Shop",
  "Colegio / Escuela / Universidad",
  "Hotel / Hospedaje",
  "Ferretería",
  "Constructora / Arquitectura",
  "Inmobiliaria / Bienes Raíces",
  "Distribuidora / Mayorista",
  "Logística / Transporte",
  "Agencia de Marketing / Publicidad",
  "Consultoría / Asesoría",
  "Desarrollo de Software / Tecnología",
  "Iglesia / Centro Religioso",
  "Centro Médico / Hospital",
  "Barbería",
  "Imprenta / Copiadora",
  "Limpieza / Mantenimiento",
  "Lavandería / Dry Clean",
  "Eventos / Catering",
  "Oficina Corporativa",
  "Centro Comercial / Mall",
];

interface Proforma {
  id: string;
  proforma_number: string;
  date: string;
  subtotal?: number;
  iva?: number;
  total: number;
  items?: any[];
  comments?: string;
  created_at: string;
  status?: string;
  approved_at?: string;
  audit_log?: any[];
  production_status?: string;
  production_history?: any[];
  delivery_time_days?: number;
}

interface Receipt {
  id: string;
  receipt_number: string;
  proforma_id: string;
  client_id: string;
  client_name: string;
  amount: number;
  date: string;
  payment_method: string;
  description: string;
  created_at?: string;
  agent?: string;
  audit_log?: any[];
}

const ReceiptModal = ({ 
  proforma, 
  client,
  receiptData, 
  setReceiptData, 
  onSave, 
  onClose,
  isSaving,
  generatedReceipt,
  isEditMode = false
}: any) => {
  if (generatedReceipt) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
        <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-8 font-sans">
          <div className="w-full flex justify-end mb-4 no-print">
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
          </div>
          
          <div id="printable-receipt" className="w-full p-8 border-4 border-slate-900 bg-white">
            <div className="flex justify-between items-start border-b-4 border-slate-900 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="APCR Logo" className="h-16 w-auto object-contain" />
                <div>
                  <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">Recibo de Dinero</h1>
                  <p className="text-xs font-bold text-slate-500">APCR Online - Alfombras Personalizadas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">Nº {generatedReceipt.receipt_number}</p>
                <p className="text-sm font-bold text-slate-600">{generatedReceipt.date}</p>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex border-b border-slate-200 pb-2">
                <span className="font-black uppercase w-32 shrink-0">Recibimos de:</span>
                <span className="font-medium text-slate-800">{generatedReceipt.client_name}</span>
              </div>
              <div className="flex border-b border-slate-200 pb-2">
                <span className="font-black uppercase w-32 shrink-0">La suma de:</span>
                <span className="text-xl font-black">₡{generatedReceipt.amount.toLocaleString()}</span>
              </div>
              <div className="flex border-b border-slate-200 pb-2">
                <span className="font-black uppercase w-32 shrink-0">Por concepto de:</span>
                <span className="font-medium text-slate-800">{generatedReceipt.description}</span>
              </div>
              <div className="flex border-b border-slate-200 pb-2">
                <span className="font-black uppercase w-32 shrink-0">Método:</span>
                <span className="font-medium text-slate-800 uppercase italic">{generatedReceipt.payment_method}</span>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t-2 border-slate-900 relative text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Documento Digital Emitido Oficialmente
              </p>
              <p className="text-[10px] text-slate-400 mt-2">
                Alfombras Personalizadas de Costa Rica (Cédula: 2-0643-0221)
              </p>
            </div>
          </div>

          <div className="mt-10 w-full no-print">
            <button 
              type="button"
              onClick={() => {
                const oldTitle = document.title;
                document.title = `Recibo_N_${generatedReceipt.receipt_number}`;
                
                const restoreTitle = () => {
                  document.title = oldTitle;
                  window.removeEventListener('afterprint', restoreTitle);
                };
                window.addEventListener('afterprint', restoreTitle);
                
                setTimeout(() => {
                  window.print();
                }, 100);
              }}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl shadow-slate-900/20"
            >
              <Printer className="w-5 h-5" /> Imprimir Recibo
            </button>
          </div>
          
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              .no-print { display: none !important; }
              body { background: white !important; }
              #printable-receipt { border: none !important; padding: 0 !important; width: 100% !important; margin: 0 !important; box-shadow: none !important; }
              @page { size: auto; margin: 0mm; }
            }
          `}} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-background dark:bg-zinc-900/50 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-white/10">
        <div className="p-8 border-b border-zinc-800/30 flex justify-between items-center bg-card dark:bg-zinc-800/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {isEditMode ? "Editar Recibo" : "Emitir Recibo"}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {isEditMode ? "Modificar valores guardados" : `Vincular a Proforma ${proforma.proforma_number}`}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-3 bg-white dark:bg-zinc-800 rounded-2xl text-slate-400 hover:text-red-500 transition-colors shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Monto del Recibo (₡)</label>
            <input 
              type="number" 
              value={receiptData.amount}
              onChange={e => setReceiptData({...receiptData, amount: Number(e.target.value)})}
              className="w-full bg-slate-50 dark:bg-zinc-950 border-2 border-zinc-800/30 p-5 rounded-2xl text-2xl font-black text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Concepto / Descripción</label>
            <input 
              type="text" 
              value={receiptData.description}
              onChange={e => setReceiptData({...receiptData, description: e.target.value})}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-800/40 p-4 rounded-xl font-bold text-slate-700 dark:text-zinc-300 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Método de Pago</label>
              <select 
                value={receiptData.payment_method}
                onChange={e => setReceiptData({...receiptData, payment_method: e.target.value})}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-800/40 p-4 rounded-xl font-bold text-slate-700 dark:text-zinc-300 outline-none appearance-none"
              >
                <option>Transferencia</option>
                <option>SINPE Móvil</option>
                <option>Efectivo</option>
                <option>Tarjeta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Fecha de Recibo</label>
              <input 
                type="date" 
                value={receiptData.date}
                onChange={e => setReceiptData({...receiptData, date: e.target.value})}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-800/40 p-4 rounded-xl font-bold text-slate-700 dark:text-zinc-300 outline-none"
              />
            </div>
          </div>

          <button 
            type="button"
            onClick={onSave}
            disabled={isSaving || receiptData.amount <= 0}
            className={`w-full py-5 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all disabled:opacity-50 disabled:scale-100 mt-4 ${isEditMode ? 'bg-amber-500 shadow-amber-500/20 hover:bg-amber-600' : 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600'}`}
          >
            {isSaving ? "Guardando..." : (isEditMode ? "Actualizar Recibo" : "Generar y Finalizar Recibo")}
          </button>
        </div>
      </div>
    </div>
  );
};


function AdminDashboardInternal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleParam = searchParams.get('activeModule');

  const [activeModule, setActiveModule] = useState("admin");
  const [clients, setClients] = useState<CRMUser[]>([]);
  const [selectedClient, setSelectedClient] = useState<CRMUser | null>(null);

  // Sync activeModule with URL and clear selectedClient if a global module is chosen
  useEffect(() => {
    if (moduleParam) {
      setActiveModule(moduleParam);
      setSelectedClient(null);
    } else {
      // If we are on /admin without params, it's the admin module (clients)
      setActiveModule("admin");
    }
  }, [moduleParam]);

  // Handle direct client navigation via URL query params (?client=... or ?clientId=... or ?search=...)
  useEffect(() => {
    const clientParam = searchParams.get('client') || searchParams.get('clientId');
    const searchParam = searchParams.get('search');

    if (searchParam && !searchTerm) {
      setSearchTerm(searchParam);
    }

    if (clientParam) {
      if (clients.length > 0) {
        const found = clients.find(c => 
          c.id === clientParam || 
          (c.account_number && c.account_number.toLowerCase() === clientParam.toLowerCase()) ||
          (c.company_name && c.company_name.toLowerCase().includes(clientParam.toLowerCase())) ||
          (c.contact_name && c.contact_name.toLowerCase().includes(clientParam.toLowerCase()))
        );
        if (found) {
          setSelectedClient(found);
          return;
        }
      }

      // Buscar directamente en Supabase si aún no está en la memoria
      supabase
        .from('crm_users')
        .select('*')
        .eq('id', clientParam)
        .single()
        .then(({ data }) => {
          if (data) setSelectedClient(data);
        });
    }
  }, [searchParams, clients]);

  const [clientProformas, setClientProformas] = useState<Proforma[]>([]);
  const [clientReceipts, setClientReceipts] = useState<Receipt[]>([]);
  const [clientDesigns, setClientDesigns] = useState<any[]>([]);
  const [notesText, setNotesText] = useState<string>("");
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [notesSavedFeedback, setNotesSavedFeedback] = useState<boolean>(false);

  const [visibleCount, setVisibleCount] = useState<number>(60);

  // Formulario completo editable del cliente
  const [clientFormData, setClientFormData] = useState<{
    company_name: string;
    contact_name: string;
    cedula: string;
    email: string;
    phone: string;
    password: string;
    activity_code: string;
    assigned_to: string;
    status: "active" | "inactive";
  }>({
    company_name: "",
    contact_name: "",
    cedula: "",
    email: "",
    phone: "",
    password: "",
    activity_code: "",
    assigned_to: "",
    status: "active"
  });
  const [isSavingClientInfo, setIsSavingClientInfo] = useState(false);
  const [clientInfoSavedFeedback, setClientInfoSavedFeedback] = useState(false);

  // Sincronizar automáticamente proformas, recibos, diseños, notas y formulario al seleccionar un cliente
  useEffect(() => {
    if (selectedClient?.id) {
      setNotesText(selectedClient.notes || "");
      setClientFormData({
        company_name: selectedClient.company_name || "",
        contact_name: selectedClient.contact_name || "",
        cedula: selectedClient.cedula || "",
        email: selectedClient.email || "",
        phone: selectedClient.phone || "",
        password: selectedClient.password || "",
        activity_code: selectedClient.activity_code || "",
        assigned_to: selectedClient.assigned_to || "",
        status: selectedClient.status || "active"
      });
      loadClientProformas(selectedClient.id);
      loadClientReceipts(selectedClient.id);
      loadClientDesigns(selectedClient.id);
    } else {
      setNotesText("");
      setClientFormData({
        company_name: "",
        contact_name: "",
        cedula: "",
        email: "",
        phone: "",
        password: "",
        activity_code: "",
        assigned_to: "",
        status: "active"
      });
      setClientProformas([]);
      setClientReceipts([]);
      setClientDesigns([]);
    }
  }, [selectedClient?.id]);
  const [uploadingDesign, setUploadingDesign] = useState<string | null>(null);
  const [approvingClient, setApprovingClient] = useState<{ clientId: string; newTags: string[] } | null>(null);
  const [approvingProformas, setApprovingProformas] = useState<Proforma[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [quoteFilter, setQuoteFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [subagentFilter, setSubagentFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Receipt Modal State
  const [isCreatingReceipt, setIsCreatingReceipt] = useState<Proforma | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [isSavingReceipt, setIsSavingReceipt] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);
  const [receiptData, setReceiptData] = useState({
    amount: 0,
    description: "",
    payment_method: "Transferencia",
    date: new Date().toISOString().split('T')[0]
  });
  const [activitySearch, setActivitySearch] = useState<string>("");
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [BUSINESS_TYPES, setBUSINESS_TYPES] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_BUSINESS_TYPES;
    try {
      const saved = localStorage.getItem("crm_custom_activities");
      if (saved) {
        const extra = JSON.parse(saved) as string[];
        return [...DEFAULT_BUSINESS_TYPES, ...extra.filter(e => !DEFAULT_BUSINESS_TYPES.includes(e))];
      }
    } catch {}
    return DEFAULT_BUSINESS_TYPES;
  });
  const [pipelineFilter, setPipelineFilter] = useState<string>("all");
  const [isDark, setIsDark] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "twoweeks" | "week">("month");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [newCustomTag, setNewCustomTag] = useState<string>("");

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
    // Disabled theme toggle
  };

  const [clientsWithProforma, setClientsWithProforma] = useState<Set<string>>(
    new Set(),
  );
  const [viewingProforma, setViewingProforma] = useState<Proforma | null>(null);
  const [importAgent, setImportAgent] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "info" | "notes" | "orders" | "post-sale" | "receipts" | "designs"
  >("info");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    account_number: "",
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    cedula: "",
    activity_code: "",
    assigned_to: "",
  });
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [loggedInAgent, setLoggedInAgent] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappTargetClient, setWhatsappTargetClient] = useState<CRMUser | null>(null);
  const [customWhatsappMsg, setCustomWhatsappMsg] = useState("");
  const [waStats, setWaStats] = useState<{ total: number; welcome: number; followup: number; renewal: number; custom: number; today: number }>({ total: 0, welcome: 0, followup: 0, renewal: 0, custom: 0, today: 0 });
  const [waStatsLoading, setWaStatsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const agentNameCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("crm_agent_name="));
    if (agentNameCookie) {
      setLoggedInAgent(decodeURIComponent(agentNameCookie.split("=")[1]));
    }
  }, []);

  const generateVoiceSummary = () => {
    const total = filteredClients.length;
    const hot = filteredClients.filter((c) => c.interest_level >= 4).length;
    const customers = filteredClients.filter((c) =>
      c.tags?.includes("venta_cerrada"),
    ).length;
    const quoted = filteredClients.filter(
      (c) =>
        clientsWithProforma.has(c.id) && !c.tags?.includes("venta_cerrada"),
    ).length;

    const text = `Resumen actual. Tienes un total de ${total} clientes filtrados. De ellos, ${hot} son prospectos en estado caliente o urgente. Actualmente hay ${customers} ventas cerradas y ${quoted} clientes con cotización pendiente de cierre.`;

    if ("speechSynthesis" in window) {
      // Cancel any current speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-CR";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(
        "Tu navegador no soporta síntesis de voz, pero aquí tienes el resumen:\n\n" +
          text,
      );
    }
  };

  useEffect(() => {
    const isAuth = document.cookie.includes("crm_authenticated=true");
    if (!isAuth) {
      router.push("/login");
      return;
    }
    // Esperar a que el agente esté cargado para aplicar filtros de seguridad
    if (loggedInAgent) {
      loadClients();
    }
  }, [router, loggedInAgent, isArchiveView]);

  const loadClients = async () => {
    setLoading(true);
    try {
      // Carga ultrarrápida en paralelo de todos los clientes y proformas
      const [batch1, batch2, batch3, profRes] = await Promise.all([
        supabase
          .from("crm_users")
          .select("*")
          .eq("role", "client")
          .order("created_at", { ascending: false })
          .range(0, 999),
        supabase
          .from("crm_users")
          .select("*")
          .eq("role", "client")
          .order("created_at", { ascending: false })
          .range(1000, 1999),
        supabase
          .from("crm_users")
          .select("*")
          .eq("role", "client")
          .order("created_at", { ascending: false })
          .range(2000, 2999),
        supabase
          .from("proformas")
          .select("user_id")
          .limit(3000)
      ]);

      let combined: CRMUser[] = [
        ...(batch1.data || []),
        ...(batch2.data || []),
        ...(batch3.data || [])
      ];

      // Filtrado por archivados si aplica
      if (isArchiveView) {
        combined = combined.filter((c: any) => c.archived === true);
      } else {
        combined = combined.filter((c: any) => !c.archived);
      }

      // REGLAS DE SEGURIDAD:
      if (loggedInAgent === "Freelance") {
        combined = combined.filter((c: any) => c.assigned_to === "Freelance");
      }

      const profIds = new Set((profRes.data || []).map((p: any) => p.user_id).filter(Boolean));
      setClientsWithProforma(profIds);
      setClients(combined);
    } catch (err) {
      console.error("Error loading clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newClientForm.company_name && !newClientForm.contact_name) {
      alert(
        "Por favor ingrese al menos el nombre de la empresa o del contacto.",
      );
      return;
    }

    setLoading(true);

    let accountNumber = newClientForm.account_number;
    if (!accountNumber) {
      const { data: allUsers } = await supabase
        .from('crm_users')
        .select('account_number')
        .eq('role', 'client');
      
      let maxNum = 0;
      (allUsers || []).forEach((u: any) => {
        if (u.account_number) {
          const acc = u.account_number.trim();
          const match = acc.match(/^[a-z]{3}\d{2}(\d+)$/i);
          if (match) {
            const n = parseInt(match[1]);
            if (!isNaN(n) && n > maxNum) maxNum = n;
          } else {
            const n = parseInt(acc.replace(/\D/g, ''));
            if (!isNaN(n) && n < 1000 && n > maxNum) maxNum = n;
          }
        }
      });
      const nextConsecutive = maxNum + 1;
      const padConsecutive = String(nextConsecutive).padStart(3, '0');
      const now = new Date();
      const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
      const monthStr = months[now.getMonth()];
      const yearStr = String(now.getFullYear()).slice(-2);
      accountNumber = `${monthStr}${yearStr}${padConsecutive}`;
    }

    const newClient = {
      ...newClientForm,
      account_number: accountNumber,
      role: "client",
      password: `Admin${accountNumber}`,
      status: "active",
      tags: [],
    };

    let clientToInsert: any = { ...newClient };
    clientToInsert.interest_level = 1;
    if (newClientForm.assigned_to || loggedInAgent) {
      clientToInsert.assigned_to = newClientForm.assigned_to || loggedInAgent;
    }

    let insertRes = await supabase
      .from("crm_users")
      .insert([clientToInsert])
      .select();

    let data = insertRes.data;
    let error = insertRes.error;

    if (error) {
      console.warn("First insert failed, retrying with core schema columns...", error.message);
      const cleanedClient = {
        account_number: newClient.account_number || `C${Math.floor(1000 + Math.random() * 9000)}`,
        company_name: newClient.company_name || "",
        contact_name: newClient.contact_name || "",
        email: newClient.email || "",
        phone: newClient.phone || "",
        cedula: newClient.cedula || "",
        activity_code: newClient.activity_code || "",
        role: newClient.role || "client",
        password: newClient.password,
        tags: newClient.tags || []
      };

      const retryRes = await supabase
        .from("crm_users")
        .insert([cleanedClient])
        .select();

      data = retryRes.data;
      error = retryRes.error;
    }

    if (error) {
      console.error("Error adding client:", error);
      alert("Error al agregar cliente: " + error.message);
    } else if (data) {
      setClients([data[0], ...clients]);
      alert(`🎉 Cliente creado con éxito.\n🔑 Cuenta de acceso (Usuario): ${data[0].account_number}\n🔒 Contraseña inicial: ${data[0].password}`);
      setShowNewClientModal(false);
      setNewClientForm({
        account_number: "",
        company_name: "",
        contact_name: "",
        email: "",
        phone: "",
        cedula: "",
        activity_code: "",
        assigned_to: "",
      });
    }
    setLoading(false);
  };

  const loadClientReceipts = async (userId: string) => {
    let allReceipts: any[] = [];
    try {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .eq("client_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        allReceipts = [...data];
      }
    } catch (e) {}

    // Cargar también SOLO recibos reales del historial de proformas del cliente (production_history)
    // Solo entradas con type='RECEIPT' y monto real — NUNCA auto-generar recibos
    try {
      const { data: profs } = await supabase
        .from("proformas")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (profs) {
        profs.forEach(p => {
          (p.production_history || []).forEach((h: any, idx: number) => {
            // Solo recibos explícitamente registrados por un humano (type='RECEIPT' con número y monto real)
            if (h.type === 'RECEIPT' && h.receipt_number && h.amount && Number(h.amount) > 0) {
              const recNum = h.receipt_number;
              const recId = h.id || `${p.id}-${recNum}-${idx}`;
              if (!allReceipts.some(r => r.id === recId || r.receipt_number === recNum)) {
                allReceipts.push({
                  id: recId,
                  receipt_number: recNum,
                  proforma_id: p.id,
                  client_id: userId,
                  client_name: selectedClient?.company_name || selectedClient?.contact_name || 'Cliente',
                  amount: Number(h.amount),
                  date: h.date || h.completed_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                  payment_method: h.payment_method || 'Transferencia',
                  description: h.description || `Recibo proforma #${p.proforma_number}`,
                  created_at: h.completed_at || p.updated_at || p.created_at,
                  audit_log: h.audit_log || []
                });
              }
            }
          });
        });
      }
    } catch (e) {
      console.error("Error loading receipts from proformas:", e);
    }

    setClientReceipts(allReceipts);
  };

  const handleDeleteReceipt = async (receipt: any) => {
    if (!confirm(`¿Estás seguro que deseas eliminar permanentemente el recibo ${receipt.receipt_number}? Esta acción no se puede deshacer.`)) return;
    
    try {
      // 1. Si está vinculado a una proforma, remover del historial de producción
      if (receipt.proforma_id) {
        const { data: pData } = await supabase.from('proformas').select('*').eq('id', receipt.proforma_id).single();
        if (pData && Array.isArray(pData.production_history)) {
          const updatedHistory = pData.production_history.filter((h: any) => 
            h.receipt_number !== receipt.receipt_number && h.id !== receipt.id
          );
          await supabase.from('proformas').update({
            production_history: updatedHistory,
            updated_at: new Date().toISOString()
          }).eq('id', receipt.proforma_id);
        }
      }
      
      // 2. Intentar borrar de la tabla receipts
      try {
        await supabase.from('receipts').delete().eq('id', receipt.id);
      } catch (err) {}

      // 3. Actualizar estado local
      setClientReceipts(prev => prev.filter(r => r.id !== receipt.id && r.receipt_number !== receipt.receipt_number));
      alert(`Recibo ${receipt.receipt_number} eliminado exitosamente.`);
    } catch (e: any) {
      console.error(e);
      alert("Error al eliminar recibo: " + e.message);
    }
  };

  const loadClientProformas = async (userId: string) => {
    // Fetch proformas for specific user
    const { data, error } = await supabase
      .from("proformas")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading proformas:", error);
      setClientProformas([]);
    } else {
      setClientProformas(data || []);
    }
  };

  const loadClientDesigns = async (userId: string) => {
    const { data, error } = await supabase
      .from("client_designs")
      .select("*")
      .eq("client_id", userId)
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error loading designs:", error);
      setClientDesigns([]);
    } else {
      setClientDesigns(data || []);
    }
  };

  const handleUploadDesign = async (category: string, file: File) => {
    if (!selectedClient) return;
    setUploadingDesign(category);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        if (category === 'logo' || category === 'final') {
          const existing = clientDesigns.find(d => d.category === category);
          if (existing) {
            const { error } = await supabase
              .from('client_designs')
              .update({ url: base64, created_at: new Date().toISOString() })
              .eq('id', existing.id);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('client_designs')
              .insert([{
                client_id: selectedClient.id,
                category,
                url: base64
              }]);
            if (error) throw error;
          }
        } else if (category === 'proposal') {
          const proposalsCount = clientDesigns.filter(d => d.category === 'proposal').length;
          if (proposalsCount >= 15) {
            alert("⚠️ Límite de propuestas alcanzado. Puedes tener un máximo de 15 fotos de propuestas.");
            setUploadingDesign(null);
            return;
          }

          const { error } = await supabase
            .from('client_designs')
            .insert([{
              client_id: selectedClient.id,
              category,
              url: base64
            }]);
          if (error) throw error;
        }

        await loadClientDesigns(selectedClient.id);
        alert("🎉 Imagen cargada con éxito.");
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert("Error al cargar imagen: " + err.message);
    } finally {
      setUploadingDesign(null);
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    if (!confirm("¿Estás seguro que deseas eliminar esta imagen de la galería?")) return;
    try {
      const { error } = await supabase
        .from('client_designs')
        .delete()
        .eq('id', designId);
      if (error) throw error;
      setClientDesigns(prev => prev.filter(d => d.id !== designId));
      alert("Imagen eliminada de la galería.");
    } catch (err: any) {
      alert("Error al eliminar imagen: " + err.message);
    }
  };

  const viewClientDetails = async (client: CRMUser) => {
    setSelectedClient(client);
    await loadClientProformas(client.id);
    await loadClientReceipts(client.id);
    await loadClientDesigns(client.id);
  };

  const handleDeleteProforma = async (proforma: Proforma) => {
    if (!confirm(`¿Estás seguro que deseas eliminar permanentemente la proforma ${proforma.proforma_number}? Esta acción borrará también cualquier rastro histórico de esta cotización.`)) return;
    
    try {
      const { error } = await supabase.from('proformas').delete().eq('id', proforma.id);
      if (error) throw error;
      
      setClientProformas(prev => prev.filter(p => p.id !== proforma.id));
      alert(`Proforma #${proforma.proforma_number} eliminada con éxito.`);
    } catch (e: any) {
      console.error(e);
      alert("Error al eliminar proforma: " + e.message);
    }
  };

  const handleLogout = () => {
    // Clear auth cookies
    document.cookie =
      "crm_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
    document.cookie =
      "crm_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
    document.cookie =
      "crm_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict";
    logout(); // Still clear localStorage for legacy compatibility
    router.push("/login");
    router.refresh();
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        Empresa: "Ejemplo S.A.",
        Contacto: "Juan Pérez",
        Email: "juan@ejemplo.com",
        Teléfono: "8888-8888",
        Cédula: "1-1111-1111",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "plantilla_clientes.xlsx");
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          alert("El archivo está vacío");
          setImporting(false);
          return;
        }

        // Get current max account number
        const { data: existingUsers } = await supabase
          .from("crm_users")
          .select("account_number")
          .eq("role", "client");

        let nextNum = 1;
        if (existingUsers && existingUsers.length > 0) {
          const numbers = existingUsers
            .map((u) => parseInt(u.account_number))
            .filter((n) => !isNaN(n));
          if (numbers.length > 0) {
            nextNum = Math.max(...numbers) + 1;
          }
        }

        const usersToInsert = data
          .filter((row: any) => {
            // Filtrar filas vacías - al menos debe tener Empresa o algún dato útil
            const hasData = Object.values(row).some(
              (v) => v !== null && v !== undefined && String(v).trim() !== "",
            );
            return hasData;
          })
          .map((row: any, index: number) => {
            // Mapeo inteligente: busca el valor en múltiples posibles nombres de columna
            const findVal = (keys: string[]) => {
              for (const key of keys) {
                const found = Object.keys(row).find(
                  (k) => k.toLowerCase().trim() === key.toLowerCase().trim(),
                );
                if (found && row[found] !== null && row[found] !== undefined)
                  return String(row[found]).trim();
              }
              return "";
            };

            const email = findVal([
              "correo",
              "email",
              "mail",
              "e-mail",
              "contacto_email",
            ]);
            const company = findVal([
              "empresa",
              "compañía",
              "company",
              "nombre empresa",
              "nombre",
              "razon social",
              "razón social",
              "negocio",
            ]);
            const contact = findVal([
              "contacto",
              "contact",
              "persona",
              "encargado",
            ]);
            const phone = findVal(["telefono", "teléfono", "phone", "tel"]);
            const whatsapp = findVal([
              "whatsapp",
              "celular",
              "cel",
              "móvil",
              "movil",
            ]);
            const cedula = findVal([
              "cédula",
              "cedula",
              "id",
              "identificación",
              "identificacion",
            ]);
            const activityCode = findVal([
              "tipo de negocio",
              "tipo negocio",
              "actividad",
              "giro",
              "rubro",
              "sector",
            ]);

            // Usar whatsapp como teléfono si no hay teléfono normal
            const finalPhone = phone || whatsapp;

            const currentNum = nextNum + index;
            const account_number = currentNum.toString().padStart(3, "0");

            return {
              account_number,
              password: `Admin${currentNum}`,
              company_name: company || contact || `Cliente ${account_number}`,
              contact_name: contact || company || "",
              email: email,
              phone: finalPhone,
              cedula: cedula,
              activity_code: activityCode,
              role: "client",
              created_by: "admin_import",
              assigned_to: loggedInAgent,
            };
          });

        if (usersToInsert.length === 0) {
          alert("No se encontraron filas con datos válidos en el archivo.");
          setImporting(false);
          return;
        }

        const { error } = await supabase
          .from("crm_users")
          .insert(usersToInsert);

        if (error) {
          console.error("Error importing users:", error);
          alert("Error al importar clientes: " + error.message);
        } else {
          alert(`${usersToInsert.length} clientes importados correctamente`);
          loadClients();
        }
        setImporting(false);
      };
      reader.readAsBinaryString(file);
    } catch (error: any) {
      console.error("Error processing file:", error);
      alert("Error al procesar el archivo");
      setImporting(false);
    }
    // Reset input
    if (e.target instanceof HTMLInputElement) e.target.value = "";
  };

  const downloadBackup = async () => {
    setLoading(true);
    try {
      // Fetch all tables
      const { data: users } = await supabase.from("crm_users").select("*");
      const { data: proformas } = await supabase.from("proformas").select("*");
      const { data: analytics } = await supabase
        .from("analytics_page_views")
        .select("*");
      const { data: emails } = await supabase
        .from("email_accounts")
        .select("*");

      const backupData = {
        version: "1.0",
        backup_id: Math.random().toString(36).substring(7),
        agent: loggedInAgent,
        timestamp: new Date().toISOString(),
        database: {
          crm_users: users || [],
          proformas: proformas || [],
          analytics_page_views: analytics || [],
          email_accounts: emails || [],
        },
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      const timeStr = new Date().getHours() + "h" + new Date().getMinutes();

      a.href = url;
      a.download = `RESPALDO_SISTEMA_${dateStr}_${timeStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Respaldo generado exitosamente. Guárdelo en un lugar seguro.");
    } catch (error: any) {
      console.error("Backup error:", error);
      alert("Error al generar el respaldo: " + error.message);
    }
    setLoading(false);
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar a "${name}"? Esta acción no se puede deshacer.`,
      )
    )
      return;

    const { error } = await supabase.from("crm_users").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar cliente: " + error.message);
    } else {
      setClients(clients.filter((c) => c.id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar los ${selectedIds.length} clientes seleccionados?`,
      )
    )
      return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("crm_users")
      .delete()
      .in("id", selectedIds);

    if (error) {
      alert("Error al eliminar clientes seleccionados: " + error.message);
    } else {
      setClients(clients.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
    setIsDeleting(false);
  };

  const handleDeleteAll = async () => {
    if (
      !confirm(
        "¡ADVERTENCIA CRÍTICA!\n\n¿Estás seguro de que deseas eliminar TODOS los clientes de la base de datos? Esta acción es IRREVERSIBLE.",
      )
    )
      return;
    if (
      !confirm(
        "Por favor confirma una vez más: ¿Eliminar ABSOLUTAMENTE TODO el directorio de clientes?",
      )
    )
      return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("crm_users")
      .delete()
      .eq("role", "client");

    if (error) {
      alert("Error al eliminar todos los clientes: " + error.message);
    } else {
      setClients([]);
      setSelectedIds([]);
      alert("Base de datos de clientes limpiada con éxito.");
    }
    setIsDeleting(false);
  };

  const handleAssignAgent = async (clientId: string, agent: string) => {
    const value = agent === "" ? null : agent;
    const { error } = await supabase
      .from("crm_users")
      .update({ assigned_to: value })
      .eq("id", clientId);
    if (!error) {
      setClients((clients) =>
        clients.map((c) =>
          c.id === clientId ? { ...c, assigned_to: value || undefined } : c,
        ),
      );
    } else {
      console.error("Error assigning agent:", error);
      alert(
        "Error al asignar agente: " +
          error.message +
          "\n\nSi el error persiste, refresca el Schema Cache en Supabase Settings > API.",
      );
    }
  };

  const handleBulkAssignAgent = async (agent: string) => {
    if (selectedIds.length === 0) return;
    const value = agent === "" ? null : agent;
    const { error } = await supabase
      .from("crm_users")
      .update({ assigned_to: value })
      .in("id", selectedIds);
    if (!error) {
      setClients((clients) =>
        clients.map((c) =>
          selectedIds.includes(c.id)
            ? { ...c, assigned_to: value || undefined }
            : c,
        ),
      );
      setSelectedIds([]);
    } else {
      console.error("Error in bulk assignment:", error);
      alert("Error en asignación masiva: " + error.message);
    }
  };

  const handleUpdateClientField = async (
    clientId: string,
    field: string,
    value: any,
  ) => {
    let updatePayload: any = { [field]: value };
    
    // Auto-Archive Logic: if tags changed and contain dead/delivered/special tags
    if (field === 'tags' && Array.isArray(value)) {
      const archiveTags = ['muerto', 'entregado_am', 'entregado_ss', 'no_contesta', 'cliente_hp', 'proveedor', 'rh'];
      const shouldArchive = value.some(t => archiveTags.includes(t));
      if (shouldArchive) {
        updatePayload.archived = true;
      } else {
        updatePayload.archived = false;
      }
    }

    const { error } = await supabase
      .from("crm_users")
      .update(updatePayload)
      .eq("id", clientId);

    if (!error) {
      setClients(prev => {
        return prev.map((c) => (c.id === clientId ? { ...c, ...updatePayload } : c));
      });

      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient((prev: any) => prev ? { ...prev, ...updatePayload } : prev);
      }
    } else {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedClient) return;
    setIsSavingNotes(true);
    try {
      const { error } = await supabase
        .from('crm_users')
        .update({ notes: notesText, updated_at: new Date().toISOString() })
        .eq('id', selectedClient.id);

      if (!error) {
        setSelectedClient((prev: any) => prev ? { ...prev, notes: notesText } : prev);
        setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...c, notes: notesText } : c));
        setNotesSavedFeedback(true);
        setTimeout(() => setNotesSavedFeedback(false), 3000);
      } else {
        alert("Error al guardar notas: " + error.message);
      }
    } catch (e: any) {
      alert("Error al guardar notas: " + e.message);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleSaveAllClientInfo = async () => {
    if (!selectedClient?.id) return;
    setIsSavingClientInfo(true);
    try {
      const updatePayload: Partial<CRMUser> = {
        company_name: clientFormData.company_name.trim(),
        contact_name: clientFormData.contact_name.trim(),
        cedula: clientFormData.cedula.trim(),
        email: clientFormData.email.trim(),
        phone: clientFormData.phone.trim(),
        password: clientFormData.password.trim(),
        activity_code: clientFormData.activity_code,
        assigned_to: clientFormData.assigned_to || undefined,
        status: clientFormData.status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('crm_users')
        .update(updatePayload)
        .eq('id', selectedClient.id);

      if (!error) {
        setSelectedClient((prev: any) => prev ? { ...prev, ...updatePayload } : prev);
        setClients(prev => prev.map(c => c.id === selectedClient.id ? ({ ...c, ...updatePayload } as CRMUser) : c));
        setClientInfoSavedFeedback(true);
        setTimeout(() => setClientInfoSavedFeedback(false), 3000);
      } else {
        alert("Error al guardar información del cliente: " + error.message);
      }
    } catch (err: any) {
      alert("Error al guardar: " + err.message);
    } finally {
      setIsSavingClientInfo(false);
    }
  };

  const handleUpdateProformaField = async (
    proformaId: string,
    field: string,
    value: any,
  ) => {
    const { error } = await supabase
      .from("proformas")
      .update({ [field]: value })
      .eq("id", proformaId);

    if (!error) {
      setClientProformas(prev => 
        prev.map(p => p.id === proformaId ? { ...p, [field]: value } : p)
      );
      if (viewingProforma && viewingProforma.id === proformaId) {
        setViewingProforma({ ...viewingProforma, [field]: value });
      }
    } else {
      console.error(`Error updating proforma ${field}:`, error);
      alert("Error al actualizar proforma: " + error.message);
    }
  };

  const updateClientTags = async (clientId: string, newTags: string[]) => {
    // Actualización optimista inmediata en UI
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, tags: newTags } : c));
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, tags: newTags } : prev);
    }

    try {
      const { error } = await supabase
        .from("crm_users")
        .update({ tags: newTags, updated_at: new Date().toISOString() })
        .eq("id", clientId);
      if (error) {
        console.error("Error al actualizar etiquetas:", error);
      }
    } catch (e) {
      console.error("Error técnico al actualizar etiquetas:", e);
    }
  };

  const addTag = async (clientId: string, tagId: string) => {
    const client = clients.find(c => c.id === clientId) || (selectedClient?.id === clientId ? selectedClient : null);
    if (!client) return;
    const currentTags = Array.isArray(client.tags) ? client.tags : [];
    if (currentTags.includes(tagId)) return;
    const newTags = [...currentTags, tagId];
    await updateClientTags(clientId, newTags);
    // La etiqueta venta_cerrada es solo una etiqueta informativa en el cliente.
    // NO auto-aprueba ni modifica ninguna proforma — eso lo hace el agente manualmente.
  };

  const removeTag = async (clientId: string, tagId: string) => {
    const client = clients.find(c => c.id === clientId) || (selectedClient?.id === clientId ? selectedClient : null);
    if (!client) return;
    const currentTags = Array.isArray(client.tags) ? client.tags : [];
    const newTags = currentTags.filter(t => t !== tagId);
    await updateClientTags(clientId, newTags);

    // Si se quita venta_cerrada, revertir estado de proformas aprobadas a enviada/cotización
    if (tagId === 'venta_cerrada') {
      const nowStr = new Date().toISOString();
      await supabase
        .from('proformas')
        .update({
          status: 'enviada',
          approved_at: null,
          production_status: 'COTIZACION',
          updated_at: nowStr
        })
        .eq('user_id', clientId)
        .eq('status', 'aprobada');

      setClientProformas(prev => prev.map(p => 
        (p.status === 'aprobada' || p.status === 'APROBADA')
          ? { ...p, status: 'enviada', approved_at: undefined, production_status: 'COTIZACION' }
          : p
      ));
    }
  };

  const toggleTag = async (clientId: string, tagId: string) => {
    const client = clients.find((c) => c.id === clientId) || (selectedClient?.id === clientId ? selectedClient : null);
    if (!client) return;

    const currentTags = Array.isArray(client.tags) ? client.tags : [];
    if (currentTags.includes(tagId)) {
      await removeTag(clientId, tagId);
    } else {
      await addTag(clientId, tagId);
    }
  };

  const confirmApproval = async (proformaId: string) => {
    if (!approvingClient) return;
    try {
      if (proformaId !== 'none') {
        const { error: pError } = await supabase
          .from('proformas')
          .update({ status: 'aprobada', approved_at: new Date().toISOString() })
          .eq('id', proformaId);
        if (pError) throw pError;
      }
      
      const newTags = approvingClient.newTags.filter(t => !t.startsWith('closed_at:'));
      newTags.push(`closed_at:${new Date().toISOString()}`);

      // Update local state and remote
      setClients(prev => prev.map(c => c.id === approvingClient.clientId ? { ...c, tags: newTags } : c));
      await supabase.from("crm_users").update({ tags: newTags }).eq("id", approvingClient.clientId);
      
      if (selectedClient?.id === approvingClient.clientId) {
        // Optimistically update selectedClient and its proformas list
        setSelectedClient({ ...selectedClient, tags: newTags });
        loadClientProformas(approvingClient.clientId); // Assuming it has been defined and accessible 
      }
    } catch (err) {
      console.error(err);
      alert("Error al aprobar");
    } finally {
      setApprovingClient(null);
      setApprovingProformas([]);
    }
  };

  const cancelApproval = () => {
    setApprovingClient(null);
    setApprovingProformas([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredClients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClients.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id as string);
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const clientId = active.id as string;
    const destColId = over.id as string;

    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    // Determinar qué etiqueta poner según la columna
    let newTags = [...(client.tags || [])];
    
    // Lista de etiquetas que definen el pipeline (para quitar las anteriores)
    const pipelineTags = ["urgente", "cotizado", "venta_cerrada", "entregado_am", "entregado_ss"];
    
    // Primero quitamos cualquier etiqueta de pipeline previa
    newTags = newTags.filter(t => !pipelineTags.includes(t));

    // Luego agregamos la nueva si corresponde
    if (destColId === "urgente") newTags.push("urgente");
    if (destColId === "cotizado") newTags.push("cotizado");
    if (destColId === "venta_cerrada") {
      newTags.push("venta_cerrada");
      if (!client.tags?.includes("venta_cerrada")) {
        setApprovingClient({ clientId, newTags });
        const { data } = await supabase.from('proformas').select('*').eq('user_id', clientId).order('created_at', { ascending: false });
        setApprovingProformas(data || []);
        setActiveId(null);
        return;
      }
    }
    if (destColId === "entregado") newTags.push("entregado_am");
    // 'none' simplemente deja las etiquetas limpias de pipeline

    // 1. Update local state
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, tags: newTags } : c));

    // 2. Update Supabase
    try {
      const { error } = await supabase
        .from("crm_users")
        .update({ tags: newTags })
        .eq("id", clientId);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating client tags on drop:", err);
      loadClients();
    } finally {
      setActiveId(null);
    }
  };

  // --- SUBCOMPONENTS FOR DRAG AND DROP ---
  function DroppableColumn({ col, children }: { col: any, children: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({ id: col.id });
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "flex-shrink-0 w-80 rounded-3xl p-5 flex flex-col gap-4 border-2 border-dashed transition-all",
          col.color,
          isOver ? "border-amber-500 bg-amber-500/10 scale-[1.02]" : col.border,
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{col.icon}</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-tighter">
              {col.title}
            </h3>
          </div>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {children}
        </div>
      </div>
    );
  }

  function DraggableCard({ client, isOverlay }: { client: CRMUser, isOverlay?: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: client.id,
    });
    
    const style = {
      transform: CSS.Translate.toString(transform),
      opacity: isDragging && !isOverlay ? 0.3 : 1,
      cursor: isOverlay ? 'grabbing' : 'grab',
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={(e) => {
          if (isDragging) return;
          viewClientDetails(client);
        }}
        className={cn(
          "bg-card p-5 rounded-2xl border transition-all group relative overflow-hidden",
          isOverlay 
            ? "border-amber-500 ring-2 ring-amber-500/20 rotate-2 scale-105 shadow-2xl z-[100] cursor-grabbing" 
            : "border-border shadow-sm hover:shadow-xl cursor-grab"
        )}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 -mr-8 -mt-8 rounded-full group-hover:bg-amber-500/10 transition-colors" />

        <div className="flex justify-between items-start mb-3 pointer-events-none">
          <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 tracking-tighter bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded uppercase border border-amber-100 dark:border-amber-900/10">
            #{client.account_number}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div
                key={lvl}
                className={cn(
                  "w-1 h-1 rounded-full",
                  client.tags?.includes("venta_cerrada")
                    ? "bg-emerald-500 shadow-sm shadow-emerald-500/20"
                    : client.interest_level >= lvl
                      ? INTEREST_LEVELS[lvl - 1].color
                      : "bg-slate-100 dark:bg-zinc-800",
                )}
              />
            ))}
          </div>
        </div>

        <h4 className="text-[16px] font-black text-slate-900 dark:text-zinc-100 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors uppercase break-words pointer-events-none mb-1">
          {client.company_name || "Sin Empresa"}
        </h4>

        {client.contact_name && (
          <p className="text-[12px] font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-1 pointer-events-none mb-3">
            <Users className="w-3 h-3" /> {client.contact_name}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between pointer-events-none pt-3 border-t border-slate-50 dark:border-zinc-800/50">
          <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
            {client.activity_code || "General"}
          </p>
          {client.assigned_to && (
            <span className="text-[9px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/10">
              {client.assigned_to}
            </span>
          )}
        </div>
      </div>
    );
  }

  const filteredClients = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    return clients.filter((c) => {
      const matchesSearch =
        !s ||
        (c.account_number || "").toLowerCase().includes(s) ||
        (c.company_name || "").toLowerCase().includes(s) ||
        (c.contact_name || "").toLowerCase().includes(s) ||
        (c.cedula || "").toLowerCase().includes(s) ||
        (c.phone || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s) ||
        (c.assigned_to || "").toLowerCase().includes(s);
      const matchesAgent =
        agentFilter === "all" ||
        (agentFilter === "unassigned"
          ? !c.assigned_to
          : c.assigned_to === agentFilter);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesTag =
        tagFilter === "all" || 
        (tagFilter === "none" 
          ? (!c.tags || c.tags.length === 0) 
          : (c.tags && c.tags.includes(tagFilter)));
      const matchesQuote =
        quoteFilter === "all" ||
        (quoteFilter === "quoted" && clientsWithProforma.has(c.id)) ||
        (quoteFilter === "not_quoted" && !clientsWithProforma.has(c.id));
      const matchesIndustry =
        industryFilter === "all" ||
        c.activity_code === industryFilter ||
        (industryFilter === "Otro / Personalizado..." &&
          !!c.activity_code &&
          !BUSINESS_TYPES.includes(c.activity_code));

      const isClosed = c.tags && c.tags.includes("venta_cerrada");
      const hasQuote = clientsWithProforma.has(c.id);

      const isLeadsBoard = viewMode === "cards" && pipelineFilter === "leads";

      const matchesPipeline =
        isLeadsBoard ||
        pipelineFilter === "all" ||
        (pipelineFilter === "leads" && !hasQuote && !isClosed) ||
        (pipelineFilter === "quoted" && hasQuote && !isClosed) ||
        (pipelineFilter === "closed" && isClosed);

      return (
        matchesSearch &&
        matchesAgent &&
        matchesStatus &&
        matchesTag &&
        matchesQuote &&
        matchesIndustry &&
        matchesPipeline
      );
    });
  }, [clients, searchTerm, agentFilter, statusFilter, tagFilter, quoteFilter, industryFilter, pipelineFilter, viewMode, clientsWithProforma, BUSINESS_TYPES]);

  const displayedClients = useMemo(() => {
    return filteredClients.slice(0, visibleCount);
  }, [filteredClients, visibleCount]);

  const fmt = (amount: number) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 2,
    }).format(amount);

  const loadWaStats = async () => {
    setWaStatsLoading(true);
    try {
      const { data } = await supabase
        .from('whatsapp_messages')
        .select('template_type, created_at');
      if (data) {
        const today = new Date().toISOString().split('T')[0];
        const stats = { total: data.length, welcome: 0, followup: 0, renewal: 0, custom: 0, today: 0 };
        data.forEach(m => {
          if (m.created_at?.startsWith(today)) stats.today++;
          if (m.template_type === 'welcome') stats.welcome++;
          else if (m.template_type === 'followup') stats.followup++;
          else if (m.template_type === 'renewal') stats.renewal++;
          else if (m.template_type === 'custom') stats.custom++;
        });
        setWaStats(stats);
      }
    } catch (e) { console.error(e); }
    finally { setWaStatsLoading(false); }
  };

  const openWhatsApp = async (phone: string, name: string, clientId?: string, templateType: string = 'followup') => {
    if (!phone) {
      alert("Este cliente no tiene un número de teléfono registrado.");
      return;
    }
    // Limpiar el número: quitar espacios, guiones y asegurar formato internacional simple
    let cleanPhone = phone.replace(/\D/g, "");

    // Si no tiene código de país (asumiendo CR si tiene 8 dígitos)
    if (cleanPhone.length === 8) {
      cleanPhone = "506" + cleanPhone;
    }

    const message = encodeURIComponent(
      `Hola ${name}, le contacto para dar seguimiento a su solicitud.`,
    );

    // Registrar en Supabase
    try {
      await supabase.from('whatsapp_messages').insert([{
        client_id: clientId || null,
        client_name: name,
        client_phone: cleanPhone,
        template_type: templateType,
        message_text: decodeURIComponent(message),
        sent_by: loggedInAgent,
        created_at: new Date().toISOString()
      }]);
      // Actualizar stats locales en tiempo real
      setWaStats(prev => ({
        ...prev,
        total: prev.total + 1,
        today: prev.today + 1,
        [templateType]: (prev[templateType as keyof typeof prev] as number) + 1
      }));
    } catch (e) { console.error('Error logging WA message:', e); }

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  if (selectedClient) {
    // Solo contabilizar proformas aprobadas individualmente (nunca por la etiqueta del cliente)
    const isProformaApproved = (p: any) =>
      p.status === 'aprobada' ||
      p.status === 'APROBADA' ||
      Boolean(p.approved_at) ||
      (p.production_status && p.production_status !== 'COTIZACION') ||
      (Array.isArray(p.production_history) && p.production_history.some((h: any) => h.type === 'RECEIPT' && Number(h.amount) > 0));

    // Dinero contratado = solo sumar proformas aprobadas individualmente
    const approvedProformas = clientProformas.filter(isProformaApproved);
    const globalProformTotal = approvedProformas.reduce((sum, p) => sum + Number(p.total || 0), 0);
    
    let paidTotal = 0;
    const proformaBalances = clientProformas.map(p => {
      const pTotal = Number(p.total || 0);
      let pPaid = 0;
      
      // Solo contar recibos reales de la tabla receipts
      const matchingReceipts = clientReceipts.filter(r => r.proforma_id === p.id);
      if (matchingReceipts.length > 0) {
        pPaid = matchingReceipts.reduce((s, r) => s + Number(r.amount || 0), 0);
      }
      // También contar recibos reales del historial de producción (type='RECEIPT' con monto)
      if (pPaid === 0 && Array.isArray(p.production_history)) {
        p.production_history.forEach((h: any) => {
          if (h.type === 'RECEIPT' && h.amount && Number(h.amount) > 0) {
            pPaid += Number(h.amount);
          }
        });
      }
      // NUNCA auto-generar 50% si no hay recibo real
      
      paidTotal += pPaid;
      return {
        ...p,
        paid: pPaid,
        balance: Math.max(0, pTotal - pPaid)
      };
    });

    const unassignedReceipts = clientReceipts.filter(r => !r.proforma_id);
    paidTotal += unassignedReceipts.reduce((s, r) => s + Number(r.amount || 0), 0);
    const pendingBalance = Math.max(0, globalProformTotal - paidTotal);
    
    const earliestPaymentDate = clientReceipts.length > 0
      ? Math.min(...clientReceipts.map(r => new Date(r.date || r.created_at || Date.now()).getTime()))
      : null;
      
    const deliveryDateStr = earliestPaymentDate 
      ? new Date(earliestPaymentDate + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CR') 
      : 'Aún no definida (Falta Abono inicial)';

    return (
      <SidebarLayout
        title={selectedClient.company_name || selectedClient.contact_name}
        badge="DETALLE"
        badgeColor="indigo"
        headerContent={
          <button
            onClick={() => setSelectedClient(null)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl text-slate-400 hover:text-white transition-all mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
      >
          {/* Redundant labels removed - Header handles navigation */}

          {/* Client Info Card */}
          <div className="bg-background dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-800/40 overflow-hidden mb-6">
            <div className="p-6 border-b border-zinc-800/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedClient.company_name || "Sin Nombre"}
                    </h2>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        selectedClient.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {selectedClient.status === "active"
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                    {selectedClient.tags?.includes("venta_cerrada") && (
                      <span className="bg-purple-600 text-white px-3 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-lg shadow-purple-500/20 animate-pulse">
                        🏆 CLIENTE CONFIRMADO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-slate-500 dark:text-zinc-300 text-sm font-bold tracking-tight">
                      Cuenta #{selectedClient.account_number} •
                    </p>
                    <select
                      value={
                        BUSINESS_TYPES.includes(
                          selectedClient.activity_code || "",
                        )
                          ? selectedClient.activity_code
                          : selectedClient.activity_code
                            ? "Otro"
                            : ""
                      }
                      onChange={async (e) => {
                        const val = e.target.value;
                        const newActivity =
                          val === "Otro"
                            ? prompt("Escriba el tipo de negocio:") || ""
                            : val;
                        await handleUpdateClientField(
                          selectedClient.id,
                          "activity_code",
                          newActivity,
                        );
                      }}
                      className="text-sm font-medium bg-transparent text-amber-600 dark:text-amber-500 hover:text-amber-700 outline-none border-b border-dashed border-amber-300 dark:border-amber-800 pb-0.5 cursor-pointer"
                    >
                      <option value="">Añadir Actividad...</option>
                      {BUSINESS_TYPES.map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                      <option value="Otro">Otro / Personalizado...</option>
                    </select>
                    {!BUSINESS_TYPES.includes(
                      selectedClient.activity_code || "",
                    ) &&
                      selectedClient.activity_code && (
                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                          ({selectedClient.activity_code})
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      openWhatsApp(
                        selectedClient.phone,
                        selectedClient.contact_name ||
                          selectedClient.company_name,
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-bold shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                  <Link
                    href={`/cotizador?clientId=${selectedClient.id}`}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2 font-bold shadow-sm transition-all animate-in zoom-in-90 duration-300"
                  >
                    <Calculator className="w-4 h-4" /> Cotizar
                  </Link>
                  <button
                    onClick={() =>
                      handleUpdateClientField(
                        selectedClient.id,
                        "status",
                        selectedClient.status === "active"
                          ? "inactive"
                          : "active",
                      )
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                      selectedClient.status === "active"
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-green-200 text-green-600 hover:bg-green-50",
                    )}
                  >
                    {selectedClient.status === "active"
                      ? "Marcar Inactivo"
                      : "Activar Cliente"}
                  </button>
                </div>
              </div>

              {/* Thermometer Display */}
              <div className="mb-6 bg-card dark:bg-zinc-950 p-4 rounded-xl border border-zinc-800/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    {selectedClient.tags?.includes("venta_cerrada")
                      ? "Nivel de Satisfacción / Fidelidad"
                      : "Termómetro de Interés"}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      selectedClient.tags?.includes("venta_cerrada")
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : INTEREST_LEVELS.find((l) => l.level === selectedClient.interest_level)?.bg,
                      selectedClient.tags?.includes("venta_cerrada")
                        ? ""
                        : INTEREST_LEVELS.find((l) => l.level === selectedClient.interest_level)?.text,
                    )}
                  >
                    {
                      selectedClient.tags?.includes("venta_cerrada")
                        ? "Confirmado ✓"
                        : INTEREST_LEVELS.find((l) => l.level === selectedClient.interest_level)?.label
                    }
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() =>
                        handleUpdateClientField(
                          selectedClient.id,
                          "interest_level",
                          lvl,
                        )
                      }
                      className={cn(
                        "h-3 flex-1 rounded-full transition-all",
                        selectedClient.tags?.includes("venta_cerrada")
                          ? "bg-emerald-500 shadow-sm shadow-emerald-500/20"
                          : selectedClient.interest_level >= lvl
                            ? INTEREST_LEVELS[lvl - 1].color
                            : "bg-slate-200 dark:bg-zinc-800",
                      )}
                      title={INTEREST_LEVELS[lvl - 1].label}
                    />
                  ))}
                </div>
              </div>

              {/* CRM Financial Balance and Delivery Summary */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* 1. Dinero Contratado */}
                <div className="bg-amber-500/5 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-500/20">
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-1">
                    Dinero Contratado (Cotizado)
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    ₡{globalProformTotal.toLocaleString('es-CR')}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-400 font-bold mt-1 uppercase">
                    {approvedProformas.length} cotización(es) aprobada(s) de {clientProformas.length}
                  </p>
                </div>

                {/* 2. Adelanto / Total Pagado */}
                <div className="bg-emerald-500/5 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/20">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                    Adelanto / Total Pagado
                  </span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                    ₡{paidTotal.toLocaleString('es-CR')}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-400 font-bold mt-1 uppercase">
                    {clientReceipts.length} recibo(s) / abono(s)
                  </p>
                </div>

                {/* 3. Saldo Pendiente */}
                <div className="bg-rose-500/5 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-500/20">
                  <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest block mb-1">
                    Saldo Pendiente
                  </span>
                  <div className={`text-2xl font-black tracking-tight ${pendingBalance <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    ₡{pendingBalance.toLocaleString('es-CR')}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-400 font-bold mt-1 uppercase">
                    {pendingBalance <= 0 ? '✓ Cancelado al 100%' : 'Por cobrar'}
                  </p>
                </div>
              </div>

              {/* Desglose de Proformas y Entrega */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <span className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-2 block">
                    Desglose por Cotización
                  </span>
                  <div className="space-y-2 overflow-y-auto max-h-28 pr-1 custom-scrollbar">
                    {proformaBalances.map(pb => (
                      <div key={pb.id} className="flex justify-between items-center text-[11px] font-bold p-2 bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800/80">
                        <span className="font-mono text-slate-700 dark:text-zinc-300">
                          #{pb.proforma_number} <span className="text-slate-400 font-normal">({fmt(pb.total)})</span>
                        </span>
                        <div className="flex gap-3 text-right text-[10px]">
                          <span className="text-emerald-600 dark:text-emerald-400 font-black">
                            Pagado: ₡{pb.paid.toLocaleString('es-CR')}
                          </span>
                          <span className={pb.balance > 0 ? "text-rose-600 dark:text-rose-400 font-black" : "text-emerald-600 font-black"}>
                            Saldo: ₡{pb.balance.toLocaleString('es-CR')}
                          </span>
                        </div>
                      </div>
                    ))}
                    {proformaBalances.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-2">No hay cotizaciones para este cliente</p>
                    )}
                  </div>
                </div>

                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1 block">
                      Fecha de Entrega Estimada
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                      <Calendar className="w-5 h-5 text-indigo-500" /> {deliveryDateStr}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-2">
                    Calculada automáticamente según el registro del primer abono o fecha de confirmación del pedido.
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-zinc-800/30 -mb-6 mt-4">
                <button
                  onClick={() => setActiveTab("info")}
                  className={cn(
                    "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    activeTab === "info"
                      ? "text-amber-500"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  Información General
                  {activeTab === "info" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={cn(
                    "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    activeTab === "notes"
                      ? "text-amber-500"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  Seguimiento y Notas
                  {activeTab === "notes" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={cn(
                    "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    activeTab === "orders"
                      ? "text-amber-500"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300",
                  )}
                >
                  Cotizaciones ({clientProformas.length})
                  {activeTab === "orders" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("receipts")}
                  className={cn(
                    "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    activeTab === "receipts"
                      ? "text-green-500"
                      : "text-slate-400 hover:text-green-400 dark:hover:text-green-300",
                  )}
                >
                  Recibos ({clientReceipts.length})
                  {activeTab === "receipts" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("designs")}
                  className={cn(
                    "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    activeTab === "designs"
                      ? "text-indigo-500"
                      : "text-slate-400 hover:text-indigo-400 dark:hover:text-indigo-300",
                  )}
                >
                  Diseños y Galería 🎨
                  {activeTab === "designs" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                  )}
                </button>
                {selectedClient.tags?.includes("venta_cerrada") && (
                  <button
                    onClick={() => setActiveTab("post-sale")}
                    className={cn(
                      "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                      activeTab === "post-sale"
                        ? "text-purple-500"
                        : "text-slate-400 hover:text-purple-400 dark:hover:text-purple-300",
                    )}
                  >
                    Fidelización 💜
                    {activeTab === "post-sale" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 bg-background dark:bg-zinc-900">
              {activeTab === "info" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Top Bar with Prominent Save Button */}
                  <div className="flex flex-wrap justify-between items-center bg-slate-50 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 mb-6 gap-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                        <Edit className="w-4 h-4 text-amber-500" /> Datos Principales y Contacto
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Edita los campos y presiona Guardar Cambios para actualizar la cuenta.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {clientInfoSavedFeedback && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="w-4 h-4" /> Cambios Guardados
                        </span>
                      )}
                      <button
                        onClick={handleSaveAllClientInfo}
                        disabled={isSavingClientInfo}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        {isSavingClientInfo ? (
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{isSavingClientInfo ? "Guardando..." : "Guardar Cambios"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                    {/* Company Name */}
                    <div className="md:col-span-2 bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-black mb-1.5 uppercase text-[10px] tracking-wider">
                        Nombre de Empresa o Negocio
                      </p>
                      <input
                        type="text"
                        value={clientFormData.company_name}
                        onChange={(e) => setClientFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        className="w-full text-base font-bold text-slate-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="Ej. SUPETSA, MAYKE PIZZERIA..."
                      />
                    </div>

                    {/* Cedula */}
                    <div className="bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-black mb-1.5 uppercase text-[10px] tracking-wider">
                        Cédula Jurídica / Física / ID
                      </p>
                      <input
                        type="text"
                        value={clientFormData.cedula}
                        onChange={(e) => setClientFormData(prev => ({ ...prev, cedula: e.target.value }))}
                        className="w-full text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="Ej. 3-101-123456"
                      />
                    </div>

                    {/* Contact */}
                    <div className="bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-black mb-1.5 uppercase text-[10px] tracking-wider">
                        Nombre de Contacto / Encargado
                      </p>
                      <input
                        type="text"
                        value={clientFormData.contact_name}
                        onChange={(e) => setClientFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                        className="w-full text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>

                    {/* Email */}
                    <div className="bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-black mb-1.5 uppercase text-[10px] tracking-wider">
                        Correo Electrónico
                      </p>
                      <input
                        type="email"
                        value={clientFormData.email}
                        onChange={(e) => setClientFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="cliente@empresa.com"
                      />
                    </div>

                    {/* Phone */}
                    <div className="bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-black mb-1.5 uppercase text-[10px] tracking-wider">
                        Teléfono / WhatsApp
                      </p>
                      <input
                        type="text"
                        value={clientFormData.phone}
                        onChange={(e) => setClientFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        placeholder="8888-8888"
                      />
                    </div>

                    {/* Activity Code */}
                    <div className="bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-black mb-1.5 uppercase text-[10px] tracking-wider">
                        Tipo de Negocio / Actividad
                      </p>
                      <select
                        value={BUSINESS_TYPES.includes(clientFormData.activity_code || "") ? clientFormData.activity_code : clientFormData.activity_code ? "Otro" : ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "Otro") {
                            const custom = prompt("Escriba el tipo de negocio:") || "";
                            if (custom) setClientFormData(prev => ({ ...prev, activity_code: custom }));
                          } else {
                            setClientFormData(prev => ({ ...prev, activity_code: val }));
                          }
                        }}
                        className="w-full text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
                      >
                        <option value="">Seleccionar actividad...</option>
                        {BUSINESS_TYPES.map(bt => (
                          <option key={bt} value={bt}>{bt}</option>
                        ))}
                        <option value="Otro">Otro / Personalizado...</option>
                      </select>
                      {!BUSINESS_TYPES.includes(clientFormData.activity_code || "") && clientFormData.activity_code && (
                        <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                          Personalizado: {clientFormData.activity_code}
                        </p>
                      )}
                    </div>

                    {/* Assigned To */}
                    <div className="bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-black mb-1.5 uppercase text-[10px] tracking-wider">
                        Agente Asignado
                      </p>
                      <select
                        value={clientFormData.assigned_to || ""}
                        onChange={(e) => setClientFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
                        className="w-full text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
                      >
                        <option value="">Sin Asignar</option>
                        {AGENTS.map(ag => (
                          <option key={ag} value={ag}>{ag}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div className="bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-black mb-1.5 uppercase text-[10px] tracking-wider">
                        Estado del Cliente
                      </p>
                      <select
                        value={clientFormData.status}
                        onChange={(e) => setClientFormData(prev => ({ ...prev, status: e.target.value as "active" | "inactive" }))}
                        className="w-full text-sm font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
                      >
                        <option value="active">🟢 Activo</option>
                        <option value="inactive">🔴 Inactivo / Pausado</option>
                      </select>
                    </div>

                    {/* Username - Read only */}
                    <div className="bg-slate-50 dark:bg-zinc-900/40 px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-bold mb-1 uppercase text-[10px] tracking-wider">
                        Usuario / Acceso Portal
                      </p>
                      <input
                        type="text"
                        readOnly
                        value={selectedClient.account_number || ""}
                        className="w-full text-sm font-mono font-semibold text-slate-800 dark:text-zinc-200 bg-transparent outline-none cursor-default"
                        title="Identificador único del portal de clientes."
                      />
                    </div>

                    {/* Password */}
                    <div className="bg-slate-50 dark:bg-zinc-900/40 px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
                      <p className="text-slate-500 dark:text-zinc-400 font-bold mb-1 uppercase text-[10px] tracking-wider">
                        Contraseña / Clave de Acceso
                      </p>
                      <input
                        type="text"
                        value={clientFormData.password}
                        onChange={(e) => setClientFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full text-sm font-mono font-semibold text-slate-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Sin contraseña"
                      />
                    </div>

                    {/* Date - read only */}
                    <div className="bg-card dark:bg-zinc-800/50 p-4 rounded-2xl border border-dashed border-zinc-800/40">
                      <p className="text-slate-400 dark:text-zinc-400 font-bold mb-1 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-amber-500" /> Fecha de Ingreso al CRM
                      </p>
                      <p className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {selectedClient.created_at
                          ? new Date(selectedClient.created_at).toLocaleDateString("es-CR", { day: "2-digit", month: "long", year: "numeric" })
                          : "No registrada"}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800/80 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        const contactName = clientFormData.contact_name || clientFormData.company_name;
                        const user = selectedClient.account_number || "";
                        const pass = clientFormData.password || "";
                        const phone = clientFormData.phone || "";
                        const cleanPhone = phone.replace(/[^0-9]/g, "");
                        
                        const message = `Hola *${contactName}*, ya puedes ingresar al Portal de Clientes de Alfombras Personalizadas para ver tu información y seguir la fabricación de tu alfombra en tiempo real.\n\n🔗 Enlace de acceso: ${window.location.origin}/login\n👤 Usuario: *${user}*\n🔑 Contraseña: *${pass}*`;
                        const url = `https://wa.me/${cleanPhone.startsWith('506') ? cleanPhone : '506' + cleanPhone}?text=${encodeURIComponent(message)}`;
                        window.open(url, '_blank');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md shadow-emerald-500/10 cursor-pointer"
                      title="Enviar credenciales de acceso por WhatsApp al cliente"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enviar Acceso por WhatsApp
                    </button>

                    <button
                      onClick={handleSaveAllClientInfo}
                      disabled={isSavingClientInfo}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {isSavingClientInfo ? (
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isSavingClientInfo ? "Guardando Cambios..." : "Guardar Cambios del Cliente"}</span>
                    </button>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-500" />
                          <span>Etiquetas Asignadas</span>
                        </p>
                        <span className="text-[10px] font-bold text-slate-400">
                          {(selectedClient?.tags || []).length} activas
                        </span>
                      </div>

                      {/* Etiquetas Activas con botón 'X' para quitar */}
                      <div className="flex flex-wrap gap-2 min-h-[36px] p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 items-center">
                        {(selectedClient?.tags || []).length === 0 ? (
                          <span className="text-xs text-slate-400 italic">
                            No tiene etiquetas asignadas. Haz clic en las etiquetas de abajo para agregarlas.
                          </span>
                        ) : (
                          (selectedClient?.tags || []).map((tagId: string) => {
                            const tagObj = AVAILABLE_TAGS.find(t => t.id === tagId);
                            const label = tagObj ? tagObj.label : tagId;
                            const colorClass = tagObj ? tagObj.color : 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-zinc-800 dark:text-zinc-200';

                            return (
                              <span
                                key={tagId}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition-all group",
                                  colorClass
                                )}
                              >
                                <span>{label}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeTag(selectedClient.id, tagId);
                                  }}
                                  className="w-4 h-4 rounded-full bg-black/10 hover:bg-black/25 dark:bg-white/10 dark:hover:bg-white/25 flex items-center justify-center text-xs transition-colors cursor-pointer"
                                  title="Quitar esta etiqueta"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Agregar Etiquetas Disponibles */}
                    <div>
                      <p className="text-slate-400 dark:text-zinc-500 font-medium mb-2 uppercase text-[10px] tracking-tight">
                        Agregar Etiquetas Rápidas (+)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_TAGS.filter(t => !(selectedClient?.tags || []).includes(t.id)).map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => addTag(selectedClient!.id, tag.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-zinc-800 bg-background dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-2xs hover:scale-102 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 text-slate-400" />
                            <span>{tag.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Crear y añadir etiqueta personalizada */}
                    <div className="flex items-center gap-2 pt-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={newCustomTag}
                          onChange={(e) => setNewCustomTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newCustomTag.trim()) {
                              e.preventDefault();
                              addTag(selectedClient!.id, newCustomTag.trim().toLowerCase());
                              setNewCustomTag("");
                            }
                          }}
                          placeholder="Nueva etiqueta personalizada (ej: VIP, Hotel, etc.)..."
                          className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (newCustomTag.trim()) {
                            addTag(selectedClient!.id, newCustomTag.trim().toLowerCase());
                            setNewCustomTag("");
                          }
                        }}
                        disabled={!newCustomTag.trim()}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm flex-shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-500" /> Bitácora & Notas de Seguimiento
                    </span>
                    <div className="flex items-center gap-3">
                      {notesSavedFeedback && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                          <CheckCircle className="w-4 h-4" /> Guardado
                        </span>
                      )}
                      <button
                        onClick={handleSaveNotes}
                        disabled={isSavingNotes}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                      >
                        {isSavingNotes ? (
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{isSavingNotes ? "Guardando..." : "Guardar Notas"}</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    onBlur={handleSaveNotes}
                    placeholder="Escribe aquí acuerdos, llamadas, compromisos, especificaciones técnicas pactadas, o notas importantes sobre este cliente..."
                    className="w-full h-64 p-5 border border-slate-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-sans text-sm text-slate-800 dark:text-zinc-200 dark:bg-zinc-950 bg-white shadow-inner resize-y leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                    <span>💡 Tip: Las notas se guardan automáticamente al salir de la casilla o al hacer clic en Guardar Notas.</span>
                    <span>{notesText.length} caracteres</span>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                        Cotizaciones del Cliente ({clientProformas.length})
                      </span>
                    </div>
                    <Link
                      href={`/cotizador?client=${selectedClient.id}`}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nueva Cotización
                    </Link>
                  </div>

                  {clientProformas.length === 0 ? (
                    <div className="text-center py-12 bg-card dark:bg-zinc-950 rounded-2xl border border-dashed border-zinc-800/40 flex flex-col items-center justify-center p-6">
                      <FileText className="w-10 h-10 text-slate-400 dark:text-zinc-600 mb-3" />
                      <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">
                        No hay cotizaciones registradas
                      </p>
                      <p className="text-xs text-slate-400 mb-4">
                        Crea una nueva cotización para este cliente en el cotizador
                      </p>
                      <Link
                        href={`/cotizador?client=${selectedClient.id}`}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Crear Cotización
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-card dark:bg-zinc-800 border-b dark:border-zinc-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase">
                              Proforma
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase">
                              Fecha
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase">
                              Total
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase">
                              Producción
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase">
                              Estado Venta
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-zinc-800">
                          {clientProformas.map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-card dark:hover:bg-zinc-800/10"
                            >
                              <td className="px-4 py-3 font-mono text-sm text-slate-900 dark:text-zinc-300">
                                #{p.proforma_number}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">
                                {loggedInAgent === 'Rolo' ? (
                                  <input 
                                    type="date"
                                    value={p.date || ""}
                                    onChange={(e) => handleUpdateProformaField(p.id, "date", e.target.value)}
                                    className="bg-transparent border-none p-0 text-sm font-medium text-slate-600 dark:text-zinc-400 outline-none focus:ring-0 cursor-pointer"
                                  />
                                ) : (
                                  p.date
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-right font-bold text-slate-900 dark:text-zinc-200">
                                {fmt(p.total)}
                              </td>
                              <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                                <select
                                  value={p.production_status || "COTIZACION"}
                                  onChange={async (e) => {
                                    const newProdStatus = e.target.value;
                                    
                                    // Log to history
                                    const currentHistory = p.production_history || [];
                                    const exists = currentHistory.some((h: any) => h.status === newProdStatus);
                                    let updatedHistory = [...currentHistory];
                                    if (!exists) {
                                      updatedHistory.push({
                                        status: newProdStatus,
                                        completed_at: new Date().toISOString()
                                      });
                                    }

                                    const { error } = await supabase
                                      .from('proformas')
                                      .update({ 
                                        production_status: newProdStatus,
                                        production_history: updatedHistory,
                                        updated_at: new Date().toISOString()
                                      })
                                      .eq('id', p.id);
                                    if (!error) {
                                      setClientProformas(prev => prev.map(prof => prof.id === p.id ? { ...prof, production_status: newProdStatus, production_history: updatedHistory } : prof));
                                    } else {
                                      alert("Error al actualizar estado de producción: " + error.message);
                                    }
                                  }}
                                  className="text-xs font-bold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg px-2.5 py-1.5 outline-none text-slate-800 dark:text-zinc-200 cursor-pointer shadow-xs max-w-[200px]"
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
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={async () => {
                                    const isCurrentlyApproved = p.status === 'aprobada' || p.status === 'APROBADA';
                                    const newStatus = isCurrentlyApproved ? 'enviada' : 'aprobada';
                                    const nowStr = new Date().toISOString();
                                    
                                    const updatePayload: any = {
                                      status: newStatus,
                                      approved_at: newStatus === 'aprobada' ? nowStr : null,
                                      updated_at: nowStr
                                    };
                                    if (newStatus === 'aprobada' && (!p.production_status || p.production_status === 'COTIZACION')) {
                                      updatePayload.production_status = 'ABONO_50';
                                    } else if (newStatus === 'enviada' && p.production_status === 'ABONO_50') {
                                      updatePayload.production_status = 'COTIZACION';
                                    }

                                    const { error } = await supabase.from('proformas').update(updatePayload).eq('id', p.id);
                                    if (!error) {
                                      setClientProformas(prev => prev.map(prof => prof.id === p.id ? { ...prof, ...updatePayload } : prof));
                                      
                                      // Sincronizar etiqueta venta_cerrada en el cliente
                                      if (selectedClient) {
                                        const currentTags = Array.isArray(selectedClient.tags) ? selectedClient.tags : [];
                                        let newTags = [...currentTags];
                                        if (newStatus === 'aprobada') {
                                          if (!newTags.includes('venta_cerrada')) {
                                            newTags.push('venta_cerrada');
                                          }
                                        } else {
                                          const hasOtherApproved = clientProformas.some(other => other.id !== p.id && (other.status === 'aprobada' || other.status === 'APROBADA'));
                                          if (!hasOtherApproved) {
                                            newTags = newTags.filter(t => t !== 'venta_cerrada');
                                          }
                                        }
                                        await updateClientTags(selectedClient.id, newTags);
                                      }
                                    } else {
                                      alert("Error actualizando estado: " + error.message);
                                    }
                                  }}
                                  title="Clic para alternar estado (Aprobada / Enviada) y sincronizar con venta cerrada"
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors shadow-xs cursor-pointer",
                                    (p.status === 'aprobada' || p.status === 'APROBADA') 
                                      ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200" 
                                      : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                  )}
                                >
                                  {(p.status === 'aprobada' || p.status === 'APROBADA') ? '✓ Aprobada' : 'Enviada'}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      const autoAbono = Math.round(Number(p.total || 0) * 0.5);
                                      setReceiptData({
                                        amount: autoAbono,
                                        description: `Abono 50% de Proforma #${p.proforma_number}`,
                                        payment_method: 'SINPE Móvil',
                                        date: new Date().toISOString().split('T')[0]
                                      });
                                      setIsCreatingReceipt(p);
                                    }}
                                    className="p-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-all shadow-sm"
                                    title="Emitir Recibo de Dinero para esta Cotización"
                                  >
                                    <Calculator className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setViewingProforma(p)}
                                    className="p-2 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                    title="Ver e Imprimir Proforma"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <Link
                                    href={`/cotizador?edit=${p.id}`}
                                    className="p-2 bg-amber-500/10 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition-all shadow-sm inline-block"
                                    title="Editar Cotización en Cotizador"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteProforma(p)}
                                    className="p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Eliminar Proforma Permanentemente"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "receipts" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-zinc-950 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                        Historial de Recibos ({clientReceipts.length})
                      </span>
                    </div>
                    {clientProformas.length > 0 ? (
                      <button
                        onClick={() => {
                          const latestProf = clientProformas[0];
                          const autoAbono = Math.round(Number(latestProf.total || 0) * 0.5);
                          setReceiptData({
                            amount: autoAbono,
                            description: `Abono 50% de Proforma #${latestProf.proforma_number}`,
                            payment_method: 'SINPE Móvil',
                            date: new Date().toISOString().split('T')[0]
                          });
                          setIsCreatingReceipt(latestProf);
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Emitir Recibo
                      </button>
                    ) : (
                      <Link
                        href={`/cotizador?client=${selectedClient.id}`}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Crear Cotización Primero
                      </Link>
                    )}
                  </div>

                  {clientReceipts.length === 0 ? (
                    <div className="text-center py-12 bg-card dark:bg-zinc-950 rounded-2xl border border-dashed border-zinc-800/40 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                        <Calculator className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">
                        No hay Recibos
                      </p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Genera uno desde una proforma
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {clientReceipts.map((r) => (
                        <div key={r.id} className="flex flex-col">
                          <div
                            className="bg-background dark:bg-zinc-900 border border-zinc-800/30 p-5 rounded-2xl shadow-sm hover:shadow flex justify-between items-center transition-all group"
                          >
                            <div className="flex gap-4 items-center">
                              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                                <Calculator className="w-6 h-6" />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                   <h4 className="font-black text-sm uppercase text-slate-900 dark:text-white">
                                     Recibo <span className="text-amber-500">{r.receipt_number}</span>
                                   </h4>
                                   <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                     {new Date(r.date || r.created_at || new Date().toISOString()).toLocaleDateString('es-CR')}
                                   </span>
                                 </div>
                                 <p className="text-xs font-bold text-slate-500 uppercase">
                                   <span className="text-slate-900 dark:text-zinc-300">Monto:</span> ₡{Number(r.amount).toLocaleString('es-CR')}
                                   <span className="mx-2 text-slate-300">|</span>
                                   <span className="text-slate-900 dark:text-zinc-300">Medio:</span> {r.payment_method}
                                 </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setReceiptData({
                                    amount: r.amount,
                                    description: r.description,
                                    payment_method: r.payment_method,
                                    date: r.date || r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
                                  });
                                  setEditingReceipt(r);
                                }}
                                className="w-10 h-10 border border-zinc-800/40 bg-background dark:bg-zinc-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                                title="Editar Recibo (Modificar y registrar auditoría)"
                              >
                                <Settings className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setGeneratedReceipt({
                                    ...r,
                                    client_name: r.client_name || selectedClient?.company_name || selectedClient?.contact_name || 'Cliente'
                                  });
                                }}
                                className="w-10 h-10 border border-zinc-800/40 bg-background dark:bg-zinc-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                                title="Ver e Imprimir Recibo Oficial"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteReceipt(r)}
                                className="w-10 h-10 border border-zinc-800/40 bg-background dark:bg-zinc-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                                title="Eliminar Recibo (Permanente)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Audit Log Timeline - Registro de quién y cuándo modificó el recibo */}
                          {r.audit_log && r.audit_log.length > 0 && (
                            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-4 mt-2 border border-amber-200/60 dark:border-amber-900/40">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" /> Registro de Modificaciones ({r.audit_log.length})
                              </h4>
                              <ul className="space-y-2 text-xs w-full">
                                {r.audit_log.map((log: any, idx: number) => (
                                  <li key={idx} className="bg-background dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-start mb-1.5">
                                      <span className="text-slate-900 dark:text-white font-black uppercase text-[11px]">
                                        Modificado por: <span className="text-amber-600 dark:text-amber-400">{log.agent || 'Administrador'}</span>
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                        {new Date(log.date).toLocaleString('es-CR')}
                                      </span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                                      Monto anterior: <span className="line-through text-red-500 font-bold">₡{Number(log.previous_total).toLocaleString('es-CR')}</span>
                                      <span className="mx-2 font-bold">➔</span>
                                      Monto nuevo: <span className="text-emerald-600 dark:text-emerald-400 font-black">₡{Number(log.new_total).toLocaleString('es-CR')}</span>
                                    </p>
                                    {log.previous_method && log.new_method && log.previous_method !== log.new_method && (
                                      <p className="text-[10px] text-slate-500 mt-1">
                                        Método: <span className="line-through">{log.previous_method}</span> ➔ <span className="font-bold">{log.new_method}</span>
                                      </p>
                                    )}
                                    {log.message && <p className="text-slate-400 dark:text-zinc-500 text-[10px] mt-1 italic">{log.message}</p>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "designs" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Logotipo del Cliente */}
                    <div className="p-5 rounded-2xl bg-card border border-zinc-800/40 flex flex-col justify-between min-h-[350px]">
                      <div>
                        <h4 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Logotipo del Cliente</h4>
                        {clientDesigns.some(d => d.category === 'logo') ? (
                          <div className="relative group rounded-xl overflow-hidden border border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-3 h-48">
                            <img 
                              src={clientDesigns.find(d => d.category === 'logo').url} 
                              alt="Logo" 
                              className="max-h-[80%] max-w-full object-contain"
                            />
                            <button
                              onClick={() => handleDeleteDesign(clientDesigns.find(d => d.category === 'logo').id)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              title="Eliminar Logotipo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-2 font-mono truncate max-w-full">
                              Actualizado por cliente o staff
                            </span>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 text-center h-48 flex flex-col items-center justify-center">
                            <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold mb-1">Sin Logotipo Cargado</p>
                            <p className="text-[10px] text-slate-400/80 dark:text-zinc-650 max-w-[180px]">El cliente o el staff puede cargar el logotipo en esta sección.</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center justify-center gap-2 cursor-pointer bg-amber-500/10 hover:bg-amber-500 hover:text-white border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all w-full">
                          {uploadingDesign === 'logo' ? (
                            <span className="w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                          ) : (
                            <span>Subir / Cambiar Logo</span>
                          )}
                          <input 
                            type="file" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadDesign('logo', file);
                            }} 
                            accept="image/*" 
                            className="hidden" 
                            disabled={uploadingDesign !== null} 
                          />
                        </label>
                      </div>
                    </div>

                    {/* Propuestas de Diseño */}
                    <div className="p-5 rounded-2xl bg-card border border-zinc-800/40 flex flex-col justify-between min-h-[350px]">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Propuestas de Confección</h4>
                          <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 px-2 py-0.5 rounded font-black">
                            {clientDesigns.filter(d => d.category === 'proposal').length}/15
                          </span>
                        </div>
                        {clientDesigns.filter(d => d.category === 'proposal').length > 0 ? (
                          <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-48 pr-1 custom-scrollbar">
                            {clientDesigns.filter(d => d.category === 'proposal').map((d, idx) => (
                              <div key={d.id} className="relative group rounded-lg overflow-hidden border border-slate-100 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-1 aspect-square">
                                <img 
                                  src={d.url} 
                                  alt={`Propuesta ${idx + 1}`} 
                                  className="max-h-full max-w-full object-contain"
                                />
                                <button
                                  onClick={() => handleDeleteDesign(d.id)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                  title="Eliminar Propuesta"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">#{idx + 1}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 text-center h-48 flex flex-col items-center justify-center">
                            <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold mb-1">Sin Propuestas Cargadas</p>
                            <p className="text-[10px] text-slate-400/80 dark:text-zinc-650 max-w-[180px]">Sube hasta 15 propuestas de diseño para que el cliente las vea y autorice.</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center justify-center gap-2 cursor-pointer bg-amber-500/10 hover:bg-amber-500 hover:text-white border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all w-full">
                          {uploadingDesign === 'proposal' ? (
                            <span className="w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                          ) : (
                            <span>Subir Propuesta (+ Añadir)</span>
                          )}
                          <input 
                            type="file" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadDesign('proposal', file);
                            }} 
                            accept="image/*" 
                            className="hidden" 
                            disabled={uploadingDesign !== null} 
                          />
                        </label>
                      </div>
                    </div>

                    {/* Alfombra Terminada */}
                    <div className="p-5 rounded-2xl bg-card border border-zinc-800/40 flex flex-col justify-between min-h-[350px]">
                      <div>
                        <h4 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Foto de Alfombra Terminada</h4>
                        {clientDesigns.some(d => d.category === 'final') ? (
                          <div className="relative group rounded-xl overflow-hidden border border-emerald-200/50 dark:border-emerald-950/20 bg-emerald-500/5 flex flex-col items-center justify-center p-3 h-48">
                            <img 
                              src={clientDesigns.find(d => d.category === 'final').url} 
                              alt="Terminada" 
                              className="max-h-[85%] max-w-full object-contain"
                            />
                            <button
                              onClick={() => handleDeleteDesign(clientDesigns.find(d => d.category === 'final').id)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              title="Eliminar Foto Final"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2">
                              ¡Lista para despacho!
                            </span>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-6 text-center h-48 flex flex-col items-center justify-center">
                            <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold mb-1">Sin Foto de Alfombra</p>
                            <p className="text-[10px] text-slate-400/80 dark:text-zinc-650 max-w-[180px]">Sube la foto del producto terminado cuando esté listo para enviar.</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center justify-center gap-2 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all w-full">
                          {uploadingDesign === 'final' ? (
                            <span className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                          ) : (
                            <span>Subir Foto Alfombra Final</span>
                          )}
                          <input 
                            type="file" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadDesign('final', file);
                            }} 
                            accept="image/*" 
                            className="hidden" 
                            disabled={uploadingDesign !== null} 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "post-sale" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-purple-600/20 rounded-xl">
                        <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-purple-900 dark:text-purple-200">
                          Programa de Fidelización
                        </h3>
                        <p className="text-sm text-purple-700 dark:text-purple-400 font-medium italic">
                          Este cliente ya es parte de nuestra comunidad
                          confirmada.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() =>
                          openWhatsApp(
                            selectedClient.phone,
                            selectedClient.contact_name ||
                              selectedClient.company_name,
                          )
                        }
                        className="bg-background dark:bg-zinc-900 p-4 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-2 group"
                      >
                        <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">
                          Feedback
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                          Solicitar Reseña en Google
                        </span>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 text-left">
                          Enviar mensaje predeterminado para incentivar una
                          reseña positiva.
                        </p>
                      </button>

                      <button className="bg-background dark:bg-zinc-900 p-4 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-2 group">
                        <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">
                          Mantenimiento
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                          Activar Seguimiento de Garantía
                        </span>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 text-left">
                          Programar recordatorio automático para limpieza o
                          revisión técnica.
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-card dark:bg-zinc-950 p-4 rounded-xl border border-zinc-800/30 text-center">
                      <p className="text-2xl font-black text-purple-600">A+</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">
                        Clasificación
                      </p>
                    </div>
                    <div className="bg-card dark:bg-zinc-950 p-4 rounded-xl border border-zinc-800/30 text-center">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {clientProformas.length}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">
                        Compras
                      </p>
                    </div>
                    <div className="bg-card dark:bg-zinc-950 p-4 rounded-xl border border-zinc-800/30 text-center">
                      <p className="text-2xl font-black text-green-600">Si</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">
                        Recomienda
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

        {viewingProforma && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:static print:bg-transparent print:backdrop-blur-none">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-zinc-800 print:shadow-none print:border-none print:my-0 print:rounded-none">
              
              {/* Barra de Acciones Superior (Oculta al imprimir) */}
              <div className="flex flex-wrap justify-between items-center p-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 print:hidden gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-100">Proforma N° {viewingProforma.proforma_number}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      let phone = (selectedClient?.phone || '').replace(/[^0-9]/g, '');
                      if (!phone) {
                        const inputPhone = prompt("Por favor ingresa el número de WhatsApp del cliente (ej: 88888888):");
                        if (!inputPhone) return;
                        phone = inputPhone.replace(/[^0-9]/g, '');
                      }
                      if (phone.length === 8) phone = '506' + phone;

                      const clientName = selectedClient?.company_name || selectedClient?.contact_name || 'Estimado(a) Cliente';
                      const itemsText = (viewingProforma.items || []).map((item: any, index: number) => 
                        `• *Ítem ${index + 1}:* ${item.quantity}x ${item.description || item.productName} (${item.width || 0}x${item.height || 0}cm) - ₡${Number(item.total || 0).toLocaleString('es-CR')}`
                      ).join('\n');

                      const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://crm-plus-2-1.vercel.app';
                      const pdfLink = `${appOrigin}/proformas?view=${viewingProforma.proforma_number || viewingProforma.id}`;

                      const message = `¡Hola *${clientName}*! 👋\n\nLe compartimos el detalle de su cotización formal de *Alfombras Personalizadas CR*:\n\n📋 *Proforma Nº:* ${viewingProforma.proforma_number}\n📅 *Fecha:* ${viewingProforma.date || new Date().toLocaleDateString('es-CR')}\n⏳ *Tiempo de entrega:* ${viewingProforma.delivery_time_days || 12} días hábiles\n\n📦 *Detalle de Productos:*\n${itemsText || '• Confección de alfombra personalizada con logo'}\n\n💰 *Subtotal:* ₡${Number(viewingProforma.subtotal || 0).toLocaleString('es-CR')}\n📊 *IVA (13%):* ₡${Number(viewingProforma.iva || 0).toLocaleString('es-CR')}\n💵 *TOTAL:* ₡${Number(viewingProforma.total || 0).toLocaleString('es-CR')}\n\n✨ *Condiciones de Venta:*\n${viewingProforma.comments || '✓ 50% de adelanto para confección y 50% contra entrega.\n✓ Garantía de 2 años contra defectos de fábrica.\n✓ Entrega gratuita en GAM, Guanacaste y Limón.'}\n\n📄 *Ver y Descargar Documento Oficial (PDF):*\n${pdfLink}\n\n📱 *Seguimiento de Producción:* Puede consultar el avance de su pedido en tiempo real desde nuestra app móvil o portal web con su cuenta.\n\n¿Gusta que procedamos con la confección y diseño preliminar? Quedamos a sus órdenes. 🤝`;
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105"
                    title="Enviar proforma al WhatsApp del cliente"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar WhatsApp
                  </button>

                  <button 
                    type="button"
                    onClick={() => router.push(`/cotizador?edit=${viewingProforma.id}`)}
                    className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105"
                    title="Editar proforma en el cotizador dinámico"
                  >
                    <Settings className="w-4 h-4" />
                    Editar
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setReceiptData({
                        amount: viewingProforma.total,
                        description: `Pago por Proforma Nº ${viewingProforma.proforma_number}`,
                        payment_method: "Transferencia",
                        date: new Date().toISOString().split('T')[0]
                      });
                      setIsCreatingReceipt(viewingProforma);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Calculator className="w-4 h-4" />
                    Hacer Recibo
                  </button>

                  <button 
                    type="button" 
                    onClick={() => {
                      const oldTitle = document.title;
                      document.title = `Proforma_N_${viewingProforma.proforma_number}`;
                      const restoreTitle = () => {
                        document.title = oldTitle;
                        window.removeEventListener('afterprint', restoreTitle);
                      };
                      window.addEventListener('afterprint', restoreTitle);
                      setTimeout(() => window.print(), 100);
                    }}  
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Printer className="w-4 h-4" /> Imprimir Proforma
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingProforma(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg"
                    title="Cerrar vista"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* CONTENIDO IMPRIMIBLE DE LA HOJA A4 OFICIAL */}
              <div className="p-8 md:p-12 print:p-0 bg-slate-50 dark:bg-zinc-950 flex justify-center print:bg-white">
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
                        <p><span className="font-bold">Proforma Nº:</span> <span className="ml-2 font-mono font-bold text-amber-600">{viewingProforma.proforma_number}</span></p>
                        <p className="mt-1"><span className="font-bold">Fecha:</span> <span className="ml-2">{viewingProforma.date}</span></p>
                        <p className="mt-1"><span className="font-bold">Tiempo de Entrega:</span> <span className="ml-2">{viewingProforma.delivery_time_days || 12} días naturales</span></p>
                      </div>
                      <div className="text-right">
                        <p><span className="font-bold">Estado:</span> <span className="ml-2 font-bold uppercase">{viewingProforma.status || 'COTIZACIÓN'}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="mb-8 pb-4 border-b border-slate-100">
                    <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                      <span className="font-bold uppercase text-slate-400 text-[9px]">Cliente</span>
                      <span className="font-black text-sm uppercase">{selectedClient?.company_name || selectedClient?.contact_name || 'Cliente sin Nombre'}</span>
                      <span className="font-bold uppercase text-slate-400 text-[9px]">Cédula</span>
                      <span>{selectedClient?.cedula || '-'}</span>
                      <span className="font-bold uppercase text-slate-400 text-[9px]">Teléfono</span>
                      <span>{selectedClient?.phone || '-'}</span>
                      <span className="font-bold uppercase text-slate-400 text-[9px]">Dirección</span>
                      <span>{[selectedClient?.province, selectedClient?.canton, selectedClient?.district, selectedClient?.neighborhood].filter(Boolean).join(', ') || '-'}</span>
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
                      {viewingProforma.items?.map((item: any, idx: number) => (
                        <tr key={item.id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}>
                          <td className="py-3 px-3 align-top font-bold">
                            {item.productCode}{item.width && item.height ? `-${item.width}X${item.height}` : ''}
                          </td>
                          <td className="py-3 px-3 text-center align-top">{item.quantity}</td>
                          <td className="py-3 px-3 text-right align-top">{fmt(item.unitPrice || 0)}</td>
                          <td className="py-3 px-3 uppercase align-top leading-relaxed text-[9px]">
                            <span className="font-black text-slate-900 block">{item.productName || item.description}</span>
                            {item.description && item.description !== item.productName && (
                              <span className="text-slate-600 block mt-0.5">{item.description}</span>
                            )}
                            {item.width && item.height && (
                              <span className="text-slate-400 text-[8px] block font-mono mt-0.5">Medida exacta: {item.width}cm x {item.height}cm</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right align-top font-bold">{fmt(item.total || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Resumen Totales */}
                  <div className="flex justify-between items-start gap-8 mb-8 pb-8 border-b border-slate-100">
                    <div className="w-1/2 space-y-3">
                      <div className="bg-slate-50 p-3 rounded border border-slate-200">
                        <p className="font-mono text-[9px] font-bold tracking-tight text-slate-700">
                          {numeroALetras(viewingProforma.total || 0)}
                        </p>
                      </div>

                      {/* Observaciones */}
                      <div>
                        <span className="font-bold uppercase text-slate-400 text-[8px] tracking-wider block mb-1">Observaciones / Términos:</span>
                        <p className="whitespace-pre-line text-slate-600 text-[9px] font-mono leading-relaxed bg-slate-50/50 p-2 rounded border border-dashed border-slate-200">
                          {viewingProforma.comments || '✓ GARANTIA 2 AÑOS CONTRA DEFECTOS DE FÁBRICA\n✓ FORMA DE PAGO 50% ADELANTO Y 50% CONTRA ENTREGA'}
                        </p>
                      </div>
                    </div>

                    <div className="w-1/2 flex justify-end">
                      <div className="w-64 space-y-1.5 text-right text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Subtotal:</span>
                          <span className="font-mono font-bold">{fmt(viewingProforma.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">IVA (13%):</span>
                          <span className="font-mono font-bold">{fmt(viewingProforma.iva || 0)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-black border-t-2 border-slate-900 pt-2 text-slate-900">
                          <span>TOTAL NETA:</span>
                          <span className="font-mono text-sm text-amber-600">{fmt(viewingProforma.total || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cuentas Bancarias */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-[9px] grid grid-cols-2 gap-4 mb-8">
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

                  {/* Footer Agradecimiento */}
                  <footer className="text-center text-[9px] text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
                    Alfombras Personalizadas de Costa Rica • Calidad y Garantía Garantizada
                  </footer>

                </div>
              </div>

              {/* Bitácora de Modificaciones y Auditoría de Cotización */}
              {Array.isArray(viewingProforma.production_history) && viewingProforma.production_history.filter((h: any) => h.type === 'AUDIT_LOG').length > 0 && (
                <div className="p-6 bg-amber-50/60 dark:bg-amber-950/20 border-t border-amber-200/70 dark:border-amber-900/40 print:hidden">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Bitácora de Modificaciones ({viewingProforma.production_history.filter((h: any) => h.type === 'AUDIT_LOG').length})
                  </h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {viewingProforma.production_history.filter((h: any) => h.type === 'AUDIT_LOG').map((log: any, idx: number) => (
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
        {isCreatingReceipt && (
          <ReceiptModal 
            proforma={isCreatingReceipt}
            client={selectedClient}
            receiptData={receiptData}
            setReceiptData={setReceiptData}
            isSaving={isSavingReceipt}
            generatedReceipt={generatedReceipt}
            onClose={() => {
              setIsCreatingReceipt(null);
              setGeneratedReceipt(null);
            }}
            onSave={async () => {
              setIsSavingReceipt(true);
              try {
                // Generar número consecutivo global real
                const { data: allRecs } = await supabase.from('receipts').select('receipt_number');
                let maxRecNum = 0;
                (allRecs || []).forEach((r: any) => {
                  if (r.receipt_number) {
                    const match = String(r.receipt_number).match(/\d+/);
                    if (match) {
                      const n = parseInt(match[0], 10);
                      if (n > maxRecNum) maxRecNum = n;
                    }
                  }
                });
                const nextNum = maxRecNum + 1;
                const receiptNum = `REC-${String(nextNum).padStart(4, '0')}`;
                const approvedTime = new Date().toISOString();
                
                const newReceipt = {
                  id: crypto.randomUUID(),
                  receipt_number: receiptNum,
                  proforma_id: isCreatingReceipt.id,
                  client_id: (selectedClient as any)?.id || null,
                  client_name: (selectedClient as any)?.contact_name || (selectedClient as any)?.company_name || "Cliente",
                  amount: Number(receiptData.amount || 0),
                  date: receiptData.date || approvedTime.split('T')[0],
                  payment_method: receiptData.payment_method || 'SINPE Móvil',
                  description: receiptData.description || 'Abono 50% de pedido',
                  created_at: approvedTime,
                  agent: loggedInAgent
                };
                
                // 1. AUTOMATIZACIÓN INMEDIATA Y GARANTIZADA: Actualizar la Proforma en Supabase a APROBADA y ABONO_50
                if (isCreatingReceipt && isCreatingReceipt.id) {
                  const currentHistory = isCreatingReceipt.production_history || [];
                  const updatedHistory = [
                    ...currentHistory,
                    {
                      type: 'RECEIPT',
                      status: 'ABONO_50',
                      receipt_number: receiptNum,
                      amount: Number(receiptData.amount || 0),
                      date: receiptData.date,
                      payment_method: receiptData.payment_method,
                      completed_at: approvedTime
                    }
                  ];

                  const { error: profError } = await supabase
                    .from('proformas')
                    .update({
                      status: 'APROBADA',
                      approved_at: isCreatingReceipt.approved_at || approvedTime,
                      production_status: 'ABONO_50',
                      production_history: updatedHistory,
                      updated_at: approvedTime
                    })
                    .eq('id', isCreatingReceipt.id);

                  if (profError) {
                    console.error("Error al actualizar estado en proforma:", profError);
                  }

                  // Actualizar proformas en memoria del cliente
                  setClientProformas(prev => prev.map(p => 
                    p.id === isCreatingReceipt.id 
                      ? { 
                          ...p, 
                          status: 'APROBADA', 
                          approved_at: p.approved_at || approvedTime, 
                          production_status: 'ABONO_50',
                          production_history: updatedHistory
                        } 
                      : p
                  ));

                  // Actualizar también la proforma abierta en visor
                  setViewingProforma((prev: any) => prev ? {
                    ...prev,
                    status: 'APROBADA',
                    approved_at: prev.approved_at || approvedTime,
                    production_status: 'ABONO_50',
                    production_history: updatedHistory
                  } : prev);

                  // Etiquetar automáticamente al cliente como 'venta_cerrada'
                  if (selectedClient && selectedClient.id) {
                    const clientTags = (selectedClient as any).tags || [];
                    if (!clientTags.includes('venta_cerrada')) {
                      const updatedTags = [...clientTags, 'venta_cerrada'];
                      await supabase
                        .from('crm_users')
                        .update({ tags: updatedTags })
                        .eq('id', (selectedClient as any).id);
                      
                      setSelectedClient((prev: any) => prev ? { ...prev, tags: updatedTags } : prev);
                      setClients(prev => prev.map(c => c.id === (selectedClient as any).id ? { ...c, tags: updatedTags } : c));
                    }
                  }
                }
                
                // 2. Intentar guardar en tabla receipts si está disponible
                try {
                  await supabase.from('receipts').insert([newReceipt]);
                } catch (e) {
                  console.log("Tabla receipts externa no requerida (guardado en historial de proforma).");
                }
                
                // 3. Actualizar la lista de recibos al instante en UI
                setClientReceipts(prev => [newReceipt, ...prev]);

                // 4. Generar objeto de recibo para vista previa/impresión
                setGeneratedReceipt(newReceipt);
              } catch (err) {
                console.error(err);
                alert("Error técnico al generar recibo");
              } finally {
                setIsSavingReceipt(false);
              }
            }}
          />
        )}
        
        {editingReceipt && (
          <ReceiptModal 
            proforma={{ proforma_number: "Edición de Sistema" }}
            client={selectedClient}
            receiptData={receiptData}
            setReceiptData={setReceiptData}
            isSaving={isSavingReceipt}
            generatedReceipt={null}
            isEditMode={true}
            onClose={() => setEditingReceipt(null)}
            onSave={async () => {
              setIsSavingReceipt(true);
              try {
                const auditEntry = {
                   agent: loggedInAgent || 'Administrador',
                   date: new Date().toISOString(),
                   previous_total: editingReceipt.amount,
                   new_total: Number(receiptData.amount),
                   previous_date: editingReceipt.date,
                   new_date: receiptData.date,
                   previous_method: editingReceipt.payment_method,
                   new_method: receiptData.payment_method,
                   previous_description: editingReceipt.description,
                   new_description: receiptData.description,
                   message: `Modificado por ${loggedInAgent || 'Administrador'} el ${new Date().toLocaleString('es-CR')}`
                };
                
                const updatedAuditLog = [...(editingReceipt.audit_log || []), auditEntry];
                
                const updatedReceiptData = {
                  ...editingReceipt,
                  amount: Number(receiptData.amount),
                  date: receiptData.date,
                  payment_method: receiptData.payment_method,
                  description: receiptData.description,
                  audit_log: updatedAuditLog,
                  updated_at: new Date().toISOString()
                };

                // 1. Actualizar en el historial de la proforma
                if (editingReceipt.proforma_id) {
                  const { data: pData } = await supabase.from('proformas').select('*').eq('id', editingReceipt.proforma_id).single();
                  if (pData && Array.isArray(pData.production_history)) {
                    const updatedHistory = pData.production_history.map((h: any) => {
                      if (h.receipt_number === editingReceipt.receipt_number || h.id === editingReceipt.id || h.type === 'RECEIPT') {
                        return {
                          ...h,
                          amount: Number(receiptData.amount),
                          date: receiptData.date,
                          payment_method: receiptData.payment_method,
                          description: receiptData.description,
                          audit_log: updatedAuditLog,
                          modified_at: new Date().toISOString(),
                          modified_by: loggedInAgent || 'Administrador'
                        };
                      }
                      return h;
                    });

                    await supabase.from('proformas').update({
                      production_history: updatedHistory,
                      updated_at: new Date().toISOString()
                    }).eq('id', editingReceipt.proforma_id);
                  }
                }

                // 2. Intentar actualizar tabla receipts si existe
                try {
                  await supabase
                    .from('receipts')
                    .update({
                      amount: Number(receiptData.amount),
                      date: receiptData.date,
                      payment_method: receiptData.payment_method,
                      description: receiptData.description,
                      audit_log: updatedAuditLog
                    })
                    .eq('id', editingReceipt.id);
                } catch (err) {}
                
                setClientReceipts(prev => prev.map(rec => (rec.id === editingReceipt.id || rec.receipt_number === editingReceipt.receipt_number) ? updatedReceiptData : rec));
                setEditingReceipt(null);
                alert(`Recibo ${editingReceipt.receipt_number} actualizado con registro de auditoría.`);
              } catch (err) {
                console.error(err);
                alert("Error técnico al actualizar recibo");
              } finally {
                setIsSavingReceipt(false);
              }
            }}
          />
        )}
                      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout title="Cuentas de Cliente" badge="LIVE">
        {/* Header Container */}
        <div className="bg-background dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-800/40 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/10 rounded-2xl">
              <Users className="w-10 h-10 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Cuentas de Cliente
              </h1>

              {loggedInAgent !== 'Freelance' && (
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">
                    Capacidad Operativa:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 md:w-48 h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-800/40">
                      <div
                        className={cn(
                          "h-full transition-all duration-1000 ease-out",
                          clients.length / MAX_CAPACITY > 0.9
                            ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            : clients.length / MAX_CAPACITY > 0.7
                              ? "bg-amber-500"
                              : "bg-green-500",
                        )}
                        style={{
                          width: `${Math.min((clients.length / MAX_CAPACITY) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-black tracking-tighter uppercase",
                        clients.length / MAX_CAPACITY > 0.9
                          ? "text-red-500 animate-pulse"
                          : "text-slate-500",
                      )}
                    >
                      {clients.length} / {MAX_CAPACITY}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Theme toggle removed */}
            {loggedInAgent !== 'Freelance' && (
              <>
                <button
                  onClick={generateVoiceSummary}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
                  title="Escuchar resumen de los clientes filtrados"
                >
                  <Volume2 className="w-4 h-4" /> Resumen
                </button>
                <button
                  onClick={downloadBackup}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-105"
                  title="Descargar un respaldo completo de la base de datos (JSON)"
                >
                  <Database className="w-4 h-4" /> Respaldo
                </button>
                <button
                  onClick={() => {
                    setShowWhatsAppModal(true);
                    loadWaStats();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 hover:scale-105"
                  title="Ver estadísticas de mensajes de WhatsApp enviados"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Stats
                </button>
              </>
            )}

            <Link
              href="/cotizador"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-purple-600/20 hover:scale-105"
              title="Ir al Generador de Proformas / Cotizaciones"
            >
              <Calculator className="w-4 h-4" /> Cotizador
            </Link>

            {loggedInAgent !== 'Freelance' && (
              <>
                <button
                  onClick={downloadTemplate}
                  className="px-4 py-2 bg-background dark:bg-zinc-800 border border-zinc-800/40 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-card dark:hover:bg-zinc-700 flex items-center gap-2 text-sm font-bold transition-all shadow-sm"
                >
                  <FileText className="w-4 h-4 text-amber-500" /> Plantilla
                </button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleImportExcel}
                    className="hidden"
                    id="excel-import"
                    disabled={importing}
                  />
                  <label
                    htmlFor="excel-import"
                    className={`px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 font-bold shadow-lg shadow-green-600/20 cursor-pointer transition-all ${importing ? "opacity-50 pointer-events-none" : "hover:scale-105"}`}
                  >
                    <Upload className="w-4 h-4" />{" "}
                    {importing ? "Importando..." : "Importar Excel"}
                  </label>
                </div>
              </>
            )}

            <div className="h-8 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>

            {loggedInAgent !== 'Freelance' && (
              <Link
                href="/"
                className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 flex items-center gap-2 text-sm font-bold transition-all border border-slate-700 shadow-lg shadow-slate-900/20 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Link>
            )}

            <button
              onClick={() => setShowNewClientModal(true)}
              className="px-5 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 flex items-center gap-2 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Cliente Nuevo
            </button>

            <button
              onClick={handleLogout}
              className="w-11 h-11 border border-red-200 dark:border-red-900/30 rounded-xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center transition-all text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 shadow-sm"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar - Big & Central Command Center */}
        <div className="bg-background dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800/40 p-6 mb-6 transition-all animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-amber-500 group-focus-within:scale-110 transition-transform" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, número de cuenta, empresa, contacto, teléfono, fecha o agente..."
              className="w-full pl-16 pr-14 py-6 bg-card dark:bg-zinc-950 text-2xl font-black border-2 border-zinc-800/30 text-slate-900 dark:text-white rounded-[2rem] outline-none focus:border-amber-500 focus:ring-[12px] focus:ring-amber-500/5 transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-700 placeholder:font-bold"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-slate-200 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded-full transition-all"
                title="Limpiar búsqueda"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="bg-background dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800/40 p-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
          <div className="flex flex-wrap items-center gap-3">
            {loggedInAgent !== 'Freelance' && (
              <button
                onClick={() => setShowCalendarModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg border border-indigo-700 hover:bg-indigo-700 transition-all shadow-md font-bold text-sm hover:scale-105 active:scale-95"
                title="Ver Calendario de Seguimiento"
              >
                <Calendar className="w-4 h-4" /> Calendario
              </button>
            )}
            
            <button
              onClick={() => setIsArchiveView(!isArchiveView)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all shadow-md font-bold text-sm hover:scale-105 active:scale-95",
                isArchiveView 
                  ? "bg-slate-800 text-white border-slate-900" 
                  : "bg-background dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-zinc-800/40"
              )}
              title={isArchiveView ? "Ver Bandeja de Entrada" : "Ver Archivados"}
            >
              {isArchiveView ? (
                <><Inbox className="w-4 h-4" /> Principal</>
              ) : (
                <><Archive className="w-4 h-4" /> Archivados</>
              )}
            </button>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-zinc-700">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <select
                value={pipelineFilter}
                onChange={(e) => setPipelineFilter(e.target.value)}
                className="text-sm outline-none font-bold bg-transparent text-slate-800 dark:text-zinc-200"
              >
                <option value="all" className="dark:bg-zinc-900">
                  Etapa: Todas
                </option>
                <option
                  value="leads"
                  className="dark:bg-zinc-900 text-blue-600"
                >
                  Leads (Prospectos)
                </option>
                <option
                  value="quoted"
                  className="dark:bg-zinc-900 text-orange-600"
                >
                  Cotizados (Pipeline)
                </option>
                <option
                  value="closed"
                  className="dark:bg-zinc-900 text-purple-600"
                >
                  Clientes (Venta)
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-card dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800/40">
              <Plus className="w-4 h-4 text-slate-400 dark:text-zinc-500 rotate-45" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm outline-none font-medium bg-transparent text-slate-600 dark:text-zinc-300"
              >
                <option value="all" className="dark:bg-zinc-900">
                  Filtro: Estado
                </option>
                <option value="active" className="dark:bg-zinc-900">
                  Activos
                </option>
                <option value="inactive" className="dark:bg-zinc-900">
                  Inactivos
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-card dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800/40">
              <Book className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="text-sm outline-none font-medium bg-transparent text-slate-600 dark:text-zinc-300"
              >
                <option value="all" className="dark:bg-zinc-900">
                  Filtro: Etiqueta
                </option>
                <option value="none" className="dark:bg-zinc-900">
                  Sin etiqueta
                </option>
                {AVAILABLE_TAGS.map((tag) => (
                  <option
                    key={tag.id}
                    value={tag.id}
                    className="dark:bg-zinc-900"
                  >
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-card dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800/40">
              <FileText className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <select
                value={quoteFilter}
                onChange={(e) => setQuoteFilter(e.target.value)}
                className="text-sm outline-none font-medium bg-transparent text-slate-600 dark:text-zinc-300"
              >
                <option value="all" className="dark:bg-zinc-900">
                  Filtro: Cotización
                </option>
                <option value="quoted" className="dark:bg-zinc-900">
                  Con Cotización
                </option>
                <option value="not_quoted" className="dark:bg-zinc-900">
                  Sin Cotización
                </option>
              </select>
            </div>

            <div className="relative">
              <div
                className="flex items-center gap-2 bg-card dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800/40 cursor-pointer"
                onClick={() => setShowActivityDropdown((v) => !v)}
              >
                <Building className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                <input
                  type="text"
                  value={activitySearch}
                  onChange={(e) => {
                    setActivitySearch(e.target.value);
                    setShowActivityDropdown(true);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActivityDropdown(true);
                  }}
                  placeholder={
                    industryFilter === "all"
                      ? "Filtro: Actividad"
                      : industryFilter.length > 18
                        ? industryFilter.slice(0, 18) + "…"
                        : industryFilter
                  }
                  className="text-sm outline-none font-medium bg-transparent text-slate-600 dark:text-zinc-300 w-[120px] placeholder:text-slate-500 dark:placeholder:text-zinc-400"
                  onBlur={() => setTimeout(() => setShowActivityDropdown(false), 150)}
                />
                {industryFilter !== "all" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndustryFilter("all");
                      setActivitySearch("");
                    }}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                    title="Quitar filtro"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              {showActivityDropdown && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-background dark:bg-zinc-900 border border-zinc-800/40 rounded-xl shadow-xl w-64 max-h-60 overflow-y-auto">
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-500 dark:text-zinc-400 hover:bg-card dark:hover:bg-zinc-800 font-medium italic border-b border-zinc-800/30"
                    onMouseDown={() => {
                      setIndustryFilter("all");
                      setActivitySearch("");
                      setShowActivityDropdown(false);
                    }}
                  >
                    Todas las actividades
                  </button>
                  {[
                    ...BUSINESS_TYPES,
                    "Otro / Personalizado...",
                  ]
                    .filter((bt) =>
                      bt.toLowerCase().includes(activitySearch.toLowerCase()),
                    )
                    .map((bt) => (
                      <button
                        key={bt}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors",
                          industryFilter === bt
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold"
                            : "text-slate-700 dark:text-zinc-200",
                        )}
                        onMouseDown={() => {
                          setIndustryFilter(bt);
                          setActivitySearch("");
                          setShowActivityDropdown(false);
                        }}
                      >
                        {bt}
                      </button>
                    ))}
                  {[
                    ...BUSINESS_TYPES,
                    "Otro / Personalizado...",
                  ].filter((bt) =>
                    bt.toLowerCase().includes(activitySearch.toLowerCase()),
                  ).length === 0 && activitySearch.trim() && (
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-bold flex items-center gap-2 transition-colors border-t border-zinc-800/30"
                      onMouseDown={() => {
                        const newType = activitySearch.trim();
                        if (newType && !BUSINESS_TYPES.includes(newType)) {
                          const updated = [...BUSINESS_TYPES, newType];
                          setBUSINESS_TYPES(updated);
                          // Persist custom types
                          const custom = updated.filter(t => !DEFAULT_BUSINESS_TYPES.includes(t));
                          localStorage.setItem("crm_custom_activities", JSON.stringify(custom));
                        }
                        setIndustryFilter(activitySearch.trim());
                        setActivitySearch("");
                        setShowActivityDropdown(false);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Agregar &quot;{activitySearch}&quot; a la lista
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-700 mx-1 hidden md:block"></div>

            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-800/40">
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "table"
                    ? "bg-background dark:bg-zinc-700 text-amber-500 shadow-sm"
                    : "text-slate-400 hover:text-slate-600",
                )}
                title="Vista de Tabla"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "cards"
                    ? "bg-background dark:bg-zinc-700 text-amber-500 shadow-sm"
                    : "text-slate-400 hover:text-slate-600",
                )}
                title="Vista de Tarjetas / Leads"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">
                {selectedIds.length} seleccionados
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) handleBulkAssignAgent(e.target.value);
                  e.target.value = "";
                }}
                className="px-3 py-2 border border-amber-300 rounded-lg text-sm bg-amber-50 text-amber-800 font-medium"
                defaultValue=""
              >
                <option value="" disabled>
                  Asignar a...
                </option>
                {AGENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
                <option value="">Quitar agente</option>
              </select>
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center gap-2 text-sm font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            </div>
          )}

          {clients.length > 0 &&
            selectedIds.length === 0 &&
            loggedInAgent === "Rolo" && (
              <button
                onClick={handleDeleteAll}
                disabled={isDeleting}
                className="px-4 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 text-xs font-medium transition-all"
              >
                <Trash2 className="w-3 h-3" /> Limpiar Base de Datos
              </button>
            )}
        </div>

        {/* Clients Display */}
        {viewMode === "table" ? (
          <div className="bg-background dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800/40 overflow-x-auto transition-colors w-full">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead className="bg-card dark:bg-zinc-800/50 border-b dark:border-zinc-800 select-none">
                <tr>
                  <th className="w-10 px-3 py-3.5 text-center">
                    <button
                      onClick={toggleSelectAll}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded transition-colors"
                    >
                      {selectedIds.length > 0 &&
                      selectedIds.length === filteredClients.length ? (
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="min-w-[180px] px-3.5 py-3.5 text-left text-xs font-black text-slate-500 dark:text-zinc-200 uppercase tracking-wider">
                    Empresa / Cuenta
                  </th>
                  <th className="w-36 px-2.5 py-3.5 text-left text-xs font-black text-slate-500 dark:text-zinc-200 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="min-w-[150px] px-3 py-3.5 text-left text-xs font-black text-slate-500 dark:text-zinc-200 uppercase tracking-wider">
                    Contacto / Info
                  </th>
                  <th className="w-28 px-2.5 py-3.5 text-center text-xs font-black text-slate-500 dark:text-zinc-200 uppercase tracking-wider">
                    Fecha Ingreso
                  </th>
                  <th className="w-24 px-2 py-3.5 text-center text-xs font-black text-slate-500 dark:text-zinc-200 uppercase tracking-wider">
                    Interés
                  </th>
                  <th className="w-28 px-2 py-3.5 text-center text-xs font-black text-slate-500 dark:text-zinc-200 uppercase tracking-wider">
                    Agente
                  </th>
                  <th className="min-w-[140px] px-2.5 py-3.5 text-center text-xs font-black text-slate-500 dark:text-zinc-200 uppercase tracking-wider">
                    Etiquetas
                  </th>
                  <th className="w-32 px-3 py-3.5 text-center text-xs font-black text-slate-500 dark:text-zinc-200 uppercase tracking-wider sticky right-0 bg-card dark:bg-zinc-800/90 border-l border-slate-200 dark:border-zinc-800/80 shadow-[-4px_0_8px_rgba(0,0,0,0.03)] z-10">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-slate-500 font-bold"
                    >
                      Cargando datos desde Supabase...
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-slate-500 font-bold"
                    >
                      {searchTerm
                        ? "No se encontraron clientes que coincidan con la búsqueda"
                        : "No hay clientes registrados en la base de datos."}
                    </td>
                  </tr>
                ) : (
                  displayedClients.map((client) => (
                    <tr
                      key={client.id}
                      className={cn(
                        "hover:bg-slate-50/80 dark:hover:bg-zinc-800/30 transition-colors group/row",
                        selectedIds.includes(client.id) &&
                          "bg-amber-50/50 dark:bg-amber-900/10",
                      )}
                    >
                      <td className="w-10 px-3 py-3 text-center">
                        <button
                          onClick={() => toggleSelect(client.id)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded transition-colors"
                        >
                          {selectedIds.includes(client.id) ? (
                            <CheckSquare className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td 
                        className="min-w-[180px] px-3.5 py-3 cursor-pointer group"
                        onClick={() => setSelectedClient(client)}
                        title="Clic para abrir el expediente / cuenta de este cliente"
                      >
                        <div className="flex flex-col">
                          <div className="text-sm font-black text-slate-900 dark:text-white leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:underline transition-colors flex items-center gap-1.5">
                            <span>{client.company_name || "Sin nombre"}</span>
                            <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 flex-shrink-0" />
                          </div>
                          <div className="text-[10px] font-black text-slate-400 dark:text-zinc-400 mt-0.5 uppercase tracking-tighter">
                            Nº {client.account_number}
                          </div>
                        </div>
                      </td>
                      <td className="w-36 px-2.5 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={client.activity_code || ""}
                          onChange={(e) => handleUpdateClientField(client.id, "activity_code", e.target.value)}
                          className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-all w-full max-w-[130px]",
                            client.activity_code 
                              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                              : "bg-card dark:bg-zinc-800 text-slate-400 dark:text-zinc-400 border-zinc-800/40"
                          )}
                        >
                          <option value="">Asignar...</option>
                          {BUSINESS_TYPES.map((bt) => (
                            <option key={bt} value={bt}>
                              {bt}
                            </option>
                          ))}
                          <option value="Otro">Otro / Personalizado...</option>
                        </select>
                      </td>
                      <td 
                        className="min-w-[150px] px-3 py-3 cursor-pointer group"
                        onClick={() => setSelectedClient(client)}
                        title="Clic para abrir el expediente / cuenta de este cliente"
                      >
                        <div className="text-xs text-slate-700 dark:text-zinc-200 font-bold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {client.contact_name || "-"}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-zinc-400 font-medium">
                          {client.phone || "-"}
                        </div>
                      </td>
                      <td className="w-28 px-2.5 py-3 text-center">
                        <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                          {client.created_at
                            ? new Date(client.created_at).toLocaleDateString(
                                "es-CR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </div>
                        <div className="text-[9px] text-slate-400 font-medium">
                          {client.created_at
                            ? new Date(client.created_at).toLocaleTimeString(
                                "es-CR",
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : ""}
                        </div>
                      </td>
                      <td className="w-24 px-2 py-3 text-center">
                        <div className="flex justify-center gap-0.5 max-w-[80px] mx-auto">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() =>
                                handleUpdateClientField(
                                  client.id,
                                  "interest_level",
                                  lvl,
                                )
                              }
                              className={cn(
                                "h-4 w-1.5 rounded-full transition-all hover:scale-125",
                                client.tags?.includes("venta_cerrada")
                                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/20"
                                  : client.interest_level >= lvl
                                    ? INTEREST_LEVELS[lvl - 1].color
                                    : "bg-slate-100 dark:bg-zinc-800",
                              )}
                              title={INTEREST_LEVELS[lvl - 1].label}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="w-28 px-2 py-3 text-center">
                        <select
                          value={client.assigned_to || ""}
                          onChange={(e) =>
                            handleAssignAgent(client.id, e.target.value)
                          }
                          className={cn(
                            "px-2 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-all",
                            client.assigned_to === "Rolo" &&
                              "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
                            client.assigned_to === "Freelance" &&
                              "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
                            !client.assigned_to &&
                              "bg-card dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 border-zinc-800/40",
                          )}
                        >
                          <option value="">—</option>
                          {AGENTS.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="min-w-[140px] px-2.5 py-3">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex flex-wrap justify-center gap-1 max-w-[150px]">
                            {(client.tags || []).map((tagId: string) => {
                              const tag = AVAILABLE_TAGS.find((t) => t.id === tagId);
                              const label = tag ? tag.label : tagId;
                              const colorClass = tag ? tag.color : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300';
                              return (
                                <span
                                  key={tagId}
                                  className={cn(
                                    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border shadow-2xs group transition-all",
                                    colorClass,
                                  )}
                                >
                                  <span>{label}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeTag(client.id, tagId);
                                    }}
                                    className="w-3 h-3 rounded-full hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Quitar etiqueta"
                                  >
                                    <X className="w-2 h-2" />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addTag(client.id, e.target.value);
                                e.target.value = "";
                              }
                            }}
                            className="text-[9px] font-black bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700 outline-none text-slate-600 dark:text-zinc-300 hover:text-amber-500 cursor-pointer transition-colors max-w-[95px]"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              + ETIQUETA
                            </option>
                            {AVAILABLE_TAGS.filter(
                              (t) => !(client.tags || []).includes(t.id),
                            ).map((tag) => (
                              <option
                                key={tag.id}
                                value={tag.id}
                                className="dark:bg-zinc-900"
                              >
                                {tag.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="w-32 px-3 py-3 text-center sticky right-0 bg-background dark:bg-zinc-900 group-hover/row:bg-slate-50 dark:group-hover/row:bg-zinc-800/70 border-l border-slate-200 dark:border-zinc-800/80 shadow-[-4px_0_8px_rgba(0,0,0,0.03)] z-10 transition-colors">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => viewClientDetails(client)}
                            className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-500 hover:text-black transition-all shadow-xs"
                            title="Ver Expediente, Notas y Cotizaciones"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              openWhatsApp(
                                client.phone,
                                client.contact_name || client.company_name,
                              )
                            }
                            className="p-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-xs"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClient(
                                client.id,
                                client.company_name || client.contact_name,
                              )
                            }
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shadow-xs"
                            title="Eliminar cliente"
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

            {/* Barra de Carga Progresiva y Paginación Ultrarrápida */}
            {filteredClients.length > displayedClients.length && (
              <div className="p-4 bg-card/60 dark:bg-zinc-800/40 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 dark:text-zinc-400 font-medium">
                  Mostrando <strong className="text-amber-500 font-bold">{displayedClients.length}</strong> de <strong className="text-slate-700 dark:text-zinc-200 font-bold">{filteredClients.length}</strong> clientes
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 60)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    + Cargar 60 más
                  </button>
                  <button
                    onClick={() => setVisibleCount(filteredClients.length)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Mostrar todos ({filteredClients.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : pipelineFilter === "leads" ? (
          <DndContext 
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd} 
            collisionDetection={closestCorners}
          >
            <div className="flex gap-6 overflow-x-auto pb-10 min-h-[600px] scrollbar-thin scrollbar-thumb-amber-500/20 animate-in fade-in duration-700">
              {[
                {
                  title: "Sin Etiqueta",
                  id: "none",
                  color: "bg-card/50 dark:bg-zinc-900/30",
                  border: "border-zinc-800/40",
                  icon: "⚪",
                  filter: (c: CRMUser) => !c.tags || c.tags.length === 0,
                },
                {
                  title: "Urgente",
                  id: "urgente",
                  color: "bg-red-50/50 dark:bg-red-950/10",
                  border: "border-red-100 dark:border-red-900/20",
                  icon: "🚨",
                  filter: (c: CRMUser) => (c.tags || []).includes("urgente"),
                },
                {
                  title: "Cotización",
                  id: "cotizado",
                  color: "bg-orange-50/50 dark:bg-orange-950/10",
                  border: "border-orange-100 dark:border-orange-900/20",
                  icon: "📄",
                  filter: (c: CRMUser) => (c.tags || []).includes("cotizado"),
                },
                {
                  title: "Venta Cerrada",
                  id: "venta_cerrada",
                  color: "bg-purple-50/50 dark:bg-purple-950/10",
                  border: "border-purple-100 dark:border-purple-900/20",
                  icon: "💰",
                  filter: (c: CRMUser) => (c.tags || []).includes("venta_cerrada"),
                },
                {
                  title: "Entregado",
                  id: "entregado",
                  color: "bg-green-50/50 dark:bg-green-950/10",
                  border: "border-green-100 dark:border-green-900/20",
                  icon: "🚚",
                  filter: (c: CRMUser) =>
                    (c.tags || []).some((t) =>
                      ["entregado_am", "entregado_ss"].includes(t),
                    ),
                },
              ].map((col) => {
                const colClients = filteredClients.filter(col.filter);
                return (
                  <DroppableColumn key={col.id} col={col}>
                    {colClients.length === 0 ? (
                      <div className="py-10 text-center border border-dashed border-zinc-800/40 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Vacío
                      </div>
                    ) : (
                      colClients.map((client) => (
                        <DraggableCard key={client.id} client={client} />
                      ))
                    )}
                  </DroppableColumn>
                );
              })}
            </div>

            <DragOverlay>
              {activeId ? (
                <DraggableCard 
                  client={clients.find(c => c.id === activeId)!} 
                  isOverlay 
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="col-span-full py-20 text-center text-slate-500">
                Cargando prospectos...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500 bg-background dark:bg-zinc-900 rounded-xl border border-dashed border-slate-300 dark:border-zinc-800">
                No hay prospectos que coincidan con los filtros.
              </div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => viewClientDetails(client)}
                  className="group relative bg-background dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-800/40 shadow-sm hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-900/50 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex justify-between items-start mb-4">
                    <div className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded text-[10px] font-black text-slate-500 dark:text-zinc-400 tracking-tighter uppercase">
                      #{client.account_number}
                    </div>
                    <div className="flex gap-1">
                      {client.interest_level >= 4 && (
                        <span
                          className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                          title="Interés Alto"
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(client.id);
                        }}
                        className={cn(
                          "p-1 rounded transition-colors",
                          selectedIds.includes(client.id)
                            ? "text-amber-500"
                            : "text-slate-300 hover:text-slate-400",
                        )}
                      >
                        {selectedIds.includes(client.id) ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100 leading-tight mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    {client.company_name || "Sin Empresa"}
                  </h3>
                  <p className="text-sm font-bold text-slate-600 dark:text-zinc-400">
                    {client.contact_name || "Sin Contacto"}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-800/30 pt-4">
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
                      {client.phone || "Sin Teléfono"}
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            client.interest_level >= lvl
                              ? INTEREST_LEVELS[lvl - 1].color
                              : "bg-slate-100 dark:bg-zinc-800",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* New Client Modal */}
        {showNewClientModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-zinc-800">
              <div className="p-6 border-b border-zinc-800/30 flex justify-between items-center bg-card dark:bg-zinc-800/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Agregar Nuevo Cliente
                </h3>
                <button
                  onClick={() => setShowNewClientModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <form onSubmit={handleAddClient} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">
                      Nombre de Empresa
                    </label>
                    <input
                      type="text"
                      required
                      value={newClientForm.company_name}
                      onChange={(e) =>
                        setNewClientForm({
                          ...newClientForm,
                          company_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-800/40 bg-background dark:bg-zinc-950 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all"
                      placeholder="Ej: Multinacionales S.A."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">
                      Persona de Contacto
                    </label>
                    <input
                      type="text"
                      value={newClientForm.contact_name}
                      onChange={(e) =>
                        setNewClientForm({
                          ...newClientForm,
                          contact_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-800/40 bg-background dark:bg-zinc-950 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={newClientForm.phone}
                      onChange={(e) =>
                        setNewClientForm({
                          ...newClientForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-800/40 bg-background dark:bg-zinc-950 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all"
                      placeholder="Ej: 8888-8888"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newClientForm.email}
                      onChange={(e) =>
                        setNewClientForm({
                          ...newClientForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-800/40 bg-background dark:bg-zinc-950 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-all"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">
                      Cédula / ID
                    </label>
                    <input
                      type="text"
                      value={newClientForm.cedula}
                      onChange={(e) =>
                        setNewClientForm({
                          ...newClientForm,
                          cedula: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-800/40 dark:bg-zinc-950 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Cédula jurídica o física"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">
                      Actividad / Negocio
                    </label>
                    <select
                      value={
                        BUSINESS_TYPES.includes(newClientForm.activity_code)
                          ? newClientForm.activity_code
                          : newClientForm.activity_code
                            ? "Otro"
                            : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewClientForm({
                          ...newClientForm,
                          activity_code: val === "Otro" ? "Personalizado" : val,
                        });
                      }}
                      className="w-full px-4 py-2 border border-zinc-800/40 dark:bg-zinc-950 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500 mb-2 text-sm"
                    >
                      <option value="">Seleccione una opción...</option>
                      {BUSINESS_TYPES.map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                      <option value="Otro">Otro / Personalizado...</option>
                    </select>
                    {!BUSINESS_TYPES.includes(newClientForm.activity_code) &&
                      newClientForm.activity_code !== "" && (
                        <input
                          type="text"
                          value={
                            newClientForm.activity_code === "Personalizado"
                              ? ""
                              : newClientForm.activity_code
                          }
                          onChange={(e) =>
                            setNewClientForm({
                              ...newClientForm,
                              activity_code: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-zinc-800/40 dark:bg-zinc-950 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-amber-300 text-sm"
                          placeholder="Escriba el tipo de negocio..."
                          autoFocus
                        />
                      )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">
                      Asignar Agente
                    </label>
                    <select
                      value={newClientForm.assigned_to}
                      onChange={(e) =>
                        setNewClientForm({
                          ...newClientForm,
                          assigned_to: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-800/40 dark:bg-zinc-950 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Sin asignar</option>
                      {AGENTS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800/30">
                  <button
                    type="button"
                    onClick={() => setShowNewClientModal(false)}
                    className="px-6 py-2 border border-zinc-800/30 rounded-lg text-slate-600 dark:text-zinc-400 font-bold hover:bg-card dark:hover:bg-zinc-800 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 shadow-lg shadow-amber-200 dark:shadow-none disabled:opacity-50 transition-all"
                  >
                    {loading ? "Guardando..." : "Crear Cliente"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* WhatsApp Statistics Modal */}
        {showWhatsAppModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-background dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-zinc-800/30 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-zinc-800/30 flex justify-between items-center bg-card/50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                    Estadísticas WhatsApp
                  </h3>
                </div>
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                </button>
              </div>

              <div className="p-8">
                {waStatsLoading ? (
                  <div className="py-12 text-center text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">
                    Calculando métricas...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-800/30 text-center">
                        <p className="text-4xl font-black text-slate-900 dark:text-white">{waStats.total}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Total Mensajes</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-3xl border border-green-100 dark:border-green-900/20 text-center">
                        <p className="text-4xl font-black text-green-600 dark:text-green-400">{waStats.today}</p>
                        <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mt-1">Enviados Hoy</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-800/30">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-blue-500"></div> Plantilla Bienvenida
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">{waStats.welcome}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-amber-500"></div> Seguimiento
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">{waStats.followup}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-purple-500"></div> Renovación
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">{waStats.renewal}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600 dark:text-zinc-400 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-slate-400"></div> Personalizados
                        </span>
                        <span className="font-black text-slate-900 dark:text-white">{waStats.custom}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowWhatsAppModal(false)}
                      className="w-full mt-6 py-4 bg-slate-900 dark:bg-background text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all active:scale-95"
                    >
                      Cerrar Reporte
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Modal */}
        {showCalendarModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 text-slate-900 dark:text-zinc-100">
            <div className="bg-background dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-zinc-800/30 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-zinc-800/30 flex flex-col md:flex-row justify-between items-center gap-4 bg-card/50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">
                      Calendario de Seguimiento
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                      {calendarDate.toLocaleString("es-CR", { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-background dark:bg-zinc-800 p-1 rounded-xl border border-zinc-800/40">
                  <button
                    onClick={() => setCalendarView("month")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all",
                      calendarView === "month" ? "bg-amber-500 text-white shadow-sm" : "hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400"
                    )}
                  >
                    Mes
                  </button>
                  <button
                    onClick={() => setCalendarView("twoweeks")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all",
                      calendarView === "twoweeks" ? "bg-amber-500 text-white shadow-sm" : "hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400"
                    )}
                  >
                    15 Días
                  </button>
                  <button
                    onClick={() => setCalendarView("week")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all",
                      calendarView === "week" ? "bg-amber-500 text-white shadow-sm" : "hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400"
                    )}
                  >
                    Semana
                  </button>
                </div>

                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => setShowCalendarModal(false)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                   >
                     <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                   </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-auto scrollbar-thin scrollbar-thumb-amber-500/20">
                <div className={cn(
                  "grid gap-1",
                  calendarView === "month" ? "grid-cols-7" : calendarView === "twoweeks" ? "grid-cols-7" : "grid-cols-7"
                )}>
                  {/* Calendar Headers */}
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                    <div key={day} className="py-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-zinc-800/30">
                      {day}
                    </div>
                  ))}

                  {/* Calendar Cells Placeholder */}
                  {Array.from({ length: calendarView === "month" ? 35 : calendarView === "twoweeks" ? 14 : 7 }).map((_, i) => {
                    const dayNum = i + 1;
                    const cellDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), dayNum);
                    
                    const dayEvents: { id: string, text: string, type: 'lead' | 'close' | 'delivery' }[] = [];

                    clients.forEach(c => {
                       const closedTag = c.tags?.find(t => t.startsWith('closed_at:'));
                       if (closedTag) {
                         const closedDate = new Date(closedTag.replace('closed_at:', ''));
                         // Venta cerrada (mismo día de cierre)
                         if (closedDate.getDate() === dayNum && closedDate.getMonth() === calendarDate.getMonth() && closedDate.getFullYear() === calendarDate.getFullYear()) {
                           dayEvents.push({ id: `close-${c.id}`, text: c.company_name || c.contact_name, type: 'close' });
                         }

                         // Entrega esperada (7 días después)
                         const deliveryDate = new Date(closedDate);
                         deliveryDate.setDate(deliveryDate.getDate() + 7);
                         if (deliveryDate.getDate() === dayNum && deliveryDate.getMonth() === calendarDate.getMonth() && deliveryDate.getFullYear() === calendarDate.getFullYear()) {
                           dayEvents.push({ id: `delivery-${c.id}`, text: c.company_name || c.contact_name, type: 'delivery' });
                         }
                       } else {
                         // Lead genérico si no hay cierre aún
                         const createdDate = new Date(c.created_at);
                         if (createdDate.getDate() === dayNum && createdDate.getMonth() === calendarDate.getMonth() && createdDate.getFullYear() === calendarDate.getFullYear()) {
                            dayEvents.push({ id: `lead-${c.id}`, text: c.company_name || c.contact_name, type: 'lead' });
                         }
                       }
                    });

                    const displayEvents = dayEvents.slice(0, 3);
                    const hasMore = dayEvents.length > 3;

                    return (
                      <div key={i} className="min-h-[100px] bg-card/50 dark:bg-zinc-950/50 border border-zinc-800/30/50 p-2 rounded-xl hover:bg-background dark:hover:bg-zinc-900 transition-all group flex flex-col">
                        <span className="text-[10px] font-bold text-slate-300 dark:text-zinc-600 group-hover:text-amber-500 transition-colors">
                          {dayNum}
                        </span>
                        <div className="mt-2 space-y-1 overflow-hidden">
                          {displayEvents.map(evt => (
                            <div 
                              key={evt.id}
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded-lg border truncate cursor-pointer hover:scale-105 transition-transform flex items-center gap-1",
                                evt.type === 'delivery' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                evt.type === 'close' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-zinc-800 dark:text-zinc-400"
                              )}
                              title={`${evt.type === 'delivery' ? 'Entrega alfombra' : evt.type === 'close' ? 'Venta Cerrada' : 'Nuevo Lead'}: ${evt.text}`}
                            >
                              <span>{evt.type === 'delivery' ? '🚚' : evt.type === 'close' ? '✅' : '✨'}</span>
                              <span className="truncate">{evt.text}</span>
                            </div>
                          ))}
                          {hasMore && (
                            <div className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest mt-1">
                              +{dayEvents.length - 3} más
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 border-t border-zinc-800/30 bg-card dark:bg-zinc-800/50 flex justify-between items-center">
                 <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500"></div>
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Urgente</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Interés</span>
                   </div>
                 </div>
                 <button 
                   onClick={() => setShowCalendarModal(false)}
                   className="px-6 py-2 bg-slate-900 dark:bg-background text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all"
                  >
                    Cerrar Calendario
                  </button>
               </div>
             </div>
           </div>
         )}

         {/* PROFORMA APPROVAL MODAL */}
         {approvingClient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4 text-slate-900 dark:text-zinc-100">
            <div className="bg-background dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-800/30 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-zinc-800/30 flex justify-between items-center bg-amber-500/10 dark:bg-amber-500/5">
                 <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                       <CheckSquare className="w-6 h-6 text-amber-500" /> Aprobar Cotización
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Has marcado esta venta como cerrada. ¿Qué cotización se aprobó?</p>
                 </div>
                 <button onClick={cancelApproval} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800/30 text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5"/>
                 </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-3">
                 {approvingProformas.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">El cliente no tiene cotizaciones generadas.</div>
                 ) : (
                    approvingProformas.map(p => (
                       <button 
                         key={p.id} 
                         onClick={() => confirmApproval(p.id)}
                         className="w-full bg-slate-50 dark:bg-zinc-800/50 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500/20 border-2 border-transparent hover:border-amber-500 transition-all rounded-xl p-4 flex justify-between items-center text-left group"
                       >
                          <div>
                            <div className="font-bold text-sm uppercase group-hover:text-amber-500 dark:group-hover:text-amber-400">Proforma N° {p.proforma_number}</div>
                            <div className="text-xs text-slate-500 mt-1">{new Date(p.date).toLocaleDateString("es-CR")} • {p.items?.length || 0} items</div>
                          </div>
                          <div className="font-black">₡{Number(p.total).toLocaleString("es-CR")}</div>
                       </button>
                    ))
                 )}
                 <button 
                   onClick={() => confirmApproval('none')}
                   className="w-full mt-4 bg-transparent border-2 border-slate-200 dark:border-zinc-800 hover:border-slate-500 dark:hover:border-zinc-600 rounded-xl p-4 text-center font-bold text-sm text-slate-500 uppercase transition-all"
                 >
                    Aprobar venta sin asociar cotización
                 </button>
              </div>
            </div>
          </div>
         )}
      </SidebarLayout>
    );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-500 font-black uppercase tracking-widest text-xs">Iniciando Panel Premium...</p>
        </div>
      </div>
    }>
      <AdminDashboardInternal />
    </Suspense>
  );
}
