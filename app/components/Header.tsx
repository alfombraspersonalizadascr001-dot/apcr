"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="font-bold text-xl tracking-tighter flex items-center gap-2">
                    <a href="/" className="z-50 relative">
                        <Image src="/logo.png" alt="APCR Logo" width={48} height={48} className="w-12 h-12 object-contain invert" />
                    </a>
                </h1>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
                    <a href="/" className="hover:text-white transition-colors">Inicio</a>
                    <a href="/portfolio" className="hover:text-white transition-colors">Nuestros Trabajos</a>
                    <a href="/#sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a>
                    <a href="/register" className="text-tropical font-bold hover:text-white transition-colors">Crear Cuenta</a>
                    <a href="/contact" className="hover:text-white transition-colors">Contacto</a>
                    <a href="/login" className="hover:text-white transition-colors border border-zinc-700 px-4 py-1 rounded-full hover:bg-zinc-800">Área Clientes</a>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white z-50 relative p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Nav Overlay (Backdrop + Drawer) */}
                {isMenuOpen && (
                    <>
                        {/* Dark Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Right Side Drawer */}
                        <div
                            className="fixed top-0 right-0 h-full w-3/4 max-w-sm shadow-2xl ring-1 ring-white/10 z-50 p-6 animate-in slide-in-from-right duration-300"
                            style={{ backgroundColor: '#000000' }}
                        >

                            {/* Close Button Header */}
                            <div className="flex justify-end mb-8">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <nav className="flex flex-col gap-6">
                                <a href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-white hover:text-tropical transition-colors border-b border-white/5 pb-4">
                                    Inicio
                                </a>
                                <a href="/portfolio" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-white hover:text-tropical transition-colors border-b border-white/5 pb-4">
                                    Nuestros Trabajos
                                </a>
                                <a href="/#sobre-nosotros" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-white hover:text-tropical transition-colors border-b border-white/5 pb-4">
                                    Sobre Nosotros
                                </a>
                                <a href="/register" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-tropical hover:text-white transition-colors border-b border-white/5 pb-4">
                                    Crear Cuenta
                                </a>
                                <a href="/contact" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-white hover:text-tropical transition-colors border-b border-white/5 pb-4">
                                    Contacto
                                </a>
                                <a href="/login" onClick={() => setIsMenuOpen(false)} className="mt-4 text-center px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors">
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
