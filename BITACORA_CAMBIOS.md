# 📜 Bitácora Oficial de Cambios y Registro del Sistema

> **REGLA FUNDAMENTAL Y PERMANENTE DEL USUARIO:**
> **GUARDAR TODO EN BITÁCORA SIEMPRE EL 100% DE LAS VECES.**
> Todo avance, decisión técnica, archivo creado, archivo modificado, puerto, proceso y estado de datos DEBE quedar documentado de forma exhaustiva, clara y transparente antes y después de cada acción.

---

## 📅 [2026-10-02 03:10] - Módulo WhatsApp CRM 2 Columnas y Diagnóstico de Despliegue

### 🎯 1. Objetivo de la Sesión
* Implementar una bandeja de entrada para WhatsApp en el CRM con diseño idéntico al de WhatsApp Web, distribuida en dos columnas compactas (altura estricta de fila de 68px):
  * **Columna 1 (Leads Crudos / Bandeja de Entrada):** Mensajes entrantes directos de WhatsApp. Incluye botón de descarte rápido (basurero para ignorar proveedores o mensajes sin interés) y botón manual "Atender". **Regla:** Ningún contacto se crea en la base de datos de clientes hasta que se presione manualmente "Atender".
  * **Columna 2 (Contactos Calificados / CRM):** Contactos que ya fueron atendidos y pasados a clientes, con acceso directo a generarles cotización en el Cotizador y editar sus datos.
  * **Drawer de Chat:** Visualizador de la conversación completa al hacer clic en cualquier contacto.
* Integrar botones de acceso directo a esta pantalla desde el Cotizador y desde la barra de navegación lateral.

---

### 📂 2. Archivos Afectados (Auditoría Exacta)

#### A. Archivo Nuevo Creado:
* `D:\APCR-WEB-OFICIAL\app\crm\whatsapp\page.tsx`:
  * Interfaz completa de 2 columnas compactas estilo WhatsApp Web.
  * Consumo del servidor Baileys local (`http://localhost:4000/api/chats`, `/api/messages`, `/api/chat/:phone`).
  * Conexión con Supabase para listar clientes calificados y crear clientes nuevos únicamente bajo acción manual.

#### B. Archivos Modificados (Solo enlaces visuales agregados):
* `D:\APCR-WEB-OFICIAL\app\crm\cotizador\page.tsx`:
  * Se agregó el botón con enlace directo `<Link href="/crm/whatsapp">` con etiqueta "WhatsApp Leads" y color esmeralda en la barra superior de acciones, ubicado junto a Ajustes y Clientes.
* `D:\APCR-WEB-OFICIAL\app\crm\components\SidebarLayout.tsx`:
  * Se agregó la opción "WhatsApp Leads" en el menú de navegación lateral bajo la sección *Herramientas*.
  * Se agregó botón de acceso rápido en el encabezado superior con indicador de estado en vivo.
* `D:\APCR-WEB-OFICIAL\app\crm\page.tsx`:
  * Se agregó el enlace en la navegación del dashboard principal y un botón directo en el banner del Comando Central.

---

### 🛡️ 3. Integridad y Seguridad de Datos
* **Archivos Personales / Fotos / Sistema:** **0 modificaciones, 0 eliminaciones.** No se ejecutó ningún comando destructivo (`rm`, `del`, formateo ni limpieza de carpetas fuera del proyecto web). Las carpetas personales, fotos y documentos en `C:` y `D:` están 100% intactas.
* **Bases de Datos (Supabase):** No se ejecutaron migraciones destructivas, DROP, DELETE ni TRUNCATE. Las tablas de `clients`, `proformas`, `inventory` y configuraciones siguen con todos sus datos originales sin alteración.
* **Separación de Bots:** Se mantiene estricta separación entre el servidor de WhatsApp (Baileys) y el bot de Telegram (Robotín).

---

### 🔍 4. Diagnóstico Técnico del Botón "No Aparece"
* **Causa Raíz Identificada:**
  * El usuario estaba navegando en la URL: `https://crm-plus-25.vercel.app/crm/cotizador`.
  * En la cuenta de Vercel existen dos proyectos separados:
    1. **`crm-plus-2.5`**: Asociado al dominio `https://crm-plus-25.vercel.app` (su último despliegue tenía más de 37 días de antigüedad).
    2. **`apcr-web-oficial`**: Proyecto donde se subió la versión actualizada (`https://apcr-web-oficial-tau.vercel.app`).
  * Como el navegador del usuario tenía abierta la URL de `crm-plus-25.vercel.app`, los cambios recién desplegados no se veían allí porque ese proyecto en Vercel no había sido actualizado.
* **Rutas donde está la versión actualizada:**
  * Cotizador con botón: `https://apcr-web-oficial-tau.vercel.app/crm/cotizador`
  * Módulo WhatsApp 2 Columnas directo: `https://apcr-web-oficial-tau.vercel.app/crm/whatsapp`

---

### ⚙️ 5. Servicios y Procesos Activos en el Sistema
* **Servidor WhatsApp Baileys:** Puerto 4000 (PID 45860) — Estado: Conectado (`open`).
* **Servidor Local Gaze Studio:** Puerto 3005 (PID 58840).
* **Bot Telegram:** PID 25440.

---

### 📌 7. Diagnóstico de www.apcr.online y Corrección de Diseño
* **Causa Raíz Resuelta:** `www.apcr.online` se despliega desde GitHub `main`. Se sincronizó el repositorio local mediante el commit `76f06f2` y se ejecutó `git push origin main` hacia `https://github.com/alfombraspersonalizadascr001-dot/apcr.git`.
* **Corrección de Diseño en Cotizador:**
  * Se restauró `app/crm/cotizador/page.tsx` a su estado original: la botonera vuelve a estar en una sola fila limpia, sin botones de WhatsApp repetidos ni descuadres.
  * Se retiró el botón de WhatsApp flotante de la barra superior.
  * El acceso a **WhatsApp Leads** queda establecido limpia y exclusivamente en el **Menú Lateral Izquierdo** (sección *Herramientas*).
* **Despliegue de Producción:**
  * Despliegue en Vercel completado: `https://apcr-web-oficial-3pg6gud8e-crm-21.vercel.app`.
### 📌 8. Actualización de WhatsApp Server (Baileys) y Filtro Antispam
* **Corrección de Creación Automática de Leads:**
  * Se eliminó el lead de prueba creado automáticamente por un canal de noticias de la BBC (`120363172997847444`).
  * Se confirmó que **ningún mensaje entrante crea leads en Supabase** de forma automática; los prospectos permanecen en la Columna 1 hasta acción manual del usuario.
  * Se añadieron filtros estrictos para ignorar canales (`@newsletter`), transmisiones (`@broadcast`), estados y grupos (`@g.us`).
### 📌 9. Módulo Comercial de Vinculación de WhatsApp (SaaS Ready)
* **Requerimiento del Usuario:** Integrar el código QR de vinculación de WhatsApp directamente dentro de la interfaz del CRM (diseñado a nivel de producto comercializable para venta), eliminando la necesidad de abrir localhost:4000.
* **Componentes a Implementar:**
  1. **Renderizado de QR Nativo en el CRM:** Uso de `react-qr-code` en `app/crm/whatsapp/page.tsx` para mostrar el código QR dinámico en una tarjeta de bienvenida profesional.
  2. **Endpoint de Desvinculación en el Servidor:** Endpoint `POST /api/logout` en `server.js` para permitir desconectar y cambiar de número con 1 clic desde el CRM.
  3. **Control de Estado en Vivo:** Detección en tiempo real del estado (`connecting`, `open`, `disconnected`) con actualización inmediata de la interfaz.

---

### 📌 10. Arquitectura Cloud Bridge para QR y Chats Nativos en CRM (SaaS Ready)
* **Diagnóstico de Bloqueo de Navegador Identificado:**
  * Al acceder al CRM desde la web (`https://crm-plus-25.vercel.app` o `https://www.apcr.online`), el navegador bloquea las solicitudes a `http://localhost:4000` por políticas de seguridad de Google Chrome (CORS Private Network Access / Mixed Content: no permite llamadas desde HTTPS hacia IPs privadas de loopback).
  * Por esta razón, el código QR quedaba en "Generando..." dentro del CRM.
* **Solución SaaS de Nivel Comercial:**
  1. **Puente en Tiempo Real vía Supabase (`SYS_WHATSAPP`):**
     * `server.js` sincroniza en tiempo real su estado (`open`, `connecting`, `disconnected`), el string del código QR y el número de teléfono vinculado en el registro de sistema `SYS_WHATSAPP` en Supabase.
     * El CRM (`/crm/whatsapp`) se conecta vía Supabase HTTPS y escucha cambios en tiempo real, renderizando el código QR nativamente en el modal y actualizando las columnas sin depender de peticiones HTTP directas del navegador al puerto 4000.
  2. **Persistencia de Chats Entrantes en la Nube:**
     * `server.js` replica los mensajes y conversaciones de la Columna 1 hacia Supabase en la categoría `wa_incoming_chats`, permitiendo que el CRM cargue todos los mensajes entrantes de inmediato en cualquier dispositivo (computadora, tablet o celular).
  3. **Desvinculación y Renovación de QR con 1 Clic:**
     * Al hacer clic en "Desvincular" o "Actualizar QR" en el CRM, se envía la instrucción de reseteo a Supabase; el servidor Baileys borra la sesión antigua y genera un nuevo QR que se proyecta en el CRM en menos de 2 segundos.







