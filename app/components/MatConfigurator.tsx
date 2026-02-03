"use client";

import { useState } from 'react';
import { generateMatImage } from '../actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Download, Layers, Type, Palette } from 'lucide-react';

export default function MatConfigurator() {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState('');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        setImage(null);

        const result = await generateMatImage(formData);

        if (result.error) {
            setError(result.error);
        } else if (result.url) {
            setImage(result.url);
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-4 lg:p-12 items-start">

            {/* Configuration Panel */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full lg:w-96 panel-industrial rounded-2xl p-8 flex flex-col gap-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-industrial-orange rounded flex items-center justify-center text-white font-bold">N</div>
                    <h2 className="text-xl font-bold tracking-tight">Nomad Configurator</h2>
                </div>

                <form action={handleSubmit} className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Type className="w-4 h-4 text-industrial-orange" /> Texto del Logo
                        </label>
                        <input
                            name="logoText"
                            type="text"
                            placeholder="Ej: Shop Time"
                            className="w-full rounded-lg px-4 py-3 input-industrial"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-industrial-orange" /> Industria / Lugar
                        </label>
                        <select name="industry" className="w-full rounded-lg px-4 py-3 input-industrial appearance-none">
                            <option value="shop">Tienda / Retail</option>
                            <option value="condo">Condominio / Edificio</option>
                            <option value="dentist">Clínica / Médico</option>
                            <option value="gym">Gimnasio</option>
                            <option value="cafe">Cafetería</option>
                            <option value="industrial">Industrial / Taller</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <Palette className="w-4 h-4 text-industrial-orange" /> Color de Alfombra
                        </label>
                        <input
                            name="matColor"
                            type="text"
                            placeholder="Ej: Dark Grey, Royal Blue"
                            className="w-full rounded-lg px-4 py-3 input-industrial"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="mt-4 w-full bg-industrial-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        {loading ? 'Fabricando...' : 'Generar Render'}
                    </button>

                    {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</p>}
                </form>
            </motion.div>

            {/* Preview Area */}
            <div className="flex-1 w-full min-h-[500px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="w-24 h-24 border-4 border-industrial-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-zinc-500 animate-pulse">Diseñando tejidos...</p>
                        </motion.div>
                    ) : image ? (
                        <motion.div
                            key="result"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <img src={image} alt="Generated Mat" className="w-full h-auto max-w-2xl" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                <a href={image} download="nomad-mat.png" target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                                    <Download className="w-5 h-5" /> Descargar HD
                                </a>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-zinc-700 flex flex-col items-center gap-4 border-2 border-dashed border-zinc-800 p-12 rounded-3xl"
                        >
                            <Layers className="w-16 h-16 opacity-20" />
                            <p>Configura los parámetros para ver el resultado.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
