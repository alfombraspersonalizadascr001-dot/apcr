"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Building2, Briefcase, Mail, Phone, MapPin, Loader2, ArrowRight } from 'lucide-react';
import Image from "next/image";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Simulate API call and storage
        // In a real app, this goes to a DB. Here we simulate it for the demo flow.
        localStorage.setItem('apcr_user', JSON.stringify(data));

        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2">
                        <Image src="/logo.png" alt="APCR Logo" width={48} height={48} className="w-12 h-12 object-contain invert" />
                    </a>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
                        <a href="/" className="hover:text-white transition-colors">Inicio</a>
                        <a href="/#sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a>
                        <a href="/register" className="text-tropical font-bold hover:text-white transition-colors">Crear Cuenta</a>
                        <a href="/contact" className="hover:text-white transition-colors">Contacto</a>
                        <a href="/login" className="hover:text-white transition-colors border border-zinc-700 px-4 py-1 rounded-full hover:bg-zinc-800">Área Clientes</a>
                    </nav>
                </div>
            </header>

            <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 pt-24 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-industrial-orange/5 blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative z-10"
                >
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-6">
                            <Image src="/logo.png" alt="APCR Logo" width={64} height={64} className="w-16 h-16 object-contain invert" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Registro Corporativo</h1>
                        <p className="text-zinc-400">Cree su cuenta para gestionar pedidos y facturación.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Info */}
                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-white/5 pb-2">Información Personal</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Nombre</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                                <input name="firstName" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:border-cyan-500 transition-colors" placeholder="Juan" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Apellido</label>
                            <div className="relative">
                                <input name="lastName" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 focus:border-cyan-500 transition-colors" placeholder="Pérez" />
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="space-y-4 md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-white/5 pb-2">Datos de Empresa</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Empresa</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                                <input name="company" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:border-cyan-500 transition-colors" placeholder="Nombre Comercial S.A." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Puesto / Cargo</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                                <input name="role" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:border-cyan-500 transition-colors" placeholder="Gerente de Operaciones" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Dirección Física</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                                <input name="address" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:border-cyan-500 transition-colors" placeholder="Provincia, Cantón, Distrito, Señas exactas..." />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider border-b border-white/5 pb-2">Contacto</h3>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Correo Electrónico de Contacto</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                                <input name="email" type="email" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:border-cyan-500 transition-colors" placeholder="juan@empresa.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Teléfono Móvil</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                                <input name="mobilePhone" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:border-cyan-500 transition-colors" placeholder="+506 8888-8888" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Teléfono Fijo / Oficina</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                                <input name="officePhone" className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:border-cyan-500 transition-colors" placeholder="+506 2222-2222" />
                            </div>
                        </div>

                        {/* Billing Info */}
                        <div className="space-y-4 md:col-span-2 mt-4">
                            <h3 className="text-sm font-bold text-tropical uppercase tracking-wider border-b border-white/5 pb-2">Datos de Facturación</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Tipo de Identificación</label>
                            <div className="relative">
                                <select name="idType" className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 focus:border-industrial-orange transition-colors appearance-none text-zinc-300">
                                    <option value="juridica">Cédula Jurídica</option>
                                    <option value="fisica">Cédula Física</option>
                                    <option value="dimex">DIMEX</option>
                                    <option value="nite">NITE</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Número de Identificación</label>
                            <div className="relative">
                                <input name="idNumber" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 focus:border-industrial-orange transition-colors" placeholder="3-101-123456" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Código Actividad Económica</label>
                            <input name="activityCode" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 focus:border-industrial-orange transition-colors" placeholder="Ej: 722003" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Correo para Facturación Electrónica</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
                                <input name="billingEmail" type="email" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 focus:border-industrial-orange transition-colors" placeholder="factura@empresa.com" />
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-8">
                            <button
                                disabled={loading}
                                className="w-full bg-tropical-gradient hover:opacity-90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Crear Cuenta Corporativa <ArrowRight className="w-5 h-5" /></>}
                            </button>
                            <p className="text-center mt-4 text-sm text-zinc-500">
                                ¿Ya tiene cuenta? <a href="/login" className="text-white underline hover:text-cyan-400">Iniciar Sesión</a>
                            </p>
                        </div>

                    </form>
                </motion.div>
            </main>

            {/* Floating WhatsApp Button */}
            <FloatingWhatsApp />
        </>
    );
}
