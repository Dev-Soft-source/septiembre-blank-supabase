// BACKUP COPY - Original from src/data/demo-leaders.ts
// Contains complete demo leaders data (17 leaders)
// DO NOT MODIFY - This is a preservation backup

// Import leader images
import oliverJohnsonImg from '@/assets/leaders/oliver-johnson-unique.jpg';
import mayaChenImg from '@/assets/leaders/maya-chen-unique.jpg';
import marcusBrownImg from '@/assets/leaders/marcus-brown-unique.jpg';
import elenaRodriguezImg from '@/assets/leaders/elena-rodriguez-unique.jpg';
import jamesWilsonImg from '@/assets/leaders/james-wilson.jpg';
import ninaPetrovImg from '@/assets/leaders/nina-petrov.jpg';
import carlosSantosImg from '@/assets/leaders/carlos-santos.jpg';
import amiraHassanImg from '@/assets/leaders/amira-hassan.jpg';
import thomasMuellerImg from '@/assets/leaders/thomas-mueller-final.jpg';
import sophieMartinImg from '@/assets/leaders/sophie-martin.jpg';

export type DemoLeader = {
  slug: string;
  full_name: string;
  age: number;
  city: string;
  country: string;
  bio: string;
  affinity: string;
  activities: string[];
  avatar_url: string;
  hotel_id?: string; // will be hydrated from approved hotels
};

// Initial seed (demo only). Hotel IDs are hydrated at runtime with approved hotels.
export const DEMO_LEADERS: DemoLeader[] = [
  {
    slug: 'laura-campos',
    full_name: 'Laura Campos',
    age: 29,
    city: 'Barcelona',
    country: 'España',
    bio: 'Organiza experiencias urbanas para nómadas digitales.',
    affinity: 'Remote work',
    activities: ['Cafés con laptop', 'Arte contemporáneo', 'Running'],
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop'
  },
  {
    slug: 'diego-mendez',
    full_name: 'Diego Méndez',
    age: 34,
    city: 'Ciudad de México',
    country: 'México',
    bio: 'Explorador gastronómico y amante de la cultura local.',
    affinity: 'Food & Local Culture',
    activities: ['Street food tours', 'Mercaditos', 'Fotografía'],
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop'
  },
  {
    slug: 'sofia-ribeiro',
    full_name: 'Sofia Ribeiro',
    age: 31,
    city: 'Lisboa',
    country: 'Portugal',
    bio: 'Creadora de grupos de bienestar y yoga en destinos soleados.',
    affinity: 'Wellness & Yoga',
    activities: ['Yoga al amanecer', 'Caminatas costeras', 'Brunch saludable'],
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop'
  },
  {
    slug: 'andrei-lucian',
    full_name: 'Andrei Lucian',
    age: 38,
    city: 'Cluj-Napoca',
    country: 'România',
    bio: 'Conecta profesionales tech con experiencias de naturaleza.',
    affinity: 'Tech & Nature',
    activities: ['Hiking', 'Coworking pop-ups', 'Catas locales'],
    avatar_url: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop'
  },
  {
    slug: 'martina-bianchi',
    full_name: 'Martina Bianchi',
    age: 50,
    city: 'Milano',
    country: 'Italia',
    bio: 'Curadora de experiencias artísticas y de diseño.',
    affinity: 'Art & Design',
    activities: ['Museos', 'Rutas de diseño', 'Sketch & coffee'],
    avatar_url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=800&auto=format&fit=crop'
  },
  {
    slug: 'bruno-silva',
    full_name: 'Bruno Silva',
    age: 62,
    city: 'Rio de Janeiro',
    country: 'Brasil',
    bio: 'Lidera grupos de aventura suave y playas tranquilas.',
    affinity: 'Beach & Soft Adventure',
    activities: ['Senderismo leve', 'Playas escondidas', 'Fotografía al atardecer'],
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'
  },
  {
    slug: 'emma-williams',
    full_name: 'Emma Williams',
    age: 30,
    city: 'Dublin',
    country: 'Ireland',
    bio: 'Conecta viajeros sociales con cafés, música y cowork.',
    affinity: 'Social & Music',
    activities: ['Live sessions', 'Pub culture', 'Cowork jams'],
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop'
  },
  // New leaders start here
  {
    slug: 'oliver-johnson',
    full_name: 'Oliver Johnson',
    age: 27,
    city: 'London',
    country: 'United Kingdom',
    bio: 'Aventurero urbano especializado en fotografía de viajes. Captura momentos únicos en cada destino que visita.',
    affinity: 'Photography & Travel',
    activities: ['Urban photography', 'Street markets', 'Sunset walks'],
    avatar_url: oliverJohnsonImg
  },
  {
    slug: 'maya-chen',
    full_name: 'Maya Chen',
    age: 25,
    city: 'Singapore',
    country: 'Singapore',
    bio: 'Defensora del medio ambiente y vida sostenible. Organiza actividades eco-friendly en cada destino.',
    affinity: 'Sustainable Living',
    activities: ['Eco workshops', 'Zero waste tours', 'Local farming'],
    avatar_url: mayaChenImg
  },
  {
    slug: 'marcus-brown',
    full_name: 'Marcus Brown',
    age: 42,
    city: 'New York',
    country: 'United States',
    bio: 'Empresario serial y mentor de startups. Conecta emprendedores digitales alrededor del mundo.',
    affinity: 'Business & Entrepreneurship',
    activities: ['Networking events', 'Pitch sessions', 'Business tours'],
    avatar_url: marcusBrownImg
  },
  {
    slug: 'elena-rodriguez',
    full_name: 'Elena Rodriguez',
    age: 33,
    city: 'Buenos Aires',
    country: 'Argentina',
    bio: 'Escritora y amante de la literatura. Crea círculos de lectura en bibliotecas locales.',
    affinity: 'Books & Literature',
    activities: ['Book clubs', 'Literary walks', 'Writing workshops'],
    avatar_url: elenaRodriguezImg
  },
  {
    slug: 'james-wilson',
    full_name: 'James Wilson',
    age: 35,
    city: 'Sydney',
    country: 'Australia',
    bio: 'Entrenador personal y atleta. Organiza entrenamientos grupales al aire libre en destinos únicos.',
    affinity: 'Sports & Fitness',
    activities: ['Beach workouts', 'Mountain biking', 'Swimming groups'],
    avatar_url: jamesWilsonImg
  },
  {
    slug: 'nina-petrov',
    full_name: 'Nina Petrov',
    age: 28,
    city: 'Prague',
    country: 'Czech Republic',
    bio: 'Sommelier certificada y experta en gastronomía local. Descubre los mejores sabores de cada región.',
    affinity: 'Wine & Gastronomy',
    activities: ['Wine tastings', 'Cooking classes', 'Market tours'],
    avatar_url: ninaPetrovImg
  },
  {
    slug: 'carlos-santos',
    full_name: 'Carlos Santos',
    age: 45,
    city: 'São Paulo',
    country: 'Brasil',
    bio: 'Historiador y guía cultural. Revela los secretos históricos y tradiciones de cada ciudad que visita.',
    affinity: 'History & Culture',
    activities: ['Historical tours', 'Cultural workshops', 'Architecture walks'],
    avatar_url: carlosSantosImg
  },
  {
    slug: 'amira-hassan',
    full_name: 'Amira Hassan',
    age: 29,
    city: 'Cairo',
    country: 'Egypt',
    bio: 'Políglota y profesora de idiomas. Facilita intercambios culturales y práctica de idiomas.',
    affinity: 'Language Learning',
    activities: ['Language exchange', 'Cultural immersion', 'Translation walks'],
    avatar_url: amiraHassanImg
  },
  {
    slug: 'thomas-mueller',
    full_name: 'Thomas Mueller',
    age: 32,
    city: 'Berlin',
    country: 'Germany',
    bio: 'Desarrollador de videojuegos y entusiasta de la tecnología. Crea experiencias interactivas únicas.',
    affinity: 'Gaming & Technology',
    activities: ['Game nights', 'Tech meetups', 'VR experiences'],
    avatar_url: thomasMuellerImg
  },
  {
    slug: 'sophie-martin',
    full_name: 'Sophie Martin',
    age: 26,
    city: 'Paris',
    country: 'France',
    bio: 'Diseñadora de moda y consultora de estilo. Descubre las tendencias locales y la moda de cada destino.',
    affinity: 'Fashion & Lifestyle',
    activities: ['Fashion tours', 'Style workshops', 'Boutique visits'],
    avatar_url: sophieMartinImg
  }
];