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
 * 7. Re-recorte y re-maximización de los elementos troquelables restantes
 */

export interface LogoProcessResult {
  processedDataUrl: string;
  processedImage: HTMLImageElement;
  originalDataUrl: string;
  elementsRemovedCount: number;
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
 * 5. Re-escalado al tamaño MÁXIMO absoluto dentro del área segura
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
  // Muestrear píxeles perimetrales para detectar si ya es transparente o el color de fondo
  let transparentPerimeterCount = 0;
  let perimeterTotal = 0;
  const perimeterColors: Array<[number, number, number]> = [];

  // Muestrear borde superior e inferior
  for (let x = 0; x < workW; x += 2) {
    const topIdx = x * 4;
    const botIdx = ((workH - 1) * workW + x) * 4;
    perimeterTotal += 2;
    if (data[topIdx + 3] < 30) transparentPerimeterCount++;
    else perimeterColors.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);

    if (data[botIdx + 3] < 30) transparentPerimeterCount++;
    else perimeterColors.push([data[botIdx], data[botIdx + 1], data[botIdx + 2]]);
  }

  // Muestrear borde izquierdo y derecho
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
    // Determinar el color de fondo dominante en el perímetro
    let sumR = 0, sumG = 0, sumB = 0;
    for (const [r, g, b] of perimeterColors) {
      sumR += r; sumG += g; sumB += b;
    }
    const bgR = Math.round(sumR / perimeterColors.length);
    const bgG = Math.round(sumG / perimeterColors.length);
    const bgB = Math.round(sumB / perimeterColors.length);

    const tolerance = options.tolerance || 38;
    const tolSq = tolerance * tolerance;

    // Cola Flood-Fill usando Int32Array para rendimiento nativo de alta velocidad
    const totalPixels = workW * workH;
    const visited = new Uint8Array(totalPixels);
    const queue = new Int32Array(totalPixels);
    let qHead = 0;
    let qTail = 0;

    // Sembrar toda la frontera exterior (4 bordes)
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

    // Expansión Flood-Fill (solo borra fondo conectado con los bordes exteriores)
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
        data[idx + 3] = 0; // Transparente

        // Propagar a los 4 vecinos ortogonales
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
        // Suavizado anti-aliasing en el contorno del logo
        const dist = Math.sqrt(distSq);
        const fade = (dist - tolerance) / 12;
        data[idx + 3] = Math.round(data[idx + 3] * Math.max(0, Math.min(1, fade)));
      }
    }
  }

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
  // Área segura respetando 7.5 cm en los 4 bordes de la alfombra:
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
  // PASO 4: ANÁLISIS DE COMPONENTES CONECTADOS (CCL) & ELIMINACIÓN < 1.0 CM
  // =========================================================================
  const compVisited = new Uint8Array(workW * workH);
  const cQueue = new Int32Array(workW * workH);
  let elementsRemovedCount = 0;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = y * workW + x;
      if (data[p * 4 + 3] <= 25 || compVisited[p]) continue;

      // Explorar componente conectado (8 vecinos para mantener letras unidas)
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

      // Medir tamaño del componente a escala física real en centímetros
      const compWPx = cMaxX - cMinX + 1;
      const compHPx = cMaxY - cMinY + 1;
      const compWCm = compWPx / pixelsPerCm;
      const compHCm = compHPx / pixelsPerCm;
      const compMaxDimCm = Math.max(compWCm, compHCm);

      // CRITERIO TÉCNICO DE FABRICACIÓN (TROQUELADO VINIL 12MM):
      // En corte e incrustación de alfombra Nomad de 12mm de espesor:
      // Cualquier elemento, letra, subtítulo, trazo o detalle que a escala real mida menos de 1.0 cm
      // en su altura o en su ancho NO se puede troquelar sin romperse o deformarse.
      const isTooSmall = 
        compMaxDimCm < minDieCutSizeCm || 
        compHCm < minDieCutSizeCm || 
        compWCm < minDieCutSizeCm;

      if (isTooSmall) {
        for (let i = 0; i < cTail; i++) {
          data[cQueue[i] * 4 + 3] = 0; // Eliminar píxel (hacer transparente)
        }
        elementsRemovedCount++;
      }
    }
  }

  // =========================================================================
  // PASO 5: RE-TRIMMING & RE-MAXIMIZACIÓN DE ELEMENTOS RESTANTES
  // =========================================================================
  // Si se eliminaron subtítulos o detalles en los extremos, re-ajustar el cuadro
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

  // Recalcular tamaño físico MÁXIMO absoluto en el área segura de la alfombra
  aspect = cropW / cropH;
  if (aspect >= safeAspect) {
    logoWCm = safeWCm;
    logoHCm = safeWCm / aspect;
  } else {
    logoHCm = safeHCm;
    logoWCm = safeHCm * aspect;
  }
  pixelsPerCm = cropW / logoWCm;

  // Actualizar imagen con los píxeles limpios
  ctx.putImageData(imgData, 0, 0);

  // Crear canvas final recortado exactamente a los gráficos limpios
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = cropW;
  finalCanvas.height = cropH;
  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) throw new Error('Error al generar canvas final');

  finalCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

  // Opcional: Si el usuario solicitó recolorear a un vinil específico (e.g. Blanco para alfombra oscura)
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

  return {
    processedDataUrl,
    processedImage,
    originalDataUrl,
    elementsRemovedCount,
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
