
// Tipos para los mensajes
export interface WhatsAppMessage {
    date: Date;
    sender: string;
    content: string;
    isSystem: boolean; // Para mensajes como "Las llamadas y mensajes están cifrados..."
}

export interface ChatSession {
    participant: string;
    messages: WhatsAppMessage[];
}

/**
 * Función principal para parsear el texto de un archivo de WhatsApp
 * Soporta formatos comunes de iOS y Android (en español e inglés)
 */
export function parseWhatsAppChat(text: string): WhatsAppMessage[] {
    const lines = text.split('\n');
    const messages: WhatsAppMessage[] = [];

    // Regex para detectar líneas de inicio de mensaje
    // Formatos soportados:
    // [29/1/24, 15:30:00] Nombre: Mensaje
    // 29/1/24 15:30 - Nombre: Mensaje
    const regexIOS = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s(\d{1,2}:\d{2}:\d{2})\]\s(.*?):(.*)/;
    const regexAndroid = /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s(\d{1,2}:\d{2})\s-\s(.*?):(.*)/;

    let currentMessage: WhatsAppMessage | null = null;

    for (const line of lines) {
        let match = line.match(regexIOS) || line.match(regexAndroid);

        if (match) {
            // Si ya teníamos un mensaje procesándose, lo guardamos
            if (currentMessage) {
                messages.push(currentMessage);
            }

            // Extraer datos del nuevo mensaje
            const [_, dateStr, timeStr, sender, content] = match;

            // Intentar parsear la fecha (esto puede requerir ajustes según tu región)
            // Asumimos DD/MM/YYYY o MM/DD/YYYY según sea necesario, por defecto intentamos estándar
            const fullDateStr = `${dateStr} ${timeStr}`;
            let date = new Date(); // Fallback

            try {
                // Parseo manual básico para asegurar formato día/mes
                const parts = dateStr.split('/');
                const timeParts = timeStr.split(':');
                if (parts.length === 3) {
                    // Asumimos DD/MM/YYYY para español
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1; // Meses en JS son 0-11
                    const year = parseInt(parts[2].length === 2 ? '20' + parts[2] : parts[2]);

                    const hour = parseInt(timeParts[0]);
                    const minute = parseInt(timeParts[1]);
                    const second = timeParts.length > 2 ? parseInt(timeParts[2]) : 0;

                    date = new Date(year, month, day, hour, minute, second);
                }
            } catch (e) {
                console.warn("Error parseando fecha:", fullDateStr);
            }

            currentMessage = {
                date,
                sender: sender.trim(),
                content: content.trim(),
                isSystem: false
            };

        } else {
            // Línea multilínea (continuación del mensaje anterior)
            if (currentMessage) {
                currentMessage.content += '\n' + line.trim();
            }
        }
    }

    // Guardar el último mensaje
    if (currentMessage) {
        messages.push(currentMessage);
    }

    return messages;
}
