import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, CheckCircle2, Clock, Truck, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos del Servicio | APCR Costa Rica",
  description: "Condiciones de contratación, confección personalizada de alfombras Nomad 3M y licenciamiento de software APCR y Gaze Studio.",
};

export default function TerminosPage() {
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
              Marco Legal B2B / B2C
            </span>
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              Términos Comerciales
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 space-y-10">
          
          {/* Título y Badge */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5" />
              <span>Condiciones Generales de Contratación y Fabricación</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Términos del Servicio
            </h1>
            <p className="text-sm text-slate-500 font-mono">
              Vigentes a partir de Septiembre 2026 | Alfombras Personalizadas CR & Gaze Studio
            </p>
          </div>

          {/* Sección 1: Objeto */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                01
              </span>
              Naturaleza de los Servicios y Dualidad Corporativa
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Alfombras Personalizadas CR (APCR) ofrece el diseño, simulación digital, troquelado milimétrico y confección artesanal e industrial de alfombras para tránsito pesado y comercial (base tipo espagueti / Nomad de 3M). De manera complementaria, nuestra división tecnológica <strong>Gaze Studio</strong> provee la infraestructura de software, simuladores 3D, sistemas CRM y plataformas de conversión web corporativas.
            </p>
          </section>

          {/* Sección 2: Confección a Medida y Anticipo */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                02
              </span>
              Confección Personalizada y Política de Pagos (50% de Anticipo)
            </h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                Toda alfombra fabricada por APCR constituye una pieza <strong>100% personalizada y producida bajo pedido</strong> mediante corte láser/troquel de vinil y ensamblaje manual sobre base vulcanizada.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 space-y-2">
                <p className="font-semibold text-xs uppercase tracking-wider text-amber-800">
                  Condición Indispensable de Confección:
                </p>
                <p className="text-xs">
                  Para dar inicio al corte de materiales y programación en taller es <strong>obligatorio el pago del 50% de anticipo</strong> del valor total cotizado. El 50% restante deberá cancelarse contra entrega o previo al despacho si el envío se realiza vía encomienda fuera del GAM.
                </p>
              </div>
            </div>
          </section>

          {/* Sección 3: Aprobación de Ficha Técnica */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                03
              </span>
              Ficha Técnica, Cajetín y Aprobación de Arte
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Antes de iniciar la producción física, APCR enviará al cliente la <strong>Ficha Técnica Oficial con Cajetín</strong> (generada desde nuestro simulador de ingeniería). El cliente es responsable de verificar minuciosamente:
            </p>
            <ul className="text-sm text-slate-600 space-y-1.5 pl-4 list-disc marker:text-amber-500">
              <li>Dimensiones exactas exteriores (ancho y alto en centímetros).</li>
              <li>Color base de la alfombra y códigos de vinil troquelado.</li>
              <li>Ortografía, proporción y disposición del logotipo o isotipo.</li>
            </ul>
            <p className="text-xs text-slate-500 italic">
              La aprobación formal del arte vía WhatsApp o correo electrónico constituye la autorización definitiva para corte.
            </p>
          </section>

          {/* Sección 4: Tiempos de Entrega */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                04
              </span>
              Tiempos de Entrega y Envíos
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              El tiempo estándar de confección es de <strong>3 a 5 días hábiles</strong> a partir de la confirmación del anticipo y aprobación del arte final. Las entregas en el Gran Área Metropolitana (GAM) se coordinan directamente con el cliente; para envíos a zonas rurales o fuera de la meseta central, se canalizan por medio de encomiendas de transporte formalmente establecidas en Costa Rica.
            </p>
          </section>

          {/* Sección 5: Propiedad Intelectual */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                05
              </span>
              Propiedad Intelectual y Marcas de Clientes
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              El cliente garantiza ser titular legítimo o contar con la licencia requerida para reproducir las marcas, nombres comerciales y logotipos suministrados para el troquelado de las alfombras. APCR se reserva el derecho de fotografiar las alfombras terminadas con fines de exhibición en su portafolio institucional de clientes satisfechos, salvo indicación contractual expresa en contrario.
            </p>
          </section>

          {/* Sección 6: Licenciamiento de Software */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                06
              </span>
              Soluciones Digitales y Software Gaze Studio
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Las aplicaciones móviles, CRM y plataformas web desarrolladas por Gaze Studio para clientes de APCR están sujetas a los acuerdos de servicio individuales y a los estándares de disponibilidad técnica estipulados en{" "}
              <a
                href="https://gazestudio.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-semibold"
              >
                gazestudio.dev
              </a>.
            </p>
          </section>

          {/* Enlaces a otros documentos */}
          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2026 APCR Costa Rica | Todos los derechos reservados</span>
            <div className="flex items-center gap-4">
              <Link href="/privacidad" className="hover:text-slate-950 underline underline-offset-2">
                Política de Privacidad
              </Link>
              <Link href="/reembolsos" className="hover:text-slate-950 underline underline-offset-2">
                Garantías y Reembolsos
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
