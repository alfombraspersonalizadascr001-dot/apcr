// Dataset Maestro de los 20 Restaurantes Asiáticos de Autor
// (China: 10, Japón: 8, Corea: 2)
// Todos con sus 5 secciones completas: Entradas, Platos Fuertes, Menú de Niños, Coctelería y Postres

const ALL_RESTAURANTS = [
  // ==========================================
  // 🇨🇳 COMIDA CHINA (10 RESTAURANTES)
  // ==========================================
  {
    id: "cn-sichuan",
    name: "SICHUAN SPICE HOUSE",
    kanji: "四川火锅川菜館",
    logoIcon: "🌶️",
    cuisine: "china",
    region: "Sichuan / Chengdu Mala District",
    tagline: "El fuego ancestral del Hot Pot y la legendaria pimienta Mala de Sichuan",
    heroImage: "images/cn_sichuan.png",
    accentColor: "#ef4444",
    secondaryColor: "#991b1b",
    glowColor: "rgba(239, 68, 68, 0.4)",
    sections: {
      entradas: {
        title: "🥟 1. ENTRADAS & DUMPLINGS MALA (川味小吃)",
        subtitle: "Aromáticos brotes de pimienta花椒 y aceites volcánicos",
        items: [
          { name: "Dumplings Sichuan en Salsa de Chile (红油抄手)", price: "$12.50", image: "images/sushi.png", desc: "Wontons hechos a mano rellenos de cerdo magro, bañados en aceite picante casero y sésamo.", tags: ["🌶️ Picante", "Popular"] },
          { name: "Ensalada Malla de Pepino Machacado (拍黄瓜)", price: "$9.00", image: "images/sushi.png", desc: "Pepinos refrescantes macerados en vinagre de arroz negro madurado y ajo silvestre.", tags: ["🌱 Vegetariano"] }
        ]
      },
      fuertes: {
        title: "🍲 2. PLATOS FUERTES & HOT POT (四川主菜)",
        subtitle: "Cazuelas picantes de Chengdu y salteados volcánicos al fuego viva",
        items: [
          { name: "Mapo Tofu Tradicional al Fuego Mala (麻婆豆腐)", price: "$18.50", image: "images/wagyu.png", desc: "Tofu suave con carne picada en salsa concentrada de habas fermentadas y pimienta Sichuan.", tags: ["🌶️ Extra Picante", "Chef Spec"] },
          { name: "Sichuan Imperial Hot Pot Banquetero (四川火锅)", price: "$36.00", image: "images/cn_sichuan.png", desc: "Caldero aromático con láminas de ribeye, brotes de bambú y hongos enoki.", tags: ["⭐ Plato Estrella", "Compartir"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS (儿童套餐)",
        subtitle: "Opciones suaves no picantes y balanceadas para niños",
        items: [
          { name: "Mini Bao Suave de Pollo Teriyaki Dulce", price: "$10.00", image: "images/bento.png", desc: "Dos panecillos esponjosos rellenos de pollo marinado en salsa dulce suave con papitas.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA & DRINKS (川味特调)",
        subtitle: "Cocteles de autor con pimienta Sichuan e infusiones de jazmín",
        items: [
          { name: "Sichuan Pepper Paloma Cocktail", price: "$14.50", image: "images/cocktail.png", desc: "Tequila blanco, licor de lychee, toronja fresca e infusión de pimienta Sichuan con escamas de sal.", tags: ["🍸 Coctel de Autor"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES & DULCES (四川甜品)",
        subtitle: "Gelatinas heladas de semillas silvestres y cremas tropicales",
        items: [
          { name: "Bingfen - Gelatina Helada de Sichuan (冰粉)", price: "$8.50", image: "images/matcha.png", desc: "Gelatina artesanal servida con sirope de azúcar de caña negra, goji y cacahuate tostado.", tags: ["Refrescante"] }
        ]
      }
    }
  },

  {
    id: "cn-canton",
    name: "CANTONESE PEARL & DIM SUM PALACE",
    kanji: "粤菜饮茶海鲜大酒楼",
    logoIcon: "🥟",
    cuisine: "china",
    region: "Cantón & Hong Kong Bay",
    tagline: "Alta gastronomía cantonesa, dim sum al vapor y tesoros marinos",
    heroImage: "images/cn_canton.png",
    accentColor: "#10b981",
    secondaryColor: "#047857",
    glowColor: "rgba(16, 185, 129, 0.4)",
    sections: {
      entradas: {
        title: "🥟 1. DIM SUM PALACE (精选点心)",
        subtitle: "Canastas al vapor de bambú y hojaldres crujientes",
        items: [
          { name: "Selección Imperial de Dim Sum (Dim Sum Basket)", price: "$16.50", image: "images/cn_canton.png", desc: "Har Gow de camarón cristal, Siu Mai de cerdo y Bao al vapor de barbacoa Char Siu.", tags: ["⭐ Favorito", "Tradicional"] }
        ]
      },
      fuertes: {
        title: "🍲 2. PLATOS FUERTES & MARISCOS (粤式主菜)",
        subtitle: "Sabor delicado y equilibrio de aromas de la costa de Cantón",
        items: [
          { name: "Pato Asado Cantón con Piel Crocante (广式烧鸭)", price: "$29.00", image: "images/cn_canton.png", desc: "Pato marinado en cinco especias y miel, horneado lentamente con salsa de ciruela.", tags: ["Plato Estrella"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS (儿童点心)",
        subtitle: "Dumplings suaves de formas divertidas",
        items: [
          { name: "Mini Bao de Crema Dulce y Siu Mai Suaves", price: "$10.50", image: "images/bento.png", desc: "Baos al vapor esponjosos con forma de personajes y tres dumplings de carne suave.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA & TÉ (港式饮品)",
        subtitle: "Té estilo Hong Kong y coctelería infusionada",
        items: [
          { name: "Hong Kong Milk Tea Craft Cocktail", price: "$13.50", image: "images/cocktail.png", desc: "Té negro concentrado con leche evaporada, ron añejo y tapioca de boba.", tags: ["🍸 Coctel de Autor"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES & NATILLAS (粤式甜品)",
        subtitle: "Egg tarts doradas y cremas de yema fluyente",
        items: [
          { name: "Egg Tarts Cantonesas Doradas (蛋挞)", price: "$8.50", image: "images/matcha.png", desc: "Dos tartas de hojaldre crujiente con natilla frita de huevo al aroma de vainilla.", tags: ["Cálido"] }
        ]
      }
    }
  },

  {
    id: "cn-peking",
    name: "PEKING IMPERIAL FEAST",
    kanji: "北京宫廷烤鸭宴",
    logoIcon: "👑",
    cuisine: "china",
    region: "Beijing / Ciudad Prohibida",
    tagline: "El lujo ceremonial de los banquetes imperiales de la Dinastía Qing",
    heroImage: "images/cn_peking.png",
    accentColor: "#dc2626",
    secondaryColor: "#7f1d1d",
    glowColor: "rgba(220, 38, 38, 0.4)",
    sections: {
      entradas: {
        title: "🥟 1. ENTRADAS PALACIEGAS (宫廷冷盘)",
        subtitle: "Bocadillos ceremoniales de la corte imperial",
        items: [
          { name: "Ensalada Imperial de Medusa al Vinagre Negro (老醋海哲)", price: "$14.50", image: "images/sushi.png", desc: "Textura crujiente marinada en vinagre ahumado de Shanxi y sésamo.", tags: ["Exótico"] }
        ]
      },
      fuertes: {
        title: "🍲 2. BANQUETE IMPERIAL & PATO PEKÍN (御膳主菜)",
        subtitle: "El legendario Pato Pekín servido en mesa en tres tiempos",
        items: [
          { name: "Pato Laqueado Pekín Ceremonial (北京烤鸭)", price: "$54.00", image: "images/cn_peking.png", desc: "Servido en mesa: Piel crujiente dorada y carne jugosa con crepas delgadas, cebollín y salsa Tianmianjiang.", tags: ["👑 Leyenda Culinaria"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS IMPERIAL (御膳儿童餐)",
        subtitle: "Crepas dulces de pato y pollo crocante",
        items: [
          { name: "Crepas Dulces de Pato Pekín para Niños", price: "$12.00", image: "images/bento.png", desc: "Tres crepas delgadas enrolladas con pollo asado dulce, pepino y salsa de manzana.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA BARS (宫廷御酒)",
        subtitle: "Elixires con Baijiu imperial y flores de crisantemo",
        items: [
          { name: "Forbidden City Royal Baijiu Sour", price: "$16.00", image: "images/cocktail.png", desc: "Baijiu exclusivo, licor de espino blanco, jugo de limón e infusión de azahar.", tags: ["🍸 Coctel de Autor"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES DE CORTE (宫廷糕点)",
        subtitle: "Pastelillos tallados con sellos imperiales",
        items: [
          { name: "Manzanas Caramelizadas a la Hilo de Seda (拔丝苹果)", price: "$10.00", desc: "Manzanas fritas envueltas en hilos de caramelo crujiente que se enfrían en hielo.", tags: ["Espectáculo"] }
        ]
      }
    }
  },

  {
    id: "cn-taiwan",
    title: "TAIWANESE NIGHT MARKET FEAST",
    kanji: "台湾夜市美食楼",
    logoIcon: "🧋",
    cuisine: "china",
    region: "Taiwán / Taipéi Shilin District",
    tagline: "La energía nocturna de los mercados de Taipéi, Pollo XXL y Té Boba artesanal",
    heroImage: "images/cn_taiwan.png",
    accentColor: "#a855f7",
    secondaryColor: "#7e22ce",
    glowColor: "rgba(168, 85, 247, 0.4)",
    sections: {
      entradas: {
        title: "🥟 1. STREET SNACKS (夜市小吃的)",
        subtitle: "Pollo crocante XXL y bao gua bao tradicionales",
        items: [
          { name: "Pollo Crocante XXL estilo Mercado Nocturno (台湾大鸡排)", price: "$12.00", image: "images/cn_taiwan.png", desc: "Pechuga frita aplanada marinada en 5 especias con sal de pimienta blanca.", tags: ["Súper Crocante", "Famoso"] }
        ]
      },
      fuertes: {
        title: "🍲 2. PLATOS FUERTES (台湾名菜)",
        subtitle: "Fideos de res de Taipéi y arroz con cerdo Lu Rou Fan",
        items: [
          { name: "Sopa de Fideos de Res estilo Taipéi (台湾牛肉面)", price: "$19.50", image: "images/ramen.png", desc: "Jarrete de res estofado por 8 horas en caldo concentrado de jitomate y especias.", tags: ["Plato Nacional"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS (儿童夜市)",
        subtitle: "Bocaditos de pollo popcorn dulce",
        items: [
          { name: "Bocaditos Popcorn Chicken con Papitas Sonrientes", price: "$10.00", image: "images/bento.png", desc: "Trocitos de pechuga frita crujiente no picantes con salsa catsup dulce.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA & BOBA (珍珠奶茶)",
        subtitle: "Cocteles de té negro con boba de tapioca caliente",
        items: [
          { name: "Boba Milk Tea Cocktail con Ron Caribeño", price: "$13.00", image: "images/cocktail.png", desc: "Té negro de Taiwán con leche fresca, perlas de tapioca y shot de ron añejo.", tags: ["🍸 Coctel de Autor"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES Y SHAVED ICE (冰品甜点)",
        subtitle: "Granizados gigantes de mango y pastelillos de piña",
        items: [
          { name: "Shaved Ice con Mango y Leche Condensada (芒果雪花冰)", price: "$9.50", image: "images/matcha.png", desc: "Nieve de hielo de leche con láminas de mango fresco y gelato.", tags: ["Gigante"] }
        ]
      }
    }
  },

  // ==========================================
  // 🇯🇵 COMIDA JAPONESA (8 RESTAURANTES)
  // ==========================================
  {
    id: "jp-tokyo",
    name: "TOKYO NEO-FUSION GASTROBAR",
    kanji: "東京新和食寿司",
    logoIcon: "🍣",
    cuisine: "japonesa",
    region: "Tokyo / Shibuya Cyber District",
    tagline: "Alta Gastronomía Japonesa Contemporánea • Coctelería de Autor • Experiencia Sensorial",
    heroImage: "images/hero.png",
    accentColor: "#6366f1",
    secondaryColor: "#4338ca",
    glowColor: "rgba(99, 102, 241, 0.4)",
    sections: {
      entradas: {
        title: "🥟 1. ENTRADAS & SASHIMI (スターター)",
        subtitle: "Bocadillos crujientes, pescados frescos marinados y cortes de autor",
        items: [
          { name: "Sashimi Moriawase & Omakase Selection", price: "$28.50", image: "images/sushi.png", desc: "9 cortes nobles de salmón fresco, otoro de atún azul y hamachi servidos sobre hielo con caviar ikura.", tags: ["⭐ Plato Insignia", "Pescado Fresco"] },
          { name: "Gyoza Crocantes de Trufa y Cerdo Kurobuta", price: "$14.00", image: "images/sushi.png", desc: "6 empanadillas al sartén con base crujiente y aceite de trufa negra.", tags: ["🥟 Crujiente"] }
        ]
      },
      fuertes: {
        title: "🍲 2. PLATOS FUERTES & ROBATA (メインディッシュ)",
        subtitle: "Cortes de Wagyu A5 a la piedra, tonkotsu ramen humeante y robata",
        items: [
          { name: "A5 Wagyu Striploin 150g a la Piedra Volcánica", price: "$78.00", image: "images/wagyu.png", desc: "El marmoleado legendario del Wagyu A5 de Kobe con sal de moshio y wasabi fresco.", tags: ["🔥 Wagyu A5", "Exclusivo"] },
          { name: "Tokyo Neo Tonkotsu Ramen Deluxe", price: "$21.50", image: "images/ramen.png", desc: "Caldo de cerdo hervido por 18 horas con chashu caramelizado y huevo ajitama.", tags: ["🍜 Famoso en Tokyo"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS (キッズメニュー)",
        subtitle: "Bento boxes divertidos y fideos suaves",
        items: [
          { name: "Kawaii Panda Bento Box Infantil", price: "$12.50", image: "images/bento.png", desc: "Esfera de arroz en forma de panda feliz, brochetitas de pollo teriyaki y tamagoyaki.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA NEÓN & DRINKS (カクテル＆ドリンク)",
        subtitle: "Coctelería con yuzu y elixires japoneses",
        items: [
          { name: "Tokyo Yuzu Dragonfruit Neon Cocktail", price: "$16.50", image: "images/cocktail.png", desc: "Vodka Haku, yuzu de Kochi, fruta del dragón rosa e hielo de cristal con oro.", tags: ["🍸 Coctel de Autor"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES & MATCHALAND (デザート)",
        subtitle: "Volcanes de té verde y mochies artesanales",
        items: [
          { name: "Volcán de Matcha Lava Cake & Gelato de Sésamo", price: "$12.00", image: "images/matcha.png", desc: "Bizcocho tibio de té verde con corazón fluido de chocolate blanco y gelato.", tags: ["⭐ Postre Insignia"] }
        ]
      }
    }
  },

  {
    id: "jp-osaka",
    name: "OSAKA DOTONBORI IZAKAYA",
    kanji: "大阪道頓堀居酒屋",
    logoIcon: "🏮",
    cuisine: "japonesa",
    region: "Osaka / Dotonbori Canal",
    tagline: "El espíritu festivo de Osaka: Takoyaki caliente, Okonomiyaki y brochetas Yakitori",
    heroImage: "images/sushi.png",
    accentColor: "#f59e0b",
    secondaryColor: "#d97706",
    glowColor: "rgba(245, 158, 11, 0.4)",
    sections: {
      entradas: {
        title: "🥟 1. STREET SNACKS & TAKOYAKI (たこ焼き)",
        subtitle: "Bocadillos crujientes directo de las brasas de Dotonbori",
        items: [
          { name: "Takoyaki Calientitos de Dotonbori - 6 Piezas", price: "$11.00", image: "images/sushi.png", desc: "Esferas crocantes rellenas de pulpo fresco con salsa okonomi y virutas de bonito.", tags: ["Famoso en Osaka"] }
        ]
      },
      fuertes: {
        title: "🍲 2. OKONOMIYAKI & YAKITORI (お好み焼き)",
        subtitle: "Tortillas a la plancha teppan y brochetas al carbón binchotan",
        items: [
          { name: "Okonomiyaki Estilo Osaka Tradicional", price: "$18.50", image: "images/wagyu.png", desc: "Tortilla abundante de col, panceta de cerdo y mariscos cocinada a la plancha.", tags: ["Plato Estrella"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS (キッズ居酒屋)",
        subtitle: "Brochetas teriyaki dulces para niños",
        items: [
          { name: "Brochetitas Yakitori Glaseadas en Salsa Teriyaki Suave", price: "$9.50", image: "images/bento.png", desc: "3 brochetas de pechuga de pollo sin hueso con salsa dulce y arroz.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. COCTELERÍA & SOURS (レモンサワー)",
        subtitle: "Lemon sours efervescentes y cerveza helada",
        items: [
          { name: "Osaka Lemon Sour Spritz", price: "$12.50", image: "images/cocktail.png", desc: "Shochu de cebada, jugo de limón entero congelado rallado y soda efervescente.", tags: ["🍸 Coctel Popular"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES DULCES (たい焼き)",
        subtitle: "Taiyaki en forma de pez recién horneado",
        items: [
          { name: "Taiyaki Caliente Relleno de Nutella", price: "$7.50", image: "images/matcha.png", desc: "Waffle en forma de pez con centro derretido de crema de avellana.", tags: ["Popular"] }
        ]
      }
    }
  },

  // ==========================================
  // 🇰🇷 COMIDA COREANA (2 RESTAURANTES)
  // ==========================================
  {
    id: "kr-seoul",
    name: "SEOUL MODERN BBQ & SOJU HOUSE",
    kanji: "서울강남한국火肉館",
    logoIcon: "🥩",
    cuisine: "coreana",
    region: "Seúl / Gangnam District",
    tagline: "La experiencia interactiva del K-BBQ con banchan ilimitado y Soju Bombs",
    heroImage: "images/kr_seoul.png",
    accentColor: "#ef4444",
    secondaryColor: "#16a34a",
    glowColor: "rgba(239, 68, 68, 0.4)",
    sections: {
      entradas: {
        title: "🥟 1. ENTRADAS & TTEOKBOKKI (떡볶이)",
        subtitle: "Tortillas picantes Kimchijeon y pasteles de arroz con queso",
        items: [
          { name: "Kimchijeon - Tortilla Crujiente de Kimchi y Mariscos (김치전)", price: "$13.50", image: "images/sushi.png", desc: "Panqueque dorado de kimchi bien madurado con calamares y cebollín.", tags: ["Popular"] },
          { name: "Tteokbokki Picante con Queso Mozzarella (떡볶이)", price: "$14.00", image: "images/ramen.png", desc: "Pasteles de arroz en salsa picante Gochujang con queso derretido.", tags: ["🌶️ Picante"] }
        ]
      },
      fuertes: {
        title: "🍲 2. COMBO K-BBQ IMPERIAL (불고기 & 삼겹살)",
        subtitle: "Cortes nobles marinados en mesa con 6 variedades de Banchan",
        items: [
          { name: "Combo K-BBQ Samgyeopsal & Galbi (불고기)", price: "$56.00", image: "images/kr_seoul.png", desc: "Panceta de cerdo corte grueso y Costilla Galbi marinada en pera coreana con ssamjang y lechuga.", tags: ["⭐ Para Compartir", "K-BBQ Real"] }
        ]
      },
      ninos: {
        title: "🧒 3. MENÚ DE NIÑOS KOREAN (儿童餐)",
        subtitle: "Bulgogi dulce picadito no picante",
        items: [
          { name: "Bulgogi Dulce Infantil con Arroz de Jazmín", price: "$11.00", image: "images/bento.png", desc: "Carne súper tierna marinada en jugo dulce de manzana y soya con arroz.", tags: ["🧒 Para Niños"] }
        ]
      },
      cocteleria: {
        title: "🍸 4. SOJU BOMBS & MAKGEOLLI (소주 & 막걸리)",
        subtitle: "Jarras de sandía congelada con Soju coreano",
        items: [
          { name: "Watermelon Soju Bomb Pitcher", price: "$18.00", image: "images/cocktail.png", desc: "Jarra servida en sandía fresca vaciada con Soju Chamisul y Sprite.", tags: ["🍸 Coctel de Fiesta"] }
        ]
      },
      postres: {
        title: "🥮 5. POSTRES & BINGSU (빙수 & 호떡)",
        subtitle: "Nieve helada de mango y panqueques Hotteok",
        items: [
          { name: "Bingsu de Mango y Leche Condensada (망고빙수)", price: "$11.50", image: "images/matcha.png", desc: "Montaña de nieve helada de leche con fruta picada de mango fresco.", tags: ["Gigante"] }
        ]
      }
    }
  }
];
