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

    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { supabase } = await import('../../lib/supabase');

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            // Éxito - Redirigir
            console.log("Login exitoso");
            router.push('/dashboard');
        } catch (err: any) {
            console.error("Error de login:", err);
            setError("Credenciales inválidas o error de conexión.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6 bg-[grid-slate-900/0.05]">
            <Header />

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/logo.png" alt="APCR Logo" width={64} height={64} className="w-16 h-16 object-contain" />
                    </div>
                    <span className="text-tropical font-bold text-lg block mb-1">/// APCR</span>
                    <h1 className="text-xl font-bold text-slate-900">Acceso Clientes</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="text-xs text-slate-500 font-bold ml-1">CORREO</label>
                        <input name="email" type="email" required className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 px-4 focus:border-cyan-500 input-industrial text-slate-900" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 font-bold ml-1">CONTRASEÑA</label>
                        <input name="password" type="password" required className="w-full bg-slate-50 border border-slate-300 rounded-lg py-3 px-4 focus:border-cyan-500 input-industrial text-slate-900" />
                    </div>

                    <button disabled={loading} className="w-full bg-tropical-gradient text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity mt-6 flex justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                    <p className="text-slate-500 text-sm">¿Primera vez?</p>
                    <a href="/register" className="text-tropical font-bold hover:underline">Crear Cuenta Corporativa</a>
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <FloatingWhatsApp />
        </main>
    )
}
