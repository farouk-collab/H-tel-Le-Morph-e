export const defaultRooms = [
  {
    id: 1,
    slug: 'chambre-standard',
    name: { fr: 'Chambre Standard', en: 'Standard Room' },
    price: 25000,
    size: '20 m2',
    capacity: 2,
    description: {
      fr: 'Une chambre confortable pour un séjour simple et pratique à Totsivi, avec les essentiels pour bien se reposer à Lomé.',
      en: 'A comfortable room for a simple and practical stay in Totsivi, with the essentials for resting well in Lome.',
    },
    amenities: [
      { fr: 'Ventilateur', en: 'Fan' },
      { fr: 'Wi-Fi', en: 'Wi-Fi' },
      { fr: 'Television', en: 'Television' },
      { fr: 'Salle de bain privée', en: 'Private bathroom' },
    ],
    image: '/images/rooms/standard-1.jpeg',
    gallery: [
      '/images/rooms/standard-1.jpeg',
      '/images/rooms/standard-2.jpeg',
      '/images/rooms/standard-3.jpeg',
      '/images/rooms/standard-4.jpeg',
    ],
    featured: false,
    highlights: {
      fr: ['Tarif accessible', 'Confort essentiel', 'idéal pour courts séjours'],
      en: ['Accessible rate', 'Essential comfort', 'idéal for short stays'],
    },
  },
  {
    id: 2,
    slug: 'chambre-vip',
    name: { fr: 'Chambre VIP', en: 'VIP Room' },
    price: 40000,
    size: '28 m2',
    capacity: 2,
    description: {
      fr: 'Une chambre plus spacieuse avec climatisation, bureau et room service pour les voyageurs en quete de calme et de confort.',
      en: 'A more spacious room with air conditioning, desk and room service for guests looking for calm and comfort.',
    },
    amenities: [
      { fr: 'Climatisation', en: 'Air conditioning' },
      { fr: 'Wi-Fi', en: 'Wi-Fi' },
      { fr: 'Bureau', en: 'Desk' },
      { fr: 'Room service', en: 'Room service' },
    ],
    image: '/images/rooms/vip-1.jpeg',
    gallery: [
      '/images/rooms/vip-1.jpeg',
      '/images/rooms/vip-2.jpeg',
      '/images/rooms/vip-3.jpeg',
      '/images/rooms/vip-4.jpeg',
      '/images/rooms/vip-5.jpeg',
    ],
    featured: true,
    highlights: {
      fr: ['Espace de travail', 'Confort supérieur', 'idéal affaires'],
      en: ['Work-friendly', 'Premium comfort', 'Great for business'],
    },
  },
  {
    id: 3,
    slug: 'chambre-famille',
    name: { fr: 'Chambre famille', en: 'Family Room' },
    price: 55000,
    size: '36 m2',
    capacity: 4,
    description: {
      fr: 'Une solution adaptée aux familles et petits groupes avec davantage d espace et des équipements pensés pour un séjour serein.',
      en: 'A room designed for families and small groups, with more space and amenities for a peaceful stay.',
    },
    amenities: [
      { fr: 'Climatisation', en: 'Air conditioning' },
      { fr: 'Wi-Fi', en: 'Wi-Fi' },
      { fr: 'Television', en: 'Television' },
      { fr: 'Salle de bain privée', en: 'Private bathroom' },
    ],
    image: '/images/rooms/family-1.jpeg',
    gallery: [
      '/images/rooms/family-1.jpeg',
      '/images/rooms/family-2.jpeg',
      '/images/rooms/family-3.jpeg',
    ],
    featured: true,
    highlights: {
      fr: ['Capacité 4 personnes', 'séjour famille', 'Espace confortable'],
      en: ['Sleeps 4', 'Family-friendly', 'Comfortable space'],
    },
  },
]

export const rooms = defaultRooms

