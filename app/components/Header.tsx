"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X, Sparkles, MessageCircle } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <a href="/" className="relative flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl p-1.5 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
              <Image 
                src="/logo.png" 
                alt="APCR Logo" 
                width={36} 
                height={36} 
                className="w-full h-full object-contain filter invert" 
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                APCR
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono hidden sm:inline">
                Soluciones para su Marca
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          <a href="/" className="text-white hover:text-cyan-400 transition-colors">
            Inicio
          </a>
          <a href="#fisico" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Mundo Físico
          </a>
          <a href="#digital" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Mundo Digital
          </a>
          <a href="/portfolio" className="hover:text-white transition-colors">
            Portafolio
          </a>
          <a href="/contact" className="hover:text-white transition-colors">
            Contacto
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://wa.me/50670693708?text=Hola%20APCR,%20deseo%20asesor%C3%ADa%20sobre%20sus%20soluciones%20para%20mi%20marca."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all text-xs font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Directo</span>
          </a>
          <a
            href="/login"
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all text-xs font-medium"
          >
            Área Clientes
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 rounded-lg bg-white/5 border border-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#0c101c]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 text-sm shadow-2xl">
          <a 
            href="/" 
            onClick={() => setIsMenuOpen(false)}
            className="text-white hover:text-cyan-400 py-2 border-b border-white/5"
          >
            Inicio
          </a>
          <a 
            href="#fisico" 
            onClick={() => setIsMenuOpen(false)}
            className="text-cyan-300 hover:text-cyan-400 py-2 border-b border-white/5 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Mundo Físico (Alfombras & Merchandising)
          </a>
          <a 
            href="#digital" 
            onClick={() => setIsMenuOpen(false)}
            className="text-indigo-300 hover:text-indigo-400 py-2 border-b border-white/5 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Mundo Digital (CRM, Apps & Web)
          </a>
          <a 
            href="/portfolio" 
            onClick={() => setIsMenuOpen(false)}
            className="text-slate-300 hover:text-white py-2 border-b border-white/5"
          >
            Portafolio
          </a>
          <a 
            href="/contact" 
            onClick={() => setIsMenuOpen(false)}
            className="text-slate-300 hover:text-white py-2 border-b border-white/5"
          >
            Contacto
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://wa.me/50670693708"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-center text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp +506 7069 3708
            </a>
            <a
              href="/login"
              className="w-full py-2.5 rounded-xl bg-white/10 text-white font-medium text-center text-xs"
            >
              Área Clientes
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
