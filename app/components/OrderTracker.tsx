"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Scissors, Stamp, CheckCircle, Truck } from 'lucide-react';

import { getOrder, type OrderStatus, type OrderData } from '../lib/orders';

const ORDER_STEPS = [
    { id: 'received', label: 'Recibido', icon: Package },
    { id: 'design', label: 'Diseño', icon: Search },
    { id: 'production', label: 'Producción', icon: Scissors },
    { id: 'quality', label: 'Calidad', icon: CheckCircle },
    { id: 'ready', label: 'Listo', icon: Truck },
];

export default function OrderTracker() {
    const [orderId, setOrderId] = useState('');
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            const data = await getOrder(orderId);
            if (data) {
                setOrderData(data);
            } else {
                setError('No encontramos ese número de pedido. Intente con 1001, 1002, 1003 o 1004.');
            }
        } catch (err) {
            setError('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">

            {/* Search Box */}
            <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-8 mb-12 text-center">
                <h2 className="text-2xl font-bold mb-2 text-slate-900">Rastrear Pedido</h2>
                <p className="text-slate-500 mb-6">Ingrese su número de orden para ver el estado de producción en tiempo real.</p>

                <form onSubmit={handleTrack} className="flex max-w-md mx-auto gap-2">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="# Orden (Ej: 12345)"
                        className="flex-1 input-industrial rounded-lg px-4 py-3 text-center tracking-widest font-mono text-lg text-slate-900 border-slate-300 bg-slate-50"
                    />
                    <button
                        disabled={loading || !orderId}
                        className="bg-tropical-gradient hover:opacity-90 text-white rounded-lg px-6 font-bold transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                    >
                        {loading ? '...' : <Search />}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            </div>

            {/* Timeline */}
            {orderData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block" />

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
                        {ORDER_STEPS.map((step, index) => {
                            const stepIndex = ORDER_STEPS.findIndex(s => s.id === step.id);
                            const currentIndex = ORDER_STEPS.findIndex(s => s.id === orderData.status);
                            const isActive = stepIndex <= currentIndex;
                            const isCurrent = stepIndex === currentIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-4 group">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? 'bg-white border-cyan-500 text-cyan-500' : 'bg-white border-slate-200 text-slate-300'} ${isCurrent ? 'shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-110 border-tropical-yellow text-tropical-yellow' : ''}`}>
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className={`font-bold text-sm uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                        {isCurrent && <span className="text-xs text-tropical-yellow animate-pulse font-bold">En Proceso</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 p-6 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center gap-4 max-w-2xl mx-auto shadow-sm">
                        <CheckCircle className="text-cyan-500 w-8 h-8" />
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{orderData.client}</h3>
                            <p className="text-sm text-slate-600">
                                Tu pedido de <span className="text-cyan-600 font-medium">{orderData.product}</span> está en estado: <span className="text-tropical-yellow-dark font-bold uppercase">{ORDER_STEPS.find(s => s.id === orderData.status)?.label}</span>.
                                <br />Estimado: {orderData.estimatedDelivery}.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

        </div>
    );
}
