"use client";

import React, { useState } from 'react';
import { ArrowLeft, Check, Moon, Sun, MessageCircle } from 'lucide-react';

interface LogoShowcaseModalProps {
  onClose: () => void;
}

export const LogoShowcaseModal: React.FC<LogoShowcaseModalProps> = ({ onClose }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>(1);

  const options = [
    {
      id: 1,
      title: 'Opci?n 1: Mosaicos con Separaci?n (Estilo Microsoft)',
      desc: '4 cuadrados independientes con fina separaci?n y bordes redondeados. Estilo cl?sico Microsoft / Fluent.',
      img: '/logo_tests/opcion_1_mosaico_microsoft.png',
      badge: 'Recomendado'
    },
    {
      id: 2,
      title: 'Opci?n 2: Bloque Cuadrado Continuo',
      desc: 'Cuadrante s?lido continuo dividido en 4 bloques de color sin separaci?n. Aspecto limpio y moderno.',
      img: '/logo_tests/opcion_2_bloque_continuo.png',
      badge: 'Minimalista'
    },
    {
      id: 3,
      title: 'Opci?n 3: Icono App Squircle',
      desc: 'Esquinas m?s pronunciadas estilo icono de aplicaci?n (Apple iOS / Windows 11). Ideal para apps y favicons.',
      img: '/logo_tests/opcion_3_app_icon_squircle.png',
      badge: 'Mobile First'
    },
    {
      id: 4,
      title: 'Opci?n 4: Espectro Alterno (Naranja, Morado, Azul, Verde)',
      desc: 'Variaci?n de orden crom?tico con naranja y morado en la fila superior, azul y verde en la inferior.',
      img: '/logo_tests/opcion_4_espectro_alterno.png',
      badge: 'Din?mico'
    },
    {
      id: 5,
      title: 'Opci?n 5: Continuo Espectro Alterno',
      desc: 'Bloque continuo s?lido con la combinaci?n de colores alterna.',
      img: '/logo_tests/opcion_5_continuo_alterno.png',
      badge: 'Alternativa'
    },
    {
      id: 6,
      title: 'Opci?n 6: Emblema Circular',
      desc: 'Insignia circular dividida en 4 cuadrantes con las letras AP en blanco.',
      img: '/logo_tests/opcion_6_emblema_circular.png',
      badge: 'Emblema'
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Barra Superior */}
      <header className={`sticky top-0 z-30 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${isDark ? 'border-slate-800 hover:bg-slate-800 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-800'}`}
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight">Pruebas de Logotipo APCR Software</h1>
            <p className="text-xs text-slate-500">Cuadr?cula de 4 colores: Naranja, Verde, Azul y Morado con AP en blanco</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Fondo Claro / Oscuro */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-yellow-300 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? 'Ver en Fondo Claro' : 'Ver en Fondo Oscuro'}</span>
          </button>

          {/* Enlace a WhatsApp */}
          <a
            href={`https://wa.me/50660638062?text=Hola%20APCR%2C%20elijo%20la%20Opci%C3%B3n%20${selectedOption}%20del%20nuevo%20logo`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md shadow-[#25D366]/20 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white text-white" />
            <span>Confirmar Opci?n por WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Vista previa en Navbar Mockup */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">As? se ve en la cabecera:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/50 bg-white/10">
              <img src={options[selectedOption - 1].img} alt="Logo Preview" className="w-7 h-7 object-contain" />
              <span className="font-extrabold tracking-tight">APCR</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 font-medium">Software</span>
            </div>
          </div>
          <span className="text-slate-400 text-[11px]">Selecciona una tarjeta para previsualizar en vivo</span>
        </div>
      </div>

      {/* Grid de Tarjetas */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedOption(item.id)}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all cursor-pointer relative group ${
                selectedOption === item.id
                  ? (isDark ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/40 shadow-xl' : 'bg-white border-[#0067b8] ring-2 ring-[#0067b8]/20 shadow-xl')
                  : (isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs')
              }`}
            >
              {/* Badge */}
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                  selectedOption === item.id 
                    ? 'bg-blue-600 text-white' 
                    : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')
                }`}>
                  {item.badge}
                </span>
                {selectedOption === item.id && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Imagen del Logo */}
              <div className={`aspect-square rounded-2xl p-6 flex items-center justify-center transition-all ${
                isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-slate-50 border border-slate-100'
              }`}>
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              </div>

              {/* Textos */}
              <div className="mt-5 space-y-1.5 text-left">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>

              {/* Bot?n de Selecci?n */}
              <div className="mt-4 pt-3 border-t border-slate-100/10 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-500">
                  {selectedOption === item.id ? 'Seleccionado' : 'Hacer clic para probar'}
                </span>
                <a
                  href={`https://wa.me/50660638062?text=Hola%20APCR%2C%20me%20gusta%20la%20Opci%C3%B3n%20${item.id}%20(${encodeURIComponent(item.title)})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs transition-all"
                  title="Elegir esta opci?n"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
};

