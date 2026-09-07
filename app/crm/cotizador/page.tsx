'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Copy, Plus, Trash2, Printer, ArrowLeft, User, Users, MapPin, FileText, MessageSquare, MessageCircle, Settings, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { cn } from "@/lib/utils";
import SidebarLayout from "../components/SidebarLayout";

function numeroALetras(num: number): string {
    if (!num || isNaN(num)) return 'CERO COLONES';
    const formatter = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' });
    return `SON: ${formatter.format(num).replace('CRC', '').trim()} COLONES EXACTOS`;
}

// Tipos
interface Producto {
    id: string;
    code: string;
    name: string;
    base_price: number;
    price_calculation_method: string;
}

interface LineItem {
    id: string;
    productCode: string;
    productName: string;
    width: number;
    height: number;
    quantity: number;
    description: string;
    unitPrice: number;
    total: number;
    hasRubberBorder: boolean;
    backgroundColor: string;
}

interface ClientData {
    id?: string;
    name: string;
    idNumber: string; // Cédula
    activityCode: string;
    phone: string;
    province: string;
    canton: string;
    district: string;
    neighborhood: string;
}

export default function CotizadorPage() {
    // --- ESTADO GLOBAL ---
    const emisor = {
        name: "YULIAN MARIA SANDOVAL JIMENEZ",
        businessName: "ALFOMBRAS PERSONALIZADAS DE COSTA RICA",
        id: "2-0643-0221",
        activity: "1393.0",
        email: "ventas@apcr.online",
        phone: "6063-8062",
        address: ""
    };

    // Configuración
    const [pricePerM2, setPricePerM2] = useState(66000);
    const [ivaRate, setIvaRate] = useState(0.13);

    // Datos Cliente (Extendido)
    const [client, setClient] = useState<ClientData>({
        name: '',
        idNumber: '',
        activityCode: '',
        phone: '',
        province: '',
        canton: '',
        district: '',
        neighborhood: ''
    });

    const [date, setDate] = useState('');
    const [proformaNumber, setProformaNumber] = useState('643');

    // Comentarios Editables
    const defaultComments = "✓ GARANTIA 2 AÑOS CONTRA DEFECTOS DE FÁBRICA\n✓ FORMA DE PAGO 50% ADELANTO Y 50% CONTRA ENTREGA";
    const [comments, setComments] = useState(defaultComments);
    const [deliveryTimeDays, setDeliveryTimeDays] = useState<number>(12);

    // Items
    const [items, setItems] = useState<LineItem[]>([]);
    const [inventoryProducts, setInventoryProducts] = useState<Producto[]>([]);

    // Inputs Item
    const [selectedProductCode, setSelectedProductCode] = useState('CUSTOM');
    const [customProductCode, setCustomProductCode] = useState('');
    const [customProductName, setCustomProductName] = useState('');
    const [tempWidth, setTempWidth] = useState<number | ''>('');
    const [tempHeight, setTempHeight] = useState<number | ''>('');
    const [tempQty, setTempQty] = useState<number>(1);
    const [tempUnitPrice, setTempUnitPrice] = useState<number>(0);
    const [tempDiscount, setTempDiscount] = useState<number>(0);
    const [autoPrice, setAutoPrice] = useState(true);
    const [hasRubberBorder, setHasRubberBorder] = useState(true);
    const [backgroundColor, setBackgroundColor] = useState('Negro');
    const [showClientForm, setShowClientForm] = useState(true);
    const [isDark, setIsDark] = useState(true);
    const [showConfig, setShowConfig] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Transferencia-Depósito Bancario');
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loggedInAgent, setLoggedInAgent] = useState<string>('');
    const [editMode, setEditMode] = useState(false);
    const [originalProformaId, setOriginalProformaId] = useState<string | null>(null);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [originalAuditLog, setOriginalAuditLog] = useState<any[]>([]);
    
    // --- BUSQUEDA DE CLIENTES ---
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const agentNameCookie = document.cookie.split('; ').find(row => row.startsWith('crm_agent_name='));
        if (agentNameCookie) {
            setLoggedInAgent(decodeURIComponent(agentNameCookie.split('=')[1]));
        }
    }, []);

    useEffect(() => {
        const handleThemeChange = () => {
            const savedTheme = localStorage.getItem('crm_theme') || 'light';
            setIsDark(savedTheme === 'dark');
        };
        window.addEventListener('themechange', handleThemeChange);
        handleThemeChange();

        // Fetch Inventory
        const fetchInventory = async () => {
            let res: any = await supabase
                .from('products')
                .select('id, code:sku, name, base_price, price_calculation_method')
                .eq('is_active', true)
                .order('name');

            if (res.error) {
                console.warn("Column price_calculation_method missing, retrying without it...");
                res = await supabase
                    .from('products')
                    .select('id, code:sku, name, base_price')
                    .eq('is_active', true)
                    .order('name');
            }

            if (res.data && !res.error) {
                setInventoryProducts(res.data);
                if (res.data.length > 0) {
                    setSelectedProductCode(res.data[0].code);
                }
            }
        };
        fetchInventory();

        return () => window.removeEventListener('themechange', handleThemeChange);
    }, []);

    const toggleTheme = () => {
        // Disabled theme toggle
    };

    const resetQuotation = () => {
        setItems([]);
        setIsSaved(false);
        fetchNextProformaNumber();
        alert("Formulario reiniciado. Se ha cargado el siguiente número consecutivo.");
    };

    const fetchNextProformaNumber = async () => {
        try {
            const { data, error } = await supabase
                .from('proformas')
                .select('proforma_number');

            if (!error && data && data.length > 0) {
                let maxNum = 749;
                data.forEach((p: any) => {
                    if (p.proforma_number) {
                        const n = parseInt(String(p.proforma_number).replace(/\D/g, ''), 10);
                        if (!isNaN(n) && n > maxNum) {
                            maxNum = n;
                        }
                    }
                });
                setProformaNumber(String(maxNum + 1));
            } else {
                setProformaNumber("750");
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const isAuth = document.cookie.includes('crm_authenticated=true');
        if (!isAuth) {
            router.push('/login');
        }
        
        const loadEdit = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const editId = queryParams.get('edit');
            const clientId = queryParams.get('clientId') || queryParams.get('client');

            if (editId) {
                setEditMode(true);
                setOriginalProformaId(editId);
                const { data, error } = await supabase.from('proformas').select('*, crm_users(*)').eq('id', editId).single();
                if (data) {
                    setDate(data.date || new Date().toLocaleDateString('es-CR'));
                    setProformaNumber(String(data.proforma_number));
                    setItems(data.items || []);
                    setComments(data.comments || defaultComments);
                    setDeliveryTimeDays(data.delivery_time_days || 12);
                    setOriginalTotal(data.total || 0);
                    setOriginalAuditLog(data.audit_log || []);
                    
                    if (data.crm_users || data.user_id) {
                        setClient({
                            id: data.crm_users?.id || data.user_id,
                            name: data.crm_users?.company_name || data.crm_users?.contact_name || '',
                            idNumber: data.crm_users?.cedula || '',
                            activityCode: data.crm_users?.activity_code || '',
                            phone: data.crm_users?.phone || '',
                            province: data.crm_users?.province || '',
                            canton: data.crm_users?.canton || '',
                            district: data.crm_users?.district || '',
                            neighborhood: data.crm_users?.neighborhood || ''
                        });
                        setShowClientForm(false);
                    }
                }
            } else if (clientId) {
                // Pre-cargar datos de un cliente existente
                const { data: clientData } = await supabase.from('crm_users').select('*').eq('id', clientId).single();
                if (clientData) {
                    setClient({
                        id: clientData.id,
                        name: clientData.company_name || clientData.contact_name || '',
                        idNumber: clientData.cedula || '',
                        activityCode: clientData.activity_code || '',
                        phone: clientData.phone || '',
                        province: clientData.province || '',
                        canton: clientData.canton || '',
                        district: clientData.district || '',
                        neighborhood: clientData.neighborhood || ''
                    });
                    setShowClientForm(false); // Ocultar formulario para ir directo a items
                }
                setDate(new Date().toLocaleDateString('es-CR'));
                fetchNextProformaNumber();
            } else {
                setDate(new Date().toLocaleDateString('es-CR'));
                fetchNextProformaNumber();
            }
        };

        loadEdit();
    }, [router]);

    // Calcular precio sugerido automáticamente
    useEffect(() => {
        if (autoPrice) {
            if (selectedProductCode === 'CUSTOM') {
                if (tempWidth && tempHeight) {
                    const areaM2 = (Number(tempWidth) * Number(tempHeight)) / 10000;
                    setTempUnitPrice(Math.round(areaM2 * pricePerM2));
                }
                return;
            }

            const product = inventoryProducts.find(p => p.code === selectedProductCode);
            if (product) {
                if (product.price_calculation_method === 'fixed' || product.price_calculation_method === 'per_unit') {
                    setTempUnitPrice(Number(product.base_price) || 0);
                } else if (product.price_calculation_method === 'per_m2' && tempWidth && tempHeight) {
                    const areaM2 = (Number(tempWidth) * Number(tempHeight)) / 10000;
                    const bPrice = Number(product.base_price) || pricePerM2;
                    setTempUnitPrice(Math.round(areaM2 * bPrice));
                }
            }
        }
    }, [tempWidth, tempHeight, pricePerM2, autoPrice, selectedProductCode, inventoryProducts]);
    
    // Búsqueda de clientes reactiva
    useEffect(() => {
        const query = client.name;
        if (!query || query.length < 3 || editMode || client.id) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            const { data } = await supabase
                .from('crm_users')
                .select('*')
                .or(`company_name.ilike.%${query}%,contact_name.ilike.%${query}%`)
                .limit(5);
            
            if (data) {
                setSearchResults(data);
                setShowResults(data.length > 0);
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [client.name, editMode, client.id]);

    const selectClient = (foundClient: any) => {
        setClient({
            id: foundClient.id,
            name: foundClient.company_name || foundClient.contact_name || '',
            idNumber: foundClient.cedula || '',
            activityCode: foundClient.activity_code || '',
            phone: foundClient.phone || '',
            province: foundClient.province || '',
            canton: foundClient.canton || '',
            district: foundClient.district || '',
            neighborhood: foundClient.neighborhood || ''
        });
        setShowResults(false);
        setShowClientForm(false);
    };

    // --- CALCULOS ---
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const iva = subtotal * ivaRate;
    const total = subtotal + iva;

    // --- ACCIONES ---
    const addItem = () => {
        if (!tempQty || Number(tempQty) <= 0) return;
        
        const isCustom = selectedProductCode === 'CUSTOM';
        const product = isCustom ? null : inventoryProducts.find(p => p.code === selectedProductCode);
        const isFixed = product?.price_calculation_method === 'fixed' || product?.price_calculation_method === 'per_unit';

        if (!isFixed && (!tempWidth || !tempHeight)) {
            alert('Por favor ingrese el ancho y el alto.');
            return;
        }
        if (selectedProductCode === 'CUSTOM' && (!customProductCode || !customProductName)) {
            alert('Por favor ingrese el código y el nombre del producto personalizado.');
            return;
        }

        const width = Number(tempWidth);
        const height = Number(tempHeight);
        const qty = Number(tempQty);

        let pCode = '';
        let pName = '';

        if (selectedProductCode === 'CUSTOM') {
            pCode = customProductCode || 'CUST';
            pName = customProductName || 'PRODUCTO PERSONALIZADO';
        } else {
            const product = inventoryProducts.find(p => p.code === selectedProductCode);
            pCode = product?.code || selectedProductCode;
            pName = product?.name || 'PRODUCTO DESCONOCIDO';
        }

        const unitPrice = Number(tempUnitPrice);
        const discount = Number(tempDiscount);
        const itemSubtotal = (unitPrice * qty) - discount;

        const desc = isFixed ? pName : `${pName} MEDIDA ${width}CM X ${height}CM`;

        const newItem: LineItem = {
            id: Date.now().toString(),
            productCode: pCode,
            productName: pName,
            width,
            height,
            quantity: qty,
            description: desc,
            unitPrice: unitPrice,
            total: itemSubtotal,
            hasRubberBorder,
            backgroundColor
        };

        setItems([...items, newItem]);
        setTempWidth('');
        setTempHeight('');
        setTempQty(1);
        setTempDiscount(0);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = `PROFORMA ${proformaNumber}`;
        window.print();
        document.title = originalTitle;
    };

    const sendWhatsAppQuotation = () => {
        let phone = (client.phone || '').replace(/[^0-9]/g, '');
        if (!phone) {
            const inputPhone = prompt("Por favor ingresa el número de WhatsApp del cliente (ej: 88888888):");
            if (!inputPhone) return;
            phone = inputPhone.replace(/[^0-9]/g, '');
        }

        if (phone.length === 8) {
            phone = '506' + phone;
        }

        const itemsText = items.map((item, index) => 
            `• *Ítem ${index + 1}:* ${item.quantity}x ${item.description || item.productName} (${item.width}x${item.height}cm) - ₡${item.total.toLocaleString()}`
        ).join('\n');

        const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://crm-plus-2-1.vercel.app';
        const pdfLink = `${appOrigin}/proformas?view=${proformaNumber}`;

        const message = `¡Hola *${client.name || 'Estimado(a) Cliente'}*! 👋

Le compartimos el detalle de su cotización formal de *Alfombras Personalizadas CR*:

📋 *Proforma Nº:* ${proformaNumber}
📅 *Fecha:* ${date || new Date().toLocaleDateString('es-CR')}
⏳ *Tiempo de entrega:* ${deliveryTimeDays} días hábiles

📦 *Detalle de Productos:*
${itemsText || '• Confección de alfombra personalizada con logo'}

💰 *Subtotal:* ₡${subtotal.toLocaleString()}
📊 *IVA (13%):* ₡${iva.toLocaleString()}
💵 *TOTAL:* ₡${total.toLocaleString()}

✨ *Condiciones de Venta:*
${comments}

📄 *Ver y Descargar Documento Oficial (PDF):*
${pdfLink}

📱 *Seguimiento de Producción:* Puede consultar el avance y fotomontaje de su pedido en tiempo real con su número de cuenta.

¿Gusta que procedamos con el fotomontaje / confección preliminar? Quedamos a su entera disposición. 🤝`;

        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    const fmt = (amount: number) =>
        new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 2 }).format(amount);

    const saveQuotation = async () => {
        if (!client.name || items.length === 0) {
            alert('Por favor complete los datos del cliente y agregue al menos un producto.');
            return;
        }

        setSaving(true);
        try {
            // 1. Buscar o Crear Cliente
            let userId = client.id || null;
            const cleanName = (client.name || '').trim();
            const cleanCedula = (client.idNumber || '').trim().replace(/[^0-9]/g, ''); // Solo números para comparar cédulas limpias

            // Búsqueda Robusta (Paso a paso si no hay ID directo)
            if (!userId && cleanCedula !== '') {
                const { data: byCedula } = await supabase
                    .from('crm_users')
                    .select('id')
                    .eq('cedula', (client.idNumber || '').trim()) // Buscamos tal cual se guardó
                    .limit(1);
                if (byCedula && byCedula.length > 0) userId = byCedula[0].id;
            }

            if (!userId && cleanName !== '') {
                const { data: byName } = await supabase
                    .from('crm_users')
                    .select('id')
                    .ilike('company_name', cleanName)
                    .limit(1);
                if (byName && byName.length > 0) userId = byName[0].id;
            }

            if (userId) {
                // Actualizar info del cliente existente
                await supabase.from('crm_users').update({
                    phone: client.phone || undefined,
                    cedula: (client.idNumber || '').trim() || undefined,
                    updated_at: new Date().toISOString()
                }).eq('id', userId);
            } else {
                // Generar número de cuenta infalible (Format: [F-]mes+año+consecutivo, e.g. ago26002)
                const basePrefix = loggedInAgent === 'Freelance' ? 'F-' : '';
                const now = new Date();
                const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
                const monthStr = months[now.getMonth()];
                const yearStr = String(now.getFullYear()).slice(-2);
                const fullPrefix = `${basePrefix}${monthStr}${yearStr}`;

                // Obtenemos TODOS los clientes en bloques para superar el límite de 1000 de Supabase
                const [batch1, batch2, batch3] = await Promise.all([
                    supabase.from('crm_users').select('account_number').range(0, 999),
                    supabase.from('crm_users').select('account_number').range(1000, 1999),
                    supabase.from('crm_users').select('account_number').range(2000, 2999)
                ]);

                const allExistingAccounts = [
                    ...(batch1.data || []),
                    ...(batch2.data || []),
                    ...(batch3.data || [])
                ].map(u => u.account_number || '');

                let maxNum = 0;
                allExistingAccounts.forEach(acc => {
                    if (acc) {
                        const trimmed = acc.trim();
                        const regex = new RegExp(`^${basePrefix}[a-z]{3}\\d{2}(\\d+)$`, 'i');
                        const match = trimmed.match(regex);
                        if (match) {
                            const n = parseInt(match[1]);
                            if (!isNaN(n) && n > maxNum) maxNum = n;
                        } else {
                            const cleanAcc = trimmed.replace(basePrefix, '');
                            const n = parseInt(cleanAcc.replace(/\D/g, ''));
                            if (!isNaN(n) && n < 1000 && n > maxNum) maxNum = n;
                        }
                    }
                });
                
                const nextNumStr = `${fullPrefix}${String(maxNum + 1).padStart(3, '0')}`;

                const clientInsertObj = {
                    account_number: nextNumStr,
                    company_name: cleanName,
                    contact_name: cleanName,
                    cedula: cleanCedula,
                    phone: client.phone,
                    role: 'client',
                    password: 'Admin' + nextNumStr.replace('-', ''),
                    province: client.province,
                    canton: client.canton,
                    district: client.district,
                    neighborhood: client.neighborhood,
                    activity_code: client.activityCode,
                    tags: ['cotizado'],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                let newUser: any = null;
                let userError: any = null;

                const tryInsert = await supabase
                    .from('crm_users')
                    .insert([{ ...clientInsertObj, assigned_to: loggedInAgent }])
                    .select()
                    .single();

                if (tryInsert.error && tryInsert.error.message.includes('assigned_to')) {
                    console.warn("Column assigned_to missing on crm_users, retrying without it...");
                    const retryInsert = await supabase
                        .from('crm_users')
                        .insert([clientInsertObj])
                        .select()
                        .single();
                    newUser = retryInsert.data;
                    userError = retryInsert.error;
                } else {
                    newUser = tryInsert.data;
                    userError = tryInsert.error;
                }

                if (userError) throw userError;
                userId = newUser.id;

                alert(`🎉 Se creó una nueva cuenta para este cliente en el CRM:\n🔑 Cuenta (Usuario): ${newUser.account_number}\n🔒 Contraseña inicial: ${newUser.password}`);
            }

            if (editMode && originalProformaId) {
                // Modificar Proforma Existente con Bitácora de Auditoría
                const auditEntry = {
                   type: 'AUDIT_LOG',
                   agent: loggedInAgent || 'Administrador',
                   date: new Date().toISOString(),
                   previous_total: originalTotal,
                   new_total: total,
                   changes_summary: `Actualizados ${items.length} productos. Total previo: ₡${Number(originalTotal).toLocaleString('es-CR')} ➔ Nuevo total: ₡${Number(total).toLocaleString('es-CR')}`,
                   message: `Modificación por ${loggedInAgent || 'Administrador'} el ${new Date().toLocaleString('es-CR')}`
                };
                
                // Obtener historial actual
                const { data: currentP } = await supabase.from('proformas').select('production_history').eq('id', originalProformaId).single();
                const currentHistory = Array.isArray(currentP?.production_history) ? currentP.production_history : [];
                const updatedHistory = [...currentHistory, auditEntry];
                
                const { error: updateError } = await supabase
                    .from('proformas')
                    .update({
                       user_id: userId,
                       proforma_number: proformaNumber,
                       date: date,
                       subtotal: subtotal,
                       iva: iva,
                       total: total,
                       items: items,
                       comments: comments,
                       delivery_time_days: deliveryTimeDays,
                       production_history: updatedHistory,
                       updated_at: new Date().toISOString()
                    }).eq('id', originalProformaId);
                    
                if (updateError) throw updateError;
                
                setIsSaved(true);
                setOriginalTotal(total);
                setOriginalAuditLog(updatedHistory.filter((h: any) => h.type === 'AUDIT_LOG'));
                alert(`✅ Cotización #${proformaNumber} ACTUALIZADA exitosamente con registro de auditoría.`);
            } else {
                // 2. Comprobar número de Proforma real
                const { data: allProformas } = await supabase
                    .from('proformas')
                    .select('proforma_number');

                let maxNum = 749;
                (allProformas || []).forEach((p: any) => {
                    if (p.proforma_number) {
                        const n = parseInt(String(p.proforma_number).replace(/\D/g, ''), 10);
                        if (!isNaN(n) && n > maxNum) {
                            maxNum = n;
                        }
                    }
                });

                let finalProformaNumber = proformaNumber ? String(Math.max(parseInt(proformaNumber) || 0, maxNum + 1)) : String(maxNum + 1);

                // 3. Guardar Proforma
                const { error: proformaError } = await supabase
                    .from('proformas')
                    .insert([{
                        user_id: userId,
                        proforma_number: finalProformaNumber,
                        date: date,
                        subtotal: subtotal,
                        iva: iva,
                        total: total,
                        items: items,
                        comments: comments,
                        delivery_time_days: deliveryTimeDays,
                        status: 'COTIZACIÓN',
                        production_status: 'COTIZACION',
                        production_history: [{ status: 'COTIZACION', completed_at: new Date().toISOString() }],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }]);

                if (proformaError) throw proformaError;

                const nextProformaNum = String(parseInt(finalProformaNumber) + 1);
                setProformaNumber(nextProformaNum);
                setIsSaved(true);

                alert(`✅ Cotización #${finalProformaNumber} guardada exitosamente.`);
            }

        } catch (error: any) {
            console.error('Error saving:', error);
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <SidebarLayout title="Cotizador / Proforma" badge="SISTEMA" badgeColor="amber">
            <div className="max-w-6xl mx-auto">
                {/* Header Control (NO IMPRIMIBLE) - Refactored for SidebarLayout */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                                <Calculator className="w-8 h-8 text-amber-500" /> Generador de Proformas
                            </h1>
                        </div>
                        <p className="text-[10px] font-black text-amber-500/80 mt-1 ml-1.5 uppercase tracking-[0.2em] animate-pulse">Cloud Connected ☁️</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {/* Theme toggle removed */}
                        <button onClick={() => setShowConfig(!showConfig)} className="px-4 py-2 bg-slate-700 dark:bg-zinc-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-zinc-700 text-sm flex items-center gap-2 font-medium">
                            <Settings className="w-4 h-4" /> {showConfig ? 'Cerrar Ajustes' : 'Ajustes'}
                        </button>
                        <Link
                            href="/admin"
                            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 flex items-center gap-2 text-sm font-bold transition-all shadow-sm"
                            title="Ver base de datos de Clientes / Admin"
                        >
                            <Users className="w-4 h-4" /> Clientes
                        </Link>
                        <button
                            onClick={saveQuotation}
                            disabled={saving || (isSaved && !editMode)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-bold transition-all ${isSaved && !editMode ? 'bg-slate-400 cursor-not-allowed' : (editMode ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white')} shadow-lg`}
                        >
                            <User className="w-4 h-4" /> {saving ? 'Guardando...' : (isSaved && !editMode ? 'Guardado ✓' : (editMode ? 'Actualizar Proforma' : 'Guardar en Nube'))}
                        </button>
                        {isSaved && (
                            <button
                                onClick={resetQuotation}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm flex items-center gap-2 font-bold shadow-lg animate-bounce"
                            >
                                <Plus className="w-4 h-4" /> Nueva Cotización
                            </button>
                        )}
                        <button
                            onClick={sendWhatsAppQuotation}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm flex items-center gap-2 font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                            title="Enviar proforma directamente al WhatsApp del cliente"
                        >
                            <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                        <button onClick={handlePrint} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm flex items-center gap-2 font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105">
                            <Printer className="w-4 h-4" /> Imprimir
                        </button>
                    </div>
                </div>

                {/* Panel de Configuración */}
                {showConfig && (
                    <div className="bg-card p-6 rounded-2xl shadow-xl border border-border mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-2">Precio por M² (CRC)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 font-bold">₡</span>
                                <input
                                    type="number"
                                    value={pricePerM2}
                                    onChange={e => setPricePerM2(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-200 text-slate-800 p-2 pl-7 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-2">IVA (%)</label>
                            <input
                                type="number"
                                value={ivaRate * 100}
                                onChange={e => setIvaRate(Number(e.target.value) / 100)}
                                className="w-full bg-white border border-slate-200 text-slate-800 p-2 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-2">Número Proforma Actual</label>
                            <input
                                type="text"
                                value={proformaNumber}
                                disabled={isSaved}
                                onChange={e => setProformaNumber(e.target.value)}
                                className={`w-full bg-white border border-slate-200 text-slate-800 p-2 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all ${isSaved ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isSaved ? "Número bloqueado tras guardado" : ""}
                            />
                        </div>
                    </div>
                )}

                {/* Formulario e Items (Solo Pantalla) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 print:hidden">
                    {/* Datos Cliente */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border lg:col-span-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-foreground flex items-center gap-2 text-xs uppercase tracking-widest">
                                <User className="w-4 h-4 text-amber-500" /> Cliente
                            </h3>
                            <button onClick={() => setShowClientForm(!showClientForm)} className="text-xs text-blue-500 font-bold hover:underline">
                                {showClientForm ? 'Ocultar' : 'Editar'}
                            </button>
                        </div>
                        {showClientForm && (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase block tracking-wider">Nombre / Razón Social</label>
                                        {client.id && (
                                            <span className="text-[9px] font-black bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full uppercase tracking-widest animate-in fade-in zoom-in duration-300">
                                                Cliente Registrado ✓
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input 
                                            value={client.name} 
                                            onChange={e => {
                                                // Reset ID if user types something else after selecting
                                                const newName = e.target.value;
                                                setClient({ ...client, name: newName, id: (client.id && newName !== client.name) ? undefined : client.id });
                                            }} 
                                            className="w-full border border-border bg-white text-slate-800 p-3 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-400" 
                                            placeholder="Nombre del Cliente o Empresa" 
                                            autoComplete="off"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        
                                        {showResults && (
                                            <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                                <div className="p-2 bg-slate-50 dark:bg-zinc-800/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                                                    Clientes Encontrados
                                                </div>
                                                {searchResults.map(r => (
                                                    <button
                                                        key={r.id}
                                                        onClick={() => selectClient(r)}
                                                        className="w-full text-left p-3 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex flex-col gap-0.5 border-b border-border last:border-0"
                                                    >
                                                        <span className="text-sm font-bold text-foreground">
                                                            {r.company_name || r.contact_name}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {r.account_number} • {r.cedula || 'Sin Cédula'}
                                                        </span>
                                                    </button>
                                                ))}
                                                <div className="p-2 bg-amber-500/5 text-amber-600 text-[10px] italic text-center font-medium">
                                                    Si no está en la lista, sigue escribiendo para crear uno nuevo.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-1">Cédula</label>
                                        <input value={client.idNumber} onChange={e => setClient({ ...client, idNumber: e.target.value })} className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="0-0000-0000" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-1">Teléfono</label>
                                        <input value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="8888-8888" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Medio de Pago</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={e => setPaymentMethod(e.target.value)}
                                            className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none"
                                        >
                                            <option value="Transferencia-Depósito Bancario">Transferencia</option>
                                            <option value="Pago con SINPE Móvil">SINPE Móvil</option>
                                            <option value="En efectivo">Efectivo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Entrega (Días Nat.)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={deliveryTimeDays}
                                            onChange={e => setDeliveryTimeDays(Number(e.target.value))}
                                            className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-2 flex items-center gap-1"><MessageSquare className="w-3 h-3 text-purple-500" /> Notas</label>
                                    <textarea
                                        value={comments}
                                        onChange={e => setComments(e.target.value)}
                                        className="w-full border border-slate-200 bg-white text-slate-800 p-3 rounded-lg text-xs h-32 outline-none resize-none focus:ring-2 focus:ring-amber-500 transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Agregar Productos */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                            <div className="md:col-span-3">
                                <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-1">Producto</label>
                                <select
                                    value={selectedProductCode}
                                    onChange={e => {
                                        setSelectedProductCode(e.target.value);
                                        setAutoPrice(true);
                                        const prod = inventoryProducts.find(p => p.code === e.target.value);
                                        if (prod && (prod.price_calculation_method === 'fixed' || prod.price_calculation_method === 'per_unit')) {
                                            setTempWidth('');
                                            setTempHeight('');
                                        }
                                    }}
                                    className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all appearance-none"
                                >
                                    {inventoryProducts.map(p => (
                                        <option key={p.code} value={p.code} className="dark:bg-zinc-900">{p.code} - {p.name}</option>
                                    ))}
                                    <option value="CUSTOM" className="dark:bg-zinc-900 font-bold text-amber-500">OTRO / PERSONALIZADO...</option>
                                </select>
                            </div>
                            
                            {selectedProductCode === 'CUSTOM' && (
                                <>
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-1">Cód. Personalizado</label>
                                        <input type="text" value={customProductCode} onChange={e => setCustomProductCode(e.target.value)} className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-1">Nom. Personalizado</label>
                                        <input type="text" value={customProductName} onChange={e => setCustomProductName(e.target.value)} className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-1">Ancho (cm)</label>
                                <input 
                                    type="number" 
                                    value={tempWidth} 
                                    onChange={e => setTempWidth(e.target.value === '' ? '' : Number(e.target.value))} 
                                    disabled={inventoryProducts.find(p => p.code === selectedProductCode)?.price_calculation_method === 'fixed'}
                                    className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-1">Alto (cm)</label>
                                <input 
                                    type="number" 
                                    value={tempHeight} 
                                    onChange={e => setTempHeight(e.target.value === '' ? '' : Number(e.target.value))} 
                                    disabled={inventoryProducts.find(p => p.code === selectedProductCode)?.price_calculation_method === 'fixed'}
                                    className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase block mb-1">Cant.</label>
                                <input type="number" value={tempQty} onChange={e => setTempQty(Number(e.target.value))} className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                            </div>
                            <div className="md:col-span-3">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Precio Unitario (₡)</label>
                                    <button onClick={() => setAutoPrice(!autoPrice)} className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors ${autoPrice ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {autoPrice ? 'AUTO' : 'MANUAL'}
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    value={tempUnitPrice}
                                    onChange={e => { setTempUnitPrice(Number(e.target.value)); setAutoPrice(false); }}
                                    className={`w-full border p-2 rounded-lg text-sm font-bold outline-none transition-all ${autoPrice ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-white text-amber-600 border-amber-500 focus:ring-2 focus:ring-amber-500'}`}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">¿Borde de Hule?</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <button
                                        onClick={() => setHasRubberBorder(true)}
                                        className={cn(
                                            "flex-1 py-1.5 rounded-md text-xs font-bold transition-all",
                                            hasRubberBorder ? "bg-white text-amber-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        SÍ
                                    </button>
                                    <button
                                        onClick={() => setHasRubberBorder(false)}
                                        className={cn(
                                            "flex-1 py-1.5 rounded-md text-xs font-bold transition-all",
                                            !hasRubberBorder ? "bg-white text-slate-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        NO
                                    </button>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Color de Fondo</label>
                                <select
                                    value={backgroundColor}
                                    onChange={e => setBackgroundColor(e.target.value)}
                                    className="w-full border border-slate-200 bg-white text-slate-800 p-2 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all appearance-none"
                                >
                                    {['Negro', 'Gris oscuro', 'Gris claro', 'Café oscuro', 'Amarillo', 'Azul oscuro', 'Azul rey', 'Celeste', 'Rosa', 'Fucsia', 'Rojo', 'Color vino', 'Naranja', 'Morado', 'Color Beige', 'Color verde lima', 'Color verde encendido', 'Color verde navidad', 'Color verde oscuro'].map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <button onClick={addItem} className="w-full bg-amber-500 hover:bg-amber-600 text-black rounded-xl p-3 flex items-center justify-center transition-all font-black text-sm shadow-lg shadow-amber-500/20 uppercase tracking-tighter">
                                    <Plus className="w-4 h-4 mr-2 stroke-[3]" /> Añadir Item
                                </button>
                            </div>
                        </div>

                        {/* Tabla Visual (Solo Pantalla) */}
                        <div className="mt-8 overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-800 text-slate-200 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="py-3 px-4 rounded-tl-lg">Producto</th>
                                        <th className="py-3 px-4 text-center">Medida</th>
                                        <th className="py-3 px-4 text-right">Cant.</th>
                                        <th className="py-3 px-4 text-right">Total</th>
                                        <th className="py-3 px-4 w-10 text-center rounded-tr-lg"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.length === 0 && (
                                        <tr><td colSpan={5} className="py-8 text-center text-slate-400 italic border-b border-slate-200">No hay items agregados</td></tr>
                                    )}
                                    {items.map(item => (
                                        <tr key={item.id} className="text-slate-800 hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 font-medium">{item.productName}</td>
                                            <td className="py-3 px-4 text-center font-mono text-slate-500">{item.width}x{item.height}</td>
                                            <td className="py-3 px-4 text-right text-slate-500">{item.quantity}</td>
                                            <td className="py-3 px-4 text-right font-bold text-slate-900">{fmt(item.total)}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- DOCUMENTO A4 IMPRIMIBLE --- */}
                <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] p-12 relative print:w-full print:max-w-none print:m-0 print:p-8 text-[11px] leading-tight text-slate-900">
                    {/* Header Factura */}
                    <header className="flex justify-between items-start mb-8 text-slate-800">
                        <div className="w-1/3">
                            <img src="/logo.png" alt="APCR Logo" className="w-48 h-auto object-contain mb-4" />
                        </div>
                        <div className="w-1/2 text-right space-y-1">
                            <h2 className="text-lg font-bold uppercase">{emisor.name}</h2>
                            <p className="font-bold text-slate-500 italic mb-4 text-xs">{emisor.businessName}</p>
                            <div className="grid grid-cols-[1fr_2fr] gap-x-2 text-[10px]">
                                <span className="font-bold">Cédula Física:</span><span>{emisor.id}</span>
                                <span className="font-bold">Actividad:</span><span>{emisor.activity}</span>
                                <span className="font-bold">Correo:</span><span className="lowercase">{emisor.email}</span>
                                <span className="font-bold">Teléfono:</span><span>{emisor.phone}</span>
                            </div>
                        </div>
                    </header>

                    {/* Meta Info */}
                    <div className="bg-slate-50 border-y border-slate-200 py-3 px-6 mb-6 text-[10px]">
                        <div className="grid grid-cols-2">
                            <div>
                                <p><span className="font-bold">Proforma Nº:</span> <span className="ml-2 font-mono font-bold text-amber-600">{proformaNumber}</span></p>
                                <p className="mt-1"><span className="font-bold">Fecha:</span> <span className="ml-2">{date}</span></p>
                                <p className="mt-1"><span className="font-bold">Tiempo de Entrega:</span> <span className="ml-2">{deliveryTimeDays} días naturales</span></p>
                            </div>
                            <div className="text-right">
                                <p><span className="font-bold">Medio de Pago:</span> <span className="ml-2">{paymentMethod}</span></p>
                                <p className="mt-1"><span className="font-bold">Estado:</span> <span className="ml-2">COTIZACIÓN</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Cliente */}
                    <div className="mb-8 pb-4 border-b border-slate-100">
                        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                            <span className="font-bold uppercase text-slate-400 text-[9px]">Cliente</span>
                            <span className="font-black text-sm uppercase">{client.name}</span>
                            <span className="font-bold uppercase text-slate-400 text-[9px]">Cédula</span>
                            <span>{client.idNumber || '-'}</span>
                            <span className="font-bold uppercase text-slate-400 text-[9px]">Teléfono</span>
                            <span>{client.phone || '-'}</span>
                        </div>
                    </div>

                    {/* Tabla de Items */}
                    <table className="w-full text-[10px] mb-8 border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white uppercase text-[9px] tracking-widest">
                                <th className="py-2.5 px-3 text-left w-24">Código</th>
                                <th className="py-2.5 px-3 text-center w-12">Cant.</th>
                                <th className="py-2.5 px-3 text-right w-24">Precio</th>
                                <th className="py-2.5 px-3 text-left">Descripción / Producto</th>
                                <th className="py-2.5 px-3 text-right w-24">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}>
                                    <td className="py-3 px-3 align-top font-bold">{item.productCode}-{item.width}X{item.height}</td>
                                    <td className="py-3 px-3 text-center align-top">{item.quantity}</td>
                                    <td className="py-3 px-3 text-right align-top">{fmt(item.unitPrice)}</td>
                                    <td className="py-3 px-3 uppercase align-top leading-relaxed text-[9px]">
                                        {item.description}
                                        <div className="text-[8px] text-slate-500 mt-1 font-bold">
                                            COLOR: {item.backgroundColor.toUpperCase()} • {item.hasRubberBorder ? 'CON BORDE DE HULE' : 'SIN BORDE DE HULE'}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-right align-top font-bold">{fmt(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer y Totales */}
                    <div className="flex justify-between items-start mt-8">
                        <div className="w-7/12">
                            <h4 className="font-bold text-[9px] uppercase text-slate-400 mb-2 border-b border-slate-100 pb-1">Términos y Condiciones</h4>
                            <div className="whitespace-pre-wrap text-[9px] uppercase leading-relaxed text-slate-600 font-mono pr-12">
                                {comments}
                            </div>
                        </div>
                        <div className="w-5/12">
                            <div className="space-y-2 mb-4 border-b border-slate-100 pb-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 uppercase font-bold text-[9px]">Subtotal Gravado</span>
                                    <span className="font-bold">{fmt(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 uppercase font-bold text-[9px]">Impuesto (13%)</span>
                                    <span className="font-bold">{fmt(iva)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-slate-900 text-white rounded">
                                <span className="font-black uppercase tracking-widest text-[10px]">Total Neto</span>
                                <span className="font-black text-lg">{fmt(total)}</span>
                            </div>
                            <p className="mt-3 text-[9px] font-bold text-right text-slate-400 italic">
                                {numeroALetras(total)}
                            </p>
                        </div>
                    </div>

                    {/* Despedida */}
                    <div className="mt-16 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">¡Gracias por confiar en APCR!</p>
                        <div className="border-t border-slate-100 pt-4 text-[8px] text-slate-400 uppercase tracking-widest">
                            Autorizado mediante resolución MH-DGT-RES-0027-2024. Versión 4.4
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}