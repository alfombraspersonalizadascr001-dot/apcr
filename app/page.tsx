import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { ShieldCheck, Truck, Star, Instagram, Facebook, Music } from "lucide-react";
import Image from "next/image";

import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col relative overflow-hidden font-sans">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="relative z-10 min-h-[500px] flex flex-col justify-center py-24 px-6 text-center overflow-hidden">

        {/* Banner Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-lifestyle.jpg"
            alt="Fondo Lifestyle Exótico"
            fill
            className="object-cover opacity-90"
            priority
          />
          {/* Gradient Overlay for Text Readability - Minimal opacity for maximum visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-white/80" />
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
            Las Mejores Alfombras <span className="text-tropical">Personalizadas</span>
            <br />del Mercado.
          </h1>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 mb-10 max-w-2xl mx-auto border border-white/40 shadow-sm">
            <p className="text-xl text-slate-900 font-medium">
              Ni más, ni menos. Simplemente somos los mejores.
              Calidad superior, diseño preciso y durabilidad garantizada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16 px-4">
            <Feature icon={Star} title="Líderes de Mercado" desc="La opción #1 elegida por empresas en Costa Rica." />
            <Feature icon={Truck} title="Envíos a Todo el País" desc="Llevamos tu imagen coporativa a la puerta de tu negocio." />
            <Feature icon={ShieldCheck} title="Calidad Superior" desc="Acabados impecables que resisten el alto tráfico." />
          </div>
        </div>
      </section>

      {/* Order Status Section */}
      <section id="tracking" className="relative z-10 py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left: Form */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-8 h-8 text-tropical-cyan" />
                <h2 className="text-3xl font-bold text-slate-900">Estado de mi Pedido</h2>
              </div>
              <p className="text-slate-600 mb-8">Ingresa tu usuario y contraseña para consultar el estado de tu pedido</p>

              <form className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                    Usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-tropical-cyan transition-colors text-slate-900 shadow-sm"
                    placeholder="Tu usuario"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-tropical-cyan transition-colors text-slate-900 shadow-sm"
                    placeholder="Tu contraseña"
                  />
                </div>

                <a
                  href="/dashboard"
                  className="w-full block text-center px-6 py-3 bg-tropical-gradient text-black font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Consultar Estado
                </a>

                <p className="text-center text-sm text-zinc-500">
                  ¿No tienes cuenta? <a href="/register" className="text-tropical-cyan hover:underline">Regístrate aquí</a>
                </p>
              </form>
            </div>

            {/* Right: Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/tracking-mat.jpg"
                alt="Alfombra Hospital Central"
                fill
                className="object-cover brightness-75"
                priority
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/20" />
            </div>

          </div>
        </div>
      </section>

      {/* Sobre Nosotros Section */}
      <section id="sobre-nosotros" className="relative z-10 py-24 px-6 overflow-hidden">
        {/* Background Images - Split */}
        <div className="absolute inset-0 z-0 flex">
          <div className="w-1/2 relative">
            <Image
              src="/about-1.jpg"
              alt="Proceso de fabricación"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="w-1/2 relative">
            <Image
              src="/about-2.jpg"
              alt="Alfombra personalizada"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Dark Overlay for Text Readability - Minimal - Reduced for carpet visibility */}
        <div className="absolute inset-0 bg-white/50 z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-tropical-yellow via-tropical-pink to-tropical-cyan bg-clip-text text-transparent">
            Sobre Nosotros
          </h2>

          <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
            <p className="text-4xl md:text-5xl font-handwriting mb-8 leading-tight">
              <span className="text-slate-900">Hola, somos Alfombras </span><span className="text-tropical">Personalizadas</span><br /><span className="text-slate-900">de Costa Rica</span>
            </p>

            <p>
              Somos los fabricantes de las alfombras atrapa-mugre más increíbles en Costa Rica.
              Nos apasiona lo que hacemos y lo hacemos con excelencia, nuestros trabajos hablan por nosotros.
            </p>

            <p>
              Nuestros clientes se vuelven nuestros amigos, somos afortunados de crear a partir de los logos
              de las empresas de nuestros clientes, así damos valor a sus marcas.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-tropical-gradient text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl hover:shadow-tropical-pink/50"
            >
              Contrátanos, Somos los Mejores
            </a>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-slate-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-sm">

          <div className="text-center md:text-left space-y-3">
            <p>© 2026 Alfombras Personalizadas CR.</p>
            <p>San José, Costa Rica. Todos los derechos reservados.</p>
            <div className="flex gap-3 justify-center md:justify-start mt-3">
              <a href="https://www.instagram.com/alfombraspersonalizadas.cr/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-pink hover:bg-tropical-pink/10 transition-all group shadow-sm">
                <Instagram className="w-6 h-6 text-slate-600 group-hover:text-tropical-pink transition-colors" />
              </a>
              <a href="https://www.facebook.com/alfombraspersonalizadascostarica" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-cyan hover:bg-tropical-cyan/10 transition-all group shadow-sm">
                <Facebook className="w-6 h-6 text-slate-600 group-hover:text-tropical-cyan transition-colors" />
              </a>
              <a href="https://www.tiktok.com/@alfombraspersonal" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-lg border border-slate-200 hover:border-tropical-yellow hover:bg-tropical-yellow/10 transition-all group shadow-sm">
                <Music className="w-6 h-6 text-slate-600 group-hover:text-tropical-yellow transition-colors" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-tropical-cyan/50 transition-colors shadow-sm">
            <Image src="/whatsapp-qr.png" alt="QR WhatsApp" width={64} height={64} className="bg-white rounded-lg p-1 border border-slate-200" />
            <div className="text-left">
              <p className="text-tropical-cyan font-bold text-xs uppercase tracking-wider mb-1">Atención Rápida</p>
              <p className="text-slate-500">Escanea para chatear</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

    </main>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:border-tropical-cyan/50 transition-all group">
      <Icon className="w-10 h-10 text-tropical-cyan mb-4 mx-auto group-hover:scale-110 transition-transform" />
      <h3 className="font-bold text-lg mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  )
}
