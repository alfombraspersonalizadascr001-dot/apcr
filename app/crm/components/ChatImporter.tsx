
'use client';

import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { parseWhatsAppChat, WhatsAppMessage } from './WhatsAppParser';

interface ChatImporterProps {
    onImport: (chatName: string, messages: WhatsAppMessage[]) => void;
    onClose: () => void;
}

export default function ChatImporter({ onImport, onClose }: ChatImporterProps) {
    const [file, setFile] = useState<File | null>(null);
    const [parsedMessages, setParsedMessages] = useState<WhatsAppMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.txt')) {
            setError("Por favor sube un archivo .txt de WhatsApp.");
            return;
        }

        setFile(selectedFile);
        setError(null);

        const text = await selectedFile.text();
        try {
            const messages = parseWhatsAppChat(text);
            if (messages.length === 0) {
                setError("No se encontraron mensajes válidos. Verifica el formato del archivo.");
            } else {
                setParsedMessages(messages);
            }
        } catch (err) {
            setError("Error al leer el archivo.");
            console.error(err);
        }
    };

    const handleConfirm = () => {
        if (file && parsedMessages.length > 0) {
            // Usar el nombre del archivo como nombre del chat por defecto (sin extensión)
            const chatName = file.name.replace('.txt', '').replace('WhatsApp Chat con ', '');
            onImport(chatName, parsedMessages);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-500" /> Importar Historial
                </h3>

                <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-accent/50 transition-colors relative">
                        <input
                            type="file"
                            accept=".txt"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
                            <FileText className="w-8 h-8 opacity-50" />
                            <p className="text-sm">Arrastra tu archivo .txt aquí o haz click</p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {parsedMessages.length > 0 && (
                        <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-lg flex items-center justify-between">
                            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> {parsedMessages.length} mensajes encontrados</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={parsedMessages.length === 0}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Importar Chats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
