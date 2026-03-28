
/**
 * Maps Spanish database values to translation keys for proper i18n handling
 */

// Property Styles mapping - Spanish database value to translation key
export const propertyStyleMapping: Record<string, string> = {
  'Clásico': 'classic',
  'Clásico Elegante': 'classicElegant', 
  'Moderno': 'modern',
  'Fusión': 'fusion',
  'Urbano': 'urban',
  'Minimalista': 'minimalist',
  'Lujo': 'luxury',
  'Rural': 'rural'
};

// Hotel Features mapping - Spanish database value to translation key
export const hotelFeatureMapping: Record<string, string> = {
  'Acceso a la Playa': 'accesoALaPlaya',
  'Acepta Mascotas': 'aceptaMascotas',
  'Ascensor': 'ascensor',
  'Bar': 'bar',
  'Biblioteca': 'biblioteca',
  'Caja Fuerte del Hotel': 'cajaFuerteDelHotel',
  'Centro de Negocios': 'centroDeNegocios',
  'Estacionamiento': 'estacionamiento',
  'Gimnasio': 'gimnasio',
  'Piscina': 'piscina',
  'Restaurante': 'restaurante',
  'Sala de Juegos': 'salaDeJuegos',
  'Salas de Conferencias': 'salasDeConferencias',
  'Servicio de Habitaciones': 'servicioDeHabitaciones',
  'Servicio de Seguridad': 'servicioDeSeguridad',
  'Spa': 'spa',
  'Terraza': 'terraza',
  'Traslado al Aeropuerto': 'trasladoAlAeropuerto',
  'WiFi en Zonas Comunes': 'wifiEnZonasComunes',
  'WiFi Gratis': 'wifiGratis',
  'Zona de Barbacoa': 'zonaDeBarbacoa'
};

// Room Features mapping - Spanish database value to translation key
export const roomFeatureMapping: Record<string, string> = {
  'Aire Acondicionado': 'aireAcondicionado',
  'Caja Fuerte': 'cajaFuerte',
  'Chimenea': 'chimenea',
  'Cortinas Opacas': 'cortinasOpacas',
  'Ducha': 'ducha',
  'Ducha a Ras de Suelo': 'duchaARasDeSuelo',
  'Escritorio': 'escritorio',
  'Hervidor de Agua': 'hervidorDeAgua',
  'Insonorizado': 'insonorizado',
  'Internet de Alta Velocidad': 'internetDeAltaVelocidad',
  'Microondas': 'microondas',
  'Mini Bar': 'miniBar',
  'Plancha': 'plancha',
  'Secador de Pelo': 'secadorDePelo',
  'Televisor': 'televisor',
  'Vista a la Ciudad': 'vistaALaCiudad',
  'Vista al Mar': 'vistaAlMar',
  'WiFi': 'wifi'
};

// Meal Plans mapping - Spanish database value to translation key
export const mealPlanMapping: Record<string, string> = {
  'Solo alojamiento': 'accommodationOnly',
  'Desayuno incluido': 'breakfastIncluded',
  'Media pensión': 'halfBoard',
  'Pensión completa': 'fullBoard',
  'Todo incluido': 'allInclusive',
  'Lavandería incluida': 'laundryIncluded',
  'Lavandería exterior': 'externalLaundry'
};

/**
 * Get the translation key for a given database value and category
 */
export function getTranslationKey(dbValue: string, category: string): string | null {
  switch (category) {
    case 'property_styles':
      return propertyStyleMapping[dbValue] || null;
    case 'hotel_features':
      return hotelFeatureMapping[dbValue] || null;
    case 'room_features':
      return roomFeatureMapping[dbValue] || null;
    case 'meal_plans':
      return mealPlanMapping[dbValue] || null;
    default:
      return null;
  }
}

/**
 * Get the translation path for filter options based on category
 */
export function getTranslationPath(category: string): string {
  switch (category) {
    case 'property_styles':
      return 'filters.propertyStyles';
    case 'hotel_features':
      return 'filters.hotelFeatureOptions';
    case 'room_features':
      return 'filters.roomFeatureOptions';
    case 'meal_plans':
      return 'filters.mealPlans';
    default:
      return '';
  }
}
