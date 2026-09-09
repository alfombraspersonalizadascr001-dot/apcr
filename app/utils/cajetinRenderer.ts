/**
 * APCR - Motor de Renderizado de Ficha Técnica 2D sobre Cajetín Oficial
 * Dimensiones oficiales del cajetín: 692 x 669 px (renderizado en 2x Retina: 1384 x 1338 px)
 * Reglas de diseño:
 * - Medida mínima de alfombra: 120 x 100 cm
 * - Margen de seguridad perimetral: 7.5 cm en los 4 bordes
 * - Espesor mínimo de troquelado: 1.0 cm a escala real
 */

export interface MatConfig {
  widthCm: number;       // Ancho en cm (mínimo 120 cm)
  heightCm: number;      // Alto en cm (mínimo 100 cm)
  baseColor: string;     // Color base hex de la alfombra
  baseColorName: string; // Nombre del color
  logoImage: HTMLImageElement | null;
  logoScale?: number;    // Multiplicador de escala (default 1)
  clientName?: string;
  orderNumber?: string;
  agentName?: string;
  agentPhone?: string;
}

export interface DieCutValidation {
  isValid: boolean;
  minAllowedSizeCm: number;
  actualMarginCm: number;
  estimatedSmallestFeatureCm: number;
  message: string;
}

// 24 Colores Oficiales de Alfombras Nomad (del muestrario de APCR)
export const NOMAD_COLOR_PALETTE = [
  // Fila Superior
  { id: 'negro', name: 'Negro Carbón', hex: '#111111', textDark: false },
  { id: 'blanco', name: 'Blanco Puro', hex: '#FDFDFD', textDark: true },
  { id: 'gris-claro', name: 'Gris Plata', hex: '#8E9094', textDark: true },
  { id: 'gris-oscuro', name: 'Gris Grafito', hex: '#373A3C', textDark: false },
  { id: 'oro-viejo', name: 'Oro Bronce', hex: '#8B7332', textDark: false },
  { id: 'beige', name: 'Arena / Beige', hex: '#C2B280', textDark: true },
  { id: 'azul-marino', name: 'Azul Marino', hex: '#0F2557', textDark: false },
  { id: 'azul-real', name: 'Azul Real', hex: '#0033AA', textDark: false },
  { id: 'azul-noche', name: 'Azul Noche', hex: '#0A1128', textDark: false },
  { id: 'azul-celeste', name: 'Azul Claro', hex: '#0077FF', textDark: false },
  { id: 'cian', name: 'Cian Vibrante', hex: '#00D2FF', textDark: true },
  { id: 'amarillo', name: 'Amarillo Cromo', hex: '#FFD000', textDark: true },
  { id: 'naranja', name: 'Naranja Vivo', hex: '#FF6600', textDark: false },
  // Fila Inferior
  { id: 'rojo', name: 'Rojo Carmesí', hex: '#D00000', textDark: false },
  { id: 'vino', name: 'Vino Tinto', hex: '#5A092B', textDark: false },
  { id: 'morado', name: 'Morado Real', hex: '#3C0946', textDark: false },
  { id: 'fucsia', name: 'Fucsia Neón', hex: '#FF0066', textDark: false },
  { id: 'magenta', name: 'Magenta', hex: '#E040FB', textDark: false },
  { id: 'rosa', name: 'Rosa Pastel', hex: '#FF80DF', textDark: true },
  { id: 'verde-bosque', name: 'Verde Pino', hex: '#0F381E', textDark: false },
  { id: 'verde-esmeralda', name: 'Verde Esmeralda', hex: '#00A86B', textDark: false },
  { id: 'verde-oliva', name: 'Verde Jade', hex: '#2E7D32', textDark: false },
  { id: 'verde-oscuro', name: 'Verde Botella', hex: '#0B4716', textDark: false },
  { id: 'verde-limon', name: 'Verde Limón', hex: '#00E600', textDark: true },
  { id: 'verde-manzana', name: 'Verde Manzana', hex: '#76FF03', textDark: true },
  { id: 'cafe', name: 'Marrón Chocolate', hex: '#3E2723', textDark: false }
];

export function validateMatDimensions(widthCm: number, heightCm: number): { valid: boolean; error?: string } {
  if (widthCm < 120 && heightCm < 100) {
    return {
      valid: false,
      error: `La medida mínima de fabricación es 120 × 100 cm. (Ingresado: ${widthCm} × ${heightCm} cm)`
    };
  }
  if (Math.min(widthCm, heightCm) < 100 || Math.max(widthCm, heightCm) < 120) {
    return {
      valid: false,
      error: `La medida mínima debe ser de al menos 120 cm de largo por 100 cm de ancho.`
    };
  }
  return { valid: true };
}

export function validateDieCut(widthCm: number, heightCm: number, logoWidthRatio = 0.6): DieCutValidation {
  const marginCm = 7.5;
  const maxLogoWidthCm = widthCm - marginCm * 2;
  const maxLogoHeightCm = heightCm - marginCm * 2;
  
  // Estimación matemática de troquel: trazos típicos en logos proporcionales
  const effectiveLogoWidthCm = maxLogoWidthCm * Math.min(1, Math.max(0.2, logoWidthRatio));
  const estimatedSmallestStrokeCm = effectiveLogoWidthCm * 0.04; // 4% del ancho del logo suele ser el trazo mínimo de letras

  const isValid = estimatedSmallestStrokeCm >= 1.0;

  return {
    isValid,
    minAllowedSizeCm: 1.0,
    actualMarginCm: marginCm,
    estimatedSmallestFeatureCm: parseFloat(estimatedSmallestStrokeCm.toFixed(2)),
    message: isValid 
      ? `Aprobado: El logo cumple con el margen de 7.5 cm y el troquel estimado es ≥ 1.0 cm (${estimatedSmallestStrokeCm.toFixed(1)} cm).`
      : `Atención: El logo contiene trazos que podrían medir menos de 1.0 cm al fabricar. Se recomienda simplificar o ampliar el logo.`
  };
}

/**
 * Renderiza el plano técnico completo sobre el cajetín oficial en un Canvas HTML5
 */
export async function renderCajetinBlueprint(
  canvas: HTMLCanvasElement,
  config: MatConfig,
  templateImg: HTMLImageElement | null
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Resolución de alta definición (Retina 2x de 692 x 669)
  const BASE_WIDTH = 692;
  const BASE_HEIGHT = 669;
  const SCALE = 2;

  canvas.width = BASE_WIDTH * SCALE;
  canvas.height = BASE_HEIGHT * SCALE;
  ctx.scale(SCALE, SCALE);

  // 1. Limpiar fondo blanco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  // 2. Dibujar la imagen base del cajetín oficial si está disponible
  if (templateImg && templateImg.complete && templateImg.naturalWidth > 0) {
    ctx.drawImage(templateImg, 0, 0, BASE_WIDTH, BASE_HEIGHT);
  } else {
    // Dibujar cajetín sintético de respaldo en caso de carga diferida
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, BASE_WIDTH - 20, BASE_HEIGHT - 20);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, BASE_WIDTH - 40, BASE_HEIGHT - 40);
  }

  // 3. Coordenadas del área libre de dibujo dentro del marco blanco del cajetín:
  // Área superior útil aproximada: x: 50 a 642 (ancho 592), y: 35 a 490 (alto 455)
  const drawAreaX = 55;
  const drawAreaY = 40;
  const drawAreaW = 582;
  const drawAreaH = 445;

  // Fondo del área de dibujo
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(drawAreaX, drawAreaY, drawAreaW, drawAreaH);

  // 4. Calcular escala proporcional para centrar la alfombra en el área
  const paddingBox = 50; // Espacio para las cotas de medida
  const maxMatW = drawAreaW - paddingBox * 2;
  const maxMatH = drawAreaH - paddingBox * 2;

  const aspectMat = config.widthCm / config.heightCm;
  const aspectArea = maxMatW / maxMatH;

  let matPixelW: number;
  let matPixelH: number;

  if (aspectMat > aspectArea) {
    matPixelW = maxMatW;
    matPixelH = maxMatW / aspectMat;
  } else {
    matPixelH = maxMatH;
    matPixelW = maxMatH * aspectMat;
  }

  // Centro de la alfombra
  const matX = drawAreaX + (drawAreaW - matPixelW) / 2;
  const matY = drawAreaY + (drawAreaH - matPixelH) / 2;

  const pixelsPerCm = matPixelW / config.widthCm;

  // 5. Dibujar Sombra suave de la alfombra
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  // Dibujar Borde biselado de hule (negro perimetral)
  const bevelBorderPx = Math.max(3, 2.5 * pixelsPerCm);
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(matX - bevelBorderPx, matY - bevelBorderPx, matPixelW + bevelBorderPx * 2, matPixelH + bevelBorderPx * 2);
  ctx.restore();

  // 6. Dibujar Cuerpo principal de la alfombra con el color base seleccionado
  ctx.fillStyle = config.baseColor || '#111111';
  ctx.fillRect(matX, matY, matPixelW, matPixelH);

  // Textura sutil de rizo atrapamugre Nomad
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let r = matY; r < matY + matPixelH; r += 6) {
    ctx.fillRect(matX, r, matPixelW, 1);
  }
  ctx.restore();

  // 7. Línea de Margen de Seguridad Perimetral de 7.5 cm (Línea punteada)
  const marginPx = 7.5 * pixelsPerCm;
  ctx.save();
  ctx.strokeStyle = '#E5A93C'; // Dorado de seguridad
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(matX + marginPx, matY + marginPx, matPixelW - marginPx * 2, matPixelH - marginPx * 2);
  ctx.restore();

  // 8. Dibujar el Logotipo del cliente centrado y escalado dentro del área segura
  const safeAreaW = Math.max(20, matPixelW - marginPx * 2);
  const safeAreaH = Math.max(20, matPixelH - marginPx * 2);
  const safeCenterX = matX + matPixelW / 2;
  const safeCenterY = matY + matPixelH / 2;

  if (config.logoImage && config.logoImage.complete && config.logoImage.naturalWidth > 0) {
    const logoImg = config.logoImage;
    const aspectLogo = logoImg.naturalWidth / logoImg.naturalHeight;

    // Escalar para que quepa perfectamente dentro del área de seguridad
    let logoDrawW = safeAreaW * (config.logoScale || 0.85);
    let logoDrawH = logoDrawW / aspectLogo;

    if (logoDrawH > safeAreaH * (config.logoScale || 0.85)) {
      logoDrawH = safeAreaH * (config.logoScale || 0.85);
      logoDrawW = logoDrawH * aspectLogo;
    }

    const logoDrawX = safeCenterX - logoDrawW / 2;
    const logoDrawY = safeCenterY - logoDrawH / 2;

    ctx.save();
    ctx.drawImage(logoImg, logoDrawX, logoDrawY, logoDrawW, logoDrawH);
    ctx.restore();
  } else {
    // Si no hay logo subido aún, mostrar placeholder arquitectónico
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SUBE TU LOGO AQUÍ', safeCenterX, safeCenterY - 10);
    ctx.font = '10px sans-serif';
    ctx.fillText(`Margen de 7.5 cm protegido`, safeCenterX, safeCenterY + 12);
    ctx.restore();
  }

  // 9. Dibujar Cotas de Medición (Líneas de medida con flechas)
  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.font = 'bold 11px sans-serif';

  // Cota Superior (Ancho)
  const dimY = matY - 18;
  drawLineWithArrows(ctx, matX, dimY, matX + matPixelW, dimY);
  ctx.textAlign = 'center';
  ctx.fillText(`${config.widthCm} cm`, matX + matPixelW / 2, dimY - 4);

  // Cota Lateral Izquierda (Alto)
  const dimX = matX - 18;
  drawLineWithArrows(ctx, dimX, matY, dimX, matY + matPixelH);
  ctx.save();
  ctx.translate(dimX - 6, matY + matPixelH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText(`${config.heightCm} cm`, 0, 0);
  ctx.restore();

  // Indicador de margen 7.5 cm
  ctx.fillStyle = '#C62828';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Margen perimetral: 7.5 cm | Troquel mín: 1.0 cm`, matX, matY + matPixelH + 18);

  ctx.textAlign = 'right';
  const areaM2 = ((config.widthCm * config.heightCm) / 10000).toFixed(2);
  ctx.fillText(`Área: ${areaM2} m² | Troquelado en colores planos sólidos`, matX + matPixelW, matY + matPixelH + 18);
  ctx.restore();

  // 10. Datos Dinámicos en los recuadros del cajetín inferior
  // Si el cliente especificó nombre o datos, se imprimen elegantemente
  if (config.clientName) {
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(`Cliente: ${config.clientName.toUpperCase()}`, 68, 595);
    ctx.font = '8px sans-serif';
    ctx.fillText(`Fecha: ${new Date().toLocaleDateString('es-CR')}`, 68, 607);
    ctx.restore();
  }
}

// Helper para dibujar líneas de cota con flechas en ambos extremos
function drawLineWithArrows(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const arrowSize = 5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Flecha 1
  const angle1 = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + arrowSize * Math.cos(angle1 + Math.PI / 6), y1 + arrowSize * Math.sin(angle1 + Math.PI / 6));
  ctx.lineTo(x1 + arrowSize * Math.cos(angle1 - Math.PI / 6), y1 + arrowSize * Math.sin(angle1 - Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  // Flecha 2
  const angle2 = Math.atan2(y1 - y2, x1 - x2);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 + arrowSize * Math.cos(angle2 + Math.PI / 6), y2 + arrowSize * Math.sin(angle2 + Math.PI / 6));
  ctx.lineTo(x2 + arrowSize * Math.cos(angle2 - Math.PI / 6), y2 + arrowSize * Math.sin(angle2 - Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}
