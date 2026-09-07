'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Users, Calculator, Globe, Book, MessageCircle, 
  BarChart3, Mail, Calendar, LogOut, Settings, Package,
  Sun, Moon, Layers, FileText, Menu, X
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  children: React.ReactNode;
  activeModule?: string;
  title?: string;
  badge?: string;
  badgeColor?: string;
  headerContent?: React.ReactNode;
}

function NavItem({ 
  icon, 
  label, 
  active = false,
  href,
  onClick
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  href: string,
  onClick?: () => void
}) {
  const isExternal = href.startsWith('http');
  const Content = (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold text-sm group cursor-pointer mb-1",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-blue-600 dark:hover:bg-zinc-900 dark:text-zinc-400"
      )}
    >
      <div className={cn(
        "transition-transform duration-300 group-hover:scale-110",
        active ? "text-white" : "text-slate-400 group-hover:text-blue-600"
      )}>
        {icon}
      </div>
      <span className="tracking-tight">{label}</span>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {Content}
      </a>
    );
  }

  return (
    <Link href={href}>
      {Content}
    </Link>
  );
}

export default function SidebarLayout({ 
  children, 
  activeModule = '',
  title = 'AP CRM',
  badge = 'LIVE',
  badgeColor = 'amber',
  headerContent
}: SidebarLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedInAgent, setLoggedInAgent] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const agentNameCookie = document.cookie.split('; ').find(row => row.startsWith('crm_agent_name='));
    if (agentNameCookie) {
      setLoggedInAgent(decodeURIComponent(agentNameCookie.split('=')[1]));
    }
    
    // Load saved theme
    const savedTheme = (localStorage.getItem('crm_theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('crm_theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  const handleLogout = () => {
    document.cookie = "crm_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "crm_agent_name=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push('/');
  };

  const getActiveModule = () => {
    if (activeModule) return activeModule;
    if (pathname === '/crm' || pathname === '/crm/') return 'dashboard';
    if (pathname === '/crm/admin') return 'admin';
    if (pathname === '/crm/cotizador') return 'cotizador';
    if (pathname === '/crm/proformas') return 'proformas';
    if (pathname === '/crm/inventory') return 'inventory';
    if (pathname.includes('/knowledge')) return 'knowledge';
    return '';
  };

  const currentModule = getActiveModule();

  const renderNavLinks = (isMobile = false) => (
    <>
      <NavItem 
        icon={<Layers className="w-4 h-4" />} 
        label="Resumen General" 
        href="/crm" 
        active={currentModule === 'dashboard'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <div className="pt-4 pb-2 px-3 text-xs font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">Herramientas</div>
      
      <NavItem 
        icon={<Package className="w-4 h-4" />} 
        label="Inventario" 
        href="/crm/inventory" 
        active={currentModule === 'inventory'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <NavItem 
        icon={<Users className="w-4 h-4" />} 
        label="Clientes y Cuentas" 
        href="/crm/admin" 
        active={currentModule === 'admin'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <NavItem 
        icon={<Calculator className="w-4 h-4" />} 
        label="Cotizador" 
        href="/crm/cotizador" 
        active={currentModule === 'cotizador'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <NavItem 
        icon={<FileText className="w-4 h-4" />} 
        label="Cotizaciones" 
        href="/crm/proformas" 
        active={currentModule === 'proformas'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <NavItem 
        icon={<Layers className="w-4 h-4 text-amber-500" />} 
        label="Tablero de Pedidos" 
        href="/crm?activeModule=kanban" 
        active={currentModule === 'kanban'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <NavItem 
        icon={<Globe className="w-4 h-4" />} 
        label="Sitio Web" 
        href="/" 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <NavItem 
        icon={<Book className="w-4 h-4" />} 
        label="Base de Conocimiento" 
        href="/crm/admin/knowledge" 
        active={currentModule === 'knowledge'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <div className="pt-4 pb-2 px-3 text-xs font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">Sistemas</div>
      
      <NavItem 
        icon={<BarChart3 className="w-4 h-4" />} 
        label="Analítica Web" 
        href="/crm?activeModule=analytics" 
        active={currentModule === 'analytics'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />

      <NavItem 
        icon={<Calendar className="w-4 h-4" />} 
        label="Calendario Seguimiento" 
        href="/crm?activeModule=calendar" 
        active={currentModule === 'calendar'} 
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      />
    </>
  );

  return (
    <div className={cn(
      "min-h-screen flex font-sans transition-colors duration-300 selection:bg-blue-600/30",
      theme === 'dark' ? "bg-zinc-950 dark" : "bg-card"
    )}>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 dark:border-zinc-800 bg-background flex-col transition-colors duration-300 sticky top-0 h-screen z-20 print:hidden">
        <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-zinc-800 gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="AP Logo"
              fill
              className="object-contain invert dark:invert-0 drop-shadow-md"
            />
          </div>
          <div>
            <span className="font-bold tracking-wide block leading-tight text-lg text-slate-900 dark:text-white">CRM Plus</span>
            <span className="text-[10px] text-green-500 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          {renderNavLinks(false)}
        </nav>

        <div className="p-4 border-t border-zinc-800/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-muted-foreground hover:text-red-500 transition-colors px-3 py-2 w-full rounded-lg text-sm font-medium hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex animate-in fade-in duration-200 print:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside 
            className="w-72 h-full bg-background dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col animate-in slide-in-from-left duration-250 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image src="/logo.png" alt="AP Logo" fill className="object-contain invert dark:invert-0 drop-shadow-md" />
                </div>
                <div>
                  <span className="font-bold tracking-wide block leading-tight text-lg text-slate-900 dark:text-white">CRM Plus</span>
                  <span className="text-[10px] text-green-500 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
                title="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              {renderNavLinks(true)}
            </nav>

            <div className="p-4 border-t border-zinc-800/30">
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
        <header className="h-20 border-b border-zinc-800/30 flex items-center justify-between px-4 sm:px-8 bg-background/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300 print:hidden gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              title="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg sm:text-xl font-black tracking-tight dark:text-white uppercase line-clamp-1">
              {title}
            </h1>
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-black rounded-full border hidden sm:inline-block",
              badgeColor === 'amber' 
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-indigo-50 text-indigo-600 border-indigo-200"
            )}>
              {badge}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {headerContent}
            
            <div className="flex items-center gap-2 bg-background dark:bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800/40">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-amber-500 hover:bg-background dark:hover:bg-zinc-900 transition-all"
                title={theme === 'dark' ? 'Modo Día' : 'Modo Noche'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button
                onClick={() => alert("Configuraciones próximamente...")}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-amber-500 hover:bg-background dark:hover:bg-zinc-900 transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="hidden sm:flex h-10 px-4 rounded-xl border border-red-900/30 hover:bg-red-900/10 items-center justify-center gap-2 transition-all text-red-600 dark:text-red-400 font-bold text-[10px] uppercase tracking-widest bg-background dark:bg-zinc-900 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
          <div className="w-full max-w-[1680px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
