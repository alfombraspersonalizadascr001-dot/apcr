/**
 * APCR - Procesador de Logotipos para Troquelado de Alfombras
 * Funciones clave:
 * 1. Eliminación automática de fondo (blanco, negro o color dominante en bordes)
 * 2. Recorte exacto de bordes transparentes (trimming)
 * 3. Escalado al tamaño MÁXIMO dentro del área segura (margen de 7.5 cm)
 * 4. Detección y eliminación automática de cualquier elemento < 1.0 cm a escala real
 */

export interface LogoProcessResult {
  processedDataUrl: string;
  processedImage: HTMLImageElement;
  elementsRemovedCount: number;
  originalDimensions: { w: number; h: number };
  croppedDimensions: { w: number; h: number };
  physicalLogoSizeCm: { w: number; h: number };
  minFeatureSizeCm: number;
  pixelsPerCm: number;
}

/**
 * Procesa el logotipo aplicando:
 * - Eliminación de fondo
 * - Recorte de áreas vacías
 * - Eliminación de elementos < 1.0 cm a escala real
 * - Ajuste al tamaño MÁXIMO permitido (margen de 7.5 cm)
 */
export async function processLogoForDieCut(
  sourceImage: HTMLImageElement,
  matWidthCm: number,
  matHeightCm: number,
  marginCm = 7.5,
  minDieCutSizeCm = 1.0
): Promise<LogoProcessResult> {
  const origW = sourceImage.naturalWidth || sourceImage.width;
  const origH = sourceImage.naturalHeight || sourceImage.height;

  // 1. Crear canvas de trabajo para la imagen original
  const canvas = document.createElement('canvas');
  canvas.width = origW;
  canvas.height = origH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('No se pudo inicializar el contexto 2D');

  ctx.drawImage(sourceImage, 0, 0);
  const imgData = ctx.getImageData(0, 0, origW, origH);
  const data = imgData.data;

  // 2. ELIMINACIÓN AUTOMÁTICA DE FONDO
  // Muestrear los 4 bordes/esquinas para identificar el color de fondo
  const corners = [
    [0, 0],
    [origW - 1, 0],
    [0, origH - 1],
    [origW - 1, origH - 1],
    [Math.floor(origW / 2), 0],
    [Math.floor(origW / 2), origH - 1]
  ];

  let bgR = 0, bgG = 0, bgB = 0, bgCount = 0;
  for (const [cx, cy] of corners) {
    const idx = (cy * origW + cx) * 4;
    const a = data[idx + 3];
    if (a > 200) {
      bgR += data[idx];
      bgG += data[idx + 1];
      bgB += data[idx + 2];
      bgCount++;
    }
  }

  const hasDetectedBg = bgCount > 0;
  if (hasDetectedBg) {
    bgR = Math.round(bgR / bgCount);
    bgG = Math.round(bgG / bgCount);
    bgB = Math.round(bgB / bgCount);

    const isWhiteBg = bgR > 230 && bgG > 230 && bgB > 230;
    const isBlackBg = bgR < 25 && bgG < 25 && bgB < 25;
    const tolerance = isWhiteBg ? 45 : (isBlackBg ? 35 : 30);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a === 0) continue;

      const diff = Math.sqrt(
        Math.pow(r - bgR, 2) + 
        Math.pow(g - bgG, 2) + 
        Math.pow(b - bgB, 2)
      );

      if (diff <= tolerance) {
        data[i + 3] = 0; // Hacer transparente
      } else if (diff < tolerance + 15) {
        // Suavizado de bordes anti-aliasing
        const fade = (diff - tolerance) / 15;
        data[i + 3] = Math.round(a * fade);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // 3. RECORTE DE ESPACIO TRANSPARENTE SOBRANTE (TRIMMING)
  let minX = origW, minY = origH, maxX = 0, maxY = 0;
  let hasPixels = false;

  for (let y = 0; y < origH; y++) {
    for (let x = 0; x < origW; x++) {
      const alpha = data[(y * origW + x) * 4 + 3];
      if (alpha > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        hasPixels = true;
      }
    }
  }

  if (!hasPixels) {
    minX = 0; minY = 0; maxX = origW - 1; maxY = origH - 1;
  }

  const croppedW = Math.max(1, maxX - minX + 1);
  const croppedH = Math.max(1, maxY - minY + 1);

  // Crear canvas recortado
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = croppedW;
  cropCanvas.height = croppedH;
  const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });
  if (!cropCtx) throw new Error('Error al recortar canvas');

  cropCtx.drawImage(canvas, minX, minY, croppedW, croppedH, 0, 0, croppedW, croppedH);

  // 4. CÁLCULO DE ESCALA REAL AL TAMAÑO MÁXIMO EN LA ALFOMBRA
  // Área segura con margen de 7.5 cm en los 4 costados:
  const safeAreaWCm = Math.max(10, matWidthCm - marginCm * 2);
  const safeAreaHCm = Math.max(10, matHeightCm - marginCm * 2);

  const aspectLogo = croppedW / croppedH;
  const aspectSafe = safeAreaWCm / safeAreaHCm;

  let physicalLogoWCm: number;
  let physicalLogoHCm: number;

  // Llenar al MÁXIMO posible el área segura respetando la proporción
  if (aspectLogo > aspectSafe) {
    physicalLogoWCm = safeAreaWCm;
    physicalLogoHCm = safeAreaWCm / aspectLogo;
  } else {
    physicalLogoHCm = safeAreaHCm;
    physicalLogoWCm = safeAreaHCm * aspectLogo;
  }

  // Factor de conversión: píxeles de la imagen por centímetro real en la alfombra
  const pixelsPerCm = croppedW / physicalLogoWCm;
  const minElementSizePx = minDieCutSizeCm * pixelsPerCm;

  // 5. DETECCIÓN Y ELIMINACIÓN DE ELEMENTOS < 1.0 CM (ANÁLISIS DE COMPONENTES CONECTADOS)
  const cropImgData = cropCtx.getImageData(0, 0, croppedW, croppedH);
  const cropData = cropImgData.data;

  // Matriz de visitados para flood fill BFS
  const visited = new Uint8Array(croppedW * croppedH);
  let elementsRemovedCount = 0;

  for (let y = 0; y < croppedH; y++) {
    for (let x = 0; x < croppedW; x++) {
      const idx = y * croppedW + x;
      const alpha = cropData[idx * 4 + 3];

      if (alpha <= 30 || visited[idx] === 1) continue;

      // Iniciar búsqueda de componente conectado (isla)
      const queue: number[] = [idx];
      visited[idx] = 1;

      let cMinX = x, cMaxX = x, cMinY = y, cMaxY = y;
      const componentPixels: number[] = [];

      let qHead = 0;
      while (qHead < queue.length) {
        const cur = queue[qHead++];
        componentPixels.push(cur);

        const curX = cur % croppedW;
        const curY = Math.floor(cur / croppedW);

        if (curX < cMinX) cMinX = curX;
        if (curX > cMaxX) cMaxX = curX;
        if (curY < cMinY) cMinY = curY;
        if (curY > cMaxY) cMaxY = curY;

        // 4 vecinos
        const neighbors = [
          curX > 0 ? cur - 1 : -1,
          curX < croppedW - 1 ? cur + 1 : -1,
          curY > 0 ? cur - croppedW : -1,
          curY < croppedH - 1 ? cur + croppedW : -1
        ];

        for (const n of neighbors) {
          if (n >= 0 && visited[n] === 0 && cropData[n * 4 + 3] > 30) {
            visited[n] = 1;
            queue.push(n);
          }
        }
      }

      // Medir tamaño del componente en cm reales
      const compWidthPx = cMaxX - cMinX + 1;
      const compHeightPx = cMaxY - cMinY + 1;
      const compMaxDimCm = Math.max(compWidthPx, compHeightPx) / pixelsPerCm;

      // REGLA TÉCNICA: Si el elemento mide MENOS de 1.0 cm a escala, SE ELIMINA
      if (compMaxDimCm < minDieCutSizeCm) {
        for (const p of componentPixels) {
          cropData[p * 4 + 3] = 0; // Borrar píxel
        }
        elementsRemovedCount++;
      }
    }
  }

  // Guardar datos limpios en el canvas
  cropCtx.putImageData(cropImgData, 0, 0);

  // 6. Generar HTMLImageElement y URL del resultado
  const processedDataUrl = cropCanvas.toDataURL('image/png', 1.0);
  const processedImage = new Image();
  await new Promise((resolve) => {
    processedImage.onload = resolve;
    processedImage.src = processedDataUrl;
  });

  return {
    processedDataUrl,
    processedImage,
    elementsRemovedCount,
    originalDimensions: { w: origW, h: origH },
    croppedDimensions: { w: croppedW, h: croppedH },
    physicalLogoSizeCm: {
      w: parseFloat(physicalLogoWCm.toFixed(1)),
      h: parseFloat(physicalLogoHCm.toFixed(1))
    },
    minFeatureSizeCm: minDieCutSizeCm,
    pixelsPerCm: parseFloat(pixelsPerCm.toFixed(1))
  };
}
