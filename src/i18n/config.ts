import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English
import enCommon from './locales/en/common.json';
import enHeader from './locales/en/header.json';
import enNavigation from './locales/en/navigation.json';
import enFaq from './locales/en/faq.json';
import enAuth from './locales/en/auth.json';
import enBooking from './locales/en/booking.json';
import enFooter from './locales/en/footer.json';
import enHome from './locales/en/home.json';
import enAffinity from './locales/en/affinity.json';
import enFilters from './locales/en/filters.json';
import enContact from './locales/en/contact.json';
import enOurServices from './locales/en/ourServices.json';
import enMisc from './locales/en/misc.json';
import enContent from './locales/en/content.json';
import enCustomerService from './locales/en/customerService.json';
import enIntellectualProperty from './locales/en/intellectualProperty.json';
import enOurValues from './locales/en/ourValues.json';
import enPrivacy from './locales/en/privacy.json';
import enHotels from './locales/en/hotels.json';
import enSearch from './locales/en/search.json';
import enDashboardGeneral from './locales/en/dashboard/general.json';
import enDashboardWelcome from './locales/en/dashboard/welcome.json';
import enDashboardStats from './locales/en/dashboard/stats.json';
import enDashboardAccommodation from './locales/en/dashboard/accommodation.json';
import enDashboardLocation from './locales/en/dashboard/location.json';
import enDashboardPricing from './locales/en/dashboard/pricing.json';
import enDashboardImages from './locales/en/dashboard/images.json';
import enDashboardFeatures from './locales/en/dashboard/features.json';
import enDashboardContact from './locales/en/dashboard/contact.json';
import enDashboardTerms from './locales/en/dashboard/terms.json';
import enDashboardContent from './locales/en/dashboard/content.json';
import enDashboardSettings from './locales/en/dashboard/settings.json';
import enDashboardProperty from './locales/en/dashboard/property.json';
import enDashboardAffinities from './locales/en/dashboard/affinities.json';
import enDashboardPropertySteps from './locales/en/dashboard/property-steps.json';
import enDashboardPropertyForm from './locales/en/dashboard/property-form.json';
import enDashboardPackages from './locales/en/dashboard/packages.json';
import esDashboardPackages from './locales/es/dashboard/packages.json';
import ptDashboardPackages from './locales/pt/dashboard/packages.json';
import roDashboardPackages from './locales/ro/dashboard/packages.json';
import enDashboardCommon from './locales/en/dashboard/common.json';
import enDashboardFaqTerms from './locales/en/dashboard/faq-terms.json';
import enAdvertising from './locales/en/dashboard/advertising.json';
import enRatesCalculator from './locales/en/dashboard/rates-calculator.json';
import enWelcomeContent from './locales/en/dashboard/welcome-content.json';
import enDashboardProfile from './locales/en/dashboard/profile.json';
import enDashboardUser from './locales/en/dashboard/user.json';
import enDashboardLeaderLiving from './locales/en/dashboard/leaderliving.json';
import enDashboard from './locales/en/dashboard.json';
import enTerms from './locales/en/terms.json';
import enAmbassador from './locales/en/ambassador.json';
import enAgents from './locales/en/promotor-local.json';
import enPress from './locales/en/press.json';
import enHotelCrisis from './locales/en/hotel-crisis.json';
import enHotelAccordion from './locales/en/hotel-accordion.json';
import enHotelAssociation from './locales/en/hotelAssociation.json';
import enAssociationRegistration from './locales/en/associationRegistration.json';
import enAssociationLetter from './locales/en/associationLetter.json';
import enAssociationDashboard from './locales/en/associationDashboard.json';
import enDashboardHotelRegistration from './locales/en/dashboard/hotel-registration.json';
import enHotel from './locales/en/hotel.json';
import enUI from './locales/en/ui.json';
import enUICommon from './locales/en/ui-common.json';
import enSystem from './locales/en/system.json';
import enSplash from './locales/en/splash.json';
import enAboutUs from './locales/en/aboutUs.json';
import enLiderLiving from './locales/en/liderLiving.json';
import enRegisterLeaderLiving from './locales/en/registerLeaderLiving.json';
import enLeaders from './locales/en/leaders.json';
import enHotelDetail from './locales/en/hotel-detail.json';
import enDetail from './locales/en/detail.json';
import enAssociation from './locales/en/association.json';
import enAssociationSlug from './locales/en/associationSlug.json';

// Spanish
import esCommon from './locales/es/common.json';
import esNavigation from './locales/es/navigation.json';
import esFaq from './locales/es/faq.json';
import esAuth from './locales/es/auth.json';
import esBooking from './locales/es/booking.json';
import esFooter from './locales/es/footer.json';
import esHome from './locales/es/home.json';
import esAffinity from './locales/es/affinity.json';
import esContact from './locales/es/contact.json';
import esFilters from './locales/es/filters.json';
import esContent from './locales/es/content.json';
import esCustomerService from './locales/es/customerService.json';
import esHotels from './locales/es/hotels.json';
import esHeader from './locales/es/header.json';
import esLegal from './locales/es/legal.json';
import esMenu from './locales/es/menu.json';
import esMessages from './locales/es/messages.json';
import esNotifications from './locales/es/notifications.json';
import esOnboarding from './locales/es/onboarding.json';
import esProfile from './locales/es/profile.json';
import esQuestions from './locales/es/questions.json';
import esReviews from './locales/es/reviews.json';
import esSearch from './locales/es/search.json';
import esServices from './locales/es/services.json';

import esTerms from './locales/es/terms.json';
import esOurServices from './locales/es/ourServices.json';
import esIntellectualProperty from './locales/es/intellectualProperty.json';
import esOurValues from './locales/es/ourValues.json';
import esPrivacy from './locales/es/privacy.json';
import esDashboardGeneral from './locales/es/dashboard/general.json';
import esDashboardHotel from './locales/es/dashboard/hotel.json';
import esDashboardProfile from './locales/es/dashboard/profile.json';
import esDashboardUser from './locales/es/dashboard/user.json';
import esDashboardLeaderLiving from './locales/es/dashboard/leaderliving.json';
import esDashboardRatesCalculator from './locales/es/dashboard/rates-calculator.json';
import esDashboardRates from './locales/es/dashboard/rates.json';
import esDashboardSettings from './locales/es/dashboard/settings.json';
import esDashboard from './locales/es/dashboard.json';
import esAmbassador from './locales/es/ambassador.json';
import esAgents from './locales/es/promotor-local.json';
import esPress from './locales/es/press.json';
import esAdvertising from './locales/es/dashboard/advertising.json';
import esHotelCrisis from './locales/es/hotel-crisis.json';
import esHotelAccordion from './locales/es/hotel-accordion.json';
import esHotelAssociation from './locales/es/hotelAssociation.json';
import esAssociationRegistration from './locales/es/associationRegistration.json';
import esAssociationLetter from './locales/es/associationLetter.json';
import esAssociationDashboard from './locales/es/associationDashboard.json';
import esAssociationSlug from './locales/es/associationSlug.json';
import esDashboardHotelRegistration from './locales/es/dashboard/hotel-registration.json';
import esHotel from './locales/es/hotel.json';
import esUI from './locales/es/ui.json';
import esUICommon from './locales/es/ui-common.json';
import esSystem from './locales/es/system.json';
import esSplash from './locales/es/splash.json';
import esAboutUs from './locales/es/aboutUs.json';
import esLiderLiving from './locales/es/liderLiving.json';
import esRegisterLeaderLiving from './locales/es/registerLeaderLiving.json';
import esLeaders from './locales/es/leaders.json';
import esHotelDetail from './locales/es/hotel-detail.json';
import esDetail from './locales/es/detail.json';
import esAssociation from './locales/es/association.json';

// Portuguese
import ptCommon from './locales/pt/common.json';
import ptHeader from './locales/pt/header.json';
import ptNavigation from './locales/pt/navigation.json';
import ptFaq from './locales/pt/faq.json';
import ptAuth from './locales/pt/auth.json';
import ptBooking from './locales/pt/booking.json';
import ptFooter from './locales/pt/footer.json';
import ptHome from './locales/pt/home.json';
import ptAffinity from './locales/pt/affinity.json';
import ptFilters from './locales/pt/filters.json';
import ptContact from './locales/pt/contact.json';
import ptOurServices from './locales/pt/ourServices.json';
import ptMisc from './locales/pt/misc.json';
import ptContent from './locales/pt/content.json';
import ptCustomerService from './locales/pt/customerService.json';
import ptIntellectualProperty from './locales/pt/intellectualProperty.json';
import ptOurValues from './locales/pt/ourValues.json';
import ptPrivacy from './locales/pt/privacy.json';
import ptHotels from './locales/pt/hotels.json';
import ptSearch from './locales/pt/search.json';
import ptDashboardGeneral from './locales/pt/dashboard/general.json';
import ptDashboardCommon from './locales/pt/dashboard/common.json';
import ptDashboardAccommodation from './locales/pt/dashboard/accommodation.json';
import ptDashboardContent from './locales/pt/dashboard/content.json';
import ptDashboardSettings from './locales/pt/dashboard/settings.json';
import ptAdvertising from './locales/pt/dashboard/advertising.json';
import ptRatesCalculator from './locales/pt/dashboard/rates-calculator.json';
import ptDashboardProfile from './locales/pt/dashboard/profile.json';
import ptDashboardUser from './locales/pt/dashboard/user.json';
import ptDashboardLeaderLiving from './locales/pt/dashboard/leaderliving.json';
import ptDashboard from './locales/pt/dashboard.json';
import ptTerms from './locales/pt/terms.json';
import ptAmbassador from './locales/pt/ambassador.json';
import ptAgents from './locales/pt/promotor-local.json';
import ptPress from './locales/pt/press.json';
import ptHotelCrisis from './locales/pt/hotel-crisis.json';
import ptHotelAccordion from './locales/pt/hotel-accordion.json';
import ptAssociationRegistration from './locales/pt/associationRegistration.json';
import ptAssociationLetter from './locales/pt/associationLetter.json';
import ptAssociationDashboard from './locales/pt/associationDashboard.json';
import ptDashboardHotelRegistration from './locales/pt/dashboard/hotel-registration.json';
import ptHotel from './locales/pt/hotel.json';
import ptUI from './locales/pt/ui.json';
import ptUICommon from './locales/pt/ui-common.json';
import ptSystem from './locales/pt/system.json';
import ptSplash from './locales/pt/splash.json';
import ptAboutUs from './locales/pt/aboutUs.json';
import ptLiderLiving from './locales/pt/liderLiving.json';
import ptRegisterLeaderLiving from './locales/pt/registerLeaderLiving.json';
import ptLeaders from './locales/pt/leaders.json';
import ptHotelDetail from './locales/pt/hotel-detail.json';
import ptDetail from './locales/pt/detail.json';
import ptAssociation from './locales/pt/association.json';
import ptAssociationSlug from './locales/pt/associationSlug.json';
import ptHotelAssociation from './locales/pt/hotelAssociation.json';

// Romanian
import roCommon from './locales/ro/common.json';
import roHeader from './locales/ro/header.json';
import roNavigation from './locales/ro/navigation.json';
import roFaq from './locales/ro/faq.json';
import roAuth from './locales/ro/auth.json';
import roBooking from './locales/ro/booking.json';
import roFooter from './locales/ro/footer.json';
import roHome from './locales/ro/home.json';
import roAffinity from './locales/ro/affinity.json';
import roFilters from './locales/ro/filters.json';
import roContact from './locales/ro/contact.json';
import roOurServices from './locales/ro/ourServices.json';
import roMisc from './locales/ro/misc.json';
import roContent from './locales/ro/content.json';
import roCustomerService from './locales/ro/customerService.json';
import roIntellectualProperty from './locales/ro/intellectualProperty.json';
import roOurValues from './locales/ro/ourValues.json';
import roPrivacy from './locales/ro/privacy.json';
import roHotels from './locales/ro/hotels.json';
import roSearch from './locales/ro/search.json';
import roDashboardGeneral from './locales/ro/dashboard/general.json';
import roDashboardCommon from './locales/ro/dashboard/common.json';
import roDashboardAccommodation from './locales/ro/dashboard/accommodation.json';
import roDashboardContent from './locales/ro/dashboard/content.json';
import roDashboardProfile from './locales/ro/dashboard/profile.json';
import roDashboardUser from './locales/ro/dashboard/user.json';
import roDashboardSettings from './locales/ro/dashboard/settings.json';
import roRatesCalculator from './locales/ro/dashboard/rates-calculator.json';
import roDashboardLeaderLiving from './locales/ro/dashboard/leaderliving.json';
import roDashboard from './locales/ro/dashboard.json';
import roTerms from './locales/ro/terms.json';
import roAmbassador from './locales/ro/ambassador.json';
import roAgents from './locales/ro/promotor-local.json';
import roPress from './locales/ro/press.json';
import roAdvertising from './locales/ro/dashboard/advertising.json';
import roHotelCrisis from './locales/ro/hotel-crisis.json';
import roHotelAccordion from './locales/ro/hotel-accordion.json';
import roAssociationRegistration from './locales/ro/associationRegistration.json';
import roAssociationLetter from './locales/ro/associationLetter.json';
import roAssociationDashboard from './locales/ro/associationDashboard.json';
import roDashboardHotelRegistration from './locales/ro/dashboard/hotel-registration.json';
import roHotel from './locales/ro/hotel.json';
import roUI from './locales/ro/ui.json';
import roUICommon from './locales/ro/ui-common.json';
import roSystem from './locales/ro/system.json';
import roSplash from './locales/ro/splash.json';
import roAboutUs from './locales/ro/aboutUs.json';
import roLiderLiving from './locales/ro/liderLiving.json';
import roRegisterLeaderLiving from './locales/ro/registerLeaderLiving.json';
import roLeaders from './locales/ro/leaders.json';
import roHotelDetail from './locales/ro/hotel-detail.json';
import roDetail from './locales/ro/detail.json';
import roAssociation from './locales/ro/association.json';
import roAssociationSlug from './locales/ro/associationSlug.json';
import roHotelAssociation from './locales/ro/hotelAssociation.json';

const resources = {
  en: {
    translation: enCommon,
    header: enHeader,
    navigation: enNavigation,
    faq: enFaq,
    auth: enAuth,
    booking: enBooking,
    footer: enFooter,
    home: enHome,
    affinity: enAffinity,
    filters: enFilters,
    contact: enContact,
    ourServices: enOurServices,
    misc: enMisc,
    content: enContent,
    customerService: enCustomerService,
    intellectualProperty: enIntellectualProperty,
    ourValues: enOurValues,
    privacy: enPrivacy,
    terms: enTerms,
    hotels: enHotels,
    search: enSearch,
    ambassador: enAmbassador,
    agents: enAgents,
    'promotor-local': enAgents,
    press: enPress,
    advertising: enAdvertising,
    'hotel-crisis': enHotelCrisis,
    'hotel-accordion': enHotelAccordion,
    hotelAssociation: enHotelAssociation,
    associationRegistration: enAssociationRegistration,
    associationLetter: enAssociationLetter,
    associationDashboard: enAssociationDashboard,
    hotel: enHotel,
    ui: enUI,
    'ui-common': enUICommon,
    system: enSystem,
    splash: enSplash,
    aboutUs: enAboutUs,
    liderLiving: enLiderLiving,
    registerLeaderLiving: enRegisterLeaderLiving,
    // Dashboard namespaces as separate resources
    'dashboard/general': enDashboardGeneral,
    'dashboard/welcome': enDashboardWelcome,
    'dashboard/stats': enDashboardStats,
    'dashboard/accommodation': enDashboardAccommodation,
    'dashboard/location': enDashboardLocation,
    'dashboard/pricing': enDashboardPricing,
    'dashboard/images': enDashboardImages,
    'dashboard/features': enDashboardFeatures,
    'dashboard/contact': enDashboardContact,
    'dashboard/terms': enDashboardTerms,
    'dashboard/content': enDashboardContent,
    'dashboard/settings': enDashboardSettings,
    'dashboard/property': enDashboardProperty,
    'dashboard/affinities': enDashboardAffinities,
    'dashboard/property-steps': enDashboardPropertySteps,
    'dashboard/property-form': enDashboardPropertyForm,
    'dashboard/packages': enDashboardPackages,
    'dashboard/common': enDashboardCommon,
    'dashboard/faq-terms': enDashboardFaqTerms,
    'dashboard/rates-calculator': enRatesCalculator,
    'dashboard/welcome-content': enWelcomeContent,
    'dashboard/profile': enDashboardProfile,
    'dashboard/user': enDashboardUser,
    'dashboard/leaderliving': enDashboardLeaderLiving,
      'dashboard/advertising': enAdvertising,
      'dashboard/hotel-registration': enDashboardHotelRegistration,
      leaders: enLeaders,
      'hotel-detail': enHotelDetail,
      detail: enDetail,
      association: enAssociation,
      associationSlug: enAssociationSlug,
    // Legacy dashboard namespace for backwards compatibility
    dashboard: {
      ...enDashboard.dashboard,
      general: enDashboardGeneral,
      welcome: enDashboardWelcome,
      stats: enDashboardStats,
      accommodation: enDashboardAccommodation,
      location: enDashboardLocation,
      pricing: enDashboardPricing,
      images: enDashboardImages,
      features: enDashboardFeatures,
      contact: enDashboardContact,
      terms: enDashboardTerms,
      content: enDashboardContent,
      settings: enDashboardSettings,
      property: enDashboardProperty,
      affinities: enDashboardAffinities,
      propertySteps: enDashboardPropertySteps,
      propertyForm: enDashboardPropertyForm,
      packages: enDashboardPackages,
      common: enDashboardCommon,
      faqTerms: enDashboardFaqTerms,
      ratesCalculator: enRatesCalculator,
      welcomeContent: enWelcomeContent,
    },
  },
  es: {
    translation: esCommon,
    navigation: esNavigation,
    faq: esFaq,
    auth: esAuth,
    booking: esBooking,
    footer: esFooter,
    home: esHome,
    affinity: esAffinity,
    contact: esContact,
    content: esContent,
    customerService: esCustomerService,
    hotels: esHotels,
    filters: esFilters,
    header: esHeader,
    legal: esLegal,
    menu: esMenu,
    messages: esMessages,
    notifications: esNotifications,
    onboarding: esOnboarding,
    profile: esProfile,
    questions: esQuestions,
    reviews: esReviews,
    search: esSearch,
    services: esServices,
    
    terms: esTerms,
    ourServices: esOurServices,
    intellectualProperty: esIntellectualProperty,
    ourValues: esOurValues,
    privacy: esPrivacy,
    ambassador: esAmbassador,
    agents: esAgents,
    'promotor-local': esAgents,
    press: esPress,
    advertising: esAdvertising,
    'hotel-crisis': esHotelCrisis,
    'hotel-accordion': esHotelAccordion,
    hotelAssociation: esHotelAssociation,
    associationRegistration: esAssociationRegistration,
    associationLetter: esAssociationLetter,
    associationDashboard: esAssociationDashboard,
    associationSlug: esAssociationSlug,
    hotel: esHotel,
    ui: esUI,
    'ui-common': esUICommon,
    system: esSystem,
splash: esSplash,
     aboutUs: esAboutUs,
     liderLiving: esLiderLiving,
      leaders: esLeaders,
      'hotel-detail': esHotelDetail,
      detail: esDetail,
      association: esAssociation,
    registerLeaderLiving: esRegisterLeaderLiving,
    // Dashboard namespaces as separate resources
    'dashboard/general': esDashboardGeneral,
    'dashboard/hotel': esDashboardHotel,
    'dashboard/profile': esDashboardProfile,
    'dashboard/user': esDashboardUser,
    'dashboard/rates-calculator': esDashboardRatesCalculator,
    'dashboard/rates': esDashboardRates,
    'dashboard/settings': esDashboardSettings,
    'dashboard/advertising': esAdvertising,
    'dashboard/leaderliving': esDashboardLeaderLiving,
    'dashboard/packages': esDashboardPackages,
    'dashboard/hotel-registration': esDashboardHotelRegistration,
    // Legacy dashboard namespace for backwards compatibility
    dashboard: {
      ...esDashboard.dashboard,
      general: esDashboardGeneral,
      hotel: esDashboardHotel,
      profile: esDashboardProfile,
      ratesCalculator: esDashboardRatesCalculator,
      rates: esDashboardRates,
      settings: esDashboardSettings,
      packages: esDashboardPackages,
    },
  },
  pt: {
    translation: ptCommon,
    header: ptHeader,
    navigation: ptNavigation,
    faq: ptFaq,
    auth: ptAuth,
    booking: ptBooking,
    footer: ptFooter,
    home: ptHome,
    affinity: ptAffinity,
    filters: ptFilters,
    contact: ptContact,
    ourServices: ptOurServices,
    misc: ptMisc,
    content: ptContent,
    customerService: ptCustomerService,
    intellectualProperty: ptIntellectualProperty,
    ourValues: ptOurValues,
    privacy: ptPrivacy,
    terms: ptTerms,
    hotels: ptHotels,
    search: ptSearch,
    ambassador: ptAmbassador,
    agents: ptAgents,
    'promotor-local': ptAgents,
    press: ptPress,
    advertising: ptAdvertising,
    'hotel-crisis': ptHotelCrisis,
    'hotel-accordion': ptHotelAccordion,
    hotelAssociation: ptHotelAssociation,
    associationRegistration: ptAssociationRegistration,
    associationLetter: ptAssociationLetter,
    associationDashboard: ptAssociationDashboard,
    hotel: ptHotel,
    ui: ptUI,
    'ui-common': ptUICommon,
    system: ptSystem,
    splash: ptSplash,
    aboutUs: ptAboutUs,
      liderLiving: ptLiderLiving,
      registerLeaderLiving: ptRegisterLeaderLiving,
      leaders: ptLeaders,
      'hotel-detail': ptHotelDetail,
      detail: ptDetail,
      association: ptAssociation,
      associationSlug: ptAssociationSlug,
    // Dashboard namespaces as separate resources
    'dashboard/general': ptDashboardGeneral,
    'dashboard/common': ptDashboardCommon,
    'dashboard/accommodation': ptDashboardAccommodation,
    'dashboard/content': ptDashboardContent,
    'dashboard/settings': ptDashboardSettings,
    'dashboard/rates-calculator': ptRatesCalculator,
    'dashboard/profile': ptDashboardProfile,
    'dashboard/user': ptDashboardUser,
    'dashboard/leaderliving': ptDashboardLeaderLiving,
    'dashboard/advertising': ptAdvertising,
    'dashboard/packages': ptDashboardPackages,
    'dashboard/hotel-registration': ptDashboardHotelRegistration,
    // Legacy dashboard namespace for backwards compatibility
    dashboard: {
      ...ptDashboard.dashboard,
      general: ptDashboardGeneral,
      common: ptDashboardCommon,
      accommodation: ptDashboardAccommodation,
      content: ptDashboardContent,
      settings: ptDashboardSettings,
      ratesCalculator: ptRatesCalculator,
      packages: ptDashboardPackages,
    },
  },
  ro: {
    translation: roCommon,
    header: roHeader,
    navigation: roNavigation,
    faq: roFaq,
    auth: roAuth,
    booking: roBooking,
    footer: roFooter,
    home: roHome,
    affinity: roAffinity,
    filters: roFilters,
    contact: roContact,
    ourServices: roOurServices,
    misc: roMisc,
    content: roContent,
    customerService: roCustomerService,
    intellectualProperty: roIntellectualProperty,
    ourValues: roOurValues,
    privacy: roPrivacy,
    terms: roTerms,
    hotels: roHotels,
    search: roSearch,
    ambassador: roAmbassador,
    agents: roAgents,
    'promotor-local': roAgents,
    press: roPress,
    advertising: roAdvertising,
    'hotel-crisis': roHotelCrisis,
    'hotel-accordion': roHotelAccordion,
    hotelAssociation: roHotelAssociation,
    associationRegistration: roAssociationRegistration,
    associationLetter: roAssociationLetter,
    associationDashboard: roAssociationDashboard,
    hotel: roHotel,
    ui: roUI,
    'ui-common': roUICommon,
    system: roSystem,
    splash: roSplash,
aboutUs: roAboutUs,
      liderLiving: roLiderLiving,
      registerLeaderLiving: roRegisterLeaderLiving,
      leaders: roLeaders,
      'hotel-detail': roHotelDetail,
      detail: roDetail,
      association: roAssociation,
      associationSlug: roAssociationSlug,
    // Dashboard namespaces as separate resources
    'dashboard/general': roDashboardGeneral,
    'dashboard/common': roDashboardCommon,
    'dashboard/accommodation': roDashboardAccommodation,
    'dashboard/content': roDashboardContent,
    'dashboard/profile': roDashboardProfile,
    'dashboard/user': roDashboardUser,
    'dashboard/settings': roDashboardSettings,
    'dashboard/rates-calculator': roRatesCalculator,
    'dashboard/leaderliving': roDashboardLeaderLiving,
    'dashboard/advertising': roAdvertising,
    'dashboard/packages': roDashboardPackages,
    'dashboard/hotel-registration': roDashboardHotelRegistration,
    // Legacy dashboard namespace for backwards compatibility
    dashboard: {
      ...roDashboard.dashboard,
      general: roDashboardGeneral,
      common: roDashboardCommon,
      accommodation: roDashboardAccommodation,
      content: roDashboardContent,
      settings: roDashboardSettings,
      ratesCalculator: roRatesCalculator,
      packages: roDashboardPackages,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // English as primary fallback - NO SPANISH FALLBACK
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
    // Add initialization callback to ensure proper loading
    initImmediate: false,
  })
  .then(async () => {
    // Load activities and affinities translations dynamically
    try {
      const [enActivities, enAffinities, esActivities, esAffinities, ptActivities, ptAffinities, roActivities, roAffinities] = await Promise.all([
        fetch('/locales/en/activities.json').then(r => r.json()),
        fetch('/locales/en/affinities.json').then(r => r.json()),
        fetch('/locales/es/activities.json').then(r => r.json()),
        fetch('/locales/es/affinities.json').then(r => r.json()),
        fetch('/locales/pt/activities.json').then(r => r.json()),
        fetch('/locales/pt/affinities.json').then(r => r.json()),
        fetch('/locales/ro/activities.json').then(r => r.json()),
        fetch('/locales/ro/affinities.json').then(r => r.json()),
      ]);

      // Add the new namespaces to existing resources
      i18n.addResourceBundle('en', 'activities', enActivities);
      i18n.addResourceBundle('en', 'affinities', enAffinities);
      i18n.addResourceBundle('es', 'activities', esActivities);
      i18n.addResourceBundle('es', 'affinities', esAffinities);
      i18n.addResourceBundle('pt', 'activities', ptActivities);
      i18n.addResourceBundle('pt', 'affinities', ptAffinities);
      i18n.addResourceBundle('ro', 'activities', roActivities);
      i18n.addResourceBundle('ro', 'affinities', roAffinities);

    } catch (error) {
      console.error('❌ Failed to load activities/affinities translations:', error);
    }    
  })
  .catch((error) => {
    console.error('❌ i18n initialization failed:', error);
  });

export default i18n;