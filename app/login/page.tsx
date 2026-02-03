"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from "next/image";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Header from "../components/Header";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock login - check if user exists in storage or just let them in for demo
        setTimeout(() => {
            router.push('/dashboard');
            setLoading(false);
        }, 1000);
    };

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 bg-[grid-white/0.05]">
            <Header />

            <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/logo.png" alt="APCR Logo" width={64} height={64} className="w-16 h-16 object-contain invert" />
                    </div>
                    <span className="text-tropical font-bold text-lg block mb-1">/// APCR</span>
                    <h1 className="text-xl font-bold">Acceso Clientes</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-xs text-zinc-500 font-bold ml-1">CORREO</label>
                        <input type="email" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 focus:border-cyan-500 input-industrial" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 font-bold ml-1">CONTRASEÑA</label>
                        <input type="password" required className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 focus:border-cyan-500 input-industrial" />
                    </div>

                    <button disabled={loading} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors mt-6 flex justify-center">
                        {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-zinc-500 text-sm">¿Primera vez?</p>
                    <a href="/register" className="text-tropical font-bold hover:underline">Crear Cuenta Corporativa</a>
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <FloatingWhatsApp />
        </main>
    )
}
