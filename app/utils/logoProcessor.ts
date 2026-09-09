/**
 * APCR - Procesador Técnico de Logotipos para Troquelado de Alfombras
 * 
 * Reglas Técnicas de Fabricación:
 * 1. Medida mínima oficial de alfombra: 120 × 100 cm
 * 2. Margen de seguridad perimetral obligatorio: 7.5 cm en los 4 bordes
 * 3. Eliminación de fondo exterior mediante Flood-Fill perimetral (conservando blancos y detalles internos del logo)
 * 4. Recorte milimétrico automático de bordes transparentes (Auto-trimming)
 * 5. Escalado al tamaño MÁXIMO dentro del área segura (W - 15 cm, H - 15 cm)
 * 6. Análisis de componentes conectados (CCL): Eliminación de cualquier elemento < 1.0 cm a escala real
 * 7. Generación de Auditoría de Viabilidad Técnica & Mapa de Rayos X (Rojo = No viable, Verde = Aprobado)
 * 8. Re-recorte y re-maximización de los elementos troquelables restantes
 */

export interface ViabilityAudit {
  status: 'viable' | 'needs_simplification' | 'rejected';
  badgeText: string;
  title: string;
  description: string;
  issues: string[];
  smallElementsCount: number;
  smallestElementCm: number;
  suggestedMatWidthCm?: number;
  isRealisticPhoto: boolean;
}

export interface LogoProcessResult {
  processedDataUrl: string;
  processedImage: HTMLImageElement;
  originalDataUrl: string;
  xrayDataUrl: string;                // Mapa de Rayos X: Rojo = <1.0cm (no troquelable), Verde = >=1.0cm (aprobado)
  elementsRemovedCount: number;
  viability: ViabilityAudit;          // Diagnóstico técnico de taller
  originalDimensions: { w: number; h: number };
  croppedDimensions: { w: number; h: number };
  physicalLogoSizeCm: { w: number; h: number };
  safeAreaSizeCm: { w: number; h: number };
  pixelsPerCm: number;
  minDieCutSizeCm: number;
}

export interface LogoProcessOptions {
  tolerance?: number;             // Tolerancia para remoción de fondo (default 38)
  customVinylColor?: string;      // Color de vinil para recolorear siluetas monocromáticas (hex)
}

/**
 * Procesa el logotipo aplicando:
 * 1. Remoción de fondo perimetral (flood-fill desde bordes exteriores)
 * 2. Recorte automático a los límites exactos de los gráficos
 * 3. Mapeo a la escala física real de la alfombra (con margen de 7.5 cm)
 * 4. Detección y eliminación automática de cualquier elemento < 1.0 cm
 * 5. Generación de mapa de calor / Rayos X de troquel
 * 6. Re-escalado al tamaño MÁXIMO absoluto dentro del área segura
 */
export async function processLogoForDieCut(
  sourceImage: HTMLImageElement,
  matWidthCm: number,
  matHeightCm: number,
  marginCm = 7.5,
  minDieCutSizeCm = 1.0,
  options: LogoProcessOptions = {}
): Promise<LogoProcessResult> {
  const origW = sourceImage.naturalWidth || sourceImage.width;
  const origH = sourceImage.naturalHeight || sourceImage.height;

  if (!origW || !origH) {
    throw new Error('La imagen proporcionada no tiene dimensiones válidas');
  }

  // Guardar URL original para comparativas
  const origCanvas = document.createElement('canvas');
  origCanvas.width = origW;
  origCanvas.height = origH;
  const origCtx = origCanvas.getContext('2d');
  if (origCtx) origCtx.drawImage(sourceImage, 0, 0);
  const originalDataUrl = origCanvas.toDataURL('image/png');

  // Limitar resolución de trabajo a un máximo de 1600px para garantizar ejecución ultra rápida (<40ms)
  // sin perder precisión milimétrica (1600px / 150cm = ~10.6 px/cm -> 1mm = ~1px)
  const MAX_PROCESS_DIM = 1600;
  let workW = origW;
  let workH = origH;
  if (workW > MAX_PROCESS_DIM || workH > MAX_PROCESS_DIM) {
    if (workW > workH) {
      workH = Math.round((workH * MAX_PROCESS_DIM) / workW);
      workW = MAX_PROCESS_DIM;
    } else {
      workW = Math.round((workW * MAX_PROCESS_DIM) / workH);
      workH = MAX_PROCESS_DIM;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = workW;
  canvas.height = workH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('No se pudo inicializar el contexto 2D');

  ctx.drawImage(sourceImage, 0, 0, workW, workH);
  const imgData = ctx.getImageData(0, 0, workW, workH);
  const data = imgData.data;

  // =========================================================================
  // PASO 1: REMOCIÓN DE FONDO EXTERIOR (FLOOD-FILL DESDE PERÍMETRO)
  // =========================================================================
  let transparentPerimeterCount = 0;
  let perimeterTotal = 0;
  const perimeterColors: Array<[number, number, number]> = [];

  for (let x = 0; x < workW; x += 2) {
    const topIdx = x * 4;
    const botIdx = ((workH - 1) * workW + x) * 4;
    perimeterTotal += 2;
    if (data[topIdx + 3] < 30) transparentPerimeterCount++;
    else perimeterColors.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);

    if (data[botIdx + 3] < 30) transparentPerimeterCount++;
    else perimeterColors.push([data[botIdx], data[botIdx + 1], data[botIdx + 2]]);
  }

  for (let y = 1; y < workH - 1; y += 2) {
    const leftIdx = (y * workW) * 4;
    const rightIdx = (y * workW + (workW - 1)) * 4;
    perimeterTotal += 2;
    if (data[leftIdx + 3] < 30) transparentPerimeterCount++;
    else perimeterColors.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);

    if (data[rightIdx + 3] < 30) transparentPerimeterCount++;
    else perimeterColors.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
  }

  const isAlreadyTransparent = transparentPerimeterCount > perimeterTotal * 0.25;

  if (!isAlreadyTransparent && perimeterColors.length > 0) {
    let sumR = 0, sumG = 0, sumB = 0;
    for (const [r, g, b] of perimeterColors) {
      sumR += r; sumG += g; sumB += b;
    }
    const bgR = Math.round(sumR / perimeterColors.length);
    const bgG = Math.round(sumG / perimeterColors.length);
    const bgB = Math.round(sumB / perimeterColors.length);

    const tolerance = options.tolerance || 38;
    const tolSq = tolerance * tolerance;

    const totalPixels = workW * workH;
    const visited = new Uint8Array(totalPixels);
    const queue = new Int32Array(totalPixels);
    let qHead = 0;
    let qTail = 0;

    for (let x = 0; x < workW; x++) {
      queue[qTail++] = x;
      visited[x] = 1;
      const bIdx = (workH - 1) * workW + x;
      queue[qTail++] = bIdx;
      visited[bIdx] = 1;
    }
    for (let y = 1; y < workH - 1; y++) {
      const lIdx = y * workW;
      queue[qTail++] = lIdx;
      visited[lIdx] = 1;
      const rIdx = y * workW + (workW - 1);
      queue[qTail++] = rIdx;
      visited[rIdx] = 1;
    }

    while (qHead < qTail) {
      const p = queue[qHead++];
      const px = p % workW;
      const py = (p / workW) | 0;
      const idx = p * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const distSq = (r - bgR) * (r - bgR) + (g - bgG) * (g - bgG) + (b - bgB) * (b - bgB);

      if (distSq <= tolSq) {
        data[idx + 3] = 0;

        if (px > 0) {
          const n = p - 1;
          if (!visited[n]) { visited[n] = 1; queue[qTail++] = n; }
        }
        if (px < workW - 1) {
          const n = p + 1;
          if (!visited[n]) { visited[n] = 1; queue[qTail++] = n; }
        }
        if (py > 0) {
          const n = p - workW;
          if (!visited[n]) { visited[n] = 1; queue[qTail++] = n; }
        }
        if (py < workH - 1) {
          const n = p + workW;
          if (!visited[n]) { visited[n] = 1; queue[qTail++] = n; }
        }
      } else if (distSq <= (tolerance + 12) * (tolerance + 12)) {
        const dist = Math.sqrt(distSq);
        const fade = (dist - tolerance) / 12;
        data[idx + 3] = Math.round(data[idx + 3] * Math.max(0, Math.min(1, fade)));
      }
    }
  }

  // =========================================================================
  // PASO 1.5: DETECCIÓN DE DEGRADADOS O FOTOS REALISTAS
  // =========================================================================
  const colorSet = new Set<number>();
  let foregroundCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 30) {
      foregroundCount++;
      const key = ((data[i] >> 3) << 10) | ((data[i + 1] >> 3) << 5) | (data[i + 2] >> 3);
      colorSet.add(key);
    }
  }
  const isRealisticPhoto = colorSet.size > 1400;

  // =========================================================================
  // PASO 2: AUTO-TRIMMING INICIAL (RECORTE DE MÁRGENES TRANSPARENTES)
  // =========================================================================
  let minX = workW, maxX = 0, minY = workH, maxY = 0;
  let hasForeground = false;

  for (let y = 0; y < workH; y++) {
    for (let x = 0; x < workW; x++) {
      if (data[(y * workW + x) * 4 + 3] > 25) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        hasForeground = true;
      }
    }
  }

  if (!hasForeground) {
    minX = 0; maxX = workW - 1; minY = 0; maxY = workH - 1;
  }

  let cropW = Math.max(1, maxX - minX + 1);
  let cropH = Math.max(1, maxY - minY + 1);

  // =========================================================================
  // PASO 3: CÁLCULO DE ESCALA FÍSICA AL TAMAÑO MÁXIMO EN ÁREA SEGURA
  // =========================================================================
  const safeWCm = Math.max(10, matWidthCm - marginCm * 2);
  const safeHCm = Math.max(10, matHeightCm - marginCm * 2);

  let aspect = cropW / cropH;
  let safeAspect = safeWCm / safeHCm;

  let logoWCm: number;
  let logoHCm: number;

  if (aspect >= safeAspect) {
    logoWCm = safeWCm;
    logoHCm = safeWCm / aspect;
  } else {
    logoHCm = safeHCm;
    logoWCm = safeHCm * aspect;
  }

  let pixelsPerCm = cropW / logoWCm;

  // =========================================================================
  // PASO 4: ANÁLISIS DE COMPONENTES CONECTADOS (CCL), RAYOS X & ELIMINACIÓN < 1.0 CM
  // =========================================================================
  // Crear canvas de Rayos X técnico (muestra en Rojo lo no troquelable y en Verde lo aprobado)
  const xrayCanvas = document.createElement('canvas');
  xrayCanvas.width = workW;
  xrayCanvas.height = workH;
  const xrayCtx = xrayCanvas.getContext('2d');
  const xrayImgData = xrayCtx?.createImageData(workW, workH);
  const xrayData = xrayImgData ? xrayImgData.data : new Uint8ClampedArray(workW * workH * 4);

  const compVisited = new Uint8Array(workW * workH);
  const cQueue = new Int32Array(workW * workH);
  let elementsRemovedCount = 0;
  let smallestElementCm = 999;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = y * workW + x;
      if (data[p * 4 + 3] <= 25 || compVisited[p]) continue;

      let cHead = 0;
      let cTail = 0;
      cQueue[cTail++] = p;
      compVisited[p] = 1;

      let cMinX = x, cMaxX = x, cMinY = y, cMaxY = y;

      while (cHead < cTail) {
        const cur = cQueue[cHead++];
        const cx = cur % workW;
        const cy = (cur / workW) | 0;

        if (cx < cMinX) cMinX = cx;
        if (cx > cMaxX) cMaxX = cx;
        if (cy < cMinY) cMinY = cy;
        if (cy > cMaxY) cMaxY = cy;

        const neighbors = [
          cx > 0 ? cur - 1 : -1,
          cx < workW - 1 ? cur + 1 : -1,
          cy > 0 ? cur - workW : -1,
          cy < workH - 1 ? cur + workW : -1,
          cx > 0 && cy > 0 ? cur - workW - 1 : -1,
          cx < workW - 1 && cy > 0 ? cur - workW + 1 : -1,
          cx > 0 && cy < workH - 1 ? cur + workW - 1 : -1,
          cx < workW - 1 && cy < workH - 1 ? cur + workW + 1 : -1
        ];

        for (const nb of neighbors) {
          if (nb >= 0 && !compVisited[nb] && data[nb * 4 + 3] > 25) {
            compVisited[nb] = 1;
            cQueue[cTail++] = nb;
          }
        }
      }

      const compWPx = cMaxX - cMinX + 1;
      const compHPx = cMaxY - cMinY + 1;
      const compWCm = compWPx / pixelsPerCm;
      const compHCm = compHPx / pixelsPerCm;
      const compMaxDimCm = Math.max(compWCm, compHCm);

      // CRITERIO TÉCNICO DE FABRICACIÓN (TROQUELADO VINIL 12MM):
      // En alfombras Nomad de 12mm: cualquier elemento, letra o trazo menor a 1.0 cm
      // en su altura o en su ancho NO se puede troquelar sin romperse o desprenderse.
      const isTooSmall = 
        compMaxDimCm < minDieCutSizeCm || 
        compHCm < minDieCutSizeCm || 
        compWCm < minDieCutSizeCm;

      if (isTooSmall) {
        smallestElementCm = Math.min(smallestElementCm, compMaxDimCm);
        for (let i = 0; i < cTail; i++) {
          const pi = cQueue[i];
          data[pi * 4 + 3] = 0; // Borrar del archivo troquelable

          // En Rayos X: Pintar en ROJO carmesí de advertencia
          const xi = pi * 4;
          xrayData[xi] = 239;     // R
          xrayData[xi + 1] = 68;  // G
          xrayData[xi + 2] = 68;  // B
          xrayData[xi + 3] = 255; // Alpha
        }
        elementsRemovedCount++;
      } else {
        // En Rayos X: Pintar en VERDE esmeralda de aprobación
        for (let i = 0; i < cTail; i++) {
          const pi = cQueue[i];
          const xi = pi * 4;
          xrayData[xi] = 16;      // R
          xrayData[xi + 1] = 185; // G
          xrayData[xi + 2] = 129; // B
          xrayData[xi + 3] = 255; // Alpha
        }
      }
    }
  }

  // =========================================================================
  // PASO 5: RE-TRIMMING & RE-MAXIMIZACIÓN DE ELEMENTOS RESTANTES
  // =========================================================================
  minX = workW; maxX = 0; minY = workH; maxY = 0;
  let remainingPixels = 0;

  for (let y = 0; y < workH; y++) {
    for (let x = 0; x < workW; x++) {
      if (data[(y * workW + x) * 4 + 3] > 25) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        remainingPixels++;
      }
    }
  }

  if (remainingPixels > 0) {
    cropW = Math.max(1, maxX - minX + 1);
    cropH = Math.max(1, maxY - minY + 1);
  }

  aspect = cropW / cropH;
  if (aspect >= safeAspect) {
    logoWCm = safeWCm;
    logoHCm = safeWCm / aspect;
  } else {
    logoHCm = safeHCm;
    logoWCm = safeHCm * aspect;
  }
  pixelsPerCm = cropW / logoWCm;

  ctx.putImageData(imgData, 0, 0);

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = cropW;
  finalCanvas.height = cropH;
  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) throw new Error('Error al generar canvas final');

  finalCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

  if (options.customVinylColor) {
    finalCtx.globalCompositeOperation = 'source-in';
    finalCtx.fillStyle = options.customVinylColor;
    finalCtx.fillRect(0, 0, cropW, cropH);
    finalCtx.globalCompositeOperation = 'source-over';
  }

  const processedDataUrl = finalCanvas.toDataURL('image/png', 1.0);
  const processedImage = new Image();
  await new Promise((resolve) => {
    processedImage.onload = resolve;
    processedImage.src = processedDataUrl;
  });

  // Exportar mapa de Rayos X recortado a las mismas proporciones
  if (xrayCtx && xrayImgData) {
    xrayCtx.putImageData(xrayImgData, 0, 0);
  }
  const finalXrayCanvas = document.createElement('canvas');
  finalXrayCanvas.width = cropW;
  finalXrayCanvas.height = cropH;
  const finalXrayCtx = finalXrayCanvas.getContext('2d');
  if (finalXrayCtx) {
    finalXrayCtx.drawImage(xrayCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  }
  const xrayDataUrl = finalXrayCanvas.toDataURL('image/png', 1.0);

  // =========================================================================
  // PASO 6: AUDITORÍA DE VIABILIDAD TÉCNICA (SEMÁFORO DE TALLER)
  // =========================================================================
  let viabilityStatus: 'viable' | 'needs_simplification' | 'rejected';
  let badgeText: string;
  let title: string;
  let description: string;
  const issues: string[] = [];

  if (smallestElementCm === 999) smallestElementCm = 1.0;
  const smallestFormatted = parseFloat(smallestElementCm.toFixed(1));

  let suggestedMatWidthCm: number | undefined = undefined;
  if (elementsRemovedCount > 0 && smallestElementCm > 0.1) {
    suggestedMatWidthCm = Math.min(400, Math.round(matWidthCm * (1.05 / smallestElementCm)));
  }

  if (isRealisticPhoto) {
    viabilityStatus = 'rejected';
    badgeText = 'NO APTO PARA TROQUELADO';
    title = 'Diseño Fotográfico o con Degradados Continuos';
    description = 'El archivo parece ser una fotografía o tener degradados de color continuos. Las alfombras Nomad de 12mm se fabrican mediante incrustación de piezas sólidas de vinil plano.';
    issues.push('Contiene degradados complejos que no se pueden troquelar en vinil.');
    issues.push('Requiere vectorización previa o adaptación a colores sólidos.');
  } else if (elementsRemovedCount > 0) {
    viabilityStatus = 'needs_simplification';
    badgeText = 'REQUIERE SIMPLIFICACIÓN TÉCNICA';
    title = 'Logotipo con Letras o Trazos Menores a 1.0 cm';
    description = `Se detectaron ${elementsRemovedCount} detalle(s) o letras menores a 1.0 cm (mínimo de corte de 10mm). El sistema aisló el isotipo y nombre principal apto para garantizar un troquelado perfecto.`;
    issues.push(`${elementsRemovedCount} elemento(s) o subtítulos miden menos de 1.0 cm a escala real.`);
    issues.push('En vinil Nomad de 12mm, letras menores a 10mm se despedazan con las cuchillas de corte.');
  } else {
    viabilityStatus = 'viable';
    badgeText = '100% APTO PARA TROQUELADO';
    title = 'Logotipo Aprobado para Fabricación';
    description = 'Todos los trazos, letras y elementos superan el grosor mínimo de 1.0 cm a escala real. El archivo está listo para producción en taller.';
  }

  return {
    processedDataUrl,
    processedImage,
    originalDataUrl,
    xrayDataUrl,
    elementsRemovedCount,
    viability: {
      status: viabilityStatus,
      badgeText,
      title,
      description,
      issues,
      smallElementsCount: elementsRemovedCount,
      smallestElementCm: smallestFormatted,
      suggestedMatWidthCm,
      isRealisticPhoto
    },
    originalDimensions: { w: origW, h: origH },
    croppedDimensions: { w: cropW, h: cropH },
    physicalLogoSizeCm: {
      w: parseFloat(logoWCm.toFixed(1)),
      h: parseFloat(logoHCm.toFixed(1))
    },
    safeAreaSizeCm: {
      w: parseFloat(safeWCm.toFixed(1)),
      h: parseFloat(safeHCm.toFixed(1))
    },
    pixelsPerCm: parseFloat(pixelsPerCm.toFixed(1)),
    minDieCutSizeCm
  };
}

