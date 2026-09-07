// Lógica del Catálogo Maestro de los 20 Restaurantes Asiáticos de Autor

document.addEventListener('DOMContentLoaded', () => {
  // Estado global de la aplicación
  let currentView = 'catalog'; // 'catalog' o 'restaurant'
  let activeFilter = 'all';
  let activeRestaurantId = null;
  let activeSectionKey = 'entradas';
  let activePrintFormat = 'flyer'; // 'flyer' (Plastificado HD) o 'classic' (Tradicional)

  // Elementos DOM principales
  const catalogView = document.getElementById('catalogView');
  const restaurantView = document.getElementById('restaurantView');
  const catalogGrid = document.getElementById('catalogGrid');
  const filterChips = document.querySelectorAll('.chip-btn');
  
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
  renderCatalogGrid(ALL_RESTAURANTS);

  // 2. Filtros del Catálogo
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      activeFilter = chip.dataset.filter;
      const filtered = filterRestaurants(activeFilter);
      renderCatalogGrid(filtered);
    });
  });

  function filterRestaurants(filter) {
    if (filter === 'all') return ALL_RESTAURANTS;
    return ALL_RESTAURANTS.filter(r => r.cuisine === filter);
  }

  // 3. Renderizado del Grid del Catálogo Maestro
  function renderCatalogGrid(restaurants) {
    catalogGrid.innerHTML = '';

    restaurants.forEach(rest => {
      const card = document.createElement('div');
      card.className = 'rest-card';
      card.style.setProperty('--accent-primary', rest.accentColor);

      const flag = rest.cuisine === 'china' ? '🇨🇳' : (rest.cuisine === 'japonesa' ? '🇯🇵' : '🇰🇷');

      card.innerHTML = `
        <div class="rest-card-imgbox">
          <img src="${rest.heroImage}" alt="${rest.name}" loading="lazy">
          <span class="rest-card-badge">${flag}</span>
        </div>
        <div class="rest-card-body">
          <div class="rest-kanji">${rest.kanji}</div>
          <h3 class="rest-name">${rest.name}</h3>
          <p class="rest-tagline">${rest.tagline}</p>
          <button class="btn-open-world" onclick="openRestaurantWorld('${rest.id}')">
            ✨ Abrir Experiencia de Autor
          </button>
        </div>
      `;

      catalogGrid.appendChild(card);
    });
  }

  // 4. Abrir Mundo de Restaurante Individual
  window.openRestaurantWorld = function(restId) {
    const rest = ALL_RESTAURANTS.find(r => r.id === restId);
    if (!rest) return;

    activeRestaurantId = restId;
    activeSectionKey = 'entradas';

    // Actualizar Header Ampliado
    brandLogoIcon.textContent = rest.logoIcon || '🥢';
    brandKanjiTag.textContent = rest.kanji;
    brandMainName.textContent = rest.name;
    brandSubRegion.textContent = rest.region;

    // Actualizar Héroe
    restHeroBg.src = rest.heroImage;
    restHeroKanji.textContent = rest.kanji;
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
  };

  // Botón para Volver al Catálogo Maestro
  btnCatalogSwitch.addEventListener('click', () => {
    catalogView.style.display = 'block';
    restaurantView.style.display = 'none';
    btnCatalogSwitch.style.display = 'none';

    // Resetear Header al Catálogo
    brandLogoIcon.textContent = '🥢';
    brandKanjiTag.textContent = 'ASIAN GASTRONOMY';
    brandMainName.textContent = 'CATÁLOGO MAESTRO DE AUTOR';
    brandSubRegion.textContent = '20 RESTAURANTES • VIRTUAL E IMPRESO';

    currentView = 'catalog';
  });

  // 5. Renderizado de Secciones del Restaurante
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

      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
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

      const tagsHtml = dish.tags ? dish.tags.map(t => `<span style="font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 6px; background: rgba(255,255,255,0.08); color: var(--text-sub); margin-right: 0.4rem;">${t}</span>`).join('') : '';

      card.innerHTML = `
        <div class="dish-imgbox">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy">
          <span class="dish-price-tag">${dish.price}</span>
        </div>
        <div class="dish-content">
          <h4 style="font-family: var(--font-heading); font-size: 1.2rem; color: #fff; margin-bottom: 0.5rem;">${dish.name}</h4>
          <p style="font-size: 0.88rem; color: var(--text-sub); margin-bottom: 1rem; flex-grow: 1;">${dish.desc}</p>
          <div>${tagsHtml}</div>
        </div>
      `;

      card.addEventListener('click', () => openDishModal(dish));
      dishesGrid.appendChild(card);
    });
  }

  // 6. Modal de Detalle de Platillo
  function openDishModal(dish) {
    modalImg.src = dish.image;
    modalKanji.textContent = dish.kanji || '';
    modalTitle.textContent = dish.name;
    modalPrice.textContent = dish.price;
    modalDesc.textContent = dish.desc;

    detailModal.classList.add('active');
  }

  closeModalBtn.addEventListener('click', () => {
    detailModal.classList.remove('active');
  });

  // 7. Alternar Formato Impreso (Flyer Plastificado HD vs Tradicional)
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

  // Renderizador Dual de Impresión (Estilo 1 Clásico vs Estilo 2 Flyer Plastificado HD)
  function renderPrintSheet() {
    const rest = ALL_RESTAURANTS.find(r => r.id === activeRestaurantId) || ALL_RESTAURANTS[0];
    const keys = ['entradas', 'fuertes', 'ninos', 'cocteleria', 'postres'];

    if (activePrintFormat === 'flyer') {
      // 🖼️ ESTILO 2: FLYER PLASTIFICADO HD A TODO COLOR CON FOTOS IA
      const sectionsHtml = keys.map(key => {
        const sec = rest.sections[key];
        if (!sec || !sec.items || sec.items.length === 0) return '';

        const itemsHtml = sec.items.map(item => `
          <div class="flyer-dish-row">
            <img src="${item.image}" class="flyer-dish-img" alt="${item.name}">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.2rem;">
                <h4 style="font-family: var(--font-heading); font-size: 1rem; color: #fff; font-weight: 700; margin: 0;">${item.name}</h4>
                <span style="color: #f59e0b; font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem;">${item.price}</span>
              </div>
              <p style="font-size: 0.8rem; color: #cbd5e1; margin: 0; line-height: 1.35;">${item.desc}</p>
            </div>
          </div>
        `).join('');

        return `
          <div style="margin-bottom: 2rem; break-inside: avoid;">
            <div style="background: linear-gradient(135deg, ${rest.accentColor}, ${rest.secondaryColor}); padding: 0.5rem 1.25rem; border-radius: 10px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
              <h3 style="font-family: var(--font-heading); color: #fff; margin: 0; font-size: 1.15rem; font-weight: 700; letter-spacing: 0.5px;">${sec.title}</h3>
              <span style="font-size: 0.75rem; color: rgba(255,255,255,0.8); text-transform: uppercase;">Selección de Autor</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem 1.5rem;">${itemsHtml}</div>
          </div>
        `;
      }).join('');

      printSheetContent.className = 'printable-flyer-hd';
      printSheetContent.innerHTML = `
        <div class="flyer-header-banner">
          <img src="${rest.heroImage}" alt="${rest.name}">
          <div class="flyer-header-text">
            <span style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(236,72,153,0.3); border: 1px solid #ec4899; color: #ec4899; font-size: 0.75rem; border-radius: 20px; font-weight: 700; text-transform: uppercase; margin-bottom: 0.4rem;">🖼️ Edición Flyer Plastificado HD a Todo Color</span>
            <h1 style="font-family: var(--font-heading); font-size: 2.4rem; color: #fff; margin: 0; font-weight: 800; text-shadow: 0 4px 10px rgba(0,0,0,0.8);">${rest.logoIcon || '🥢'} ${rest.name}</h1>
            <p style="font-size: 0.95rem; color: #cbd5e1; margin: 0.2rem 0 0 0; font-style: italic;">${rest.tagline} • ${rest.region}</p>
          </div>
        </div>
        <div>
          ${sectionsHtml}
        </div>
        <div style="margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.15); text-align: center; font-size: 0.8rem; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;">
          <span>✨ Impresión Plastificada HD a Todo Color - Alta Definición 8K</span>
          <span>Código QR Digital: #${rest.id.toUpperCase()}</span>
        </div>
      `;

    } else {
      // 📄 ESTILO 1: CARTA TRADICIONAL DE PAPEL CON DOBLE MARCO
      const sectionsHtml = keys.map(key => {
        const sec = rest.sections[key];
        if (!sec || !sec.items || sec.items.length === 0) return '';

        const itemsHtml = sec.items.map(item => `
          <div style="margin-bottom: 1.25rem; page-break-inside: avoid; break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; border-bottom: 1px dotted #cbd5e1; padding-bottom: 0.25rem; margin-bottom: 0.25rem;">
              <span style="font-size: 1.05rem; color: #0f172a;">${item.name}</span>
              <span style="color: #4338ca; font-weight: 800; font-size: 1.05rem;">${item.price}</span>
            </div>
            <p style="font-size: 0.85rem; color: #475569; margin: 0; font-family: sans-serif; line-height: 1.45;">${item.desc}</p>
          </div>
        `).join('');

        return `
          <div style="margin-bottom: 2.25rem; page-break-inside: avoid; break-inside: avoid;">
            <h3 style="font-family: var(--font-heading); color: #4338ca; border-bottom: 2px solid #4338ca; padding-bottom: 0.4rem; margin-bottom: 1.25rem; font-size: 1.25rem; text-transform: uppercase; letter-spacing: 0.5px;">${sec.title}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 2.5rem;">${itemsHtml}</div>
          </div>
        `;
      }).join('');

      printSheetContent.className = 'physical-menu-sheet';
      printSheetContent.innerHTML = `
        <div style="text-align: center; border-bottom: 3px double #4338ca; padding-bottom: 1.75rem; margin-bottom: 2.25rem;">
          <span style="font-size: 2.8rem; display: block; margin-bottom: 0.5rem;">${rest.logoIcon || '🥢'}</span>
          <h1 style="font-family: var(--font-heading); font-size: 2.6rem; color: #4338ca; margin-bottom: 0.25rem; font-weight: 800; letter-spacing: 0.5px;">${rest.name}</h1>
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

  // 8. Bitácora Drawer
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
