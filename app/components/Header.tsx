
import Image from "next/image";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="font-bold text-xl tracking-tighter flex items-center gap-2">
                    <a href="/">
                        <Image src="/logo.png" alt="APCR Logo" width={48} height={48} className="w-12 h-12 object-contain invert" />
                    </a>
                </h1>
                <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
                    <a href="/portfolio" className="hover:text-white transition-colors">Nuestros Trabajos</a>
                    <a href="/#sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a>
                    <a href="/register" className="text-tropical font-bold hover:text-white transition-colors">Crear Cuenta</a>
                    <a href="/contact" className="hover:text-white transition-colors">Contacto</a>
                    <a href="/login" className="hover:text-white transition-colors border border-zinc-700 px-4 py-1 rounded-full hover:bg-zinc-800">Área Clientes</a>
                </nav>
            </div>
        </header>
    );
}
