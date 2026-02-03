"use client";

import { useState } from 'react';
import Header from "../components/Header";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import {
    Package,
    FileText,
    Image as ImageIcon,
    ChevronRight,
    X,
    Download,
    Clock,
    CheckCircle,
    Printer,
    Scissors,
    Layers,
    Box,
    Truck,
    Activity
} from 'lucide-react';
import Image from 'next/image';

// --- TIPO DE DATOS MOCK ---
type OrderStatus = 'Pendiente' | 'Producción' | 'Entregado' | 'Enviado';

interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    step: number; // 1 to 6
    total: string;
    items: string[];
    images: {
        topView: string;
        render: string;
    };
    documents: {
        proforma: string;
        invoice: string | null;
    };
}

// --- CONSTANTS ---
const ORDER_STEPS = [
    { number: 1, label: "Impresión de Stencil", icon: Printer },
    { number: 2, label: "Corte de Alfombra", icon: Scissors },
    { number: 3, label: "Armado de Alfombra", icon: Layers },
    { number: 4, label: "Pegado de Borde", icon: Box },
    { number: 5, label: "En Proceso de Entrega", icon: Truck },
    { number: 6, label: "Entregado", icon: CheckCircle },
];

// --- DATOS MOCK ---
const MOCK_CLIENT = {
    name: "Carlos Rodríguez",
    company: "Hotel & Casino del Rey",
    email: "gerencia@delrey.cr",
    phone: "+506 8888-8888"
};

const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-2026-001",
        date: "01 Feb 2026",
        status: "Producción",
        step: 3, // Currently at "Armado"
        total: "₡ 125,000",
        items: ["Alfombra Entrada Principal (120x80cm)", "Alfombra VIP (200x150cm)"],
        images: {
            topView: "/mock-top.jpg",
            render: "/mock-render.jpg"
        },
        documents: {
            proforma: "#PRO-001.pdf",
            invoice: "#FAC-001.pdf"
        }
    },
    {
        id: "ORD-2025-089",
        date: "15 Dic 2025",
        status: "Entregado",
        step: 6, // Completed
        total: "₡ 45,000",
        items: ["Alfombra Recepción (Pequeña)"],
        images: {
            topView: "/mock-top-2.jpg",
            render: "/mock-render-2.jpg"
        },
        documents: {
            proforma: "#PRO-089.pdf",
            invoice: "#FAC-992.pdf"
        }
    }
];

export default function DashboardPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    return (
        <div className="min-h-screen bg-black text-white font-sans bg-[grid-white/0.05]">
            <Header />

            <main className="pt-24 px-6 max-w-7xl mx-auto pb-20">

                {/* --- SECCIÓN 1: DATOS DEL CLIENTE --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-tropical font-bold tracking-wider text-sm">BIENVENIDO DE NUEVO</span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-2">{MOCK_CLIENT.name}</h1>
                        <p className="text-xl text-zinc-400 mt-2 flex items-center gap-2">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white border border-white/10">{MOCK_CLIENT.company}</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-zinc-500 text-sm font-bold">CONTACTO REGISTRADO</p>
                            <p className="text-zinc-300">{MOCK_CLIENT.email}</p>
                            <p className="text-zinc-300">{MOCK_CLIENT.phone}</p>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN 2: LISTA DE PEDIDOS --- */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Package className="text-tropical-cyan" /> Mis Pedidos
                </h2>

                <div className="grid gap-4">
                    {MOCK_ORDERS.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="group bg-surface hover:bg-zinc-900 border border-white/10 rounded-xl p-6 transition-all cursor-pointer hover:border-tropical-cyan/50 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">

                                {/* Info Principal */}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${getStatusColor(order.status).bg}`}>
                                        <Package className={`w-6 h-6 ${getStatusColor(order.status).text}`} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg group-hover:text-tropical-cyan transition-colors">{order.id}</p>
                                        <p className="text-zinc-500 text-sm">{order.date}</p>
                                    </div>
                                </div>

                                {/* Detalles Resumen */}
                                <div className="flex-1 md:px-12">
                                    <div className="flex flex-col gap-1 mb-3">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="text-zinc-300 text-sm block">• {item}</span>
                                        ))}
                                    </div>

                                    {/* Botón Ver Estado */}
                                    <div className="flex items-center text-xs font-bold text-tropical-cyan gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <Activity className="w-4 h-4" />
                                        VER ESTADO DEL PEDIDO
                                    </div>
                                </div>

                                {/* Status y Precio */}
                                <div className="text-right">
                                    <p className="font-bold text-xl">{order.total}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${getStatusColor(order.status).badge}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <ChevronRight className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            {/* --- MODAL: DETALLES DEL PEDIDO --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#121212] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200">

                        {/* Header del Modal */}
                        <div className="sticky top-0 bg-[#121212]/95 backdrop-blur-md border-b border-white/5 p-6 flex justify-between items-center z-10">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    Pedido {selectedOrder.id}
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status).badge}`}>{selectedOrder.status}</span>
                                </h3>
                                <p className="text-zinc-400 text-sm">Realizado el {selectedOrder.date}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-10">

                            {/* --- TRACKER DE PROGRESO --- */}
                            <section className="bg-zinc-900/50 rounded-2xl p-6 border border-white/5 overflow-x-auto">
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-tropical-cyan">
                                    <Package className="w-5 h-5" /> Seguimiento de Producción
                                </h4>

                                <div className="flex items-center justify-between min-w-[600px] relative">
                                    {/* Linea conectora de fondo */}
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -translate-y-1/2 z-0"></div>

                                    {/* Linea de progreso activa */}
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-tropical-yellow via-tropical-orange to-tropical-pink -translate-y-1/2 z-0 transition-all duration-1000"
                                        style={{ width: `${((selectedOrder.step - 1) / (ORDER_STEPS.length - 1)) * 100}%` }}
                                    ></div>

                                    {ORDER_STEPS.map((step) => {
                                        const isCompleted = step.number <= selectedOrder.step;
                                        const isCurrent = step.number === selectedOrder.step;
                                        const Icon = step.icon;

                                        return (
                                            <div key={step.number} className="relative z-10 flex flex-col items-center gap-3 group">
                                                <div
                                                    className={`
                                                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                                        ${isCurrent
                                                            ? 'bg-black border-tropical-cyan text-tropical-cyan scale-125 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                                                            : isCompleted
                                                                ? 'bg-zinc-900 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                                                : 'bg-zinc-900 border-zinc-700 text-zinc-600'}
                                                    `}
                                                >
                                                    {isCompleted && !isCurrent ? (
                                                        <CheckCircle className="w-5 h-5" />
                                                    ) : (
                                                        <Icon className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <span
                                                    className={`
                                                        text-xs font-bold w-24 text-center transition-colors
                                                        ${isCurrent ? 'text-white' : isCompleted ? 'text-green-400' : 'text-zinc-600'}
                                                    `}
                                                >
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* 1. VISUALIZACIÓN (Aprobación) */}
                            <section>
                                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-tropical-cyan">
                                    <ImageIcon className="w-5 h-5" /> Arte y Visualización
                                </h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Vista Superior (Diseño) */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-zinc-500 uppercase">Vista Superior (Diseño)</p>
                                        <div className="aspect-square relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900 group">
                                            {/* Placeholder de imagen */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                                                <Image src="/logo.png" width={40} height={40} alt="placeholder" className="opacity-20 mb-2 invert" />
                                                <span className="text-xs">Vista Previa Generada</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-full bg-white text-black py-2 rounded-lg font-bold text-sm">Ampliar</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Render 3D */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-zinc-500 uppercase">Render Fotorealista</p>
                                        <div className="aspect-square relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900 group">
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                                                <Image src="/logo.png" width={40} height={40} alt="placeholder" className="opacity-20 mb-2 invert" />
                                                <span className="text-xs">Render 3D</span>
                                            </div>
                                            <div className="absolute bg-tropical-pink/20 text-tropical-pink text-xs font-bold px-3 py-1 rounded-full top-4 right-4 border border-tropical-pink/50">
                                                Premium
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 2. DOCUMENTOS (Facturas y Proformas) */}
                            <section>
                                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-tropical-yellow">
                                    <FileText className="w-5 h-5" /> Documentación Legal
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">

                                    {/* Proforma Card */}
                                    <div className="p-4 bg-zinc-900 rounded-xl border border-white/5 flex items-center justify-between hover:border-tropical-yellow/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">Proforma Aprobada</p>
                                                <p className="text-xs text-zinc-500">{selectedOrder.documents.proforma}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Factura Card */}
                                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${selectedOrder.documents.invoice ? 'bg-zinc-900 border-white/5 hover:border-green-500/30' : 'bg-black/40 border-dashed border-zinc-800 opacity-60'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${selectedOrder.documents.invoice ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">Factura Electrónica</p>
                                                <p className="text-xs text-zinc-500">{selectedOrder.documents.invoice || 'Pendiente de emisión'}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.documents.invoice && (
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            )}

            <FloatingWhatsApp />
        </div>
    );
}

// Helper para colores de estado
function getStatusColor(status: OrderStatus) {
    switch (status) {
        case 'Producción':
            return { bg: 'bg-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/20' };
        case 'Entregado':
            return { bg: 'bg-green-500/20', text: 'text-green-400', badge: 'bg-green-500/20 text-green-300 border border-green-500/20' };
        case 'Enviado':
            return { bg: 'bg-indigo-500/20', text: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20' };
        default:
            return { bg: 'bg-zinc-800', text: 'text-zinc-400', badge: 'bg-zinc-800 text-zinc-400 border border-zinc-700' };
    }
}
