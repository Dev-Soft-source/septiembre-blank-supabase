// BACKUP COPY - Complete affinities list from useAffinitiesDataWithLanguage.ts
// Contains the definitive list of 75+ affinities/themes
// DO NOT MODIFY - This is a preservation backup

// Definitive list of affinities - source of truth for all filters
export const COMPLETE_AFFINITIES_LIST = [
  "Academic Learning",
  "Antiques & Collectibles", 
  "Architecture & Design",
  "Art History & Movements",
  "Artificial Intelligence",
  "Artists & Creativity",
  "Astronomy",
  "Beaches & Coastlines",
  "Beer & Brewing Culture",
  "Beverages & Tastings",
  "Biology",
  "Board Games & Strategy",
  "Botanical Interest",
  "Business Innovation",
  "Ceramics & Pottery",
  "Chemistry",
  "Chinese Culture & Language",
  "Cinema & Film Appreciation",
  "Classical Music",
  "Collecting & Games",
  "Conferences & Seminars",
  "Confidence Building",
  "Contemporary & Pop Music",
  "Courses & Workshops",
  "Desserts & Sweets Culture",
  "Digital Nomadism",
  "Engineering & Technology",
  "English Language & Culture",
  "Finance & Investment",
  "Folk & Traditional Music",
  "Forests & Greenery",
  "French Cuisine & Gastronomy",
  "Friendship & Socializing",
  "Gardening & Horticulture",
  "Gourmet Experiences",
  "Holistic Therapies",
  "Illustration & Comics",
  "Innovation & Future Trends",
  "Italian Cuisine & Pasta Culture",
  "Jazz & Blues",
  "Language Exchange",
  "Latin Music",
  "Leadership & Strategy",
  "Live Entertainment",
  "Marine Life & Oceans",
  "Marketing & Branding",
  "Mathematics",
  "Media & Digital Culture",
  "Meditation & Mindfulness",
  "Mediterranean Cuisine",
  "Mental Skills Development",
  "Mountains & Scenic Views",
  "Musical Icons",
  "Music Appreciation & History",
  "Natural Environments",
  "Nutrition & Wellness",
  "Opera & Vocal Arts",
  "Painting & Fine Arts",
  "Performance Art",
  "Personal Development & Growth",
  "Philosophy",
  "Photography",
  "Psychology & Human Behavior",
  "Public Speaking",
  "Reading & Literary Circles",
  "Rock & Heavy Music",
  "Rural & Countryside Environments",
  "Science Communication",
  "Seaside & Coastal Tourism",
  "Spiritual Growth",
  "Strategy Games & Puzzles",
  "Sustainable Living",
  "Tai Chi & Qigong",
  "Travel & Cultural Exchange",
  "Urban Exploration",
  "Visual Arts & Graphics",
  "Wellness & Self-Care",
  "Writing & Creative Expression",
  "Yoga & Mindful Movement"
];

// Activity key to name mapping for database consistency
export const ACTIVITY_KEY_TO_NAME: Record<string, string> = {
  'bachata_dancing': 'Baile Bachata',
  'classical_dancing': 'Baile Clásico',
  'ballroom_dancing': 'Baile de Salón',
  'rock_roll_dancing': 'Baile Rock & Roll',
  'salsa_dancing': 'Baile Salsa',
  'tango_dancing': 'Baile Tango',
  'ballet_dance': 'Ballet & Danza',
  'relaxing_yoga': 'Yoga Relax',
  'spanish_cooking_workshop': 'Taller Cocina Española',
  'hiking': 'Senderismo',
  'spa_massage': 'Spa & Masaje',
  'wine_tasting': 'Cata de Vinos',
  'fitness': 'Fitness',
  'meditation': 'Meditación',
  'live_music': 'Música en Vivo'
};

// Month mapping for availability filters
export const MONTH_MAPPING: Record<string, string[]> = {
  'january': ['January', '2024-01', '2025-01', '2026-01'],
  'february': ['February', '2024-02', '2025-02', '2026-02'],
  'march': ['March', '2024-03', '2025-03', '2026-03'],
  'april': ['April', '2024-04', '2025-04', '2026-04'],
  'may': ['May', '2024-05', '2025-05', '2026-05'],
  'june': ['June', '2024-06', '2025-06', '2026-06'],
  'july': ['July', '2024-07', '2025-07', '2026-07'],
  'august': ['August', '2024-08', '2025-08', '2026-08'],
  'september': ['September', '2024-09', '2025-09', '2026-09'],
  'october': ['October', '2024-10', '2025-10', '2026-10'],
  'november': ['November', '2024-11', '2025-11', '2026-11'],
  'december': ['December', '2024-12', '2025-12', '2026-12']
};

// Meal plan mapping for database consistency
export const MEAL_PLAN_MAPPING: Record<string, string> = {
  'accommodationOnly': 'room_only',
  'breakfastIncluded': 'breakfast', 
  'halfBoard': 'half_board',
  'fullBoard': 'full_board',
  'allInclusive': 'all_inclusive',
  'room_only': 'room_only', // Direct match
  'breakfast': 'breakfast', // Direct match
  'half_board': 'half_board', // Direct match
  'full_board': 'full_board', // Direct match
  'all_inclusive': 'all_inclusive' // Direct match
};