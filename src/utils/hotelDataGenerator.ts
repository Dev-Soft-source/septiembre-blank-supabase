import { createExcelFile } from './lazyExcel';
import { supabase } from '@/integrations/supabase/client';

interface HotelData {
  NAME: string;
  CITY: string;
  CATEGORY: string;
  'ADDRESS (Street and number)': string;
  'Postal code': string;
  'Hotel Description': string;
  'Latitude/Longitude': string;
}

const categories = [
  'Boutique Hotel',
  'Business Hotel',
  'City Hotel',
  'Historic Hotel',
  'Design Hotel',
  'Comfort Hotel',
  'Urban Hotel',
  'Contemporary Hotel'
];

const cityData = {
  Budapest: {
    country: 'Hungary',
    hotels: [
      { name: 'Aria Hotel Budapest', address: 'Hercegprímás utca 5', postal: '1051', lat: 47.4979, lng: 19.0402 },
      { name: 'Casati Budapest Hotel', address: 'Paulay Ede utca 31', postal: '1061', lat: 47.5014, lng: 19.0620 },
      { name: 'Hotel Moments Budapest', address: 'Andrássy út 8', postal: '1061', lat: 47.5040, lng: 19.0580 },
      { name: 'Parlament Hotel', address: 'Kálmán Imre utca 19', postal: '1054', lat: 47.5080, lng: 19.0460 },
      { name: 'Hotel Pest-Buda', address: 'Fortuna utca 3', postal: '1014', lat: 47.5020, lng: 19.0340 },
      { name: 'Hotel Clark Budapest', address: 'Dob utca 26', postal: '1072', lat: 47.4990, lng: 19.0650 },
      { name: 'Hotel Palazzo Zichy', address: 'Lőrinc pap tér 2', postal: '1053', lat: 47.4950, lng: 19.0580 }
    ]
  },
  Paris: {
    country: 'France',
    hotels: [
      { name: 'Hotel des Grands Boulevards', address: '17 Boulevard Poissonnière', postal: '75002', lat: 48.8708, lng: 2.3430 },
      { name: 'Hotel Malte Opera', address: '63 Rue de Richelieu', postal: '75002', lat: 48.8687, lng: 2.3380 },
      { name: 'Hotel Therese', address: '5-7 Rue Thérèse', postal: '75001', lat: 48.8650, lng: 2.3350 },
      { name: 'Hotel Saint-Marc', address: '36 Rue Saint-Marc', postal: '75002', lat: 48.8695, lng: 2.3405 },
      { name: 'Hotel Chopin', address: '10 Boulevard Montmartre', postal: '75009', lat: 48.8715, lng: 2.3420 },
      { name: 'Hotel Jeanne d Arc', address: '3 Rue de Jarente', postal: '75004', lat: 48.8550, lng: 2.3610 },
      { name: 'Hotel des Deux Iles', address: '59 Rue Saint-Louis en l Île', postal: '75004', lat: 48.8520, lng: 2.3580 }
    ]
  },
  Hurghada: {
    country: 'Egypt',
    hotels: [
      { name: 'Steigenberger Aqua Magic', address: 'Safaga Road', postal: '84511', lat: 27.2579, lng: 33.8116 },
      { name: 'Coral Beach Hurghada Resort', address: 'Corniche Road', postal: '84511', lat: 27.2400, lng: 33.8200 },
      { name: 'Desert Rose Resort', address: 'Safaga Road Km 10', postal: '84511', lat: 27.2300, lng: 33.8300 },
      { name: 'Hurghada Marriott Beach Resort', address: 'Corniche Road', postal: '84511', lat: 27.2450, lng: 33.8150 },
      { name: 'Albatros Aqua Park Resort', address: 'Safaga Road Km 12', postal: '84511', lat: 27.2200, lng: 33.8400 },
      { name: 'Golden Beach Resort', address: 'El Corniche Road', postal: '84511', lat: 27.2380, lng: 33.8180 },
      { name: 'Sunset Beach Resort', address: 'Safaga Road Km 8', postal: '84511', lat: 27.2320, lng: 33.8250 }
    ]
  },
  Berlin: {
    country: 'Germany',
    hotels: [
      { name: 'Hackescher Hof', address: 'Große Präsidentenstraße 8', postal: '10178', lat: 52.5200, lng: 13.4050 },
      { name: 'Hotel Augustinenhof', address: 'Auguststraße 82', postal: '10117', lat: 52.5250, lng: 13.3950 },
      { name: 'Hotel Bleibtreu Berlin', address: 'Bleibtreustraße 31', postal: '10707', lat: 52.5030, lng: 13.3280 },
      { name: 'Hotel Hackischer Markt', address: 'Große Präsidentenstraße 6', postal: '10178', lat: 52.5210, lng: 13.4040 },
      { name: 'Hotel Pension Funk', address: 'Fasanenstraße 69', postal: '10719', lat: 52.4950, lng: 13.3200 },
      { name: 'Hotel Propeller Island City Lodge', address: 'Albrecht-Achilles-Straße 58', postal: '10709', lat: 52.4980, lng: 13.3150 },
      { name: 'Hotel Residenz Begaswinkel', address: 'Paretzer Straße 2', postal: '10713', lat: 52.4920, lng: 13.3080 }
    ]
  },
  'New York': {
    country: 'United States',
    hotels: [
      { name: 'Pod Brooklyn', address: '247 Metropolitan Avenue', postal: '11211', lat: 40.7150, lng: -73.9620 },
      { name: 'The High Line Hotel', address: '180 10th Avenue', postal: '10011', lat: 40.7420, lng: -74.0050 },
      { name: 'Hotel Americano', address: '518 W 27th Street', postal: '10001', lat: 40.7500, lng: -74.0020 },
      { name: 'The Jane Hotel', address: '113 Jane Street', postal: '10014', lat: 40.7380, lng: -74.0080 },
      { name: 'Hotel Gansevoort Meatpacking', address: '18 9th Avenue', postal: '10014', lat: 40.7400, lng: -74.0060 },
      { name: 'Pod Times Square', address: '400 W 42nd Street', postal: '10036', lat: 40.7580, lng: -73.9910 },
      { name: 'Hotel Hugo', address: '525 Greenwich Street', postal: '10013', lat: 40.7220, lng: -74.0090 }
    ]
  },
  Bucharest: {
    country: 'Romania',
    hotels: [
      { name: 'Hotel Cismigiu', address: 'Bulevardul Regina Elisabeta 38', postal: '030167', lat: 44.4378, lng: 26.0950 },
      { name: 'Hotel Capsa', address: 'Calea Victoriei 36', postal: '010061', lat: 44.4420, lng: 26.0970 },
      { name: 'Villa Frieda', address: 'Strada Polonă 15', postal: '010494', lat: 44.4450, lng: 26.0920 },
      { name: 'Hotel Berthelot', address: 'Strada Berthelot 60', postal: '010168', lat: 44.4200, lng: 26.1100 },
      { name: 'Hotel Amzei', address: 'Strada George Enescu 8-10', postal: '010301', lat: 44.4480, lng: 26.0980 },
      { name: 'Hotel Mozart', address: 'Strada Academiei 13', postal: '010011', lat: 44.4350, lng: 26.0960 },
      { name: 'Hotel Opera', address: 'Strada Ion Brezoianu 37', postal: '010131', lat: 44.4320, lng: 26.1020 }
    ]
  },
  London: {
    country: 'United Kingdom',
    hotels: [
      { name: 'The Zetter Townhouse Piccadilly', address: '3 Dover Street', postal: 'W1S 4LD', lat: 51.5080, lng: -0.1420 },
      { name: 'Artist Residence London', address: '52 Cambridge Street', postal: 'SW1V 4QQ', lat: 51.4920, lng: -0.1450 },
      { name: 'The Hoxton Southwark', address: '32 Southwark Street', postal: 'SE1 1TU', lat: 51.5040, lng: -0.0950 },
      { name: 'Hotel Amano London', address: '10 Argyle Street', postal: 'WC1H 8EG', lat: 51.5250, lng: -0.1300 },
      { name: 'The Resident Covent Garden', address: '51 Earlham Street', postal: 'WC2H 9LJ', lat: 51.5150, lng: -0.1280 },
      { name: 'Z Hotel Piccadilly', address: '2 Orange Street', postal: 'WC2H 7DF', lat: 51.5100, lng: -0.1320 },
      { name: 'Point A Hotel London Paddington', address: '23-24 Praed Street', postal: 'W2 1NP', lat: 51.5150, lng: -0.1750 }
    ]
  },
  Istanbul: {
    country: 'Turkey',
    hotels: [
      { name: 'Hotel Amira Istanbul', address: 'Küçük Ayasofya Caddesi 74', postal: '34122', lat: 41.0058, lng: 28.9731 },
      { name: 'Hotel Basileus', address: 'Barbaros Hayrettin Paşa Sk. 11', postal: '34122', lat: 41.0070, lng: 28.9720 },
      { name: 'Hotel Sultania', address: 'Ebusuud Caddesi 20', postal: '34110', lat: 41.0120, lng: 28.9680 },
      { name: 'Hotel Poem', address: 'Terzihane Sokak 12', postal: '34122', lat: 41.0080, lng: 28.9750 },
      { name: 'Hotel Nena', address: 'Binbirdirek Mahallesi Dizdariye Çeşmesi Sk. 8', postal: '34122', lat: 41.0060, lng: 28.9740 },
      { name: 'Hotel Arcadia Blue', address: 'Dr. Imran Ökem Caddesi 1', postal: '34122', lat: 41.0040, lng: 28.9760 },
      { name: 'Hotel Empress Zoe', address: 'Akbıyık Caddesi 10', postal: '34122', lat: 41.0050, lng: 28.9770 }
    ]
  }
};

const generateRandomDescription = (): string => {
  const descriptions = [
    'A charming boutique hotel offering modern comfort in a historic setting. Features elegantly appointed rooms with premium amenities and personalized service.',
    'Contemporary urban retreat with stylish accommodations and exceptional hospitality. Perfect for both business and leisure travelers seeking quality and convenience.',
    'Intimate hotel combining traditional charm with modern luxury. Offers comfortable rooms, excellent dining options, and prime location near major attractions.',
    'Sophisticated hotel featuring well-designed rooms and suites with modern amenities. Provides exceptional service and convenient access to city highlights.',
    'Comfortable and elegant hotel with attention to detail and warm hospitality. Features spacious rooms, quality furnishings, and excellent location.',
    'Modern hotel offering contemporary comfort and style. Well-appointed rooms with premium amenities and convenient access to local attractions and business districts.',
    'Charming property with character and modern conveniences. Provides comfortable accommodations, attentive service, and prime location for exploring the city.',
    'Stylish hotel combining comfort and sophistication. Features modern rooms with quality amenities and convenient location near shopping, dining, and cultural sites.'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const generateRandomCategory = (): string => {
  return categories[Math.floor(Math.random() * categories.length)];
};

export const generateHotelExcel = async (): Promise<{ success: boolean; count?: number; error?: string }> => {
  try {
    const hotels: HotelData[] = [];
    
    // Generate 7 hotels for each city
    Object.entries(cityData).forEach(([cityName, cityInfo]) => {
      cityInfo.hotels.forEach(hotel => {
        hotels.push({
          NAME: hotel.name,
          CITY: cityName,
          CATEGORY: generateRandomCategory(),
          'ADDRESS (Street and number)': hotel.address,
          'Postal code': hotel.postal,
          'Hotel Description': generateRandomDescription(),
          'Latitude/Longitude': hotel.lat && hotel.lng ? `${hotel.lat}, ${hotel.lng}` : 'Not available'
        });
      });
    });

    // Create Excel file with the specified filename
    await createExcelFile(hotels, 'hotel_living_56_hotels.xlsx');
    
    return { success: true, count: hotels.length };
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// New function to import hotels to database
export const importHotelsToDatabase = async () => {
  try {
    // Use the same hotel data that's used for Excel generation
    const hotelsToImport = [
      // Budapest Hotels
      { name: "Aria Hotel Budapest", city: "Budapest", category: "Boutique", address: "Hercegprímás utca 5", postalCode: "1051", description: "A luxury music-themed boutique hotel in the heart of Budapest's Castle District, featuring soundproofed rooms and a rooftop bar with panoramic city views.", coordinates: "47.4979,19.0402" },
      { name: "Hotel Moments Budapest", city: "Budapest", category: "Historic", address: "Andrássy út 8", postalCode: "1061", description: "An elegant historic hotel on the famous Andrássy Avenue, combining classic architecture with modern amenities and sophisticated dining experiences.", coordinates: "47.5058,19.0632" },
      { name: "Maison Bistro & Hotel", city: "Budapest", category: "Boutique", address: "Dohány utca 5", postalCode: "1074", description: "A charming boutique hotel in the Jewish Quarter, featuring individually designed rooms and an acclaimed French bistro restaurant.", coordinates: "47.4956,19.0634" },
      { name: "Hotel Palazzo Zichy", city: "Budapest", category: "Historic", address: "Lőrinc pap tér 2", postalCode: "1088", description: "A beautifully restored 19th-century palace turned hotel, offering luxury accommodations with original architectural details and modern comforts.", coordinates: "47.4888,19.0689" },
      { name: "Barceló Budapest", city: "Budapest", category: "Contemporary", address: "Kálmán Imre utca 19", postalCode: "1054", description: "A contemporary hotel near the Danube River, featuring stylish rooms, a wellness center, and easy access to Budapest's main attractions.", coordinates: "47.5058,19.0402" },
      { name: "Hotel Clark Budapest", city: "Budapest", category: "Boutique", address: "Clark Ádám tér 1", postalCode: "1013", description: "A sophisticated boutique hotel at the foot of Castle Hill, offering spectacular views of the Danube and Chain Bridge.", coordinates: "47.4966,19.0388" },
      { name: "D8 Hotel", city: "Budapest", category: "Design", address: "Dohány utca 8", postalCode: "1074", description: "A modern design hotel in the vibrant Jewish Quarter, featuring contemporary rooms and proximity to Budapest's famous ruin bars.", coordinates: "47.4956,19.0639" },

      // Paris Hotels
      { name: "Hotel des Grands Boulevards", city: "Paris", category: "Boutique", address: "17 Boulevard Poissonnière", postalCode: "75002", description: "A stylish boutique hotel in the trendy 2nd arrondissement, featuring elegant rooms and a celebrated restaurant by renowned chefs.", coordinates: "48.8716,2.3426" },
      { name: "Hotel Malte Opera", city: "Paris", category: "Classic", address: "63 Rue de Richelieu", postalCode: "75002", description: "A charming classic hotel steps from the Opera, offering comfortable accommodations with traditional Parisian charm and modern amenities.", coordinates: "48.8691,2.3372" },
      { name: "Hotel Gramont Opera", city: "Paris", category: "Traditional", address: "22 Rue Gramont", postalCode: "75002", description: "A traditional Parisian hotel in the Opera district, combining old-world elegance with contemporary comfort in the heart of the city.", coordinates: "48.8702,2.3395" },
      { name: "Villa Panthéon", city: "Paris", category: "Classic", address: "41 Rue des Écoles", postalCode: "75005", description: "A refined classic hotel in the Latin Quarter, offering intimate accommodations near the Panthéon and Sorbonne University.", coordinates: "48.8484,2.3458" },
      { name: "Hotel Saint-André des Arts", city: "Paris", category: "Historic", address: "66 Rue Saint-André des Arts", postalCode: "75006", description: "A historic hotel in Saint-Germain-des-Prés, featuring unique rooms with exposed beams and antique furnishings in a 16th-century building.", coordinates: "48.8538,2.3403" },
      { name: "Hotel des Académies et des Arts", city: "Paris", category: "Artistic", address: "15 Rue de la Grande Chaumière", postalCode: "75006", description: "An artistic hotel in Montparnasse, celebrating the area's cultural heritage with art-inspired rooms and proximity to famous cafés.", coordinates: "48.8422,2.3265" },
      { name: "Hotel Verneuil", city: "Paris", category: "Boutique", address: "8 Rue de Verneuil", postalCode: "75007", description: "An intimate boutique hotel in Saint-Germain, featuring individually decorated rooms and a cozy atmosphere in a historic neighborhood.", coordinates: "48.8578,2.3298" },

      // Hurghada Hotels
      { name: "Steigenberger Aqua Magic", city: "Hurghada", category: "Resort", address: "Red Sea Riviera", postalCode: "84511", description: "A family-friendly resort hotel featuring multiple pools, water slides, and direct beach access on the beautiful Red Sea coast.", coordinates: "27.2579,33.8116" },
      { name: "Sunrise Arabian Beach Resort", city: "Hurghada", category: "Beach Resort", address: "Safaga Road", postalCode: "84511", description: "An all-inclusive beach resort offering comfortable accommodations, multiple dining options, and various water sports activities.", coordinates: "27.1767,33.7638" },
      { name: "Coral Beach Resort Hurghada", city: "Hurghada", category: "Coral Resort", address: "El Corniche Road", postalCode: "84511", description: "A seaside resort hotel with direct coral reef access, perfect for snorkeling and diving enthusiasts seeking underwater adventures.", coordinates: "27.2942,33.8468" },
      { name: "Desert Rose Resort", city: "Hurghada", category: "Desert Resort", address: "Safaga Road Km 17", postalCode: "84511", description: "A unique desert-themed resort combining traditional Egyptian architecture with modern amenities and stunning Red Sea views.", coordinates: "27.1598,33.7512" },
      { name: "Albatros Aqua Park Resort", city: "Hurghada", category: "Aqua Resort", address: "Safaga Road", postalCode: "84511", description: "An exciting resort featuring one of the largest aqua parks in the region, with thrilling water slides and family entertainment.", coordinates: "27.1701,33.7579" },
      { name: "Sunny Days El Palacio", city: "Hurghada", category: "Palace Resort", address: "El Corniche Road", postalCode: "84511", description: "An elegant palace-style resort offering luxurious accommodations, fine dining, and premium spa services by the Red Sea.", coordinates: "27.2856,33.8402" },
      { name: "Sea Gull Beach Resort", city: "Hurghada", category: "Beach Resort", address: "El Corniche Road", postalCode: "84511", description: "A comfortable beachfront resort with traditional Egyptian hospitality, featuring spacious rooms and direct access to pristine beaches.", coordinates: "27.2889,33.8435" },

      // Berlin Hotels
      { name: "The Weinmeister Berlin-Mitte", city: "Berlin", category: "Design", address: "Weinmeisterstraße 2", postalCode: "10178", description: "A contemporary design hotel in trendy Mitte district, featuring modern rooms with artistic touches and proximity to Berlin's cultural attractions.", coordinates: "52.5244,13.4002" },
      { name: "Hotel ZOE by AMANO", city: "Berlin", category: "Boutique", address: "Ziegelstraße 28", postalCode: "10117", description: "A stylish boutique hotel combining industrial chic with comfort, located in the heart of Berlin near major shopping and dining areas.", coordinates: "52.5244,13.3888" },
      { name: "Honigmond Garden Hotel", city: "Berlin", category: "Garden Hotel", address: "Invalidenstraße 122", postalCode: "10115", description: "A charming garden hotel offering peaceful accommodations with lovely outdoor spaces, perfect for a tranquil stay in bustling Berlin.", coordinates: "52.5311,13.3756" },
      { name: "Hotel Hackescher Hof", city: "Berlin", category: "Historic", address: "Große Präsidentenstraße 8", postalCode: "10178", description: "A historic hotel near Hackescher Markt, featuring classic German hospitality and easy access to Berlin's vibrant nightlife and culture.", coordinates: "52.5225,13.4044" },
      { name: "Almodovar Hotel Berlin", city: "Berlin", category: "Eco Hotel", address: "Boxhagener Straße 83", postalCode: "10245", description: "Berlin's first eco-certified hotel, combining sustainability with style in the trendy Friedrichshain district with organic dining options.", coordinates: "52.5086,13.4534" },
      { name: "Hotel Otto", city: "Berlin", category: "Design", address: "Gneisenaustraße 85", postalCode: "10961", description: "A modern design hotel in creative Kreuzberg, featuring minimalist rooms and easy access to the area's famous street art and culture.", coordinates: "52.4906,13.3947" },
      { name: "Lux 11 Berlin-Mitte", city: "Berlin", category: "Apartment Hotel", address: "Rosa-Luxemburg-Straße 9-13", postalCode: "10178", description: "A sophisticated apartment hotel offering spacious suites with kitchenettes, perfect for extended stays in central Berlin.", coordinates: "52.5261,13.4089" },

      // New York Hotels
      { name: "Pod Brooklyn", city: "New York", category: "Pod Hotel", address: "247 Metropolitan Avenue", postalCode: "11211", description: "A modern pod hotel in trendy Williamsburg, featuring efficient design, rooftop bar, and stunning Manhattan skyline views.", coordinates: "40.7145,-73.9425" },
      { name: "The William Vale", city: "New York", category: "Contemporary", address: "111 N 12th Street", postalCode: "11249", description: "A sleek contemporary hotel in Brooklyn with floor-to-ceiling windows, multiple dining venues, and panoramic city views.", coordinates: "40.7207,-73.9574" },
      { name: "1 Hotels Brooklyn Bridge", city: "New York", category: "Eco Luxury", address: "60 Furman Street", postalCode: "11201", description: "An eco-luxury hotel in Brooklyn Bridge Park, featuring sustainable design, organic amenities, and breathtaking harbor views.", coordinates: "40.7022,-73.9969" },
      { name: "Hotel Le Bleu", city: "New York", category: "Boutique", address: "370 4th Avenue", postalCode: "11215", description: "A boutique hotel in Park Slope, combining European elegance with Brooklyn's relaxed atmosphere and easy Manhattan access.", coordinates: "40.6693,-73.9807" },
      { name: "Brooklyn Bridge Hotel", city: "New York", category: "Historic", address: "8 Remsen Street", postalCode: "11201", description: "A charming historic hotel in Brooklyn Heights, offering intimate accommodations with classic New York character and harbor views.", coordinates: "40.6957,-73.9946" },
      { name: "Nu Hotel Brooklyn", city: "New York", category: "Design", address: "85 Smith Street", postalCode: "11201", description: "A contemporary design hotel in downtown Brooklyn, featuring modern rooms, fitness facilities, and proximity to trendy neighborhoods.", coordinates: "40.6884,-73.9901" },
      { name: "Even Hotel Brooklyn", city: "New York", category: "Wellness", address: "46 Nevins Street", postalCode: "11217", description: "A wellness-focused hotel emphasizing healthy living, with fitness amenities, nutritious dining options, and ergonomic room design.", coordinates: "40.6882,-73.9851" },

      // Bucharest Hotels
      { name: "Villa 11", city: "Bucharest", category: "Villa Hotel", address: "Strada Ion Campineanu 11", postalCode: "010031", description: "An elegant villa hotel in central Bucharest, offering personalized service and sophisticated accommodations in a historic building.", coordinates: "44.4378,26.0969" },
      { name: "Hotel Tecadra", city: "Bucharest", category: "Business", address: "Calea Victoriei 120", postalCode: "010094", description: "A refined business hotel on famous Calea Victoriei, featuring classic architecture, modern amenities, and proximity to cultural landmarks.", coordinates: "44.4459,26.0959" },
      { name: "Rembrandt Hotel", city: "Bucharest", category: "Classic", address: "Strada Smârdan 11", postalCode: "030082", description: "A classic hotel in Bucharest's Old Town, combining traditional Romanian hospitality with modern comfort and historical charm.", coordinates: "44.4304,26.1026" },
      { name: "Hotel Cismigiu", city: "Bucharest", category: "Park Hotel", address: "Bulevardul Regina Elisabeta 38", postalCode: "050017", description: "A comfortable hotel overlooking beautiful Cismigiu Park, offering peaceful accommodations in the heart of Romania's capital city.", coordinates: "44.4336,26.0946" },
      { name: "Casa Capsa", city: "Bucharest", category: "Historic", address: "Calea Victoriei 36", postalCode: "010063", description: "A legendary historic hotel dating back to 1852, featuring restored elegance, fine dining, and a rich cultural heritage.", coordinates: "44.4387,26.0974" },
      { name: "Hotel Amzei", city: "Bucharest", category: "Contemporary", address: "Strada George Enescu 5-7", postalCode: "010301", description: "A contemporary hotel in the Amzei area, offering modern accommodations with easy access to business districts and shopping centers.", coordinates: "44.4456,26.0890" },
      { name: "The Marmorosch Bucharest", city: "Bucharest", category: "Luxury Heritage", address: "Calea Victoriei 2-4", postalCode: "030026", description: "A luxury heritage hotel in a beautifully restored historic building, combining old-world grandeur with contemporary sophistication.", coordinates: "44.4359,26.0982" },

      // London Hotels
      { name: "The Z Hotel Piccadilly", city: "London", category: "Compact Hotel", address: "2 Orange Street", postalCode: "WC2H 7DF", description: "A smart compact hotel in the heart of the West End, featuring efficiently designed rooms and proximity to theaters and attractions.", coordinates: "51.5099,-0.1299" },
      { name: "Premier Inn London County Hall", city: "London", category: "Value Hotel", address: "Belvedere Road", postalCode: "SE1 7PB", description: "A reliable value hotel on the South Bank, offering comfortable accommodations with views of the Thames and Westminster.", coordinates: "51.5019,-0.1173" },
      { name: "Hub by Premier Inn London King's Cross", city: "London", category: "Pod Hotel", address: "1 King's Cross St Pancras", postalCode: "N1C 4TB", description: "A modern pod hotel at King's Cross, featuring compact smart rooms and excellent transport connections across London and Europe.", coordinates: "51.5308,-0.1238" },
      { name: "YHA London Central", city: "London", category: "Hostel Plus", address: "104 Bolsover Street", postalCode: "W1W 5NU", description: "An upgraded hostel experience in Fitzrovia, offering private rooms alongside traditional dorm accommodations with modern facilities.", coordinates: "51.5206,-0.1411" },
      { name: "Generator London", city: "London", category: "Design Hostel", address: "37 Tavistock Place", postalCode: "WC1H 9SE", description: "A stylish design hostel in Bloomsbury, combining vibrant social spaces with comfortable private rooms and dormitories.", coordinates: "51.5254,-0.1264" },
      { name: "Point A Hotel London King's Cross", city: "London", category: "Efficient Hotel", address: "13-20 King's Cross Road", postalCode: "WC1X 9QG", description: "An efficiently designed hotel near King's Cross Station, maximizing comfort in compact spaces with modern amenities.", coordinates: "51.5301,-0.1233" },
      { name: "The Wesley Euston", city: "London", category: "Contemporary", address: "81-103 Euston Street", postalCode: "NW1 2EZ", description: "A contemporary hotel in Fitzrovia, offering stylish accommodations with easy access to the West End and major transport hubs.", coordinates: "51.5251,-0.1375" },

      // Istanbul Hotels
      { name: "Hotel Amira Istanbul", city: "Istanbul", category: "Boutique", address: "Küçük Ayasofya Caddesi 67", postalCode: "34122", description: "A charming boutique hotel in Sultanahmet, featuring traditional Ottoman architecture with modern amenities and historic atmosphere.", coordinates: "41.0049,28.9753" },
      { name: "Sirkeci Mansion", city: "Istanbul", category: "Historic Mansion", address: "Taya Hatun Sokak 5", postalCode: "34110", description: "A beautifully restored historic mansion near the Grand Bazaar, offering authentic Ottoman elegance with contemporary comfort.", coordinates: "41.0115,28.9744" },
      { name: "Hotel Sultania", city: "Istanbul", category: "Traditional", address: "Ebusuud Caddesi 20", postalCode: "34110", description: "A traditional hotel in the heart of Old Istanbul, combining classical Turkish hospitality with modern facilities and central location.", coordinates: "41.0106,28.9760" },
      { name: "Levni Hotel & Spa", city: "Istanbul", category: "Spa Hotel", address: "Alemdar Mah. Ticarethane Sok. 20", postalCode: "34110", description: "A wellness-focused hotel featuring traditional Turkish spa treatments, comfortable rooms, and easy access to major historical sites.", coordinates: "41.0086,28.9794" },
      { name: "Stone Hotel Istanbul", city: "Istanbul", category: "Historic Stone", address: "Alemdar Mah. Yerebatan Cad. 89", postalCode: "34110", description: "A unique hotel built within historic stone walls, offering atmospheric accommodations with authentic Byzantine and Ottoman architectural elements.", coordinates: "41.0078,28.9781" },
      { name: "Hotel Nena", city: "Istanbul", category: "Contemporary", address: "Binbirdirek Mah. Nakilbent Sk. 8", postalCode: "34122", description: "A contemporary hotel in Sultanahmet district, featuring modern design with traditional Turkish touches and panoramic city views.", coordinates: "41.0065,28.9742" },
      { name: "Dersaadet Hotel Istanbul", city: "Istanbul", category: "Ottoman Style", address: "Kapıağası Sk. 5", postalCode: "34122", description: "An Ottoman-style hotel near the Blue Mosque, offering authentic Turkish architecture, traditional decor, and warm hospitality.", coordinates: "41.0056,28.9765" }
    ];

    // Convert to database format
    const hotelInserts = hotelsToImport.map(hotel => {
      // Parse coordinates
      let latitude = null;
      let longitude = null;
      if (hotel.coordinates) {
        const [lat, lng] = hotel.coordinates.split(',');
        latitude = parseFloat(lat);
        longitude = parseFloat(lng);
      }

      // Convert category to numeric (1-3 scale)
      let categoryNumber = 2; // Default to 2 (mid-range secondary)
      if (hotel.category.toLowerCase().includes('luxury') || hotel.category.toLowerCase().includes('palace')) {
        categoryNumber = 3;
      } else if (hotel.category.toLowerCase().includes('hostel') || hotel.category.toLowerCase().includes('pod')) {
        categoryNumber = 1;
      }

      // Map city to country
      const cityToCountry: Record<string, string> = {
        'Budapest': 'Hungary',
        'Paris': 'France',
        'Hurghada': 'Egypt',
        'Berlin': 'Germany',
        'New York': 'United States',
        'Bucharest': 'Romania',
        'London': 'United Kingdom',
        'Istanbul': 'Turkey'
      };

      return {
        name: hotel.name,
        city: hotel.city,
        country: cityToCountry[hotel.city] || 'Unknown',
        address: hotel.address,
        postal_code: hotel.postalCode,
        description: hotel.description,
        latitude: latitude,
        longitude: longitude,
        category: categoryNumber,
        price_per_month: 1500, // Default price - can be updated later
        status: 'pending', // So they appear in admin workflow
        // All other fields will use their default values from the schema
        // This allows completion through the existing 5-step workflow
      };
    });

    // Insert all hotels into the database
    const { data, error } = await supabase
      .from('hotels')
      .insert(hotelInserts)
      .select();

    if (error) {
      console.error('Database import error:', error);
      return {
        success: false,
        count: 0,
        error: error.message
      };
    }

    return {
      success: true,
      count: data?.length || 0,
      error: null
    };

  } catch (error) {
    console.error('Import hotels error:', error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Combined function for Excel + Database import
export const generateExcelAndImportToDatabase = async () => {
  try {
    // First generate Excel file
    const excelResult = await generateHotelExcel();
    
    if (!excelResult.success) {
      return {
        success: false,
        count: 0,
        excelGenerated: false,
        hotelsImported: 0,
        error: excelResult.error
      };
    }

    // Then import to database
    const importResult = await importHotelsToDatabase();
    
    return {
      success: importResult.success,
      count: excelResult.count,
      excelGenerated: true,
      hotelsImported: importResult.count,
      error: importResult.error
    };

  } catch (error) {
    console.error('Combined generation error:', error);
    return {
      success: false,
      count: 0,
      excelGenerated: false,
      hotelsImported: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
