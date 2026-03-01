'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        // Verificar si ya está logueado (aquí usamos apcr_user como en el dashboard original)
        const isAuth = localStorage.getItem('apcr_user');
        if (isAuth) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Verificar en la tabla crm_users (donde están los clientes del CRM)
        if (identifier) {
            // Buscamos por email o número de cuenta
            const { data: user, error: authError } = await supabase
                .from('crm_users')
                .select('*')
                .or(`email.eq."${identifier}",account_number.eq."${identifier}"`)
                .eq('password', password)
                .single();

            if (user) {
                // Éxito - Guardar en localStorage para el dashboard de nomad-mats-web
                const userData = {
                    id: user.id,
                    firstName: user.contact_name?.split(' ')[0] || user.company_name,
                    lastName: user.contact_name?.split(' ').slice(1).join(' ') || "",
                    company: user.company_name,
                    email: user.email,
                    mobilePhone: user.phone,
                    role: user.role
                };

                localStorage.setItem('apcr_user', JSON.stringify(userData));

                // También ponemos las cookies por si acaso se usan otras partes del sistema
                const expires = new Date();
                expires.setDate(expires.getDate() + 7);
                document.cookie = `crm_authenticated=true; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
                document.cookie = `crm_user_id=${user.id}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
                document.cookie = `crm_role=${user.role}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

                router.push('/dashboard');
                router.refresh();
            } else {
                setError('Credenciales inválidas. Verifica tu cuenta y contraseña.');
                setLoading(false);
            }
        } else {
            setError('Por favor ingresa tu número de cuenta o correo electrónico.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Panel Izquierdo — Branding Hero */}
            <div
                className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-16"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #b45309 100%)',
                }}
            >
                {/* Elementos decorativos */}
                <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
                <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

                {/* Logo & Volver */}
                <div className="relative z-10 flex flex-col gap-8">
                    <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group text-sm font-medium">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al inicio
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500 shadow-lg shadow-amber-500/20">
                            <ShieldCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-black text-2xl tracking-tighter block leading-none">APCR</span>
                            <span className="text-amber-500 font-bold text-xs tracking-widest uppercase">Portal Clientes</span>
                        </div>
                    </div>
                </div>

                {/* Contenido Central */}
                <div className="relative z-10 max-w-md">
                    <div className="mb-10">
                        <Sparkles className="w-12 h-12 mb-6 text-amber-500" />
                        <h2 className="text-5xl font-black text-white leading-[1.1] mb-6">
                            Tu espacio<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Premium APCR</span>
                        </h2>
                        <p className="text-indigo-100/70 text-lg leading-relaxed">
                            Accede a tus proformas, visualiza tus diseños en 3D y realiza el seguimiento de tus pedidos en tiempo real.
                        </p>
                    </div>

                    {/* Beneficios */}
                    <div className="space-y-4">
                        {[
                            'Seguimiento detallado de producción',
                            'Historial de cotizaciones y facturas',
                            'Soporte directo y prioritario',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-4 group">
                                <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition-transform" />
                                <span className="text-indigo-50 text-base font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer del panel */}
                <div className="relative z-10">
                    <p className="text-indigo-400/60 text-xs font-medium">
                        © {new Date().getFullYear()} APCR · Innovación en Alfombras de Vinilo CR
                    </p>
                </div>
            </div>

            {/* Panel Derecho — Formulario */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div
                    className="w-full max-w-[420px] relative z-10"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {/* Logo Móvil */}
                    <div className="lg:hidden text-center mb-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 bg-gradient-to-br from-slate-900 to-indigo-950 shadow-xl">
                            <ShieldCheck className="w-9 h-9 text-white" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">APCR Portal</h1>
                        <p className="text-amber-600 font-bold text-[10px] tracking-[0.2em] uppercase mt-2">Área de Clientes</p>
                    </div>

                    {/* Card de Login */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 md:p-12">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Ingresar</h2>
                            <p className="text-slate-500 text-sm font-medium">Bienvenido de nuevo a tu panel de control.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Identificador */}
                            <div className="space-y-2">
                                <label htmlFor="identifier" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">
                                    Nº de Cuenta o Email
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                    <input
                                        type="text"
                                        id="identifier"
                                        required
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none text-slate-800 placeholder-slate-300 text-sm font-medium transition-all focus:bg-white focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5"
                                        placeholder="Ej: 4500 o correo@empresa.com"
                                        autoComplete="username"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">
                                    Contraseña
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none text-slate-800 placeholder-slate-300 text-sm font-medium transition-all focus:bg-white focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5"
                                        placeholder="Tu contraseña personal"
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 animate-in slide-in-from-top-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                    <p className="text-xs text-red-600 font-bold">{error}</p>
                                </div>
                            )}

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4.5 bg-slate-900 rounded-2xl text-white font-black text-sm relative group overflow-hidden shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center justify-center gap-3 py-4">
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Autenticando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Acceder al Portal</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        {/* Link de Ayuda / Registro */}
                        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                            <p className="text-slate-400 text-xs font-medium">
                                ¿No tienes cuenta? <Link href="/register" className="text-amber-600 font-black hover:underline underline-offset-4">Regístrate gratis</Link>
                            </p>
                        </div>
                    </div>

                    {/* Bloque de Ayuda Premium */}
                    <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">Acceso con Nº de Cuenta</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                Si aún no tienes email registrado, puedes ingresar con tu <strong>Número de Cuenta</strong> y la contraseña asignada por tu agente.
                            </p>
                        </div>
                    </div>

                    {/* Footer final */}
                    <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] mt-10">
                        APCR · Sistema de Gestión v2.0
                    </p>
                </div>
            </div>
        </div>
    );
}
