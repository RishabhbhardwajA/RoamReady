// High quality initial seed data for RoamReady travel gear e-commerce platform
const seedCategories = [
  {
    name: 'TSA-Approved Luggage Locks',
    slug: 'tsa-locks',
    description: 'Airport security-compliant zinc alloy combination and cable locks engineered to withstand heavy transit impact.',
    shortDescription: 'Certified security for global air travel.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    icon: 'Lock',
    displayOrder: 1,
    badge: 'TSA Certified'
  },
  {
    name: 'Luggage Tags & Identifiers',
    slug: 'luggage-tags',
    description: 'Anodized aluminum and premium vegan leather baggage tags with privacy shields and stainless steel wire loops.',
    shortDescription: 'Privacy-focused instant luggage identification.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    icon: 'Tag',
    displayOrder: 2,
    badge: 'Privacy Shield'
  },
  {
    name: 'Compression Packing Cubes',
    slug: 'packing-cubes',
    description: 'Double-zipper expandable compression cubes made from 300D ripstop water-resistant fabric with reinforced seams.',
    shortDescription: 'Save up to 60% luggage volume.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    icon: 'Package',
    displayOrder: 3,
    badge: '60% Space Saver'
  },
  {
    name: 'Heavy-Duty Baggage Straps',
    slug: 'baggage-straps',
    description: 'Tear-proof high-density polyester luggage belts with impact-resistant POM buckles and built-in tension grips.',
    shortDescription: 'Burst-proof luggage protection on carousels.',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
    icon: 'ShieldCheck',
    displayOrder: 4,
    badge: 'Heavy Duty'
  },
  {
    name: 'Foldable Nylon Duffel Bags',
    slug: 'foldable-duffels',
    description: 'Ultralight packable travel duffels that collapse into an integrated pouch with luggage trolley sleeve integration.',
    shortDescription: 'Lightweight extra luggage that folds into palm size.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    icon: 'Briefcase',
    displayOrder: 5,
    badge: 'Ultralight Packable'
  },
  {
    name: 'Travel Kits & Bundles',
    slug: 'travel-kits',
    description: 'Complete all-in-one travel bundles combining locks, compression sets, straps, and tags at discounted bundle rates.',
    shortDescription: 'Pre-curated kits for stress-free journeys.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    icon: 'Layers',
    displayOrder: 6,
    badge: 'Save Up to 25%'
  }
];

const seedProducts = [
  // 1. TSA Locks
  {
    title: 'RoamReady AeroLock Pro — 4-Digit TSA Combination Lock',
    slug: 'roamready-aerolock-pro-4-digit-tsa',
    sku: 'RR-LK-001',
    description: 'The RoamReady AeroLock Pro features high-strength zinc alloy casing, hardened steel shackle, and high-contrast numerical tumblers. Recognized and accepted by the US Transportation Security Administration (TSA) and international airport authorities, enabling security staff to inspect luggage without damaging the lock or zippers.',
    shortDescription: 'Heavy-duty 4-digit zinc alloy TSA combination lock with high-contrast numbers.',
    price: 699,
    originalPrice: 1299,
    discountPercent: 46,
    categorySlug: 'tsa-locks',
    categoryName: 'TSA-Approved Luggage Locks',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 148,
    stock: 85,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    badge: 'Bestseller',
    tags: ['tsa', 'lock', 'security', 'zinc-alloy', 'bestseller'],
    specifications: {
      material: 'Reinforced Electroplated Zinc Alloy + Hardened Carbon Steel Shackle',
      dimensions: '68 x 30 x 14 mm',
      weight: '78 grams',
      capacity: 'Fits all standard 4mm+ zipper pullers',
      lockType: '4-Dial Combination with Master TSA Keyhole',
      combinationDigits: 4,
      tsaApproved: true,
      waterResistance: 'Rust-Proof Anti-Corrosion Coating',
      warranty: '3-Year Replacement Guarantee',
      originCountry: 'India',
      closureType: 'Spring-loaded Shackle with Push-Button Release'
    },
    luggageCompatibility: ['Cabin (20"-22")', 'Medium Check-in (24"-26")', 'Large Check-in (28"-30")', 'Backpacks & Duffles'],
    variants: [
      {
        id: 'var-lk1-stealth-black',
        name: 'Stealth Matte Black',
        sku: 'RR-LK-001-BLK',
        colorName: 'Stealth Black',
        colorHex: '#1E293B',
        size: 'Standard',
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
        stockCount: 45,
        inStock: true
      },
      {
        id: 'var-lk1-silver-chrome',
        name: 'Aero Silver Chrome',
        sku: 'RR-LK-001-SLV',
        colorName: 'Aero Silver',
        colorHex: '#94A3B8',
        size: 'Standard',
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
        stockCount: 40,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'How do I set my personal 4-digit code?',
        answer: 'Default code is 0-0-0-0. Rotate the shackle 90 degrees to the reset notch, press it down firmly, set your desired 4-digit combination, and pull the shackle back up. Your new code is now set!'
      },
      {
        question: 'Does this lock come with a TSA key?',
        answer: 'No. The TSA keyhole is exclusively for official airport security screeners (TSA in USA, CATSA in Canada, etc.). You unlock your luggage using your secret 4-digit combination.'
      }
    ]
  },
  {
    title: 'RoamReady FlexCable — Flexible Steel Wire TSA Lock',
    slug: 'roamready-flexcable-flexible-steel-tsa-lock',
    sku: 'RR-LK-002',
    description: 'Engineered with a high-tensile braided steel cable that threads effortlessly through multiple zippers, pelican cases, or gym lockers. Ultra-compact and lightweight yet capable of resisting over 120 kg of pull tension.',
    shortDescription: 'Flexible braided cable TSA lock designed for tricky or dual zipper closures.',
    price: 549,
    originalPrice: 999,
    discountPercent: 45,
    categorySlug: 'tsa-locks',
    categoryName: 'TSA-Approved Luggage Locks',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 92,
    stock: 60,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    badge: 'New Arrival',
    tags: ['tsa', 'cable-lock', 'security', 'flexible'],
    specifications: {
      material: 'Braided Stainless Steel Wire with Vinyl Coating + Cast Zinc Housing',
      dimensions: '82 x 32 x 12 mm (Cable length: 110 mm)',
      weight: '62 grams',
      capacity: 'Threads through zippers down to 3mm aperture',
      lockType: '3-Dial TSA Combination',
      combinationDigits: 3,
      tsaApproved: true,
      waterResistance: 'Weather-Resistant Vinyl Jacket',
      warranty: '2-Year Warranty',
      originCountry: 'India'
    },
    luggageCompatibility: ['Duffels', 'Backpacks', 'Hard Suitcases', 'Pelican Cases'],
    variants: [
      {
        id: 'var-lk2-midnight',
        name: 'Midnight Navy',
        sku: 'RR-LK-002-NVY',
        colorName: 'Midnight Navy',
        colorHex: '#0F172A',
        size: 'Standard',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
        stockCount: 35,
        inStock: true
      },
      {
        id: 'var-lk2-amber',
        name: 'Sunrise Amber',
        sku: 'RR-LK-002-AMB',
        colorName: 'Sunrise Amber',
        colorHex: '#F59E0B',
        size: 'Standard',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
        stockCount: 25,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'Will this cable fit small backpack zipper holes?',
        answer: 'Yes! The flexible cable has a slim 3.2mm diameter tip that threads easily through any standard backpack or duffel zipper slider.'
      }
    ]
  },

  // 2. Luggage Tags
  {
    title: 'RoamReady PrivacyShield — Anodized Aluminum Luggage Tag',
    slug: 'roamready-privacyshield-aluminum-luggage-tag',
    sku: 'RR-TG-001',
    description: 'Keep your identity secure on the baggage carousel. Features a precision CNC-milled aluminum cover that conceals your phone number and address while displaying only your name. Secured with a screw-lock stainless steel braided loop that will never snap off.',
    shortDescription: 'Aircraft-grade aluminum luggage tag with confidential privacy flap.',
    price: 399,
    originalPrice: 799,
    discountPercent: 50,
    categorySlug: 'luggage-tags',
    categoryName: 'Luggage Tags & Identifiers',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 215,
    stock: 120,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    badge: 'Bestseller',
    tags: ['luggage-tag', 'privacy', 'aluminum', 'travel-security'],
    specifications: {
      material: 'Anodized 6063 Aluminum Alloy + PVC Waterproof ID Card Cover',
      dimensions: '80 x 42 x 3 mm',
      weight: '24 grams',
      capacity: 'Holds double-sided waterproof contact card',
      lockType: 'Screw-Lock Braided Steel Cable (170 mm)',
      tsaApproved: false,
      waterResistance: '100% Waterproof Seal Insert',
      warranty: 'Lifetime Replacement on Steel Cable',
      originCountry: 'India'
    },
    luggageCompatibility: ['All Suitcases', 'Carry-ons', 'Duffels', 'Golf Bags'],
    variants: [
      {
        id: 'var-tg1-slate',
        name: 'Slate Gunmetal',
        sku: 'RR-TG-001-SLT',
        colorName: 'Gunmetal Slate',
        colorHex: '#334155',
        size: 'Standard',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
        stockCount: 60,
        inStock: true
      },
      {
        id: 'var-tg1-champagne',
        name: 'Champagne Gold',
        sku: 'RR-TG-001-GLD',
        colorName: 'Champagne Gold',
        colorHex: '#D97706',
        size: 'Standard',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
        stockCount: 60,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'Does this protect my personal address from being seen by strangers?',
        answer: 'Yes! The outer aluminum sleeve covers your address and contact phone number. Only your name is visible on the outside. In case of lost baggage, airline staff simply slide open the inner sleeve.'
      }
    ]
  },

  // 3. Compression Packing Cubes
  {
    title: 'RoamReady CompressPack Elite — 6-Piece Compression Cube Set',
    slug: 'roamready-compresspack-elite-6-piece-set',
    sku: 'RR-PC-001',
    description: 'Compress bulky clothes, jackets, and accessories by up to 60% with our engineered double-zipper compression system. Crafted from ultra-durable 300D honeycomb ripstop nylon with genuine SBS heavy-duty reverse zippers and breathable micromesh viewing windows.',
    shortDescription: '6-piece modular compression packing cube set saving 60% luggage volume.',
    price: 1499,
    originalPrice: 2999,
    discountPercent: 50,
    categorySlug: 'packing-cubes',
    categoryName: 'Compression Packing Cubes',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 342,
    stock: 95,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    badge: 'Award Winner',
    tags: ['compression', 'packing-cubes', 'space-saver', 'water-resistant', 'bestseller'],
    specifications: {
      material: '300D Honeycomb Ripstop Diamond Nylon + Reinforced Webbing Handle',
      dimensions: 'XL (40x30x10cm), L (35x25x10cm), M (30x20x10cm), S (25x18x10cm), Shoe Bag (38x20cm), Laundry Bag (45x35cm)',
      weight: '410 grams total set',
      capacity: 'Fits full 14-day wardrobe into a 22" cabin suitcase',
      compressionMechanism: 'Dual-Zipper Perimeter Compression with Bar-Tack Seam Reinforcements',
      waterResistance: 'DWR (Durable Water Repellent) Polyurethane Coating',
      warranty: '2-Year Zipper & Seam Warranty',
      originCountry: 'India',
      closureType: 'Reinforced SBS Smooth Glide Dual Sliders'
    },
    luggageCompatibility: ['Cabin Bags (20"-22")', 'Medium Trolleys (24"-26")', 'Large Suitcases (28"-30")'],
    variants: [
      {
        id: 'var-pc1-obsidian',
        name: 'Obsidian Navy',
        sku: 'RR-PC-001-NVY',
        colorName: 'Obsidian Navy',
        colorHex: '#0F172A',
        size: '6-Piece Complete Set',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        stockCount: 50,
        inStock: true
      },
      {
        id: 'var-pc1-sage',
        name: 'Olive Sage',
        sku: 'RR-PC-001-SGE',
        colorName: 'Olive Sage',
        colorHex: '#475569',
        size: '6-Piece Complete Set',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        stockCount: 45,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'Do these really compress clothes without wrinkling them?',
        answer: 'Yes! By neatly folding garments and zipping the exterior compression track, trapped air is expelled evenly without twisting clothes, leaving garments wrinkle-free.'
      },
      {
        question: 'Can the zippers handle being packed tightly?',
        answer: 'Our cubes utilize heavy-gauge SBS reinforced dual-pull zippers with high tensile bar-tack stitching tested to withstand over 35 kg of cross-seam pressure.'
      }
    ]
  },
  {
    title: 'RoamReady AeroPack Ultralight — 4-Piece Quick Pack Cubes',
    slug: 'roamready-aeropack-ultralight-4-piece-cubes',
    sku: 'RR-PC-002',
    description: 'Designed specifically for weekend trips, business overnight journeys, and gym carry-ons. Featherlight 70D silnylon construction provides maximum compressibility and tear resistance.',
    shortDescription: 'Featherlight 4-piece packing cubes ideal for 2-4 day weekend trips.',
    price: 999,
    originalPrice: 1799,
    discountPercent: 44,
    categorySlug: 'packing-cubes',
    categoryName: 'Compression Packing Cubes',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 88,
    stock: 70,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    badge: 'Ultralight',
    tags: ['ultralight', 'packing-cubes', 'weekend', 'silnylon'],
    specifications: {
      material: '70D Siliconized Ripstop Nylon',
      dimensions: 'Large (35x25x8cm), Medium (30x18x8cm), Small (22x15x8cm), Pouch (20x12cm)',
      weight: '190 grams total set',
      capacity: 'Fits easily into 20-30L backpacks and weekenders',
      compressionMechanism: 'Integrated Compression Gusset',
      waterResistance: 'Water-Repellent Hydrostatic Coating',
      warranty: '2-Year Warranty',
      originCountry: 'India'
    },
    luggageCompatibility: ['Backpacks (20-35L)', 'Cabin Luggage (20"-22")'],
    variants: [
      {
        id: 'var-pc2-charcoal',
        name: 'Charcoal Mist',
        sku: 'RR-PC-002-CHR',
        colorName: 'Charcoal Mist',
        colorHex: '#334155',
        size: '4-Piece Set',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        stockCount: 40,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'Are these cubes machine washable?',
        answer: 'Yes, wash with cold water on delicate cycle and hang dry. Avoid hot water and bleach.'
      }
    ]
  },

  // 4. Heavy-Duty Baggage Straps
  {
    title: 'RoamReady CrossGuard — Heavy-Duty Cross Luggage Strap with TSA Lock',
    slug: 'roamready-crossguard-heavy-duty-strap-tsa-lock',
    sku: 'RR-ST-001',
    description: 'Protect your luggage from accidental zipper bursts and carousel spills. Features a 2-inch wide ultra-dense polypropylene cross-strap webbed in an X-configuration with an integrated 3-digit TSA-approved lock buckle. Vibrant contrast accents make your bag instantly recognizable on the baggage belt.',
    shortDescription: 'X-pattern heavy-duty baggage strap with built-in 3-digit TSA combination lock.',
    price: 649,
    originalPrice: 1199,
    discountPercent: 46,
    categorySlug: 'baggage-straps',
    categoryName: 'Heavy-Duty Baggage Straps',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 164,
    stock: 75,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    badge: 'TSA Integrated',
    tags: ['strap', 'tsa-lock', 'heavy-duty', 'anti-burst', 'security'],
    specifications: {
      material: '1000D High-Density Jacquard Polyester Webbing + High-Impact POM Buckle',
      dimensions: 'Horizontal: up to 200 cm; Vertical: up to 230 cm; Width: 5 cm (2 inches)',
      weight: '235 grams',
      capacity: 'Fits all suitcases from 20" to 32"',
      lockType: 'Integrated 3-Digit TSA Combination Buckle',
      tsaApproved: true,
      waterResistance: 'Weather-Proof Mold-Resistant Webbing',
      warranty: '3-Year Unconditional Buckle Guarantee',
      originCountry: 'India'
    },
    luggageCompatibility: ['Cabin (20"-22")', 'Medium (24"-26")', 'Large (28"-32")'],
    variants: [
      {
        id: 'var-st1-cobalt',
        name: 'Aero Cobalt & Amber',
        sku: 'RR-ST-001-CBL',
        colorName: 'Cobalt / Amber Stripe',
        colorHex: '#2563EB',
        size: 'Universal (Adjustable 20"-32")',
        image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
        stockCount: 45,
        inStock: true
      },
      {
        id: 'var-st1-obsidian',
        name: 'Tactical Blackout',
        sku: 'RR-ST-001-BLK',
        colorName: 'Tactical Black',
        colorHex: '#0F172A',
        size: 'Universal (Adjustable 20"-32")',
        image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
        stockCount: 30,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'Does the strap slip or loosen during transit?',
        answer: 'No. The CrossGuard incorporates a ribbed high-friction textured weave and dual non-slip tension triglides that hold locked tension even during severe baggage drops.'
      }
    ]
  },

  // 5. Foldable Nylon Duffel Bags
  {
    title: 'RoamReady Voyager Packable 40L — Foldable Waterproof Duffel Bag',
    slug: 'roamready-voyager-packable-40l-duffel',
    sku: 'RR-DF-001',
    description: 'The ultimate souvenir saver and secondary travel bag. Weighing just 280 grams, it unfolds in seconds into a spacious 40-litre duffel with a dedicated trolley sleeve that slides securely over any suitcase handle. Made of 420D ripstop water-repellent nylon with separate wet/shoe pocket.',
    shortDescription: '40L ultralight packable travel duffel with luggage handle pass-through sleeve.',
    price: 1199,
    originalPrice: 2199,
    discountPercent: 45,
    categorySlug: 'foldable-duffels',
    categoryName: 'Foldable Nylon Duffel Bags',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 228,
    stock: 80,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    badge: 'Trolley Sleeve',
    tags: ['duffel', 'foldable', 'packable', 'trolley-sleeve', 'waterproof', 'bestseller'],
    specifications: {
      material: '420D Diamond Ripstop Waterproof Nylon + Metal Alloy Swivel Clips',
      dimensions: 'Unfolded: 52 x 30 x 26 cm; Folded: 20 x 18 x 4 cm',
      weight: '280 grams',
      capacity: '40 Litres (Meets IATA Cabin Baggage Regulations)',
      waterResistance: 'IPX4 Water-Resistant & Stain-Repellent Coating',
      warranty: '2-Year Hardware & Seam Warranty',
      originCountry: 'India',
      closureType: 'Dual Heavy-Duty Zippers with Metal Pull Tabs'
    },
    luggageCompatibility: ['Fits over all standard 18"-32" trolley handles via back sleeve', 'Under-seat cabin carry-on'],
    variants: [
      {
        id: 'var-df1-navy',
        name: 'Deep Oceanic Navy',
        sku: 'RR-DF-001-NVY',
        colorName: 'Deep Navy',
        colorHex: '#0F172A',
        size: '40 Litres',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        stockCount: 45,
        inStock: true
      },
      {
        id: 'var-df1-crimson',
        name: 'Crimson Ember',
        sku: 'RR-DF-001-RED',
        colorName: 'Crimson Red',
        colorHex: '#DC2626',
        size: '40 Litres',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        stockCount: 35,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'Does it slide securely over my rolling suitcase?',
        answer: 'Yes! The back features a reinforced 22 cm wide trolley strap that slides over any rolling luggage handle so your bag won’t slide off while running through terminals.'
      },
      {
        question: 'Can I take this as personal item cabin baggage on Indigo, Air India, or Emirates?',
        answer: 'Yes, its 52 x 30 x 26 cm dimensions easily fit within airline overhead bins and under seats.'
      }
    ]
  },

  // 6. Curated Travel Kits (BUNDLES)
  {
    title: 'RoamReady International Explorer Bundle — All-in-One Flight Kit',
    slug: 'roamready-international-explorer-bundle',
    sku: 'RR-KT-001',
    description: 'The ultimate flight-ready package for hassle-free international journeys. Includes our flagship 4-Digit TSA AeroLock Pro, PrivacyShield Aluminum Luggage Tag, CrossGuard TSA Luggage Strap, and 6-Piece CompressPack Elite system. Save 25% compared to purchasing individually.',
    shortDescription: 'Complete international flight kit: 4-digit TSA lock + Privacy tag + Cross strap + 6 cubes.',
    price: 2799,
    originalPrice: 3899,
    discountPercent: 28,
    categorySlug: 'travel-kits',
    categoryName: 'Travel Kits & Bundles',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    reviewCount: 312,
    stock: 50,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    badge: 'Bundle Deal • Save ₹1100',
    tags: ['kit', 'bundle', 'international', 'tsa', 'all-in-one', 'bestseller'],
    isTravelKit: true,
    specifications: {
      material: 'Aircraft Aluminum + Zinc Alloy + 300D Ripstop Nylon + Polyester Webbing',
      dimensions: 'Complete Travel Bundle in Gift Ready Travel Case',
      weight: '740 grams total kit weight',
      capacity: 'Full 14-day international travel preparation kit',
      tsaApproved: true,
      waterResistance: 'Water-Resistant Components',
      warranty: '3-Year Comprehensive Bundle Warranty',
      originCountry: 'India'
    },
    luggageCompatibility: ['All International Cabin & Check-In Bags (20" to 32")'],
    variants: [
      {
        id: 'var-kt1-classic',
        name: 'Obsidian Suite',
        sku: 'RR-KT-001-OBS',
        colorName: 'Obsidian Suite',
        colorHex: '#0F172A',
        size: 'Universal Travel Kit',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
        stockCount: 50,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'Are all 4 products included in one box?',
        answer: 'Yes! The International Explorer Kit comes packaged in a branded travel box, perfect for frequent flyers or as a gift for travelers.'
      }
    ]
  },
  {
    title: 'RoamReady Weekend Escape Duo — 40L Duffel + 4-Pack Cubes',
    slug: 'roamready-weekend-escape-duo',
    sku: 'RR-KT-002',
    description: 'Pack light and skip baggage queues. This bundle combines our Voyager Packable 40L Duffel with the AeroPack Ultralight 4-Piece Cubes. Perfect for 2 to 4-day getaways, road trips, and business retreats.',
    shortDescription: 'Packable 40L Duffel + 4-piece ultralight compression cubes bundle.',
    price: 1899,
    originalPrice: 2699,
    discountPercent: 30,
    categorySlug: 'travel-kits',
    categoryName: 'Travel Kits & Bundles',
    brand: 'RoamReady',
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 119,
    stock: 40,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    badge: 'Weekend Special',
    tags: ['kit', 'weekend', 'duffel', 'cubes', 'bundle'],
    isTravelKit: true,
    specifications: {
      material: '420D + 70D Ripstop Water-Repellent Nylon',
      dimensions: 'Duffel: 52x30x26 cm (40L); Cubes: 4 modular sizes',
      weight: '470 grams total weight',
      capacity: '40 Litres total storage',
      waterResistance: 'IPX4 Water-Resistant',
      warranty: '2-Year Warranty',
      originCountry: 'India'
    },
    luggageCompatibility: ['Carry-on overhead bin compliant', 'Personal vehicle trunk'],
    variants: [
      {
        id: 'var-kt2-navy',
        name: 'Oceanic Duo',
        sku: 'RR-KT-002-NVY',
        colorName: 'Oceanic Navy',
        colorHex: '#0F172A',
        size: '40L + 4 Cubes',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        stockCount: 40,
        inStock: true
      }
    ],
    faq: [
      {
        question: 'Does the 4-pack cubes fit inside the 40L duffel?',
        answer: 'Yes, with plenty of room to spare for your shoes, toiletries, and laptop!'
      }
    ]
  }
];

const seedCoupons = [
  {
    code: 'WELCOME10',
    description: '10% discount on your first order',
    discountType: 'percentage',
    discountValue: 10,
    minimumSpend: 499,
    maxDiscount: 500,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'ROAMFREEDOM',
    description: '₹200 flat off on orders above ₹1499',
    discountType: 'fixed',
    discountValue: 200,
    minimumSpend: 1499,
    maxDiscount: 200,
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'FLYREADY',
    description: '15% off on travel kits and bundles',
    discountType: 'percentage',
    discountValue: 15,
    minimumSpend: 1999,
    maxDiscount: 1000,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

const seedReviews = [
  {
    productSlug: 'roamready-aerolock-pro-4-digit-tsa',
    userName: 'Vikramaditya S.',
    userCity: 'Bengaluru',
    rating: 5,
    title: 'Flown through Heathrow and JFK without a scratch',
    comment: 'The 4-digit tumblers turn smoothly with a satisfying click. Airport security in London inspected my bag with their master key without breaking the lock. Highly recommended!',
    verifiedPurchase: true,
    travelType: 'Frequent Business Flyer'
  },
  {
    productSlug: 'roamready-aerolock-pro-4-digit-tsa',
    userName: 'Ananya Mehra',
    userCity: 'Mumbai',
    rating: 5,
    title: 'Solid build quality compared to generic Amazon locks',
    comment: 'Feels much more solid in hand than typical luggage locks. Heavy-duty zinc alloy and setting the combination code took less than 30 seconds.',
    verifiedPurchase: true,
    travelType: 'Vacationer'
  },
  {
    productSlug: 'roamready-compresspack-elite-6-piece-set',
    userName: 'Rohan Deshmukh',
    userCity: 'Pune',
    rating: 5,
    title: 'Fitted 10 days of winter clothes into a single cabin suitcase',
    comment: 'The dual compression zippers are phenomenal. Usually zippers break when you pull hard, but these SBS zippers glide easily under high tension. Game changer!',
    verifiedPurchase: true,
    travelType: 'Solo Backpacker'
  },
  {
    productSlug: 'roamready-privacyshield-aluminum-luggage-tag',
    userName: 'Pooja Nair',
    userCity: 'Kochi',
    rating: 5,
    title: 'Great privacy design!',
    comment: 'I hate having my phone number exposed to everyone at Delhi airport carousel. The sliding metal cover solves that elegantly. The steel wire loop feels indestructible.',
    verifiedPurchase: true,
    travelType: 'Family Vacationer'
  },
  {
    productSlug: 'roamready-crossguard-heavy-duty-strap-tsa-lock',
    userName: 'Karan Singhal',
    userCity: 'Delhi',
    rating: 4,
    title: 'Very bright and easy to spot',
    comment: 'The blue and gold color made my black bag stand out instantly on the belt. Buckle held up through 3 connecting flights.',
    verifiedPurchase: true,
    travelType: 'International Traveler'
  },
  {
    productSlug: 'roamready-voyager-packable-40l-duffel',
    userName: 'Sneha Patel',
    userCity: 'Ahmedabad',
    rating: 5,
    title: 'Saved me ₹4500 in excess luggage fees!',
    comment: 'Bought so many things on my trip to Singapore. Unfolded this bag at the airport, packed all the heavy items, and slid it right over my suitcase handle. Absolute lifesaver.',
    verifiedPurchase: true,
    travelType: 'Leisure Shopper'
  }
];

module.exports = {
  seedCategories,
  seedProducts,
  seedCoupons,
  seedReviews
};
