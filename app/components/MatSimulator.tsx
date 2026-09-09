"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Upload, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  Box, 
  Sparkles, 
  Maximize2, 
  RotateCw, 
  FileText, 
  Share2, 
  Send,
  Building2,
  Check,
  Info,
  ShieldAlert,
  Eye,
  X,
  ExternalLink,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import { 
  NOMAD_COLOR_PALETTE, 
  validateMatDimensions, 
  validateDieCut, 
  renderCajetinBlueprint, 
  MatConfig, 
  DieCutValidation 
} from '../utils/cajetinRenderer';
import { processLogoForDieCut, LogoProcessResult } from '../utils/logoProcessor';

export function MatSimulator() {
  // Dimensiones (Mínimo estricto 120 x 100 cm)
  const [widthCm, setWidthCm] = useState<number>(150);
  const [heightCm, setHeightCm] = useState<number>(100);

  // Color base
  const [selectedColor, setSelectedColor] = useState(NOMAD_COLOR_PALETTE[0]); // Negro por defecto

  // Logo subido y procesado
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');
  const [logoImageElement, setLogoImageElement] = useState<HTMLImageElement | null>(null);
  const [rawLogoImage, setRawLogoImage] = useState<HTMLImageElement | null>(null);
  const [logoScale, setLogoScale] = useState<number>(1.0); // 100% Tamaño MÁXIMO por defecto
  const [isProcessingLogo, setIsProcessingLogo] = useState<boolean>(false);
  const [processedStats, setProcessedStats] = useState<LogoProcessResult | null>(null);

  // Opciones de Troquelado & Color de Vinil
  const [vinylColor, setVinylColor] = useState<string>('#FFFFFF'); // Blanco por defecto para contraste con alfombra negra
  const [bgTolerance, setBgTolerance] = useState<number>(38);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showXrayModal, setShowXrayModal] = useState<boolean>(false);

  // Datos del cliente para el cajetín
  const [clientName, setClientName] = useState<string>('');

  // Pestañas de visualización
  const [activeTab, setActiveTab] = useState<'blueprint' | '3d' | 'xray' | 'ai'>('blueprint');

  // Tipo de suelo para el simulador 3D
  const [floorType, setFloorType] = useState<'marble' | 'concrete' | 'tiles' | 'wood'>('marble');

  // Entorno para el render de IA
  const [aiEnvironment, setAiEnvironment] = useState<'corporate_lobby' | 'luxury_hotel' | 'retail_store' | 'executive_office'>('corporate_lobby');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiRenderResult, setAiRenderResult] = useState<string | null>(null);

  // Referencias Canvas y plantilla de cajetín
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const templateImgRef = useRef<HTMLImageElement | null>(null);
  const [templateLoaded, setTemplateLoaded] = useState<boolean>(false);

  // Validación de dimensiones
  const dimensionValidation = validateMatDimensions(widthCm, heightCm);

  // Validación de troquelado
  const dieCutValidation: DieCutValidation = validateDieCut(widthCm, heightCm, logoScale);

  // Cargar imagen de plantilla del cajetín
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = '/images/templates/cajetin-template.png';
    img.onload = () => {
      templateImgRef.current = img;
      setTemplateLoaded(true);
    };
  }, []);

  // Cargar logo por defecto (monograma AP en vinil blanco para contraste con alfombra negra)
  useEffect(() => {
    if (!logoDataUrl) {
      const defaultImg = new window.Image();
      defaultImg.crossOrigin = 'anonymous';
      defaultImg.src = '/images/logos/ap-monogram-black.png';
      defaultImg.onload = () => {
        setRawLogoImage(defaultImg);
        processAndMaximizeLogo(defaultImg, '#FFFFFF', 38);
      };
    }
  }, [logoDataUrl]);

  // Función para remover fondo, maximizar tamaño y eliminar elementos < 1cm
  const processAndMaximizeLogo = async (
    img: HTMLImageElement,
    customColor = vinylColor,
    tolerance = bgTolerance
  ) => {
    setIsProcessingLogo(true);
    try {
      const result = await processLogoForDieCut(
        img, 
        widthCm, 
        heightCm, 
        7.5, 
        1.0,
        {
          tolerance,
          customVinylColor: customColor || undefined
        }
      );
      setLogoImageElement(result.processedImage);
      setLogoDataUrl(result.processedDataUrl);
      setProcessedStats(result);
      setLogoScale(1.0); // 100% TAMAÑO MÁXIMO DENTRO DEL ÁREA SEGURA
    } catch (err) {
      console.error('Error procesando logo para troquel:', err);
      setLogoImageElement(img);
    } finally {
      setIsProcessingLogo(false);
    }
  };

  // Re-procesar cuando el cliente cambie dimensiones de la alfombra
  useEffect(() => {
    if (rawLogoImage) {
      processAndMaximizeLogo(rawLogoImage, vinylColor, bgTolerance);
    }
  }, [widthCm, heightCm, vinylColor, bgTolerance]);

  // Manejar subida de logo por el cliente
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Al subir logo nuevo, preservar colores originales por defecto
      setVinylColor('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = result;
        img.onload = () => {
          setRawLogoImage(img);
          processAndMaximizeLogo(img, '', bgTolerance);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-renderizar el Canvas del cajetín cuando cambie cualquier parámetro
  useEffect(() => {
    if (!canvasRef.current) return;
    const config: MatConfig = {
      widthCm,
      heightCm,
      baseColor: selectedColor.hex,
      baseColorName: selectedColor.name,
      logoImage: logoImageElement,
      logoScale,
      clientName: clientName.trim() || undefined
    };

    renderCajetinBlueprint(canvasRef.current, config, templateImgRef.current);
  }, [widthCm, heightCm, selectedColor, logoImageElement, logoScale, clientName, templateLoaded, activeTab]);

  // Descargar Ficha Técnica con Cajetín
  const handleDownloadBlueprint = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `Ficha-Tecnica-Alfombra-${widthCm}x${heightCm}cm-${clientName || 'Cliente'}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Generar Render de IA
  const handleGenerateAiRender = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/generate-mat-render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widthCm,
          heightCm,
          baseColor: selectedColor.hex,
          baseColorName: selectedColor.name,
          environment: aiEnvironment,
          logoDataUrl
        })
      });

      const data = await response.json();
      if (data.imageUrl) {
        setAiRenderResult(data.imageUrl);
      } else {
        // En caso de modo síntesis
        setActiveTab('3d');
      }
    } catch (err) {
      console.error('Error generando render AI:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-mono text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            DISEÑADOR & SIMULADOR APCR
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Diseñador de Alfombras Troqueladas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Genera la ficha técnica oficial con cajetín para producción y visualiza tu alfombra en 3D con Inteligencia Artificial.
          </p>
        </div>

        {/* REGLA TÉCNICA CLAVE: MEDIDA MÍNIMA */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>Medida mínima oficial: <strong>120 × 100 cm</strong> • Margen: <strong>7.5 cm</strong></span>
        </div>
      </div>

      {/* CUERPO: 2 COLUMNAS (CONFIGURADOR A LA IZQUIERDA, VIEWPORT A LA DERECHA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================
            COLUMNA IZQUIERDA: CONTROLES DE DISEÑO (5 COLS)
           ======================================================== */}
        <div className="lg:col-span-5 space-y-6 bg-card border border-border p-6 rounded-3xl shadow-sm">
          
          {/* 1. Medidas de la Alfombra */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                1. Medidas de la Alfombra (cm)
              </label>
              <span className="text-[11px] font-mono text-muted-foreground">Mínimo 120 × 100 cm</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Ancho (cm)
                </label>
                <input
                  type="number"
                  min={100}
                  value={widthCm}
                  onChange={(e) => setWidthCm(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">
                  Largo / Alto (cm)
                </label>
                <input
                  type="number"
                  min={100}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Error de medida mínima */}
            {!dimensionValidation.valid && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{dimensionValidation.error}</span>
              </div>
            )}

            {/* Botones de Medidas Estándar Oficiales (Con Precios de Promoción) */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                Medidas Oficiales con Precios Promocionales:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { w: 120, h: 100, label: '1.2m × 1m (Mínima)', promo: '₡93.500', reg: '₡110.000' },
                  { w: 150, h: 100, label: '1.5m × 1m', promo: '₡127.500', reg: '₡150.000' },
                  { w: 180, h: 120, label: '1.8m × 1.2m', promo: '₡152.150', reg: '₡179.000' },
                  { w: 200, h: 120, label: '2.0m × 1.2m', promo: '₡169.150', reg: '₡199.000' },
                ].map((m, idx) => {
                  const isSelected = widthCm === m.w && heightCm === m.h;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setWidthCm(m.w); setHeightCm(m.h); }}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-600 text-foreground ring-1 ring-blue-600/30'
                          : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="text-xs font-bold block">{m.label}</span>
                      <div className="flex items-center gap-1.5 mt-0.5 font-mono">
                        <span className="text-emerald-500 font-extrabold text-xs">{m.promo}</span>
                        <span className="text-[10px] line-through text-muted-foreground">{m.reg}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Banner de Vigencia de Descuentos */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-500 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    15% DE DESCUENTO ACTIVO
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    Hasta 31 Oct
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Descuento del 15% válido hasta el <strong>31 de octubre</strong>. A partir del <strong>1 de noviembre hasta el 31 de diciembre</strong> regirán los precios regulares sin descuento.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Selector de Color Base (Paleta Oficial de 24 Tonos) */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                2. Color Base Nomad ({selectedColor.name})
              </label>
              <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: selectedColor.hex }}></span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {NOMAD_COLOR_PALETTE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className={`relative w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                    selectedColor.id === c.id 
                      ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20' 
                      : 'border-white/10'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor.id === c.id && (
                    <Check className={`w-3.5 h-3.5 ${c.textDark ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Cargar Logotipo & Procesador Técnico de Troquel */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
                3. Logotipo del Cliente
              </label>
              {processedStats && (
                <button
                  type="button"
                  onClick={() => setShowCompareModal(!showCompareModal)}
                  className="text-[11px] font-mono text-blue-500 hover:text-blue-400 underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {showCompareModal ? 'Ocultar comparativa' : 'Ver Antes / Después'}
                </button>
              )}
            </div>

            {/* Subida de Archivo */}
            <div className="relative border-2 border-dashed border-border hover:border-blue-500 rounded-2xl p-4 text-center transition-colors bg-secondary/20">
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleLogoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {logoFile ? logoFile.name : 'Haz clic o arrastra tu logo aquí'}
                </span>
                <span className="text-[10px] text-muted-foreground">PNG transparente, JPG o SVG (Auto-remoción de fondo)</span>
              </div>
            </div>

            {/* Comparativa Antes / Después (Original vs Troquelado) */}
            {showCompareModal && processedStats && (
              <div className="p-3 rounded-2xl bg-black/40 border border-blue-500/30 space-y-2 animate-in fade-in duration-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block font-bold">
                  Comparativa de Procesamiento Técnico:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-center">
                    <span className="text-[9px] font-mono text-muted-foreground block">Original (Con fondo / detalles)</span>
                    <div className="w-full h-24 rounded-lg bg-zinc-900 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={processedStats.originalDataUrl} 
                        alt="Logo original" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="text-[9px] font-mono text-emerald-400 block font-bold">Troquelado (Sin fondo / &ge;1cm)</span>
                    <div className="w-full h-24 rounded-lg bg-zinc-900 border border-emerald-500/30 p-1 flex items-center justify-center overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={processedStats.processedDataUrl} 
                        alt="Logo troquelado" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estado de Procesamiento Automático de Logo para Troquel */}
            {isProcessingLogo ? (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-400 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Analizando viabilidad técnica, removiendo fondo y evaluando trazos de troquel...</span>
              </div>
            ) : processedStats && (
              <div className="space-y-3">
                {/* SEMÁFORO DE VIABILIDAD TÉCNICA (TALLER OFICIAL GRECIA) */}
                {processedStats.viability.status === 'rejected' ? (
                  /* 🔴 CASO 1: RECHAZADO (FOTO O DEGRADADO CONTINUO) */
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-red-400 text-xs uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>🔴 NO APTO PARA TROQUELADO</span>
                      </div>
                      <span className="text-[10px] font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                        FOTO / DEGRADADO
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      El archivo contiene fotografías o degradados de color continuos. Las alfombras Nomad de 12mm <strong>se fabrican únicamente mediante incrustación de piezas sólidas de vinil troqueladas</strong>. No es posible imprimir en este material.
                    </p>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-red-500/20 text-[11px] space-y-1.5">
                      <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">
                        Solución Técnica de Taller:
                      </span>
                      <p className="text-zinc-300 text-[11px]">
                        Nuestro equipo en Grecia puede vectorizar y adaptar tu logo a colores planos sólidos sin costo adicional en pedidos confirmados.
                      </p>
                      <a
                        href={`https://wa.me/50660638062?text=${encodeURIComponent(`Hola Rolando, estoy en el diseñador web de APCR y mi logo tiene degradados/fotos para una alfombra de ${widthCm}x${heightCm}cm. ¿Me ayudas a adaptarlo a colores planos de vinil?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors mt-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Consultar con Rolando Fallas (+506 6063-8062)</span>
                      </a>
                    </div>
                  </div>
                ) : processedStats.viability.status === 'needs_simplification' ? (
                  /* 🟡 CASO 2: REQUIERE SIMPLIFICACIÓN (MICRO-LETRAS < 1.0 CM DETECTADAS) */
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-amber-400 text-xs uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>🟡 REQUIERE SIMPLIFICACIÓN</span>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        {processedStats.elementsRemovedCount} micro-detalle(s) &lt; 1.0cm
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Se detectaron <strong>{processedStats.elementsRemovedCount} elemento(s) o letras menores a 1.0 cm (10 mm)</strong> a escala real. En alfombras Nomad de rizo de 12mm, trazos menores a 10 mm <strong>se desprenden de la cuchilla y se rompen con el tránsito</strong>.
                    </p>

                    {/* Botón destacado para abrir visor de Rayos X */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowXrayModal(true);
                        setActiveTab('xray');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-all group"
                    >
                      <Eye className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                      <span>Inspeccionar Mapa de Rayos X (Ver Zonas en Rojo)</span>
                    </button>

                    {/* LAS 3 SOLUCIONES OFICIALES DE FABRICACIÓN */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                        Elige una de las 3 soluciones de taller:
                      </span>

                      {/* Opción 1: Versión Simplificada */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">1. Usar Versión Simplificada (Recomendada)</span>
                          <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Activa</span>
                        </div>
                        <p className="text-[11px] text-zinc-300">
                          Se omiten los micro-textos no viables y se maximiza el isotipo y marca principal a <strong>{processedStats.physicalLogoSizeCm.w} × {processedStats.physicalLogoSizeCm.h} cm</strong> (100% troquelable y resistente).
                        </p>
                      </div>

                      {/* Opción 2: Aumentar Alfombra */}
                      {processedStats.viability.suggestedMatWidthCm && (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-blue-500/30 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-400">2. Aumentar Tamaño de Alfombra</span>
                            <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                              Sugerido: {processedStats.viability.suggestedMatWidthCm} cm
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-300">
                            Para que todas las letras midan &ge; 1.0 cm y se puedan cortar completas, amplía el ancho de la alfombra.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (processedStats.viability.suggestedMatWidthCm) {
                                setWidthCm(processedStats.viability.suggestedMatWidthCm);
                              }
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Ampliar alfombra a {processedStats.viability.suggestedMatWidthCm} cm de ancho</span>
                          </button>
                        </div>
                      )}

                      {/* Opción 3: WhatsApp Rolando Fallas */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-700 space-y-1">
                        <span className="text-xs font-bold text-foreground block">3. Asesoría Técnica con Rolando Fallas</span>
                        <p className="text-[11px] text-zinc-300">
                          Revisamos tu archivo en el taller de Grecia para buscar opciones especiales de fabricación.
                        </p>
                        <a
                          href={`https://wa.me/50660638062?text=${encodeURIComponent(`Hola Rolando, estoy cotizando una alfombra Nomad de ${widthCm}x${heightCm}cm en el diseñador web APCR y el sistema detectó ${processedStats.elementsRemovedCount} letras/detalles menores a 1.0cm en mi logo. ¿Podemos revisarlo juntos?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors mt-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>WhatsApp Grecia: 6063-8062</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 🟢 CASO 3: 100% APTO PARA TROQUELADO */
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        100% Apto para Troquelado Oficial
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        Aprobado Taller
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Todos los elementos y letras miden <strong>1.0 cm o más a escala real</strong> y respetan el margen perimetral de 7.5 cm. Se troquela directamente en la cuchilla sin desprendimiento.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase block">Área Segura (Margen 7.5cm):</span>
                        <span className="text-xs font-bold font-mono text-foreground">
                          {processedStats.safeAreaSizeCm.w} × {processedStats.safeAreaSizeCm.h} cm
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/30 border border-emerald-500/20 space-y-0.5">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase block font-bold">Tamaño Máximo Logo:</span>
                        <span className="text-xs font-bold font-mono text-emerald-400">
                          {processedStats.physicalLogoSizeCm.w} × {processedStats.physicalLogoSizeCm.h} cm
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowXrayModal(true);
                        setActiveTab('xray');
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors mt-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Mapa de Rayos X (100% Verde Aprobado)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Selector de Color de Vinil de Troquelado */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground uppercase">
                  Color de Troquelado del Logo:
                </span>
                <span className="text-[10px] font-mono text-blue-400">
                  {vinylColor ? 'Personalizado' : 'Colores Originales'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setVinylColor('');
                    if (rawLogoImage) processAndMaximizeLogo(rawLogoImage, '', bgTolerance);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold border transition-all ${
                    !vinylColor
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-secondary/40 text-muted-foreground border-border hover:text-foreground'
                  }`}
                >
                  Originales
                </button>

                {[
                  { name: 'Blanco Puro', hex: '#FFFFFF' },
                  { name: 'Oro Bronce', hex: '#8B7332' },
                  { name: 'Amarillo Cromo', hex: '#FFD000' },
                  { name: 'Rojo Carmesí', hex: '#D00000' },
                  { name: 'Azul Real', hex: '#0033AA' },
                  { name: 'Cian Vibrante', hex: '#00D2FF' },
                  { name: 'Negro Carbón', hex: '#111111' }
                ].map((vc) => (
                  <button
                    key={vc.hex}
                    type="button"
                    onClick={() => {
                      setVinylColor(vc.hex);
                      if (rawLogoImage) processAndMaximizeLogo(rawLogoImage, vc.hex, bgTolerance);
                    }}
                    title={vc.name}
                    className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                      vinylColor === vc.hex ? 'border-blue-500 scale-110 shadow' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: vc.hex }}
                  >
                    {vinylColor === vc.hex && (
                      <Check className={`w-3 h-3 ${vc.hex === '#FFFFFF' || vc.hex === '#FFD000' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Ajuste de Tolerancia de Fondo (Opcional) */}
            <div className="pt-2">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                <span>Tolerancia remoción de fondo:</span>
                <span className="font-bold text-foreground">{bgTolerance}</span>
              </div>
              <input
                type="range"
                min={20}
                max={60}
                step={2}
                value={bgTolerance}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setBgTolerance(val);
                  if (rawLogoImage) processAndMaximizeLogo(rawLogoImage, vinylColor, val);
                }}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Regla de Fabricación: Sin ilustraciones realistas ni degradados */}
            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-amber-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Norma Técnica de Troquelado</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Fabricamos mediante <strong>corte e incrustación de piezas sólidas de vinil</strong>. Por restricciones técnicas de troquel:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ✔ Colores planos sólidos, letras nítidas y vectores.
                </div>
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                  ✖ No ilustraciones realistas, fotos ni degradados.
                </div>
              </div>
            </div>

            {/* Validaciones Técnicas de Margen y Troquel */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-500 font-medium">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Margen perimetral de 7.5 cm protegido en los 4 bordes</span>
              </div>

              <div className={`flex items-start gap-2 font-medium ${
                dieCutValidation.isValid ? 'text-emerald-500' : 'text-amber-500'
              }`}>
                {dieCutValidation.isValid ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-[11px] leading-tight">
                  {dieCutValidation.message}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Datos del Cliente / Proyecto */}
          <div className="space-y-2 pt-4 border-t border-border">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
              4. Nombre del Cliente / Proyecto (Para el cajetín)
            </label>
            <input
              type="text"
              placeholder="Ej: Hotel Real InterContinental"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground font-sans text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 5. Botones de Acción */}
          <div className="space-y-2 pt-4 border-t border-border">
            <button
              onClick={handleDownloadBlueprint}
              disabled={!dimensionValidation.valid}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Descargar Ficha Técnica con Cajetín
            </button>

            <a
              href={`/crm/cotizador?width=${widthCm}&height=${heightCm}&color=${encodeURIComponent(selectedColor.name)}`}
              className="w-full py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-center"
            >
              <Send className="w-3.5 h-3.5" />
              Crear Cotización en CRM
            </a>
          </div>
        </div>

        {/* ========================================================
            COLUMNA DERECHA: VIEWPORT CON PESTAÑAS (7 COLS)
           ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Navegación de Pestañas */}
          <div className="flex items-center justify-between bg-secondary/40 p-1.5 rounded-2xl border border-border">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'blueprint' 
                    ? 'bg-card text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Ficha Técnica (Cajetín 2D)
              </button>

              <button
                onClick={() => setActiveTab('3d')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === '3d' 
                    ? 'bg-card text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                Simulador 3D
              </button>

              <button
                onClick={() => setActiveTab('xray')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'xray' 
                    ? 'bg-card text-foreground shadow-sm ring-1 ring-red-500/50' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-red-400" />
                <span>Rayos X Troquel</span>
                {processedStats && processedStats.elementsRemovedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-mono font-bold">
                    {processedStats.elementsRemovedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'ai' 
                    ? 'bg-card text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Render con IA
              </button>
            </div>
          </div>

          {/* VISTA 1: PLANO TÉCNICO 2D (CAJETÍN OFICIAL) */}
          {activeTab === 'blueprint' && (
            <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm overflow-hidden flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 text-xs text-muted-foreground font-mono">
                <span>FORMATO OFICIAL // APCR COSTA RICA</span>
                <span>RESOLUCIÓN: 1384 × 1338 PX (2X)</span>
              </div>

              {/* Contenedor del Canvas */}
              <div className="relative w-full max-w-[550px] aspect-[692/669] rounded-xl overflow-hidden border border-border shadow-lg bg-white flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="pt-4 text-center text-xs text-muted-foreground">
                Vista técnica superior a escala con cotas, margen perimetral de 7.5 cm y datos de contacto de Grecia, Alajuela.
              </div>
            </div>
          )}

          {/* VISTA 2: SIMULADOR 3D EN TIEMPO REAL */}
          {activeTab === '3d' && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  Simulación 3D en perspectiva con textura Nomad
                </span>

                {/* Selector de tipo de piso */}
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-muted-foreground">Piso:</span>
                  {(['marble', 'concrete', 'tiles', 'wood'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFloorType(f)}
                      className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                        floorType === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {f === 'marble' ? 'Mármol' : f === 'concrete' ? 'Concreto' : f === 'tiles' ? 'Porcelanato' : 'Madera'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escenario 3D con perspectiva CSS */}
              <div 
                className="relative w-full h-96 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner"
                style={{
                  perspective: '900px',
                  backgroundColor: floorType === 'marble' ? '#EAE5DB' : floorType === 'concrete' ? '#8C8C8C' : floorType === 'tiles' ? '#D6D3CD' : '#5C4033',
                  backgroundImage: floorType === 'marble'
                    ? 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.2) 25%, transparent 25%)'
                    : floorType === 'concrete'
                    ? 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)'
                    : 'none',
                  backgroundSize: '40px 40px'
                }}
              >
                {/* Puertas de cristal de fondo para realismo */}
                <div className="absolute top-0 inset-x-0 h-44 border-b-2 border-white/40 bg-gradient-to-b from-blue-100/30 to-transparent flex items-center justify-around pointer-events-none">
                  <div className="w-1/2 h-full border-r border-white/50"></div>
                </div>

                {/* Sombra ambiental proyectada en el piso */}
                <div 
                  className="absolute w-72 h-48 bg-black/40 rounded-3xl blur-xl"
                  style={{
                    transform: 'rotateX(60deg) translateY(40px)',
                    width: `${Math.min(320, widthCm * 1.5)}px`,
                    height: `${Math.min(220, heightCm * 1.4)}px`
                  }}
                />

                {/* La Alfombra en Perspectiva 3D */}
                <div
                  className="relative rounded-lg p-2 shadow-2xl transition-all duration-500"
                  style={{
                    transform: 'rotateX(55deg) rotateZ(-3deg)',
                    backgroundColor: '#111111', // Borde biselado
                    width: `${Math.min(340, widthCm * 1.8)}px`,
                    height: `${Math.min(240, heightCm * 1.6)}px`,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  {/* Cuerpo de la alfombra con color seleccionado y textura de rizo */}
                  <div 
                    className="w-full h-full rounded flex items-center justify-center p-3 relative overflow-hidden"
                    style={{ backgroundColor: selectedColor.hex }}
                  >
                    {/* Micro-textura de rizo Nomad */}
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '6px 6px'
                      }}
                    />

                    {/* Área segura con margen de 7.5 cm perimetral a escala exacta */}
                    <div 
                      className="relative z-10 flex items-center justify-center border border-dashed border-amber-400/50 p-1"
                      style={{
                        width: `${((Math.max(10, widthCm - 15)) / widthCm) * 100}%`,
                        height: `${((Math.max(10, heightCm - 15)) / heightCm) * 100}%`
                      }}
                    >
                      {/* Logo montado al MÁXIMO en el área segura */}
                      {logoImageElement && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoDataUrl || '/images/logos/ap-monogram-black.png'}
                          alt="Logo cliente"
                          className="w-full h-full object-contain filter drop-shadow-md"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Dimensiones reales: {widthCm} × {heightCm} cm</span>
                <span>Material: Nomad 12mm Atrapamugre</span>
              </div>
            </div>
          )}

          {/* VISTA 3: RENDER FOTORREALISTA CON IA */}
          {activeTab === 'ai' && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    Generador de Escenas con Inteligencia Artificial
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Proyecta tu alfombra en entornos comerciales reales de alta gama.
                  </p>
                </div>
              </div>

              {/* Selector de Entorno */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'corporate_lobby', label: 'Lobby Corporativo' },
                  { id: 'luxury_hotel', label: 'Hotel de Lujo' },
                  { id: 'retail_store', label: 'Tienda Comercial' },
                  { id: 'executive_office', label: 'Oficina Ejecutiva' },
                ].map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setAiEnvironment(env.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-semibold transition-all text-center ${
                      aiEnvironment === env.id 
                        ? 'border-blue-600 bg-blue-600/10 text-blue-600' 
                        : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {env.label}
                  </button>
                ))}
              </div>

              {/* Área del Render Generado */}
              <div className="relative w-full h-80 rounded-2xl border border-border bg-black/50 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                {aiLoading ? (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-mono text-zinc-300 animate-pulse">
                      La IA está componiendo la escena fotorrealista...
                    </span>
                  </div>
                ) : aiRenderResult ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={aiRenderResult}
                    alt="Render generado por IA"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="max-w-sm space-y-3">
                    <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                    <span className="text-sm font-bold text-foreground block">
                      Listo para sintetizar el render fotorrealista
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Haz clic en el botón inferior para que la IA ensamble la entrada comercial con las medidas exactas de {widthCm} × {heightCm} cm y tu logo.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateAiRender}
                disabled={aiLoading || !dimensionValidation.valid}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {aiLoading ? 'Generando Render...' : 'Generar Render Fotorrealista con IA'}
              </button>
            </div>
          )}

          {/* VISTA 4: AUDITORÍA DE RAYOS X DE TROQUELADO */}
          {activeTab === 'xray' && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
              {processedStats ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-red-400 font-mono text-[10px] uppercase tracking-wider font-bold mb-1">
                        <Eye className="w-3.5 h-3.5" />
                        AUDITORÍA DE CORTE // TALLER GRECIA, ALAJUELA
                      </div>
                      <h3 className="font-bold text-base text-foreground">
                        Mapa de Rayos X de Viabilidad de Troquelado
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Detección técnica a escala real sobre alfombra Nomad de 12 mm con base sintética.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-secondary border border-border text-foreground">
                        Escala: 1 cm real = {processedStats.pixelsPerCm} px
                      </span>
                    </div>
                  </div>

                  {/* Visor de Rayos X con rejilla técnica milimétrica */}
                  <div className="relative w-full aspect-[4/3] max-h-[440px] rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-4 overflow-hidden shadow-inner">
                    {/* Rejilla milimétrica */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}
                    />

                    {/* Imagen de Rayos X */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={processedStats.xrayDataUrl}
                      alt="Mapa de Rayos X de Troquelado"
                      className="relative z-10 max-w-full max-h-full object-contain filter drop-shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                    />

                    {/* Badge flotante de tolerancia */}
                    <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>Tolerancia mínima de taller: 1.0 cm</span>
                    </div>
                  </div>

                  {/* Leyenda Técnica Explicativa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-red-400 text-xs">
                        <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                        <span>ZONAS EN ROJO: Menores a 1.0 cm (Omitidas)</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        En alfombra Nomad de rizo de 12 mm, cualquier letra o detalle menor a 10 mm <strong>se desfibra, se desprende de la cuchilla y no resiste el tránsito</strong>. Se eliminan para preservar la calidad del producto.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span>ZONAS EN VERDE: Mayor o igual a 1.0 cm (Aprobadas)</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        Trazos y letras con cuerpo estructural suficiente para troquelado perfecto, incrustación manual y termofusión con base de goma.
                      </p>
                    </div>
                  </div>

                  {/* Métricas de Taller */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border">
                    <div className="p-2.5 rounded-xl bg-secondary/40 border border-border">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase block">Área Segura Alfombra:</span>
                      <span className="text-xs font-bold font-mono text-foreground">
                        {processedStats.safeAreaSizeCm.w} × {processedStats.safeAreaSizeCm.h} cm
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/40 border border-border">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase block">Tamaño Logo Útil:</span>
                      <span className="text-xs font-bold font-mono text-emerald-400">
                        {processedStats.physicalLogoSizeCm.w} × {processedStats.physicalLogoSizeCm.h} cm
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/40 border border-border">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase block">Detalle más fino:</span>
                      <span className={`text-xs font-bold font-mono ${
                        processedStats.viability.smallestElementCm < 1.0 ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {processedStats.viability.smallestElementCm} cm
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/40 border border-border">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase block">Detalles Omitidos:</span>
                      <span className={`text-xs font-bold font-mono ${
                        processedStats.elementsRemovedCount > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {processedStats.elementsRemovedCount} micro-elemento(s)
                      </span>
                    </div>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('blueprint')}
                      className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver Ficha Técnica Oficial</span>
                    </button>

                    {processedStats.viability.suggestedMatWidthCm && (
                      <button
                        type="button"
                        onClick={() => {
                          if (processedStats.viability.suggestedMatWidthCm) {
                            setWidthCm(processedStats.viability.suggestedMatWidthCm);
                          }
                        }}
                        className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Aumentar alfombra a {processedStats.viability.suggestedMatWidthCm} cm</span>
                      </button>
                    )}

                    <a
                      href={`https://wa.me/50660638062?text=${encodeURIComponent(`Hola Rolando, estoy revisando los Rayos X de mi logo en el simulador APCR para una alfombra de ${widthCm}x${heightCm}cm. ¿Me ayudas con la cotización de producción?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Grecia (6063-8062)</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <Eye className="w-10 h-10 text-muted-foreground mx-auto" />
                  <span className="text-sm font-bold text-foreground block">
                    Carga un logotipo para inspeccionar sus Rayos X
                  </span>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    El analizador automático medirá cada letra y trazo en milímetros reales según la alfombra seleccionada.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODAL EMERGENTE DE RAYOS X (ACCESIBLE DESDE CUALQUIER PESTAÑA) */}
      {showXrayModal && processedStats && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    Inspección de Rayos X de Troquelado
                  </h3>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Taller Grecia, Alajuela • Tolerancia mínima: 1.0 cm
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowXrayModal(false)}
                className="p-1.5 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Imagen de Rayos X */}
            <div className="relative w-full aspect-[4/3] max-h-[380px] rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-4 overflow-hidden shadow-inner">
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={processedStats.xrayDataUrl}
                alt="Mapa de Rayos X"
                className="relative z-10 max-w-full max-h-full object-contain filter drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              />
            </div>

            {/* Leyenda y Diagnóstico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
                <span className="font-bold text-red-400 block">🔴 Rojo = Menor a 1.0 cm (Omitido)</span>
                <p className="text-[11px] text-zinc-300">
                  Subtítulos o micro-textos que no se pueden cortar en vinil Nomad de 12 mm. Se suprimen para evitar rotura del material.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <span className="font-bold text-emerald-400 block">🟢 Verde = Mayor a 1.0 cm (Aprobado)</span>
                <p className="text-[11px] text-zinc-300">
                  Isotipo y marca principal con grosor garantizado para corte preciso y termofusión.
                </p>
              </div>
            </div>

            {/* Soluciones */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowXrayModal(false)}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition-colors"
              >
                Aceptar Versión Simplificada
              </button>

              {processedStats.viability.suggestedMatWidthCm && (
                <button
                  type="button"
                  onClick={() => {
                    if (processedStats.viability.suggestedMatWidthCm) {
                      setWidthCm(processedStats.viability.suggestedMatWidthCm);
                      setShowXrayModal(false);
                    }
                  }}
                  className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border font-bold text-xs text-center transition-colors"
                >
                  Ampliar a {processedStats.viability.suggestedMatWidthCm} cm
                </button>
              )}

              <a
                href={`https://wa.me/50660638062?text=${encodeURIComponent(`Hola Rolando, estoy en el simulador APCR revisando los Rayos X de mi logo para una alfombra de ${widthCm}x${heightCm}cm. Quiero una cotización.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Grecia</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
