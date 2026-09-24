import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award, RotateCcw, AlertOctagon, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Garantías y Reembolsos | APCR Costa Rica",
  description: "Política de garantía de fábrica de 1 año, condiciones de reemplazo técnico y política de reembolsos para alfombras Nomad 3M de APCR.",
};

export default function ReembolsosPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans">
      {/* Header Corporativo */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a APCR</span>
          </Link>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
              Garantía Nomad 3M
            </span>
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              1 Año de Respaldo
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 space-y-10">
          
          {/* Título y Badge */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Garantía de Calidad y Política de Respaldo Técnico</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Política de Garantías y Reembolsos
            </h1>
            <p className="text-sm text-slate-500 font-mono">
              Estándares de Fabricación Industrial | Alfombras Personalizadas CR
            </p>
          </div>

          {/* Sección 1: Garantía de 1 año */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                01
              </span>
              Garantía de Fábrica de 1 Año en Alfombras Nomad
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              En APCR empleamos materia prima premium grado industrial (vinil tipo espagueti con respaldo y viniles de troquelado de alta densidad). Respaldamos nuestras alfombras corporativas con <strong>1 año de garantía total</strong> sobre defectos de fabricación:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                <p className="font-bold text-slate-900">Adherencia de Vinil</p>
                <p className="text-slate-600">Garantía contra desprendimiento prematuro de las letras o isotipos troquelados.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                <p className="font-bold text-slate-900">Respaldo Antideslizante</p>
                <p className="text-slate-600">Garantía sobre la integridad de la base vinílica en condiciones normales de uso.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <Award className="w-5 h-5 text-emerald-600 mb-1" />
                <p className="font-bold text-slate-900">Corte Milimétrico</p>
                <p className="text-slate-600">Exactitud garantizada respecto a la ficha técnica aprobada con cajetín.</p>
              </div>
            </div>
          </section>

          {/* Sección 2: Excepción por Producto a Medida */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                02
              </span>
              Naturaleza de Confección a Medida y Cancelaciones
            </h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                De conformidad con la Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor de Costa Rica (Ley N° 7472), el derecho de retracto común no es aplicable a bienes confeccionados conforme a las <strong>especificaciones personalizadas del cliente</strong> o claramente individualizados con marcas comerciales específicas.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                <p className="font-bold uppercase tracking-wider text-amber-800">
                  Condición de Corte y Anticipo:
                </p>
                <p>
                  Una vez que el cliente aprueba la Ficha Técnica y se realiza el corte del sustrato de alfombra en nuestro taller, el <strong>anticipo del 50% no es reembolsable</strong>, en razón de que el material ya ha sido seccionado e individualizado de forma irreversible.
                </p>
              </div>
            </div>
          </section>

          {/* Sección 3: Reemplazo Técnico */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                03
              </span>
              Reemplazo Técnico Integral sin Costo
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Si por un error imputable a nuestro proceso de producción la alfombra entregada difiere sustancialmente en dimensiones, color base o diseño respecto a la <strong>Ficha Técnica aprobada por el cliente</strong>, APCR procederá con la <strong>fabricación y entrega de una pieza completamente nueva sin costo adicional</strong> en un plazo prioritario de 3 a 5 días hábiles.
            </p>
          </section>

          {/* Sección 4: Exclusiones */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                04
              </span>
              Exclusiones de la Garantía
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              La garantía no cubre daños derivados de:
            </p>
            <ul className="text-sm text-slate-600 space-y-1.5 pl-4 list-disc marker:text-amber-500">
              <li>Uso de disolventes corrosivos, cloro puro, gasolina o ácidos para el lavado de la alfombra.</li>
              <li>Paso de maquinaria pesada no peatonal (montacargas, tractores) sobre alfombras no diseñadas para dicho fin.</li>
              <li>Cortes manuales con objetos punzocortantes realizados con posterioridad a la entrega.</li>
              <li>Desgaste natural de uso excesivo transcurrido el período de 1 año.</li>
            </ul>
          </section>

          {/* Sección 5: Procedimiento de Reclamo */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                05
              </span>
              Procedimiento Ágil de Validación Técnica
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Para tramitar una revisión de garantía, simplemente envíe fotografías nítidas y el comprobante de compra o número de orden a nuestro WhatsApp oficial (<strong>+506 7069-3708</strong> o <strong>+506 6063-8062</strong>) o al correo <strong>ventas@apcr.online</strong>. Un técnico emitirá resolución técnica en un máximo de 24 horas hábiles.
            </p>
          </section>

          {/* Enlaces a otros documentos */}
          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2026 APCR Costa Rica | Calidad Garantizada</span>
            <div className="flex items-center gap-4">
              <Link href="/privacidad" className="hover:text-slate-950 underline underline-offset-2">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-slate-950 underline underline-offset-2">
                Términos del Servicio
              </Link>
              <a
                href="https://gazestudio.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-950 font-bold"
              >
                Gaze Studio ↗
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
