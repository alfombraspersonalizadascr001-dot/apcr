'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Inbox, Star, Trash2, RefreshCw, Plus, Search, ChevronRight, ChevronLeft, LogOut, Settings, AlertCircle, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface EmailAccount {
    id: string;
    account_name: string;
    email: string;
    account_type: 'gmail' | 'imap' | 'outlook';
    imap_host?: string;
    imap_port?: number;
    imap_secure?: boolean;
    imap_user?: string;
    imap_pass?: string;
    gmail_refresh_token?: string;
    outlook_refresh_token?: string;
}

interface EmailMessage {
    id: string;
    from: string;
    subject: string;
    date: string;
    preview: string;
    read: boolean;
    starred: boolean;
}

export default function EmailClient() {
    const [accounts, setAccounts] = useState<EmailAccount[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<EmailAccount | null>(null);
    const [emails, setEmails] = useState<EmailMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newAccount, setNewAccount] = useState<Partial<EmailAccount>>({
        account_type: 'imap',
        imap_port: 993,
        imap_secure: true
    });

    useEffect(() => {
        loadAccounts();

        // Handle success/error messages from OAuth2 redirects
        const params = new URLSearchParams(window.location.search);
        const success = params.get('success');
        const error = params.get('error');
        const details = params.get('details');

        if (success === 'outlook_connected') {
            alert('¡Cuenta de Outlook conectada con éxito! 🎉');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (success === 'gmail_connected') {
            alert('¡Cuenta de Gmail conectada con éxito! 🎉');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (error) {
            alert(`Error de conexión: ${error}${details ? ` - ${details}` : ''}`);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const loadAccounts = async () => {
        const { data, error } = await supabase
            .from('email_accounts')
            .select('*')
            .eq('is_active', true);

        if (error) {
            console.error('Error loading accounts:', error);
        }

        if (data) {
            setAccounts(data);
            if (data.length > 0 && !selectedAccount) setSelectedAccount(data[0]);
        }
    };

    const fetchEmails = async () => {
        if (!selectedAccount) return;
        setLoading(true);

        try {
            const response = await fetch('/api/email/fetch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account: selectedAccount })
            });
            const data = await response.json();
            if (data.emails) {
                setEmails(data.emails);
            } else if (data.error) {
                console.error(data.error);
                alert(data.error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let userId = document.cookie.split('; ').find(row => row.startsWith('crm_user_id='))?.split('=')[1];

        if (!userId) {
            // Fallback: fetch the admin user ID if cookie is missing
            const { data: adminUser } = await supabase
                .from('crm_users')
                .select('id')
                .eq('account_number', 'admin')
                .single();
            if (adminUser) userId = adminUser.id;
        }

        if (!userId) {
            alert('Error: No se pudo determinar el ID de usuario. Por favor, re-inicia sesión.');
            setSaving(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('email_accounts')
                .insert([{
                    ...newAccount,
                    user_id: userId
                }])
                .select();

            if (error) {
                console.error('Error adding account:', error);
                setSaving(false);
                return;
            }

            setAccounts([...accounts, ...data]);
            setShowAccountModal(false);
            setSaving(false);
            setNewAccount({ account_type: 'imap', imap_port: 993, imap_secure: true });
        } catch (error) {
            console.error('Save error:', error);
            setSaving(false);
        }
    };

    const handleDeleteAccount = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('¿Estás seguro de que deseas eliminar esta cuenta de correo?')) return;

        try {
            const { error } = await supabase
                .from('email_accounts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setAccounts(accounts.filter(acc => acc.id !== id));
            if (selectedAccount?.id === id) {
                setSelectedAccount(accounts.length > 1 ? accounts.find(a => a.id !== id) || null : null);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error al eliminar la cuenta');
        }
    };
    useEffect(() => {
        fetchEmails();
    }, [selectedAccount]);

    return (
        <div className="flex bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xl" style={{ height: 'calc(100vh - 180px)' }}>
            {/* Accounts Sidebar */}
            <div className="w-20 lg:w-64 bg-slate-50 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                    <h3 className="font-black text-lg hidden lg:block tracking-tight dark:text-zinc-100">CORREOS</h3>
                    <button
                        onClick={() => setShowAccountModal(true)}
                        className="p-2 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {accounts.map(acc => (
                        <div key={acc.id} className="group relative">
                            <button
                                onClick={() => setSelectedAccount(acc)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedAccount?.id === acc.id
                                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                                    : 'hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                                    }`}
                            >
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <div className="text-left hidden lg:block overflow-hidden flex-1">
                                    <p className="text-sm font-bold truncate">{acc.account_name}</p>
                                    <p className="text-[10px] opacity-60 truncate">{acc.email}</p>
                                </div>
                            </button>
                            <button
                                onClick={(e) => handleDeleteAccount(acc.id, e)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Eliminar cuenta"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                    <button className="flex items-center gap-3 text-sm font-medium text-slate-500 hover:text-amber-500 transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="hidden lg:block">Configuración</span>
                    </button>
                </div>
            </div>

            {/* Email List */}
            <div className="w-full lg:w-[400px] border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar en buzón..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-900 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchEmails}
                        className={`p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-all ${loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Cargando correos...</div>
                    ) : (
                        emails.map(email => (
                            <button
                                key={email.id}
                                onClick={() => setSelectedEmail(email)}
                                className={`w-full p-4 border-b border-slate-100 dark:border-zinc-900 text-left hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-all ${selectedEmail?.id === email.id ? 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-l-amber-500' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <p className={`text-sm ${!email.read ? 'font-black dark:text-white' : 'font-medium dark:text-zinc-300'}`}>{email.from}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-zinc-500">{email.date}</p>
                                </div>
                                <p className={`text-xs truncate ${!email.read ? 'text-slate-900 dark:text-zinc-100 font-bold' : 'text-slate-500 dark:text-zinc-400'}`}>
                                    {email.subject}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-zinc-500 truncate mt-1">{email.preview}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Email View */}
            <div className="hidden lg:flex flex-1 flex-col bg-slate-50/50 dark:bg-zinc-900/20">
                {selectedEmail ? (
                    <>
                        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold dark:text-white">{selectedEmail.subject}</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs">
                                        {selectedEmail.from[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-zinc-200">{selectedEmail.from}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">Para: {selectedAccount?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 transition-all">
                                    <Star className={`w-5 h-5 ${selectedEmail.starred ? 'fill-amber-500 text-amber-500' : ''}`} />
                                </button>
                                <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 min-h-[300px]">
                                <p className="whitespace-pre-wrap text-slate-700 dark:text-zinc-300">
                                    {selectedEmail.preview}
                                    {"\n\n"}
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    {"\n\n"}
                                    Saludos cordiales,
                                    {"\n"}
                                    Equipo de Soporte
                                </p>
                            </div>

                            <div className="mt-6 flex flex-col gap-4">
                                <textarea
                                    className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-amber-500/20 min-h-[150px] text-sm"
                                    placeholder="Escribe tu respuesta aquí..."
                                />
                                <div className="flex justify-end">
                                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl">
                                        <Send className="w-4 h-4" /> Enviar Respuesta
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <Mail className="w-16 h-16 mb-4 opacity-10" />
                        <h2 className="text-lg font-medium">Selecciona un correo para leer</h2>
                        <p className="text-sm max-w-xs mt-2">Gestiona todas tus cuentas de Gmail y dominio privado en un solo lugar.</p>
                    </div>
                )}
            </div>

            {/* Account Modal */}
            {showAccountModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950">
                            <h3 className="font-black text-xl dark:text-white">Configurar Cuenta</h3>
                            <button onClick={() => setShowAccountModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddAccount} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">Nombre de la Cuenta</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ej: Ventas APCR"
                                    className="w-full p-3 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                                    value={newAccount.account_name || ''}
                                    onChange={e => setNewAccount({ ...newAccount, account_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">Dirección de Correo</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="ventas@apcr.online"
                                    className="w-full p-3 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                                    value={newAccount.email || ''}
                                    onChange={e => setNewAccount({ ...newAccount, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">Tipo de Cuenta</label>
                                    <select
                                        className="w-full p-3 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                                        value={newAccount.account_type}
                                        onChange={e => setNewAccount({ ...newAccount, account_type: e.target.value as 'gmail' | 'imap' | 'outlook' })}
                                    >
                                        <option value="imap" className="dark:bg-zinc-900">IMAP (Empresarial/Hostinger)</option>
                                        <option value="gmail" className="dark:bg-zinc-900">Gmail</option>
                                        <option value="outlook" className="dark:bg-zinc-900">Outlook / Office 365</option>
                                    </select>
                                </div>
                                {newAccount.account_type === 'imap' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">Puerto IMAP</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                                            value={newAccount.imap_port}
                                            onChange={e => setNewAccount({ ...newAccount, imap_port: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}
                            </div>

                            {newAccount.account_type === 'imap' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">Servidor IMAP (Host)</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="imap.hostinger.com"
                                            className="w-full p-3 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                                            value={newAccount.imap_host || ''}
                                            onChange={e => setNewAccount({ ...newAccount, imap_host: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">Usuario IMAP</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full p-3 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                                                value={newAccount.imap_user || ''}
                                                onChange={e => setNewAccount({ ...newAccount, imap_user: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase mb-1">Password IMAP</label>
                                            <input
                                                required
                                                type="password"
                                                className="w-full p-3 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                                                value={newAccount.imap_pass || ''}
                                                onChange={e => setNewAccount({ ...newAccount, imap_pass: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                                        <AlertCircle className="w-5 h-5 mb-2" />
                                        <p>Para {newAccount.account_type === 'gmail' ? 'Gmail' : 'Outlook'}, debemos vincular tu cuenta vía OAuth2 de forma segura.</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const baseUrl = newAccount.account_type === 'gmail'
                                                ? 'https://accounts.google.com/o/oauth2/v2/auth'
                                                : 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';

                                            const params = new URLSearchParams({
                                                client_id: newAccount.account_type === 'gmail'
                                                    ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
                                                    : process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || '',
                                                redirect_uri: `${window.location.origin}/api/auth/callback/${newAccount.account_type}`,
                                                response_type: 'code',
                                                scope: newAccount.account_type === 'gmail'
                                                    ? 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email'
                                                    : 'offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.Send User.Read',
                                                access_type: 'offline',
                                                prompt: 'consent',
                                                state: crypto.randomUUID()
                                            });

                                            window.location.href = `${baseUrl}?${params.toString()}`;
                                        }}
                                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl ${newAccount.account_type === 'gmail'
                                            ? 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700'
                                            : 'bg-[#00a4ef] text-white hover:bg-[#008bcb]'
                                            }`}
                                    >
                                        {newAccount.account_type === 'gmail' ? (
                                            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="" />
                                        ) : (
                                            <Mail className="w-5 h-5" />
                                        )}
                                        Conectar con {newAccount.account_type === 'gmail' ? 'Google' : 'Microsoft'}
                                    </button>
                                </div>
                            )}

                            <button
                                disabled={saving}
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-2"
                            >
                                {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                {saving ? 'Guardando...' : 'Guardar Configuración'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
