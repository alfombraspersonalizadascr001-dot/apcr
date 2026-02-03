"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, ArrowLeft, Instagram, Facebook, Linkedin, Music } from "lucide-react";
import Link from "next/link";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans">

            {/* Header */}
            <header className="relative z-20 w-full border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2">
                        <Image src="/logo.png" alt="APCR Logo" width={48} height={48} className="w-12 h-12 object-contain invert" />
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
                        <a href="/" className="hover:text-white transition-colors">Inicio</a>
                        <a href="/#sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a>
                        <a href="/register" className="hover:text-white transition-colors">Crear Cuenta</a>
                        <a href="/contact" className="text-tropical font-bold hover:text-white transition-colors">Contacto</a>
                        <a href="/login" className="hover:text-white transition-colors border border-zinc-700 px-4 py-1 rounded-full hover:bg-zinc-800">Área Clientes</a>
                    </nav>
                </div>
            </header>

            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/contact-bg.jpg"
                    alt="Alfombra Corporativa"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="relative z-10 w-full max-w-4xl">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        {/* Left: Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">Hablemos de tu <span className="text-tropical">Proyecto</span></h1>
                                <p className="text-zinc-400 text-lg">Estamos listos para personalizar la imagen de tu empresa. Escríbenos por WhatsApp o correo.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                                        <Phone className="w-6 h-6 text-tropical-yellow" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">WhatsApp Oficial</h3>
                                        <p className="text-zinc-400">Respuesta rápida</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                                        <Mail className="w-6 h-6 text-tropical-cyan" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Correo Electrónico</h3>
                                        <p className="text-zinc-400">ventas@apcr.online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="pt-6 border-t border-white/10">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500 mb-4">Síguenos</h3>
                                <div className="flex gap-3">
                                    <a href="https://www.instagram.com/alfombraspersonalizadas.cr/" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-tropical-pink/50 transition-colors group">
                                        <Instagram className="w-5 h-5 text-zinc-400 group-hover:text-tropical-pink transition-colors" />
                                    </a>
                                    <a href="https://www.facebook.com/alfombraspersonalizadascostarica" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-tropical-cyan/50 transition-colors group">
                                        <Facebook className="w-5 h-5 text-zinc-400 group-hover:text-tropical-cyan transition-colors" />
                                    </a>
                                    <a href="https://www.tiktok.com/@alfombraspersonal" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-tropical-yellow/50 transition-colors group">
                                        <Music className="w-5 h-5 text-zinc-400 group-hover:text-tropical-yellow transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right: QR Code Card */}
                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 text-center relative group">
                            <div className="absolute inset-0 bg-tropical-gradient opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl blur-xl" />

                            <div className="relative z-10 bg-white p-4 rounded-2xl mx-auto w-64 h-64 mb-6 shadow-2xl">
                                <Image
                                    src="/whatsapp-qr.png"
                                    alt="Escanea para Chatear"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <h3 className="text-2xl font-bold mb-2">Escanea para Chatear</h3>
                            <p className="text-zinc-500 text-sm">Abre la cámara de tu celular y conecta directamente con nuestro equipo de ventas.</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-12 bg-black/80 backdrop-blur-md border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600 text-sm">

                    <div className="text-center md:text-left space-y-3">
                        <p>© 2026 Alfombras Personalizadas CR.</p>
                        <p>San José, Costa Rica. Todos los derechos reservados.</p>
                        <div className="flex gap-3 justify-center md:justify-start mt-3">
                            <a href="https://www.instagram.com/alfombraspersonalizadas.cr/" target="_blank" rel="noopener noreferrer" className="p-3 bg-black rounded-lg border-2 border-white/20 hover:border-tropical-pink hover:bg-tropical-pink/10 transition-all group">
                                <Instagram className="w-6 h-6 text-white group-hover:text-tropical-pink transition-colors" />
                            </a>
                            <a href="https://www.facebook.com/alfombraspersonalizadascostarica" target="_blank" rel="noopener noreferrer" className="p-3 bg-black rounded-lg border-2 border-white/20 hover:border-tropical-cyan hover:bg-tropical-cyan/10 transition-all group">
                                <Facebook className="w-6 h-6 text-white group-hover:text-tropical-cyan transition-colors" />
                            </a>
                            <a href="https://www.tiktok.com/@alfombraspersonal" target="_blank" rel="noopener noreferrer" className="p-3 bg-black rounded-lg border-2 border-white/20 hover:border-tropical-yellow hover:bg-tropical-yellow/10 transition-all group">
                                <Music className="w-6 h-6 text-white group-hover:text-tropical-yellow transition-colors" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:border-tropical-cyan/30 transition-colors">
                        <Image src="/whatsapp-qr.png" alt="QR WhatsApp" width={64} height={64} className="bg-white rounded-lg p-1" />
                        <div className="text-left">
                            <p className="text-tropical-cyan font-bold text-xs uppercase tracking-wider mb-1">Atención Rápida</p>
                            <p className="text-zinc-400">Escanea para chatear</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Button */}
            <FloatingWhatsApp />
        </main>
    )
}
