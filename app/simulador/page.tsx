import React from 'react';
import Link from 'next/link';
import { MatSimulator } from '../components/MatSimulator';
import { ArrowLeft, Globe, Lock } from 'lucide-react';

export const metadata = {
  title: 'Diseñador & Simulador de Alfombras | APCR',
  description: 'Sube tu logo y genera la ficha técnica de producción con cajetín oficial y simulación 3D con Inteligencia Artificial.',
};

export default function SimuladorPublicPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-border bg-card/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Web</span>
            </Link>

            <span className="text-border">|</span>

            <span className="font-bold text-sm tracking-wider uppercase text-foreground">
              APCR // SIMULADOR
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/crm"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-mono transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso CRM</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Designer Section */}
      <main className="flex-1 py-8">
        <MatSimulator />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground font-mono">
        © {new Date().getFullYear()} APCR® Alfombras Personalizadas CR. Todos los derechos reservados.
      </footer>
    </div>
  );
}
