"use client";

import Header from "../components/Header";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";

// Imágenes base (reales)
const BASE_IMAGES = [
    "/portfolio-surf.jpg",
    "/portfolio-rehab.jpg",
    "/portfolio-electro.jpg",
    "/portfolio-pizza.jpg",
    "/portfolio-outback.jpg",
    "/portfolio-las-palmeras.jpg",
    "/portfolio-monteverde.jpg",
    "/portfolio-mayi.jpg",
    "/portfolio-ulacit.jpg",
    "/portfolio-uisil.jpg",
    "/portfolio-uisil-2.jpg",
    "/portfolio-hotel-delfin.jpg",
    "/portfolio-costa-rider.jpg",
    "/portfolio-move-detailing.jpg",
    "/portfolio-iglesia-bautista.jpg",
    "/portfolio-carniceria-sossa.jpg",
    "/portfolio-comida-callejera.jpg",
    "/portfolio-materiales-ure.jpg",
    "/portfolio-moto-ventura.jpg",
    "/portfolio-la-chismosa.jpg",
    "/portfolio-carniceria-jrm.jpg",
    "/portfolio-pineapple-tour.jpg",
    "/portfolio-orthophysio.jpg",
    "/portfolio-elyon.jpg",
    "/portfolio-costa-pacifica.jpg"
];

// Generar lista de portfolio basada en las imágenes únicas
const PORTFOLIO_ITEMS = BASE_IMAGES.map((image, i) => ({
    id: i,
    image: image,
}));

export default function PortfolioPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans bg-[grid-white/0.05]">
            <Header />

            <main className="pt-24 pb-20">

                {/* Header de la Página */}
                <section className="px-6 max-w-7xl mx-auto mb-16 text-center">
                    <span className="text-tropical font-bold tracking-wider text-sm mb-4 block">MÁS DE 5,000 PROYECTOS ENTREGADOS</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Galería de <span className="text-tropical">Excelencia</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        No son solo alfombras. Son la imagen de miles de empresas exitosas.
                        Aquí una pequeña muestra de nuestro legado.
                    </p>
                </section>

                {/* Galería Masonry (Muro de Fotos) */}
                <section className="px-6 max-w-[1920px] mx-auto">
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                        {PORTFOLIO_ITEMS.map((item) => (
                            <div key={item.id} className="relative rounded-xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-tropical-cyan/50 transition-all duration-300 break-inside-avoid group">
                                {/* Imagen */}
                                <div className="relative w-full">
                                    <Image
                                        src={item.image}
                                        alt="Alfombra Personalizada"
                                        width={500}
                                        height={500}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                                    />
                                    {/* Brillo sutil al hover */}
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Final */}
                <section className="mt-32 px-6">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-zinc-900 to-black border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-tropical-pink/10 blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-tropical-cyan/10 blur-[100px] rounded-full" />

                        <h2 className="text-3xl font-bold mb-6 relative z-10">¿Listo para unirte a nuestra lista de clientes felices?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <a href="/register" className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 justify-center">
                                Crear Cuenta Corporativa
                            </a>
                            <a href="/contact" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 justify-center">
                                Contactar Ventas <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </section>

            </main>

            <FloatingWhatsApp />
        </div>
    );
}
