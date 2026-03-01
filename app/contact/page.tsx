"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, ArrowLeft, Instagram, Facebook, Linkedin, Music } from "lucide-react";
import Link from "next/link";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Header from "../components/Header";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 flex flex-col relative overflow-hidden font-sans">

            {/* Header */}
            <Header />

            {/* Background Image */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/contact-bg.jpg"
                    alt="Alfombra Corporativa"
                    fill
                    className="object-cover opacity-95"
                    priority
                />
                {/* Light Overlay for Text Readability - Minimal for carpet visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
            </div>

            <div className="flex-1 flex items-center justify-center p-6 pt-24">
                <div className="relative z-10 w-full max-w-4xl">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        {/* Left: Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Hablemos de tu <span className="text-tropical">Proyecto</span></h1>
                                <p className="text-lg md:text-xl text-slate-900 font-bold">Estamos listos para personalizar la imagen de tu empresa. Escríbenos por WhatsApp o correo.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                        <Phone className="w-6 h-6 text-tropical-yellow" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">WhatsApp Oficial</h3>
                                        <p className="text-slate-500 font-medium">+506 7069-3708</p>
                                        <p className="text-slate-500 text-xs">Respuesta rápida</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                        <Mail className="w-6 h-6 text-tropical-cyan" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">Correo Electrónico</h3>
                                        <p className="text-slate-500">ventas@apcr.online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="pt-6 border-t border-slate-200">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">Síguenos</h3>
                                <div className="flex gap-3">
                                    <a href="https://www.instagram.com/alfombraspersonalizadas.cr/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-pink/50 transition-colors group shadow-sm">
                                        <Instagram className="w-5 h-5 text-slate-400 group-hover:text-tropical-pink transition-colors" />
                                    </a>
                                    <a href="https://www.facebook.com/alfombraspersonalizadascostarica" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-cyan/50 transition-colors group shadow-sm">
                                        <Facebook className="w-5 h-5 text-slate-400 group-hover:text-tropical-cyan transition-colors" />
                                    </a>
                                    <a href="https://www.tiktok.com/@alfombraspersonal" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-yellow/50 transition-colors group shadow-sm">
                                        <Music className="w-5 h-5 text-slate-400 group-hover:text-tropical-yellow transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right: QR Code Card */}
                        <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 text-center relative group">

                            <div className="relative z-10 bg-white p-4 rounded-2xl mx-auto w-64 h-64 mb-6 shadow-none border border-slate-100">
                                <Image
                                    src="/whatsapp-qr.png"
                                    alt="Escanea para Chatear"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-slate-900">Escanea para Chatear</h3>
                            <p className="text-slate-500 text-sm">Abre la cámara de tu celular y conecta directamente con nuestro equipo de ventas.</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-12 bg-white/90 backdrop-blur-md border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600 text-sm">

                    <div className="text-center md:text-left space-y-3">
                        <p>© 2026 Alfombras Personalizadas CR.</p>
                        <p>San José, Costa Rica. Todos los derechos reservados.</p>
                        <div className="flex gap-3 justify-center md:justify-start mt-3">
                            <a href="https://www.instagram.com/alfombraspersonalizadas.cr/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-pink hover:bg-tropical-pink/10 transition-all group shadow-sm">
                                <Instagram className="w-6 h-6 text-slate-600 group-hover:text-tropical-pink transition-colors" />
                            </a>
                            <a href="https://www.facebook.com/alfombraspersonalizadascostarica" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-cyan hover:bg-tropical-cyan/10 transition-all group shadow-sm">
                                <Facebook className="w-6 h-6 text-slate-600 group-hover:text-tropical-cyan transition-colors" />
                            </a>
                            <a href="https://www.tiktok.com/@alfombraspersonal" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-yellow hover:bg-tropical-yellow/10 transition-all group shadow-sm">
                                <Music className="w-6 h-6 text-slate-600 group-hover:text-tropical-yellow transition-colors" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-tropical-cyan/30 transition-colors shadow-sm">
                        <Image src="/whatsapp-qr.png" alt="QR WhatsApp" width={64} height={64} className="bg-white rounded-lg p-1 border border-slate-200" />
                        <div className="text-left">
                            <p className="text-tropical-cyan font-bold text-xs uppercase tracking-wider mb-1">Atención Rápida</p>
                            <p className="text-slate-500">Escanea para chatear</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Button */}
            <FloatingWhatsApp />
        </main>
    )
}
