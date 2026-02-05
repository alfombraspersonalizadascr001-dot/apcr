"use client";

import { useState, useEffect } from 'react';
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

// --- DATOS MOCK INITIAL ---
const DEFAULT_CLIENT = {
    firstName: "Invitado",
    lastName: "",
    company: "Empresa Demo",
    email: "cliente@demo.com",
    mobilePhone: "+506 8888-8888"
};

const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-DEMO-001",
        date: "Hoy",
        status: "Producción",
        step: 2, // Corte
        total: "₡ 85,000",
        items: ["Alfombra Personalizada (100x80cm)"],
        images: {
            topView: "/mock-top.jpg",
            render: "/mock-render.jpg"
        },
        documents: {
            proforma: "#PRO-2026.pdf",
            invoice: null
        }
    }
];

export default function DashboardPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [clientData, setClientData] = useState(DEFAULT_CLIENT);

    useEffect(() => {
        // Cargar datos reales si el usuario se ha registrado
        const storedUser = localStorage.getItem('apcr_user');
        if (storedUser) {
            try {
                setClientData(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error reading user data", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans bg-[grid-slate-900/0.05]">
            <Header />

            <main className="pt-24 px-6 max-w-7xl mx-auto pb-20">

                {/* --- SECCIÓN 1: DATOS DEL CLIENTE --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-tropical font-bold tracking-wider text-sm">BIENVENIDO DE NUEVO</span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-slate-900">{clientData.firstName} {clientData.lastName}</h1>
                        <p className="text-xl text-slate-500 mt-2 flex items-center gap-2">
                            <span className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700 border border-slate-200 shadow-sm">{clientData.company}</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-slate-500 text-sm font-bold">CONTACTO REGISTRADO</p>
                            <p className="text-slate-700">{clientData.email}</p>
                            <p className="text-slate-700">{clientData.mobilePhone}</p>
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
                            className="group bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-6 transition-all cursor-pointer hover:border-tropical-cyan/50 relative overflow-hidden shadow-sm hover:shadow-md"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">

                                {/* Info Principal */}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${getStatusColor(order.status).bg}`}>
                                        <Package className={`w-6 h-6 ${getStatusColor(order.status).text}`} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg group-hover:text-tropical-cyan transition-colors text-slate-900">{order.id}</p>
                                        <p className="text-slate-500 text-sm">{order.date}</p>
                                    </div>
                                </div>

                                {/* Detalles Resumen */}
                                <div className="flex-1 md:px-12">
                                    <div className="flex flex-col gap-1 mb-3">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="text-slate-600 text-sm block">• {item}</span>
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

                                <ChevronRight className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            {/* --- MODAL: DETALLES DEL PEDIDO --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200">

                        {/* Header del Modal */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 p-6 flex justify-between items-center z-10">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                    Pedido {selectedOrder.id}
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status).badge}`}>{selectedOrder.status}</span>
                                </h3>
                                <p className="text-slate-500 text-sm">Realizado el {selectedOrder.date}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-10">

                            {/* --- TRACKER DE PROGRESO --- */}
                            <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200 overflow-x-auto">
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-tropical-cyan">
                                    <Package className="w-5 h-5" /> Seguimiento de Producción
                                </h4>

                                <div className="flex items-center justify-between min-w-[600px] relative">
                                    {/* Linea conectora de fondo */}
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

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
                                                            ? 'bg-white border-tropical-cyan text-tropical-cyan scale-125 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                                            : isCompleted
                                                                ? 'bg-white border-green-500 text-green-500 shadow-sm'
                                                                : 'bg-white border-slate-200 text-slate-300'}
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
                                                        ${isCurrent ? 'text-slate-900' : isCompleted ? 'text-green-600' : 'text-slate-400'}
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
                                        <p className="text-sm font-bold text-slate-500 uppercase">Vista Superior (Diseño)</p>
                                        <div className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                                            {/* Placeholder de imagen */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                <Image src="/logo.png" width={40} height={40} alt="placeholder" className="opacity-20 mb-2" />
                                                <span className="text-xs">Vista Previa Generada</span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-full bg-white text-black py-2 rounded-lg font-bold text-sm shadow-lg">Ampliar</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Render 3D */}
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-slate-500 uppercase">Render Fotorealista</p>
                                        <div className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                <Image src="/logo.png" width={40} height={40} alt="placeholder" className="opacity-20 mb-2" />
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
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:border-tropical-yellow/50 transition-colors shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">Proforma Aprobada</p>
                                                <p className="text-xs text-slate-500">{selectedOrder.documents.proforma}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Factura Card */}
                                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors shadow-sm ${selectedOrder.documents.invoice ? 'bg-white border-slate-200 hover:border-green-500/50' : 'bg-slate-50 border-dashed border-slate-300 opacity-60'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${selectedOrder.documents.invoice ? 'bg-green-500/10 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">Factura Electrónica</p>
                                                <p className="text-xs text-slate-500">{selectedOrder.documents.invoice || 'Pendiente de emisión'}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.documents.invoice && (
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
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
            return { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border border-blue-200' };
        case 'Entregado':
            return { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-100 text-green-700 border border-green-200' };
        case 'Enviado':
            return { bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700 border border-indigo-200' };
        default:
            return { bg: 'bg-slate-100', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-600 border border-slate-200' };
    }
}
