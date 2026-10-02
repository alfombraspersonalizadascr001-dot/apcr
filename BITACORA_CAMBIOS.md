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
* **Hallazgo Clave:** La página en producción real del usuario es `www.apcr.online`, la cual se despliega automáticamente desde el repositorio de GitHub (`origin/main`). Al no haberse hecho `git commit` y `git push` a `origin/main`, `www.apcr.online` no reflejaba los cambios.
* **Corrección de la "animalada" de diseño:**
  * Se restaura `app/crm/cotizador/page.tsx` a su estado original para eliminar los botones redundantes y dejar la botonera de cotizar limpia en una sola fila.
  * Se elimina el botón extra de la cabecera superior en `SidebarLayout.tsx`.
  * El acceso a **WhatsApp Leads** se mantiene estrictamente y de forma limpia en el **Menú Lateral Izquierdo** (sección *Herramientas*).
* **Acción para www.apcr.online:** Se procederá a hacer commit y push a GitHub (`main`) para que `www.apcr.online` reciba la actualización oficial limpia.



