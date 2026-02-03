"use client";

import Image from "next/image";

export default function BrandingPage() {
    return (
        <div className="min-h-screen bg-black text-white p-12">

            {/* SECTION 1: THE CORE IDENTITY (User Request: Black BG, White Logo) */}
            <div className="max-w-6xl mx-auto mb-20 border-b border-white/10 pb-20">
                <div className="text-left mb-8">
                    <h1 className="text-5xl font-bold mb-2">Identidad Visual <span className="text-zinc-600">Final</span></h1>
                    <p className="text-xl text-zinc-400">Menos es Más. Silueta Pura.</p>
                </div>

                <div className="w-full bg-black border border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                    {/* Subtle Spotlight Effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/30 via-black to-black opacity-50" />

                    <div className="relative z-10 w-full max-w-lg aspect-video flex items-center justify-center">
                        {/* 
                    TECHNICAL FIX:
                    1. invert(1): Turns Black Text -> White Text, White BG -> Black BG.
                    2. mix-blend-screen: Makes the (now Black) BG transparent, keeps White Text.
                 */}
                        <div className="relative w-full h-full flex items-center justify-center mix-blend-screen">
                            <Image
                                src="/logo.png"
                                alt="AP Logo White"
                                width={500}
                                height={500}
                                className="object-contain invert"
                                priority
                            />
                        </div>
                    </div>

                    <div className="relative z-10 text-center mt-8">
                        <h2 className="text-3xl font-bold tracking-tight">Luxury Monochrome</h2>
                        <p className="text-zinc-500 mt-2 uppercasetracking-widest text-sm">Identidad Corporativa Principal</p>
                    </div>
                </div>
            </div>


            {/* SECTION 2: THE TROPICAL ENERGY (User Liked: Gradient) */}
            <div className="max-w-6xl mx-auto">
                <div className="text-left mb-8 flex items-end gap-4">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
                        Acentos Tropicales
                    </h2>
                    <div className="h-px bg-white/10 flex-grow mb-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* CARD 1: SUNSET GRADIENT - BLACK LOGO (Updated per request) */}
                    <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-3xl p-10 flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:scale-[1.01] transition-transform">
                        {/* mix-blend-multiply: Removes White BG, Keeps Black Logo */}
                        <div className="w-full aspect-video flex items-center justify-center mix-blend-multiply">
                            <Image
                                src="/logo.png"
                                alt="AP Logo Tropical Black"
                                width={300}
                                height={300}
                                className="object-contain" // No invert, keeps black
                            />
                        </div>
                        <div className="text-white text-center">
                            <h3 className="font-bold text-xl drop-shadow-md">Sunset Gradient</h3>
                            <p className="text-sm font-medium text-black/80 mt-1">Logo Negro para máximo contraste.</p>
                        </div>
                    </div>

                    {/* CARD 2: TURQUOISE CONTRAST */}
                    <div className="bg-cyan-500 rounded-3xl p-10 flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:scale-[1.01] transition-transform">
                        <div className="w-full aspect-video flex items-center justify-center mix-blend-screen">
                            <Image
                                src="/logo.png"
                                alt="AP Logo Turquoise"
                                width={300}
                                height={300}
                                className="object-contain invert"
                            />
                        </div>
                        <div className="text-white text-center">
                            <h3 className="font-bold text-xl">Caribbean Turquoise</h3>
                            <p className="text-sm opacity-90">Para destacar botones de acción y alertas.</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
