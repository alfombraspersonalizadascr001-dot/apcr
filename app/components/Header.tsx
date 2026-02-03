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

                {/* Mobile Nav Overlay */}
                {isMenuOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-6 space-y-8 animate-in slide-in-from-top-10 duration-200">
                        <nav className="flex flex-col items-center gap-8 text-xl font-medium text-zinc-400">
                            <a href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors border-b border-white/10 pb-2 w-full text-center">Inicio</a>
                            <a href="/portfolio" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors border-b border-white/10 pb-2 w-full text-center">Nuestros Trabajos</a>
                            <a href="/#sobre-nosotros" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors border-b border-white/10 pb-2 w-full text-center">Sobre Nosotros</a>
                            <a href="/register" onClick={() => setIsMenuOpen(false)} className="text-tropical font-bold hover:text-white transition-colors border-b border-white/10 pb-2 w-full text-center">Crear Cuenta</a>
                            <a href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors border-b border-white/10 pb-2 w-full text-center">Contacto</a>
                            <a href="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors border border-zinc-700 px-6 py-2 rounded-full hover:bg-zinc-800 mt-4">Área Clientes</a>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
