"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="font-bold text-xl tracking-tighter flex items-center gap-2">
                    <a href="/" className="z-50 relative">
                        <Image src="/logo.png" alt="APCR Logo" width={48} height={48} className="w-12 h-12 object-contain" />
                    </a>
                </h1>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
                    <a href="/" className="hover:text-black transition-colors">Inicio</a>
                    <a href="/portfolio" className="hover:text-black transition-colors">Nuestros Trabajos</a>
                    <a href="/#sobre-nosotros" className="hover:text-black transition-colors">Sobre Nosotros</a>
                    <a href="/register" className="text-tropical font-bold hover:text-black transition-colors">Crear Cuenta</a>
                    <a href="/contact" className="hover:text-black transition-colors">Contacto</a>
                    <a href="/login" className="hover:text-white hover:bg-black transition-colors border border-slate-200 px-4 py-1 rounded-full text-slate-900">Área Clientes</a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-black z-50 relative p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Nav Overlay (Backdrop + Drawer) */}
                {isMenuOpen && (
                    <>
                        {/* Dark Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Right Side Drawer */}
                        <div
                            className="fixed top-0 right-0 h-full w-3/4 max-w-sm z-50 p-6 shadow-2xl"
                            style={{
                                backgroundColor: '#ffffff',
                                background: '#ffffff'
                            }}
                        >

                            {/* Close Button Header */}
                            <div className="flex justify-end mb-8">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 text-black hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <nav
                                className="flex flex-col gap-6 p-6"
                                style={{
                                    backgroundColor: '#ffffff',
                                    background: '#ffffff'
                                }}
                            >
                                <a href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-slate-900 hover:text-tropical transition-colors border-b border-slate-100 pb-4">
                                    Inicio
                                </a>
                                <a href="/portfolio" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-slate-900 hover:text-tropical transition-colors border-b border-slate-100 pb-4">
                                    Nuestros Trabajos
                                </a>
                                <a href="/#sobre-nosotros" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-slate-900 hover:text-tropical transition-colors border-b border-slate-100 pb-4">
                                    Sobre Nosotros
                                </a>
                                <a href="/register" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-tropical hover:text-black transition-colors border-b border-slate-100 pb-4">
                                    Crear Cuenta
                                </a>
                                <a href="/contact" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-slate-900 hover:text-tropical transition-colors border-b border-slate-100 pb-4">
                                    Contacto
                                </a>
                                <a href="/login" onClick={() => setIsMenuOpen(false)} className="mt-4 text-center px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-zinc-800 transition-colors">
                                    Área Clientes
                                </a>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
