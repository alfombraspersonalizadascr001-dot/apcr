// Lógica del Catálogo Maestro de la Colección de Restaurantes Mexicanos de Autor
// Con aplicación dinámica de mundos visuales 100% independientes por restaurante

document.addEventListener('DOMContentLoaded', () => {
  // Estado global de la aplicación
  let currentView = 'catalog';
  let activeRestaurantId = null;
  let activeSectionKey = 'entradas';
  let activePrintFormat = 'flyer'; // 'flyer' (Plastificado HD) o 'classic' (Tradicional)

  // Elementos DOM principales
  const catalogView = document.getElementById('catalogView');
  const restaurantView = document.getElementById('restaurantView');
  const catalogGrid = document.getElementById('catalogGrid');
  
  // Elementos del Header Ampliado
  const brandLogoIcon = document.getElementById('brandLogoIcon');
  const brandKanjiTag = document.getElementById('brandKanjiTag');
  const brandMainName = document.getElementById('brandMainName');
  const brandSubRegion = document.getElementById('brandSubRegion');
  const btnCatalogSwitch = document.getElementById('btnCatalogSwitch');

  // Elementos de la Vista de Restaurante
  const restHeroCard = document.getElementById('restHeroCard');
  const restHeroBg = document.getElementById('restHeroBg');
  const restHeroTitle = document.getElementById('restHeroTitle');
  const restHeroTagline = document.getElementById('restHeroTagline');
  const restHeroKanji = document.getElementById('restHeroKanji');
  const sectionsTabBar = document.getElementById('sectionsTabBar');
  const dishesGrid = document.getElementById('dishesGrid');

  // Modales y Drawer
  const detailModal = document.getElementById('detailModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalImg = document.getElementById('modalImg');
  const modalKanji = document.getElementById('modalKanji');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');

  const printModal = document.getElementById('printModal');
  const btnOpenPrint = document.getElementById('openPrintBtn');
  const btnClosePrint = document.getElementById('closePrintBtn');
  const btnPrintNow = document.getElementById('printNowBtn');
  const printSheetContent = document.getElementById('printSheetContent');

  const printFormatBtns = document.querySelectorAll('.print-format-btn');

  const bitacoraDrawer = document.getElementById('bitacoraDrawer');
  const btnOpenBitacora = document.getElementById('openBitacoraBtn');
  const btnCloseBitacora = document.getElementById('closeBitacoraBtn');

  // 1. Inicialización
  renderCatalogGrid(MEXICAN_RESTAURANTS);

  // 2. Renderizado del Grid del Catálogo Maestro
  function renderCatalogGrid(restaurants) {
    catalogGrid.innerHTML = '';

    restaurants.forEach(rest => {
      const card = document.createElement('div');
      card.className = 'rest-card';
      card.style.background = rest.bgCard;
      card.style.borderColor = rest.borderColor;

      card.innerHTML = `
        <div class="rest-card-imgbox">
          <img src="${rest.heroImage}" alt="${rest.name}" loading="lazy">
          <span class="rest-card-badge">🇲🇽</span>
          <span style="position: absolute; bottom: 0.8rem; right: 0.8rem; padding: 0.25rem 0.75rem; background: rgba(0,0,0,0.85); color: ${rest.accentColor}; font-size: 0.75rem; font-weight: 800; border-radius: 20px; border: 1px solid ${rest.accentColor};">${rest.styleCategory}</span>
        </div>
        <div class="rest-card-body">
          <div class="rest-kanji" style="color: ${rest.accentColor};">${rest.kanji}</div>
          <h3 class="rest-name">${rest.name}</h3>
          <p class="rest-tagline">${rest.tagline}</p>
          <button class="btn-open-world" style="background: linear-gradient(135deg, ${rest.accentColor}, ${rest.secondaryColor}); box-shadow: 0 0 15px ${rest.glowColor};" onclick="openRestaurantWorld('${rest.id}')">
            ✨ Abrir Experiencia (${rest.styleCategory.split(' ')[1] || 'Autor'})
          </button>
        </div>
      `;

      catalogGrid.appendChild(card);
    });
  }

  // 3. Abrir Mundo de Restaurante Individual (APLICACIÓN DE ESTILO ÚNICO)
  window.openRestaurantWorld = function(restId) {
    const rest = MEXICAN_RESTAURANTS.find(r => r.id === restId);
    if (!rest) return;

    activeRestaurantId = restId;
    activeSectionKey = 'entradas';

    // APLICACIÓN DINÁMICA DEL AMBIENTE VISUAL DEL RESTAURANTE
    document.body.style.background = rest.bgMain;
    document.documentElement.style.setProperty('--bg-card', rest.bgCard);
    document.documentElement.style.setProperty('--bg-card-hover', rest.bgCardHover);
    document.documentElement.style.setProperty('--accent-primary', rest.accentColor);
    document.documentElement.style.setProperty('--accent-glow', rest.glowColor);
    document.documentElement.style.setProperty('--border-glass', rest.borderColor);
    document.documentElement.style.setProperty('--font-heading', rest.fontHeading);

    // Actualizar Header Ampliado
    brandLogoIcon.textContent = rest.logoIcon || '🇲🇽';
    brandKanjiTag.textContent = rest.kanji;
    brandMainName.textContent = rest.name;
    brandSubRegion.textContent = `${rest.region} • ${rest.styleCategory}`;

    // Actualizar Héroe
    restHeroBg.src = rest.heroImage;
    restHeroKanji.textContent = `${rest.kanji} — ESTILO ${rest.styleCategory.toUpperCase()}`;
    restHeroKanji.style.color = rest.accentColor;
    restHeroTitle.textContent = rest.name;
    restHeroTagline.textContent = rest.tagline;

    // Renderizar Pestañas de Secciones
    renderSectionTabs(rest);
    renderDishesGrid(rest, 'entradas');

    // Cambiar Vista
    catalogView.style.display = 'none';
    restaurantView.style.display = 'block';
    btnCatalogSwitch.style.display = 'flex';
    currentView = 'restaurant';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Botón para Volver al Catálogo Maestro
  btnCatalogSwitch.addEventListener('click', () => {
    catalogView.style.display = 'block';
    restaurantView.style.display = 'none';
    btnCatalogSwitch.style.display = 'none';

    // Resetear Tema Visual del Catálogo
    document.body.style.background = '#0a0503';
    document.documentElement.style.setProperty('--bg-card', 'rgba(24, 15, 12, 0.85)');
    document.documentElement.style.setProperty('--accent-primary', '#dc2626');
    document.documentElement.style.setProperty('--accent-glow', 'rgba(220, 38, 38, 0.4)');

    brandLogoIcon.textContent = '🇲🇽';
    brandKanjiTag.textContent = 'MEXICAN GASTRONOMY';
    brandMainName.textContent = 'CATÁLOGO MAESTRO MEXICANO';
    brandSubRegion.textContent = '12 MENÚS DE AUTOR • VIRTUAL E IMPRESO';

    currentView = 'catalog';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4. Renderizado de Secciones del Restaurante
  function renderSectionTabs(rest) {
    sectionsTabBar.innerHTML = '';
    const keys = ['entradas', 'fuertes', 'ninos', 'cocteleria', 'postres'];

    keys.forEach((key, index) => {
      const secData = rest.sections[key];
      if (!secData) return;

      const tab = document.createElement('button');
      tab.className = `tab-item ${index === 0 ? 'active' : ''}`;
      tab.dataset.key = key;
      tab.textContent = secData.title;

      if (index === 0) {
        tab.style.background = `linear-gradient(135deg, ${rest.accentColor}, ${rest.secondaryColor})`;
      }

      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-item').forEach(t => {
          t.classList.remove('active');
          t.style.background = 'transparent';
        });
        tab.classList.add('active');
        tab.style.background = `linear-gradient(135deg, ${rest.accentColor}, ${rest.secondaryColor})`;
        activeSectionKey = key;
        renderDishesGrid(rest, key);
      });

      sectionsTabBar.appendChild(tab);
    });
  }

  function renderDishesGrid(rest, sectionKey) {
    const secData = rest.sections[sectionKey];
    dishesGrid.innerHTML = '';

    if (!secData || !secData.items || secData.items.length === 0) {
      dishesGrid.innerHTML = `<p style="color: var(--text-muted);">No hay platillos en esta sección.</p>`;
      return;
    }

    secData.items.forEach(dish => {
      const card = document.createElement('div');
      card.className = 'dish-card';
      card.style.background = rest.bgCard;
      card.style.borderColor = rest.borderColor;

      const tagsHtml = dish.tags ? dish.tags.map(t => `<span style="font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 6px; background: rgba(255,255,255,0.08); color: var(--text-sub); margin-right: 0.4rem;">${t}</span>`).join('') : '';

      card.innerHTML = `
        <div class="dish-imgbox">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy">
          <span class="dish-price-tag" style="border-color: ${rest.accentColor}; color: ${rest.accentColor};">${dish.price}</span>
        </div>
        <div class="dish-content">
          <h4 style="font-family: var(--font-heading); font-size: 1.2rem; color: #fff; margin-bottom: 0.5rem;">${dish.name}</h4>
          <p style="font-size: 0.88rem; color: var(--text-sub); margin-bottom: 1rem; flex-grow: 1;">${dish.desc}</p>
          <div>${tagsHtml}</div>
        </div>
      `;

      card.addEventListener('click', () => openDishModal(dish, rest));
      dishesGrid.appendChild(card);
    });
  }

  // 5. Modal de Detalle de Platillo
  function openDishModal(dish, rest) {
    modalImg.src = dish.image;
    modalKanji.textContent = dish.kanji || rest.kanji;
    modalKanji.style.color = rest.accentColor;
    modalTitle.textContent = dish.name;
    modalPrice.textContent = dish.price;
    modalPrice.style.color = rest.accentColor;
    modalDesc.textContent = dish.desc;

    detailModal.classList.add('active');
  }

  closeModalBtn.addEventListener('click', () => {
    detailModal.classList.remove('active');
  });

  // 6. Selector Dual de Impresión (Flyer Plastificado HD vs Tradicional)
  printFormatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      printFormatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activePrintFormat = btn.dataset.format;
      renderPrintSheet();
    });
  });

  btnOpenPrint.addEventListener('click', () => {
    renderPrintSheet();
    printModal.classList.add('active');
  });

  btnClosePrint.addEventListener('click', () => {
    printModal.classList.remove('active');
  });

  btnPrintNow.addEventListener('click', () => {
    window.print();
  });

  // Renderizador Dual de Impresión Físico / PDF
  function renderPrintSheet() {
    const rest = MEXICAN_RESTAURANTS.find(r => r.id === activeRestaurantId) || MEXICAN_RESTAURANTS[0];
    const keys = ['entradas', 'fuertes', 'ninos', 'cocteleria', 'postres'];

    if (activePrintFormat === 'flyer') {
      // 🖼️ ESTILO 1: FLYER PLASTIFICADO HD A TODO COLOR CON FOTOS IA Y ESTILO PROPIO
      const sectionsHtml = keys.map(key => {
        const sec = rest.sections[key];
        if (!sec || !sec.items || sec.items.length === 0) return '';

        const itemsHtml = sec.items.map(item => `
          <div class="flyer-dish-row">
            <img src="${item.image}" class="flyer-dish-img" alt="${item.name}">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
                <h4 style="font-family: var(--font-heading); font-size: 1.05rem; color: #fff; font-weight: 700; margin: 0;">${item.name}</h4>
                <span style="color: ${rest.accentColor}; font-family: var(--font-heading); font-weight: 800; font-size: 1.1rem;">${item.price}</span>
              </div>
              <p style="font-size: 0.82rem; color: #fca5a5; margin: 0; line-height: 1.35;">${item.desc}</p>
            </div>
          </div>
        `).join('');

        return `
          <div style="margin-bottom: 2rem; break-inside: avoid;">
            <div style="background: linear-gradient(135deg, ${rest.accentColor}, ${rest.secondaryColor}); padding: 0.55rem 1.25rem; border-radius: 10px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
              <h3 style="font-family: var(--font-heading); color: #fff; margin: 0; font-size: 1.15rem; font-weight: 700; letter-spacing: 0.5px;">${sec.title}</h3>
              <span style="font-size: 0.75rem; color: rgba(255,255,255,0.85); text-transform: uppercase;">Selección de Autor</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem 1.5rem;">${itemsHtml}</div>
          </div>
        `;
      }).join('');

      printSheetContent.className = 'printable-flyer-hd';
      printSheetContent.style.borderColor = rest.accentColor;
      printSheetContent.style.background = rest.bgMain;
      printSheetContent.innerHTML = `
        <div class="flyer-header-banner">
          <img src="${rest.heroImage}" alt="${rest.name}">
          <div class="flyer-header-text">
            <span style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(0,0,0,0.6); border: 1px solid ${rest.accentColor}; color: ${rest.accentColor}; font-size: 0.75rem; border-radius: 20px; font-weight: 700; text-transform: uppercase; margin-bottom: 0.4rem;">🖼️ Edición Flyer Plastificado HD (${rest.styleCategory})</span>
            <h1 style="font-family: var(--font-heading); font-size: 2.4rem; color: #fff; margin: 0; font-weight: 800; text-shadow: 0 4px 10px rgba(0,0,0,0.8);">${rest.logoIcon || '🇲🇽'} ${rest.name}</h1>
            <p style="font-size: 0.95rem; color: #fca5a5; margin: 0.2rem 0 0 0; font-style: italic;">${rest.tagline} • ${rest.region}</p>
          </div>
        </div>
        <div>
          ${sectionsHtml}
        </div>
        <div style="margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.15); text-align: center; font-size: 0.8rem; color: #fca5a5; display: flex; justify-content: space-between; align-items: center;">
          <span>✨ Impresión Plastificada HD a Todo Color - Alta Definición 8K</span>
          <span>Código QR Digital: #${rest.id.toUpperCase()}</span>
        </div>
      `;

    } else {
      // 📄 ESTILO 2: CARTA TRADICIONAL DE PAPEL CON DOBLE MARCO
      const sectionsHtml = keys.map(key => {
        const sec = rest.sections[key];
        if (!sec || !sec.items || sec.items.length === 0) return '';

        const itemsHtml = sec.items.map(item => `
          <div style="margin-bottom: 1.25rem; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; border-bottom: 1px dotted #cbd5e1; padding-bottom: 0.25rem; margin-bottom: 0.25rem;">
              <span style="font-size: 1.05rem; color: #0f172a;">${item.name}</span>
              <span style="color: ${rest.secondaryColor || '#dc2626'}; font-weight: 800; font-size: 1.05rem;">${item.price}</span>
            </div>
            <p style="font-size: 0.85rem; color: #475569; margin: 0; font-family: sans-serif; line-height: 1.45;">${item.desc}</p>
          </div>
        `).join('');

        return `
          <div style="margin-bottom: 2.25rem; page-break-inside: avoid; break-inside: avoid;">
            <h3 style="font-family: var(--font-heading); color: ${rest.secondaryColor || '#dc2626'}; border-bottom: 2px solid ${rest.secondaryColor || '#dc2626'}; padding-bottom: 0.4rem; margin-bottom: 1.25rem; font-size: 1.25rem; text-transform: uppercase; letter-spacing: 0.5px;">${sec.title}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 2.5rem;">${itemsHtml}</div>
          </div>
        `;
      }).join('');

      printSheetContent.className = 'physical-menu-sheet';
      printSheetContent.innerHTML = `
        <div style="text-align: center; border-bottom: 3px double ${rest.secondaryColor || '#dc2626'}; padding-bottom: 1.75rem; margin-bottom: 2.25rem;">
          <span style="font-size: 2.8rem; display: block; margin-bottom: 0.5rem;">${rest.logoIcon || '🇲🇽'}</span>
          <h1 style="font-family: var(--font-heading); font-size: 2.6rem; color: ${rest.secondaryColor || '#dc2626'}; margin-bottom: 0.25rem; font-weight: 800; letter-spacing: 0.5px;">${rest.name}</h1>
          <p style="font-size: 1.05rem; color: #334155; font-style: italic;">${rest.tagline} • ${rest.region}</p>
        </div>
        <div style="display: flex; flex-direction: column;">
          ${sectionsHtml}
        </div>
        <div style="margin-top: 3.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.82rem; color: #64748b; display: flex; justify-content: space-between; font-family: sans-serif;">
          <span>Carta Física Oficial - Edición Tradicional de Papel</span>
          <span>Código QR de Verificación Digital: #${rest.id.toUpperCase()}</span>
        </div>
      `;
    }
  }

  // 7. Bitácora Drawer
  btnOpenBitacora.addEventListener('click', () => {
    bitacoraDrawer.classList.add('active');
  });

  btnCloseBitacora.addEventListener('click', () => {
    bitacoraDrawer.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      detailModal.classList.remove('active');
      printModal.classList.remove('active');
      bitacoraDrawer.classList.remove('active');
    }
  });
});
