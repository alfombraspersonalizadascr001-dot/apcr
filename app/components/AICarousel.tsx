"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
    "/ai-mats/media__1772424886748.png",
    "/ai-mats/media__1772424886811.png",
    "/ai-mats/media__1772424886953.png",
    "/ai-mats/media__1772424886961.jpg",
    "/ai-mats/media__1772424886962.png"
];

export default function AICarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[500px] rounded-2xl shadow-2xl overflow-hidden group">
            {IMAGES.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={src}
                        alt={`Diseño de Alfombra Inteligente ${index + 1}`}
                        fill
                        className="object-cover brightness-75"
                        priority={index === 0}
                    />
                </div>
            ))}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 z-20 pointer-events-none" />

            {/* Indicadores visuales */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
                {IMAGES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-tropical-cyan" : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Ver imagen ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
