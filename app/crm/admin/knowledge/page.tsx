"use client";

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Book, ChevronLeft, Search, FileText, Info, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KnowledgeBase() {
    const [content, setContent] = useState('');
    const [isDark, setIsDark] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const isAuth = document.cookie.includes('crm_authenticated=true');
        if (!isAuth) {
            router.push('/login');
            return;
        }

        fetch('/MANUAL_OPERACIONES.md')
            .then(res => res.text())
            .then(text => setContent(text))
            .catch(err => setContent("# Error\nNo se pudo cargar el manual."));

        // Initial theme from localStorage
        const savedTheme = localStorage.getItem('crm_theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(document.documentElement.classList.contains('dark'));
        }
    }, [router]);

    // Toggle Theme
    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('crm_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('crm_theme', 'light');
        }
    };

    const toc = content.match(/^##\s+(.+)$/gm)?.map((h: string, i: number) => ({
        id: `section-${i}`,
        title: h.replace(/^##\s+/, '')
    })) || [];

    // Inject IDs into content for linking (Quick hack for pure markdown without rehype plugins)
    // We replace "## Title" with "<h2 id='section-X'>Title</h2>" manually before passing to ReactMarkdown logic? 
    // No, ReactMarkdown doesn't parse HTML by default.
    // Better: split content by "## " and render sections?
    // Simplest: Just render the content. The "well designed" part comes from Typography.

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
            {/* Header / Nav */}
            <div className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <Link href="/" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 font-bold shadow-sm transition-all hover:scale-105">
                        <ChevronLeft className="w-5 h-5" /> Volver
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Book className="w-5 h-5 text-amber-500" />
                            Base de Conocimiento
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">Documentación Oficial de Operaciones</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 flex items-center justify-center transition-all text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700">
                        <Search className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-zinc-400">Buscar (Ctrl+F)</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 flex gap-8 items-start">

                {/* Sidebar Navigation */}
                <div className="w-72 shrink-0 hidden lg:block sticky top-24">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors duration-300">
                        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Contenido</h3>
                        </div>
                        <nav className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {toc.length > 0 ? toc.map((item: any, i: number) => (
                                <a
                                    key={i}
                                    href={`#`} // Anchors won't work easily without rehype-slug, so keeping it simple or just visual
                                    className="block px-3 py-2 text-sm text-slate-600 dark:text-zinc-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-300 rounded-lg transition-colors mb-1"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 font-mono text-xs opacity-50">{(i + 1).toString().padStart(2, '0')}</span>
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                </a>
                            )) : (
                                <p className="p-4 text-xs text-slate-400 italic">No se detectaron secciones.</p>
                            )}
                        </nav>
                        <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-700 text-xs text-slate-500 dark:text-zinc-500">
                            <FileText className="w-3 h-3 inline mr-1" />
                            {content.length} caracteres
                        </div>
                    </div>

                    <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4">
                        <h4 className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm mb-2">
                            <span className="p-1 bg-blue-100 dark:bg-blue-800 rounded"><Info className="w-4 h-4" /></span>
                            Para el Bot
                        </h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed font-medium">
                            Esta información es consumida automáticamente por el Asistente IA para generar respuestas a los clientes. Mantén este archivo actualizado.
                        </p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <article className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-8 md:p-12 transition-colors duration-300">
                        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none 
                            prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold 
                            prose-h1:text-3xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-slate-100 dark:prose-h1:border-zinc-800
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-amber-600 dark:prose-h2:text-amber-500
                            prose-h3:text-xl prose-h3:mt-8
                            prose-p:text-slate-600 dark:prose-p:text-zinc-300 prose-p:leading-relaxed
                            prose-li:text-slate-600 dark:prose-li:text-zinc-300
                            prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold
                            prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-50/30 dark:prose-blockquote:bg-amber-500/10 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                        ">
                            <ReactMarkdown>
                                {content}
                            </ReactMarkdown>
                        </div>
                    </article>

                    <div className="mt-8 text-center text-slate-400 text-sm">
                        &copy; 2026 Alfombras Personalizadas CR &mdash; Documento Confidencial
                    </div>
                </div>
            </div>
        </div>
    );
}
