import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad | APCR Costa Rica",
  description: "Tratamiento de datos personales conforme a la Ley N° 8968 y normativa PRODHAB para clientes de APCR y Gaze Studio.",
};

export default function PrivacidadPage() {
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
              Cumplimiento PRODHAB
            </span>
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              Ley N° 8968
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 space-y-10">
          
          {/* Título y Badge */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Garantía de Protección y Confidencialidad de Datos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Política de Privacidad y Tratamiento de Datos
            </h1>
            <p className="text-sm text-slate-500 font-mono">
              Última actualización: Septiembre 2026 | San José, República de Costa Rica
            </p>
          </div>

          {/* Sección 1: Responsable */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                01
              </span>
              Identidad del Responsable del Tratamiento
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              El presente sitio web y sus herramientas interactivas (incluyendo el Simulador de Alfombras y el Cajetín Técnico) son operados por <strong>Alfombras Personalizadas CR (APCR)</strong>, en sinergia tecnológica con su división de arquitectura digital <strong>Gaze Studio</strong> (
              <a
                href="https://gazestudio.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                gazestudio.dev
              </a>
              ). La protección de la privacidad de nuestros clientes empresariales y usuarios es un compromiso inquebrantable regido por la <strong>Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Ley N° 8968)</strong> de la República de Costa Rica y su Agencia de Protección de Datos de los Habitantes (PRODHAB).
            </p>
          </section>

          {/* Sección 2: Finalidad */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                02
              </span>
              Datos Recopilados y Finalidad Específica
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              APCR recopila y procesa exclusivamente aquellos datos indispensables para la cotización, diseño asistido, troquelado industrial, facturación electrónica y despacho de alfombras tipo Nomad de alto tránsito y soluciones de software:
            </p>
            <ul className="text-sm text-slate-600 space-y-2 pl-4 list-disc marker:text-amber-500">
              <li>
                <strong>Datos de contacto e identificación:</strong> Nombre de contacto o empresa, cédula física o jurídica, número de teléfono (WhatsApp corporativo) y correo electrónico.
              </li>
              <li>
                <strong>Activos de marca y diseño:</strong> Logotipos vectoriales o rasterizados, especificaciones dimensionales de alfombra y combinaciones cromáticas de vinil troquelado.
              </li>
              <li>
                <strong>Datos de entrega física:</strong> Dirección exacta de despacho en el Gran Área Metropolitana o envíos a nivel nacional vía Encomienda o Correos de Costa Rica.
              </li>
            </ul>
            <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <strong>Finalidad Legítima:</strong> Sus datos no serán vendidos, transferidos, cedidos ni expuestos a terceras partes ajenas a la ejecución directa de su orden de confección o servicio contratado.
            </p>
          </section>

          {/* Sección 3: Consentimiento */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                03
              </span>
              Consentimiento Expreso e Informado
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              En estricta conformidad con el Artículo 5 de la Ley N° 8968, toda recopilación de datos a través de nuestros formularios digitales, WhatsApp API o simuladores interactivos requiere la manifestación de voluntad libre, inequívoca, expresa e informada del titular, formalizada mediante la marcación de la casilla de aceptación obligatoria (opt-in no pre-marcado).
            </p>
          </section>

          {/* Sección 4: Derechos ARCO */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                04
              </span>
              Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Usted tiene pleno derecho a conocer qué datos personales conservamos, solicitar su actualización cuando sean inexactos o exigir su eliminación de nuestras bases de prospección comercial en cualquier momento. Para ejercer estos derechos, puede canalizar su solicitud formal a:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Canal Escrito Oficial
                </span>
                <a
                  href="mailto:ventas@apcr.online"
                  className="text-sm font-bold text-slate-900 hover:text-blue-600"
                >
                  ventas@apcr.online
                </a>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Atención Inmediata
                </span>
                <span className="text-sm font-bold text-slate-900">
                  +506 7069-3708 / +506 6063-8062
                </span>
              </div>
            </div>
          </section>

          {/* Sección 5: Cookies */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">
                05
              </span>
              Política de Cookies y Almacenamiento Local
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              APCR no utiliza cookies de rastreo publicitario intrusivo ni comercializa perfiles de navegación con redes de terceros. Las únicas cookies o registros de almacenamiento local (localStorage) empleados responden a fines estrictamente técnicos: memorizar preferencias de visualización del portal, almacenar el consentimiento legal y permitir la persistencia del diseño interactivo en el simulador 3D.
            </p>
          </section>

          {/* Enlaces a otros documentos */}
          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2026 APCR Costa Rica | Gaze Studio Architecture</span>
            <div className="flex items-center gap-4">
              <Link href="/terminos" className="hover:text-slate-950 underline underline-offset-2">
                Términos del Servicio
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
