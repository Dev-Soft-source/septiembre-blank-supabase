// COMPLETE THEME CATEGORIES BACKUP - ALL STATIC THEME DATA

import { ThemeCategory_Legacy, LegacyTheme, ThemeSubcategory_Legacy } from '../../utils/theme-types';

// ART CATEGORY
export const artCategory: ThemeCategory_Legacy = {
  category: "ART",
  themes: [
    { id: "painting", name: "Painting" },
    { id: "sculpture", name: "Sculpture" },
    { id: "photography", name: "Photography" },
    { id: "architecture", name: "Architecture" },
    { id: "design", name: "Design" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// CULTURE CATEGORY
export const cultureCategory: ThemeCategory_Legacy = {
  category: "CULTURE",
  themes: [
    { id: "history", name: "History" },
    { id: "museums", name: "Museums" },
    { id: "local-traditions", name: "Local Traditions" },
    { id: "festivals", name: "Festivals" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// LANGUAGES CATEGORY
export const languagesCategory: ThemeCategory_Legacy = {
  category: "LANGUAGES",
  subcategories: [
    {
      name: "Practice",
      themes: [
        { id: "english-practice", name: "English" },
        { id: "spanish-practice", name: "Spanish" },
        { id: "french-practice", name: "French" },
        { id: "german-practice", name: "German" },
        { id: "chinese-practice", name: "Chinese" },
        { id: "japanese-practice", name: "Japanese" },
        { id: "add-other-practice", name: "Add other", isAddOption: true }
      ] as LegacyTheme[]
    },
    {
      name: "Learning",
      themes: [
        { id: "english-learning", name: "English" },
        { id: "spanish-learning", name: "Spanish" },
        { id: "french-learning", name: "French" },
        { id: "german-learning", name: "German" },
        { id: "chinese-learning", name: "Chinese" },
        { id: "japanese-learning", name: "Japanese" },
        { id: "add-other-learning", name: "Add other", isAddOption: true }
      ] as LegacyTheme[]
    }
  ]
};

// MUSIC CATEGORY
export const musicCategory: ThemeCategory_Legacy = {
  category: "MUSIC",
  themes: [
    { id: "rock", name: "Rock" },
    { id: "opera", name: "Opera" },
    { id: "symphonic", name: "Symphonic" },
    { id: "classical", name: "Classical" },
    { id: "pop", name: "Pop" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// GAMES CATEGORY
export const gamesCategory: ThemeCategory_Legacy = {
  category: "GAMES",
  themes: [
    { id: "board-games", name: "Board Games" },
    { id: "card-games", name: "Card Games" },
    { id: "chess", name: "Chess" },
    { id: "video-games", name: "Video Games" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// LITERATURE CATEGORY
export const literatureCategory: ThemeCategory_Legacy = {
  category: "LITERATURE",
  themes: [
    { id: "poetry", name: "Poetry" },
    { id: "novels", name: "Novels" },
    { id: "short-stories", name: "Short Stories" },
    { id: "book-clubs", name: "Book Clubs" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// FOODS & DRINKS CATEGORY
export const foodAndDrinksCategory: ThemeCategory_Legacy = {
  category: "FOODS & DRINKS",
  subcategories: [
    {
      name: "Culinary",
      id: "culinary",
      level: 2,
      children: [
        {
          id: "world-cuisines",
          name: "World Cuisines",
          level: 3,
          children: [
            { id: "spain", name: "Spain" },
            { id: "france", name: "France" },
            { id: "italy", name: "Italian" },
            { id: "add-other", name: "Add other", isAddOption: true }
          ]
        },
        {
          id: "cuisine-learning",
          name: "Cuisine Learning", 
          level: 3,
          children: [
            { id: "meat", name: "Meat" },
            { id: "fish", name: "Fish" },
            { id: "seafood", name: "Seafood" },
            { id: "add-other", name: "Add other", isAddOption: true }
          ]
        }
      ]
    } as ThemeSubcategory_Legacy,
    {
      name: "Drinks",
      id: "drinks",
      level: 2,
      children: [
        { id: "wine", name: "Wine" },
        { id: "beer", name: "Beer" },
        { id: "cocktails", name: "Cocktails" },
        { id: "spirits", name: "Spirits" },
        { id: "add-other", name: "Add other", isAddOption: true }
      ] as LegacyTheme[]
    } as ThemeSubcategory_Legacy
  ]
};

// SPORTS CATEGORY
export const sportsCategory: ThemeCategory_Legacy = {
  category: "SPORTS",
  themes: [
    { id: "golf", name: "Golf" },
    { id: "tennis", name: "Tennis" },
    { id: "swimming", name: "Swimming" },
    { id: "diving", name: "Diving" },
    { id: "yoga", name: "Yoga" },
    { id: "fitness", name: "Fitness" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// DANCE CATEGORY
export const danceCategory: ThemeCategory_Legacy = {
  category: "DANCE",
  themes: [
    { id: "ballroom", name: "Ballroom" },
    { id: "latin", name: "Latin" },
    { id: "contemporary", name: "Contemporary" },
    { id: "traditional", name: "Traditional" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// TECHNOLOGY CATEGORY
export const technologyCategory: ThemeCategory_Legacy = {
  category: "TECHNOLOGY",
  themes: [
    { id: "digital", name: "Digital" },
    { id: "innovation", name: "Innovation" },
    { id: "smart-home", name: "Smart Home" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// SCIENCES CATEGORY
export const sciencesCategory: ThemeCategory_Legacy = {
  category: "SCIENCES",
  themes: [
    { id: "astronomy", name: "Astronomy" },
    { id: "biology", name: "Biology" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

// COOKING EXPERIENCES
export const cookingExperiences: LegacyTheme[] = [
  { id: "italian-cooking", name: "Italian Cuisine", category: "FOODS & DRINKS" },
  { id: "french-pastry", name: "French Pastry", category: "FOODS & DRINKS" },
  { id: "sushi-prep", name: "Sushi Preparation", category: "FOODS & DRINKS" },
  { id: "tapas-workshop", name: "Tapas Workshop", category: "FOODS & DRINKS" },
  { id: "bbq-techniques", name: "BBQ Techniques", category: "FOODS & DRINKS" },
  { id: "mediterranean-cooking", name: "Mediterranean Cooking", category: "FOODS & DRINKS" },
  { id: "asian-fusion", name: "Asian Fusion", category: "FOODS & DRINKS" },
  { id: "pastry-baking", name: "Pastry & Baking", category: "FOODS & DRINKS" },
  { id: "vegetarian-cooking", name: "Vegetarian Cooking", category: "FOODS & DRINKS" },
  { id: "wine-pairing", name: "Wine Pairing", category: "FOODS & DRINKS" }
];

// FOOD PREFERENCES
export const foodPreferences: LegacyTheme[] = [
  { id: "seafood", name: "Seafood", category: "FOODS & DRINKS" },
  { id: "pastries-desserts", name: "Pastries & Desserts", category: "FOODS & DRINKS" },
  { id: "grilled-meats", name: "Grilled Meats", category: "FOODS & DRINKS" },
  { id: "vegan", name: "Vegan", category: "FOODS & DRINKS" },
  { id: "mediterranean", name: "Mediterranean", category: "FOODS & DRINKS" },
  { id: "street-food", name: "Street Food", category: "FOODS & DRINKS" },
  { id: "breakfast", name: "Breakfast Specialties", category: "FOODS & DRINKS" },
  { id: "organic", name: "Organic & Local", category: "FOODS & DRINKS" },
  { id: "gluten-free", name: "Gluten Free", category: "FOODS & DRINKS" },
  { id: "fusion", name: "Fusion Cuisine", category: "FOODS & DRINKS" }
];

// THEME CONSTANTS
export const themeConstants = [
  {
    name: "Nature & Outdoors",
    themes: [
      { name: "Mountain Retreat", description: "Accommodations near mountains with hiking opportunities" },
      { name: "Beach Living", description: "Properties with access to beaches and ocean views" },
      { name: "Forest Immersion", description: "Hotels surrounded by forests and natural landscapes" },
      { name: "Desert Experience", description: "Unique stays in desert environments" },
      { name: "Lake & Waterfront", description: "Properties situated near lakes or other bodies of water" }
    ]
  },
  {
    name: "Cultural Experiences",
    themes: [
      { name: "Historical Immersion", description: "Stays in buildings with historical significance" },
      { name: "Local Traditions", description: "Experiences focused on local customs and traditions" },
      { name: "Language Learning", description: "Hotels with language learning programs or environments" },
      { name: "Culinary Exploration", description: "Stays centered around local cuisine and cooking" },
      { name: "Artistic Communities", description: "Properties in areas known for artistic pursuits" }
    ]
  },
  {
    name: "Wellness & Lifestyle",
    themes: [
      { name: "Meditation & Mindfulness", description: "Properties focusing on mental wellness and meditation" },
      { name: "Yoga Retreats", description: "Hotels with dedicated yoga facilities and programs" },
      { name: "Spa & Relaxation", description: "Luxury spa experiences and relaxation-focused stays" },
      { name: "Fitness & Active Living", description: "Accommodations with premium fitness facilities" },
      { name: "Holistic Health", description: "Properties offering comprehensive wellness programs" }
    ]
  },
  {
    name: "Professional & Education",
    themes: [
      { name: "Digital Nomad Hubs", description: "Properties designed for remote workers" },
      { name: "Coworking Communities", description: "Hotels with coworking spaces and business amenities" },
      { name: "Educational Retreats", description: "Stays with educational programs and workshops" },
      { name: "Entrepreneurial Spaces", description: "Environments fostering business development" },
      { name: "Academic Settings", description: "Properties near or associated with academic institutions" }
    ]
  },
  {
    name: "Special Interests",
    themes: [
      { name: "Wine Country", description: "Stays in regions known for vineyards and wine production" },
      { name: "Music Scenes", description: "Properties in areas with vibrant music cultures" },
      { name: "Literary Inspiration", description: "Hotels connected to literary history or writing retreats" },
      { name: "Photography Destinations", description: "Locations ideal for photography enthusiasts" },
      { name: "Astronomy & Stargazing", description: "Properties with dark skies for stargazing" }
    ]
  }
];

// ALL THEME CATEGORIES COMBINED
export const ALL_THEME_CATEGORIES = [
  artCategory,
  cultureCategory,
  languagesCategory,
  musicCategory,
  gamesCategory,
  literatureCategory,
  foodAndDrinksCategory,
  sportsCategory,
  danceCategory,
  technologyCategory,
  sciencesCategory
];