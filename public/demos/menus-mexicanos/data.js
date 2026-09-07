// Dataset Maestro de los 12 Restaurantes Mexicanos de Autor
// Cada restaurante posee una identidad visual y paleta de colores 100% ÚNICA e INDEPENDIENTE

const MEXICAN_RESTAURANTS = [
  {
    id: "mx-oaxaca",
    name: "OAXACA MOLE & MEZCALERÍA",
    kanji: "大 OAXACA",
    logoIcon: "🕯️",
    cuisine: "mexicana",
    region: "Oaxaca / Valle Central",
    styleCategory: "👑 Místico & Tradicional",
    tagline: "Mole negro de 34 ingredientes, tlayudas artesanales y mezcal de jícara en barro negro",
    heroImage: "images/entrada_sopes.jpg",
    
    // Paleta Visual Única: Barro Negro, Mole Oscuro & Oro Cálido
    bgMain: "radial-gradient(circle at 20% 20%, #291008 0%, #0c0503 100%)",
    bgCard: "rgba(35, 16, 10, 0.85)",
    bgCardHover: "rgba(55, 25, 15, 0.95)",
    accentColor: "#f59e0b",
    secondaryColor: "#dc2626",
    glowColor: "rgba(245, 158, 11, 0.5)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    fontHeading: "'Playfair Display', serif",

    sections: {
      entradas: {
        title: "🥟 1. ENTRADAS & ANTOJITOS OAXAQUEÑOS",
        subtitle: "Bocadillos en comal de barro con maíz criollo y queso oaxaca",
        items: [
          { name: "Sopes Artesanales de Chorizo y Queso Fresco", price: "$14.50", image: "images/entrada_sopes.jpg", desc: "Tres sopes de maíz azul pellizcados al comal con frijoles negros refritos, chorizo artesanal y queso fresco de estraza.", tags: ["⭐ Favorito", "Maíz Criollo"] },
          { name: "Ceviche Blanco de Camarón con Elote Tierno", price: "$16.00", image: "images/entrada_ceviche.jpg", desc: "Camaroncitos marinados en limón agrio con maíz dorado, jitomate picado y cilantro de montaña.", tags: ["Fresco"] }
        ]
      },
      fuertes: {
        title: "🍲 2. PLATOS FUERTES & MOLES DE AUTOR",
        subtitle: "Guisados ancestrales cocinados en olla de barro a fuego lento",
        items: [
          { name: "Pollo en Mole Negro Oaxaqueño Ceremonial", price: "$28.50", image: "images/fuerte_mole_poblano.jpg", desc: "Pechuga jugosa bañada en mole negro de 34 ingredientes espesado con tortillas quemadas, cacao puro y ajonjolí tostado.", tags: ["🔥 Plato Insignia", "34 Ingredientes"] },
          { name: "Tacos de Birria de Res con Consomé Concentrado", price: "$24.00", image: "images/fuerte_birria_tacos.jpg", desc: "Tres tacos dorados a la plancha rellenos de carne deshebrada tierno con tazón de consomé caliente para sumergir.", tags: ["Popular"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS OAXAQUEÑO",
        subtitle: "Platos divertidos no picantes servidos en vajillas especiales",
        items: [
          { name: "Cactus Combo Plate con Arroz y Nuggets", price: "$11.50", image: "images/ninos_cactus_arroz.jpg", desc: "Platillo divertido en forma de cactus con bolita de arroz sonriente, nuggets de pollo crujientes, frijoles negros y aguacate.", tags: ["🧒 Para Niños", "Divertido"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA & MEZCALES DE OAXACA",
        subtitle: "Mezcales artesanales de agave espadín y cocteles tradicionales",
        items: [
          { name: "Jarrito de Barro de Mezcal Ahumado y Café de Olla", price: "$15.00", image: "images/coctel_jarrito.jpg", desc: "Mezcal artesanal infusionado con café de olla caliente, piloncillo, canela en rama y naranja agria.", tags: ["🍸 Coctel de Autor", "Ahumado"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES & DULCES TRADICIONALES",
        subtitle: "Flanes de caramelo y repostería artesanal",
        items: [
          { name: "Flan de Caramelo Oaxaqueño con Flores Comestibles", price: "$9.50", image: "images/postre_flan.jpg", desc: "Natilla horneada súper cremosa con sirope de caramelo quemado, nueces tostadas y flores orgánicas.", tags: ["Delicioso"] }
        ]
      }
    }
  },

  {
    id: "mx-jalisco",
    name: "JALISCO TEQUILA & MARIACHI GRILL",
    kanji: "JALISCO",
    logoIcon: "🌵",
    cuisine: "mexicana",
    region: "Jalisco / Valle de Tequila",
    styleCategory: "🍹 Agave Teal & Dorado Tequila",
    tagline: "Birria estofada en adobo tradicional, cazuelas de tequila y mariachi",
    heroImage: "images/fuerte_birria_tacos.jpg",
    
    // Paleta Visual Única: Turquesa Agave, Tequila Dorado & Noche Tapatía
    bgMain: "radial-gradient(circle at 80% 20%, #042f2e 0%, #021212 100%)",
    bgCard: "rgba(6, 44, 43, 0.85)",
    bgCardHover: "rgba(10, 68, 66, 0.95)",
    accentColor: "#06b6d4",
    secondaryColor: "#f59e0b",
    glowColor: "rgba(6, 182, 212, 0.5)",
    borderColor: "rgba(6, 182, 212, 0.35)",
    fontHeading: "'Space Grotesk', sans-serif",

    sections: {
      entradas: {
        title: "🥟 1. ENTRADAS & TOSTADAS TAPATÍAS",
        subtitle: "Tostadas crujientes de ceviche y antojitos del mercado de San Juan de Dios",
        items: [
          { name: "Tostadas de Tártar de Atún al Limón Agrio", price: "$16.50", image: "images/entrada_tostadas.jpg", desc: "Dos tostadas doradas con picado de atún marinadas en cítricos frescos, aguacate cremoso y salsa de chile macha.", tags: ["Fresco", "Crocante"] }
        ]
      },
      fuertes: {
        title: "🍲 2. BIRRIA & PLATOS DE GUADALAJARA",
        subtitle: "Adobos tradicionales y carnes estofadas en cazuela",
        items: [
          { name: "Birria de Res Estofada al Estilo Jalisco", price: "$26.00", image: "images/fuerte_birria_tacos.jpg", desc: "Carne de res marinada en chiles secos guajillo y ancho, servida con consomé espeso, cilantro, cebolla y tortillas calientes.", tags: ["⭐ Plato Estrella"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS TAPATÍO",
        subtitle: "Tacos suaves en carrito rojo divertido",
        items: [
          { name: "Car-Plate Tacos Suaves con Papitas Sonrientes", price: "$12.00", image: "images/ninos_auto_tacos.jpg", desc: "Plato en forma de auto deportivo rojo con 3 tacos suaves de pollo, guacamole sin picante y papitas fritos.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA TEQUILERA & MICHELADAS",
        subtitle: "Margaritas heladas escarchadas y cazuelas de Tequila",
        items: [
          { name: "Margarita Clásica de Tequila Reposado", price: "$14.00", image: "images/coctel_margarita.jpg", desc: "Tequila 100% agave reposado, triple sec, jugo de limón recién exprimido y borde escarchado en sal rosa.", tags: ["🍸 Coctel Tradicional"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES & TARTALETAS",
        subtitle: "Tartaletas tropicales con fruta de la pasión",
        items: [
          { name: "Tartaleta de Mango y Fruta de la Pasión", price: "$9.00", image: "images/postre_tartaleta.jpg", desc: "Capa crujiente de galleta con crema pastelera de vainilla, láminas de mango fresco y reducción de maracuyá.", tags: ["Refrescante"] }
        ]
      }
    }
  },

  {
    id: "mx-yucatan",
    name: "YUCATÁN MAYA COCHINITA & LOUNGE",
    kanji: "YUCATÁN",
    logoIcon: "🌺",
    cuisine: "mexicana",
    region: "Yucatán / Mérida",
    styleCategory: "🌴 Esmeralda Maya & Coral",
    tagline: "Cochinita pibil enterrada en hoja de plátano, panuchos y sopa de lima",
    heroImage: "images/entrada_tostadas.jpg",
    
    // Paleta Visual Única: Verde Cenote, Coral Neón & Selva Maya
    bgMain: "radial-gradient(circle at 10% 80%, #064e3b 0%, #022c22 100%)",
    bgCard: "rgba(6, 64, 49, 0.85)",
    bgCardHover: "rgba(9, 90, 69, 0.95)",
    accentColor: "#10b981",
    secondaryColor: "#f43f5e",
    glowColor: "rgba(16, 185, 129, 0.5)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    fontHeading: "'Outfit', sans-serif",

    sections: {
      entradas: {
        title: "🥟 1. PANUCHOS & ANTOJITOS MAYAS",
        subtitle: "Tortillas con frijol colado y cebolla morada curada",
        items: [
          { name: "Panuchos Yucatecos de Cochinita Pibil", price: "$15.00", image: "images/entrada_tostadas.jpg", desc: "Tortillas fritas rellenas de frijol colado con cochinita deshebrada y cebollita morada con habanero.", tags: ["Tradición Maya"] }
        ]
      },
      fuertes: {
        title: "🍲 2. COCHINITA PIBIL & PLATOS PENINSULARES",
        subtitle: "Carnes horneadas en recado rojo bajo tierra",
        items: [
          { name: "Cochinita Pibil Tradicional Enterrada", price: "$27.00", image: "images/fuerte_mole_poblano.jpg", desc: "Cerdo tierno marinado en achiote orgánico y jugo de naranja agria, horneado en hojas de plátano.", tags: ["⭐ Especialidad"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS MAYA",
        subtitle: "Sombrero Rice Bowl infantil",
        items: [
          { name: "Sombrero Rice Bowl con Corndogs Crujientes", price: "$11.00", image: "images/ninos_sombrero_bowl.jpg", desc: "Tazón de arroz blanco en forma de muñeco con sombrero norteño y empanaditos de queso.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA DE LA PENÍNSULA",
        subtitle: "Micheladas artesanales con Tajín y licor Xtabentún",
        items: [
          { name: "Michelada Artesanal Escarchada con Tajín y Tamarindo", price: "$13.50", image: "images/coctel_michelada.jpg", desc: "Cerveza clara helada con jugo de tomate sazonado, pulpa de tamarindo y escarchado de chile.", tags: ["Helada"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES MAYAS",
        subtitle: "Pastel espeso de chocolate de metate y cacao",
        items: [
          { name: "Pastel de Chocolate de Metate con Helado", price: "$10.00", image: "images/postre_pastel_choco.jpg", desc: "Bizcocho caliente rico en cacao sin refinar bañada en fudge caliente con helado de crema.", tags: ["Delicioso"] }
        ]
      }
    }
  },

  {
    id: "mx-baja",
    name: "BAJA SEAFOOD & PACIFIC TACOS",
    kanji: "BAJA TACOS",
    logoIcon: "🌮",
    cuisine: "mexicana",
    region: "Baja California / Ensenada",
    styleCategory: "🌊 Azul Pacífico & Sol Dorado",
    tagline: "Tacos de pescado capeados estilo Ensenada, ceviches frescos y vino del Valle de Guadalupe",
    heroImage: "images/entrada_ceviche.jpg",
    
    // Paleta Visual Única: Azul Océano Pacífico, Cian Costa & Sol Dorado
    bgMain: "radial-gradient(circle at 50% 20%, #0c4a6e 0%, #031e2e 100%)",
    bgCard: "rgba(12, 60, 90, 0.85)",
    bgCardHover: "rgba(16, 85, 125, 0.95)",
    accentColor: "#38bdf8",
    secondaryColor: "#fbbf24",
    glowColor: "rgba(56, 189, 248, 0.5)",
    borderColor: "rgba(56, 189, 248, 0.35)",
    fontHeading: "'Space Grotesk', sans-serif",

    sections: {
      entradas: {
        title: "🥟 1. CEVICHES & TOSTADAS DEL PACÍFICO",
        subtitle: "Mariscos frescos cortados al momento con limón real",
        items: [
          { name: "Ceviche de Camarón y Elote con Aguacate", price: "$17.50", image: "images/entrada_ceviche.jpg", desc: "Camarones del pacífico marinados en cítricos con cubos de aguacate cremoso y totopos crocantes.", tags: ["⭐ Favorito"] }
        ]
      },
      fuertes: {
        title: "🍲 2. TACOS ENSENADA & PESCADO A LA PARRILLA",
        subtitle: "Capeados crujientes en cerveza y pescados al carbón",
        items: [
          { name: "Pescado a la Veracruzana con Alcaparras y Aceitunas", price: "$29.50", image: "images/fuerte_pescado_veracruz.jpg", desc: "Filete de pescado blanco horneado sobre cama de salsa de jitomate, alcaparras, aceitunas negras y arroz.", tags: ["Chef Spec"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS PACÍFICO",
        subtitle: "Tacos suaves de pescadito sin picante",
        items: [
          { name: "Car-Plate Tacos Suaves de Pescadito", price: "$11.50", image: "images/ninos_auto_tacos.jpg", desc: "Tacos de pescadito suave en platillo divertido de auto con maíz dulce.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA & CLAMATOS",
        subtitle: "Clamatos preparados y margaritas con sal de mar",
        items: [
          { name: "Margarita de Limón Real con Sal Marina", price: "$14.50", image: "images/coctel_margarita.jpg", desc: "Tequila blanco, limón real, agave orgánico y sal marina del Pacífico.", tags: ["🍸 Coctel de Autor"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES PACÍFICO",
        subtitle: "Flan cremoso de caramelo de coco",
        items: [
          { name: "Flan de Caramelo con Frutas del Bosque", price: "$9.00", image: "images/postre_flan.jpg", desc: "Natilla horneada con capa rica de caramelo líquido y moras.", tags: ["Dulce"] }
        ]
      }
    }
  },

  {
    id: "mx-cdmx",
    name: "CDMX STREET TAQUERÍA & CERVECERÍA",
    kanji: "CDMX TACOS",
    logoIcon: "🍍",
    cuisine: "mexicana",
    region: "Ciudad de México / El Centro",
    styleCategory: "🌆 Neón Chilango & Salsa Verde",
    tagline: "Tacos al pastor al trompo con piña, gringas de suadero y cerveza helada",
    heroImage: "images/fuerte_birria_tacos.jpg",
    
    // Paleta Visual Única: Neón Magenta Chilango, Verde Salsa & Rojo Pastor
    bgMain: "radial-gradient(circle at 20% 80%, #701a75 0%, #1a051d 100%)",
    bgCard: "rgba(65, 15, 68, 0.85)",
    bgCardHover: "rgba(95, 20, 100, 0.95)",
    accentColor: "#f43f5e",
    secondaryColor: "#a3e635",
    glowColor: "rgba(244, 63, 94, 0.55)",
    borderColor: "rgba(244, 63, 94, 0.4)",
    fontHeading: "'Space Grotesk', sans-serif",

    sections: {
      entradas: {
        title: "🥟 1. ANTOJITOS CHILANGOS",
        subtitle: "Sopes con chorizo y salsas molcajeteadas de puesto callejero",
        items: [
          { name: "Sopes Chilangos de Chorizo con Queso de Cuadra", price: "$13.50", image: "images/entrada_sopes.jpg", desc: "Sopes de comal bien doraditos con crema, queso fresco y salsa verde molcajeteada.", tags: ["Callejero"] }
        ]
      },
      fuertes: {
        title: "🍲 2. TACOS AL PASTOR & TAQUIZAS CHILANGAS",
        subtitle: "El verdadero sabor del trompo al pastor y guisados al comal",
        items: [
          { name: "Taquiza Imperial de Pastor y Birria", price: "$25.00", image: "images/fuerte_birria_tacos.jpg", desc: "Tacos con carne adobada al trompo, piña asada, cebollita frita y consomé.", tags: ["⭐ Favorito CDMX"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS CHILANGO",
        subtitle: "Platillo divertido con arroz y nuggets",
        items: [
          { name: "Cactus Plate con Arroz y Nuggets Suaves", price: "$10.50", image: "images/ninos_cactus_arroz.jpg", desc: "Platillo en forma de cactus con nuggets doraditos y arroz.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. CERVECERÍA & MICHELADAS CHILANGAS",
        subtitle: "Micheladas con gomitas y cantaritos preparados",
        items: [
          { name: "Michelada Chilanga con Tamarindo y Tajín", price: "$12.50", image: "images/coctel_michelada.jpg", desc: "Cerveza clara helada con escarchado abundante de Tajín y brocheta de tamarindo.", tags: ["Popular"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES DE CHURRERÍA",
        subtitle: "Pastel de chocolate espeso con helado",
        items: [
          { name: "Pastel de Chocolate Fudge con Helado", price: "$9.50", image: "images/postre_pastel_choco.jpg", desc: "Rebanada esponjosa de chocolate derretido con bola de helado.", tags: ["Delicioso"] }
        ]
      }
    }
  },

  {
    id: "mx-puebla",
    name: "PUEBLA IMPERIAL BANQUET",
    kanji: "TALAVERA",
    logoIcon: "👑",
    cuisine: "mexicana",
    region: "Puebla de los Ángeles",
    styleCategory: "🏛️ Azul Talavera Colonial & Oro Imperial",
    tagline: "Chiles en nogada ceremoniales, mole poblano de convento y chalupas",
    heroImage: "images/fuerte_mole_poblano.jpg",
    
    // Paleta Visual Única: Azul Cobalto Talavera, Blanco Marfil & Oro Imperial
    bgMain: "radial-gradient(circle at 50% 50%, #1e3a8a 0%, #0a1329 100%)",
    bgCard: "rgba(20, 45, 110, 0.85)",
    bgCardHover: "rgba(30, 65, 150, 0.95)",
    accentColor: "#fbbf24",
    secondaryColor: "#60a5fa",
    glowColor: "rgba(251, 191, 36, 0.5)",
    borderColor: "rgba(251, 191, 36, 0.4)",
    fontHeading: "'Playfair Display', serif",

    sections: {
      entradas: {
        title: "🥟 1. CHALUPAS & ANTOJITOS DE CONVENTO",
        subtitle: "Tortillitas bañadas en salsa verde y roja con carne deshebrada",
        items: [
          { name: "Chalupas Poblanas Tradicionales", price: "$14.00", image: "images/entrada_sopes.jpg", desc: "Cuatro tortillas suaves pasadas por manteca con salsa verde de tomate, salsa roja y carne de cerdo.", tags: ["👑 Tradición"] }
        ]
      },
      fuertes: {
        title: "🍲 2. MOLE POBLANO & CHILES EN NOGADA",
        subtitle: "Recetas históricas de los conventos de Puebla",
        items: [
          { name: "Mole Poblano Imperial de la Casa", price: "$29.00", image: "images/fuerte_mole_poblano.jpg", desc: "Pechuga de pollo bañada en mole espeso de 28 ingredientes, semillas de ajonjolí y arroz a la mexicana.", tags: ["⭐ Imperial"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS POBLANO",
        subtitle: "Sombrero Rice Bowl no picante",
        items: [
          { name: "Sombrero Rice Bowl con Nuggets de Pollo", price: "$11.00", image: "images/ninos_sombrero_bowl.jpg", desc: "Arroz tierno y bolitas empanizadas de queso.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. LICORES DE PUEBLA & MISMAS",
        subtitle: "Rompope artesanal, pasita y margaritas",
        items: [
          { name: "Margarita Imperial con Sal Dorada", price: "$15.00", image: "images/coctel_margarita.jpg", desc: "Tequila premium, licor de damiana y lima fresca.", tags: ["🍸 Coctel de Autor"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES DE CONVENTO",
        subtitle: "Flan espeso de vainilla de papantla",
        items: [
          { name: "Flan de Caramelo con Flores Comestibles", price: "$9.50", image: "images/postre_flan.jpg", desc: "Natilla artesanal con flores orgánicas y sirope.", tags: ["Exquisito"] }
        ]
      }
    }
  },

  {
    id: "mx-fusion",
    name: "MODERN MEXICAN MICHELIN FUSION",
    kanji: "REVOLUCIÓN",
    logoIcon: "✨",
    cuisine: "mexicana",
    region: "CDMX Polanco / Roma Norte",
    styleCategory: "💎 Mármol Negro Ultra-Lujo & Violeta Neón",
    tagline: "Alta cocina mexicana contemporánea, estrellas Michelin y coctelería de vanguardia",
    heroImage: "images/coctel_margarita.jpg",
    
    // Paleta Visual Única: Mármol Negro Absoluto, Neón Violeta & Platino
    bgMain: "radial-gradient(circle at 50% 10%, #1e1b4b 0%, #03020c 100%)",
    bgCard: "rgba(22, 18, 55, 0.88)",
    bgCardHover: "rgba(35, 28, 85, 0.95)",
    accentColor: "#a855f7",
    secondaryColor: "#38bdf8",
    glowColor: "rgba(168, 85, 247, 0.55)",
    borderColor: "rgba(168, 85, 247, 0.4)",
    fontHeading: "'Playfair Display', serif",

    sections: {
      entradas: {
        title: "🥟 1. DECONSTRUCCIONES & ANTOJITOS DE VANGUARDIA",
        subtitle: "Emplatados Michelin sobre piedra volcánica esculpida",
        items: [
          { name: "Ceviche de Maracuyá y Elote Tierno", price: "$19.50", image: "images/entrada_ceviche.jpg", desc: "Pesca del día en leche de tigre de maracuyá, maíz tostado y brotes de cilantro orgánico.", tags: ["⭐ Michelin 2026"] }
        ]
      },
      fuertes: {
        title: "🍲 2. MARES & TIERRAS DE AUTOR",
        subtitle: "Técnicas contemporáneas y cocciones al vacío",
        items: [
          { name: "Pescado Sellado sobre Camote y Aceituna Negra", price: "$34.00", image: "images/fuerte_pescado_veracruz.jpg", desc: "Filete de robalo con piel crujiente sobre puré de camote amarillo y reducción de jitomate rostizado.", tags: ["Chef Spec"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ JUNIOR GOURMET",
        subtitle: "Experiencia divertida para pequeños gourmets",
        items: [
          { name: "Cactus Gourmet Plate con Arroz Orgánico", price: "$13.00", image: "images/ninos_cactus_arroz.jpg", desc: "Nuggets de pechuga orgánica con arroz sazonado al azafrán.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. MIXOLOGÍA AHUMADA & DECONSTRUIDA",
        subtitle: "Coctelería con nitrógeno y humo de madera de nogal",
        items: [
          { name: "Coctel Ahumado de Mezcal y Café de Olla", price: "$17.00", image: "images/coctel_jarrito.jpg", desc: "Infusión de mezcal silvestre con bitter de cacao y humo de nogal prensado.", tags: ["🍸 Coctel de Autor"] }
        ]
      },
      postres: {
        title: "🥮 5. ALTA REPOSTERÍA MEXICANA",
        subtitle: "Cacao orgánico de Soconusco y maracuyá",
        items: [
          { name: "Tartaleta de Maracuyá y Mango con Carambola", price: "$11.00", image: "images/postre_tartaleta.jpg", desc: "Tartaleta crujiente con mousse de maracuyá y láminas de mango fresco.", tags: ["Gourmet"] }
        ]
      }
    }
  }
];
