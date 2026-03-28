/**
 * Common i18n constants and utilities for linguistic decoupling
 */

// Common UI element keys that need translation across all components
export const COMMON_UI_KEYS = {
  // Navigation and control elements
  PREVIOUS_PAGE: 'ui.navigation.previousPage',
  NEXT_PAGE: 'ui.navigation.nextPage',
  CLOSE: 'ui.actions.close',
  MORE: 'ui.actions.more',
  TOGGLE_SIDEBAR: 'ui.navigation.toggleSidebar',
  TOGGLE_MENU: 'ui.navigation.toggleMenu',
  
  // Carousel controls
  PREVIOUS_SLIDE: 'ui.carousel.previousSlide',
  NEXT_SLIDE: 'ui.carousel.nextSlide',
  
  // Pagination
  MORE_PAGES: 'ui.pagination.morePages',
  GO_TO_PREVIOUS_PAGE: 'ui.pagination.goToPreviousPage',
  GO_TO_NEXT_PAGE: 'ui.pagination.goToNextPage',
  
  // Modal and dialog
  CLOSE_MODAL: 'ui.modal.close',
  
  // Search and form
  SEARCH_FAQS: 'ui.search.searchFaqs',
  CLEAR_SEARCH: 'ui.search.clearSearch',
  SEARCH_GUESTS: 'ui.search.searchGuests',
  
  // Gallery controls
  PREVIOUS_IMAGE: 'ui.gallery.previousImage',
  NEXT_IMAGE: 'ui.gallery.nextImage',
  
  // Accessibility
  BREADCRUMB: 'ui.accessibility.breadcrumb',
  PAGINATION: 'ui.accessibility.pagination',
  VIRTUALIZED_LIST: 'ui.accessibility.virtualizedList',
  
  // Loading and state
  LOADING: 'ui.state.loading',
  ERROR: 'ui.state.error',
  NO_ITEMS: 'ui.state.noItems',
  
  // Emoji accessibility
  SMILE: 'ui.emoji.smile'
} as const;

// Type-safe function to get UI translation keys
export const getUIKey = (key: keyof typeof COMMON_UI_KEYS): string => {
  return COMMON_UI_KEYS[key];
};

// Language-specific fallbacks for critical UI elements
export const CRITICAL_UI_FALLBACKS = {
  en: {
    [COMMON_UI_KEYS.PREVIOUS_PAGE]: 'Previous Page',
    [COMMON_UI_KEYS.NEXT_PAGE]: 'Next Page',
    [COMMON_UI_KEYS.CLOSE]: 'Close',
    [COMMON_UI_KEYS.MORE]: 'More',
    [COMMON_UI_KEYS.TOGGLE_SIDEBAR]: 'Toggle Sidebar',
    [COMMON_UI_KEYS.TOGGLE_MENU]: 'Toggle menu',
    [COMMON_UI_KEYS.PREVIOUS_SLIDE]: 'Previous slide',
    [COMMON_UI_KEYS.NEXT_SLIDE]: 'Next slide',
    [COMMON_UI_KEYS.MORE_PAGES]: 'More pages',
    [COMMON_UI_KEYS.GO_TO_PREVIOUS_PAGE]: 'Go to previous page',
    [COMMON_UI_KEYS.GO_TO_NEXT_PAGE]: 'Go to next page',
    [COMMON_UI_KEYS.CLOSE_MODAL]: 'Close modal',
    [COMMON_UI_KEYS.SEARCH_FAQS]: 'Search FAQs',
    [COMMON_UI_KEYS.CLEAR_SEARCH]: 'Clear search',
    [COMMON_UI_KEYS.SEARCH_GUESTS]: 'Search guests by name',
    [COMMON_UI_KEYS.PREVIOUS_IMAGE]: 'Previous image',
    [COMMON_UI_KEYS.NEXT_IMAGE]: 'Next image',
    [COMMON_UI_KEYS.BREADCRUMB]: 'breadcrumb',
    [COMMON_UI_KEYS.PAGINATION]: 'pagination',
    [COMMON_UI_KEYS.VIRTUALIZED_LIST]: 'Virtualized list',
    [COMMON_UI_KEYS.LOADING]: 'Loading...',
    [COMMON_UI_KEYS.ERROR]: 'Error',
    [COMMON_UI_KEYS.NO_ITEMS]: 'No items to display',
    [COMMON_UI_KEYS.SMILE]: 'smile'
  },
  es: {
    [COMMON_UI_KEYS.PREVIOUS_PAGE]: 'Página Anterior',
    [COMMON_UI_KEYS.NEXT_PAGE]: 'Página Siguiente',
    [COMMON_UI_KEYS.CLOSE]: 'Cerrar',
    [COMMON_UI_KEYS.MORE]: 'Más',
    [COMMON_UI_KEYS.TOGGLE_SIDEBAR]: 'Alternar Barra Lateral',
    [COMMON_UI_KEYS.TOGGLE_MENU]: 'Alternar menú',
    [COMMON_UI_KEYS.PREVIOUS_SLIDE]: 'Diapositiva anterior',
    [COMMON_UI_KEYS.NEXT_SLIDE]: 'Siguiente diapositiva',
    [COMMON_UI_KEYS.MORE_PAGES]: 'Más páginas',
    [COMMON_UI_KEYS.GO_TO_PREVIOUS_PAGE]: 'Ir a la página anterior',
    [COMMON_UI_KEYS.GO_TO_NEXT_PAGE]: 'Ir a la página siguiente',
    [COMMON_UI_KEYS.CLOSE_MODAL]: 'Cerrar modal',
    [COMMON_UI_KEYS.SEARCH_FAQS]: 'Buscar FAQs',
    [COMMON_UI_KEYS.CLEAR_SEARCH]: 'Limpiar búsqueda',
    [COMMON_UI_KEYS.SEARCH_GUESTS]: 'Buscar huéspedes por nombre',
    [COMMON_UI_KEYS.PREVIOUS_IMAGE]: 'Imagen anterior',
    [COMMON_UI_KEYS.NEXT_IMAGE]: 'Siguiente imagen',
    [COMMON_UI_KEYS.BREADCRUMB]: 'ruta de navegación',
    [COMMON_UI_KEYS.PAGINATION]: 'paginación',
    [COMMON_UI_KEYS.VIRTUALIZED_LIST]: 'Lista virtualizada',
    [COMMON_UI_KEYS.LOADING]: 'Cargando...',
    [COMMON_UI_KEYS.ERROR]: 'Error',
    [COMMON_UI_KEYS.NO_ITEMS]: 'No hay elementos para mostrar',
    [COMMON_UI_KEYS.SMILE]: 'sonrisa'
  },
  pt: {
    [COMMON_UI_KEYS.PREVIOUS_PAGE]: 'Página Anterior',
    [COMMON_UI_KEYS.NEXT_PAGE]: 'Próxima Página',
    [COMMON_UI_KEYS.CLOSE]: 'Fechar',
    [COMMON_UI_KEYS.MORE]: 'Mais',
    [COMMON_UI_KEYS.TOGGLE_SIDEBAR]: 'Alternar Barra Lateral',
    [COMMON_UI_KEYS.TOGGLE_MENU]: 'Alternar menu',
    [COMMON_UI_KEYS.PREVIOUS_SLIDE]: 'Slide anterior',
    [COMMON_UI_KEYS.NEXT_SLIDE]: 'Próximo slide',
    [COMMON_UI_KEYS.MORE_PAGES]: 'Mais páginas',
    [COMMON_UI_KEYS.GO_TO_PREVIOUS_PAGE]: 'Ir para página anterior',
    [COMMON_UI_KEYS.GO_TO_NEXT_PAGE]: 'Ir para próxima página',
    [COMMON_UI_KEYS.CLOSE_MODAL]: 'Fechar modal',
    [COMMON_UI_KEYS.SEARCH_FAQS]: 'Pesquisar FAQs',
    [COMMON_UI_KEYS.CLEAR_SEARCH]: 'Limpar pesquisa',
    [COMMON_UI_KEYS.SEARCH_GUESTS]: 'Pesquisar hóspedes por nome',
    [COMMON_UI_KEYS.PREVIOUS_IMAGE]: 'Imagem anterior',
    [COMMON_UI_KEYS.NEXT_IMAGE]: 'Próxima imagem',
    [COMMON_UI_KEYS.BREADCRUMB]: 'trilha de navegação',
    [COMMON_UI_KEYS.PAGINATION]: 'paginação',
    [COMMON_UI_KEYS.VIRTUALIZED_LIST]: 'Lista virtualizada',
    [COMMON_UI_KEYS.LOADING]: 'Carregando...',
    [COMMON_UI_KEYS.ERROR]: 'Erro',
    [COMMON_UI_KEYS.NO_ITEMS]: 'Nenhum item para exibir',
    [COMMON_UI_KEYS.SMILE]: 'sorriso'
  },
  ro: {
    [COMMON_UI_KEYS.PREVIOUS_PAGE]: 'Pagina Anterioară',
    [COMMON_UI_KEYS.NEXT_PAGE]: 'Pagina Următoare',
    [COMMON_UI_KEYS.CLOSE]: 'Închide',
    [COMMON_UI_KEYS.MORE]: 'Mai mult',
    [COMMON_UI_KEYS.TOGGLE_SIDEBAR]: 'Comută Bara Laterală',
    [COMMON_UI_KEYS.TOGGLE_MENU]: 'Comută meniul',
    [COMMON_UI_KEYS.PREVIOUS_SLIDE]: 'Diapozitivul anterior',
    [COMMON_UI_KEYS.NEXT_SLIDE]: 'Următorul diapozitiv',
    [COMMON_UI_KEYS.MORE_PAGES]: 'Mai multe pagini',
    [COMMON_UI_KEYS.GO_TO_PREVIOUS_PAGE]: 'Mergi la pagina anterioară',
    [COMMON_UI_KEYS.GO_TO_NEXT_PAGE]: 'Mergi la următoarea pagină',
    [COMMON_UI_KEYS.CLOSE_MODAL]: 'Închide modalul',
    [COMMON_UI_KEYS.SEARCH_FAQS]: 'Caută FAQ-uri',
    [COMMON_UI_KEYS.CLEAR_SEARCH]: 'Șterge căutarea',
    [COMMON_UI_KEYS.SEARCH_GUESTS]: 'Caută oaspeți după nume',
    [COMMON_UI_KEYS.PREVIOUS_IMAGE]: 'Imaginea anterioară',
    [COMMON_UI_KEYS.NEXT_IMAGE]: 'Următoarea imagine',
    [COMMON_UI_KEYS.BREADCRUMB]: 'traseu de navigare',
    [COMMON_UI_KEYS.PAGINATION]: 'paginare',
    [COMMON_UI_KEYS.VIRTUALIZED_LIST]: 'Listă virtualizată',
    [COMMON_UI_KEYS.LOADING]: 'Se încarcă...',
    [COMMON_UI_KEYS.ERROR]: 'Eroare',
    [COMMON_UI_KEYS.NO_ITEMS]: 'Nu există elemente de afișat',
    [COMMON_UI_KEYS.SMILE]: 'zâmbet'
  }
} as const;