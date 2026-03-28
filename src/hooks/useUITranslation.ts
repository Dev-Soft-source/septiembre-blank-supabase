import { useTranslation } from 'react-i18next';

/**
 * Hook for accessing common UI translations
 * Provides easy access to frequently used UI strings across all languages
 */
export const useUITranslation = () => {
  const { t } = useTranslation('ui-common');
  
  return {
    // Loading states
    loading: t('loading'),
    loadingTranslations: t('loadingTranslations'),
    downloading: t('downloading'),
    processing: t('processing'),
    thinking: t('thinking'),
    
    // Buttons - direct access for convenience
    buttons: {
      close: t('buttons.close'),
      cancel: t('buttons.cancel'),
      submit: t('buttons.submit'),
      save: t('buttons.save'),
      edit: t('buttons.edit'),
      delete: t('buttons.delete'),
      view: t('buttons.view'),
      back: t('buttons.back'),
      next: t('buttons.next'),
      previous: t('buttons.previous'),
      retry: t('buttons.retry'),
      refresh: t('buttons.refresh'),
      search: t('buttons.search'),
      filter: t('buttons.filter'),
      clear: t('buttons.clear'),
      reset: t('buttons.reset'),
      confirm: t('buttons.confirm'),
      continue: t('buttons.continue'),
      finish: t('buttons.finish'),
      download: t('buttons.download'),
      upload: t('buttons.upload'),
      copy: t('buttons.copy'),
      paste: t('buttons.paste'),
      bookNow: t('buttons.bookNow')
    },
    
    // Status messages
    status: {
      success: t('status.success'),
      failed: t('status.failed'),
      error: t('status.error'),
      warning: t('status.warning'),
      info: t('status.info'),
      pending: t('status.pending'),
      completed: t('status.completed'),
      cancelled: t('status.cancelled'),
      active: t('status.active'),
      inactive: t('status.inactive'),
      enabled: t('status.enabled'),
      disabled: t('status.disabled'),
      online: t('status.online'),
      offline: t('status.offline')
    },
    
    // Placeholders
    placeholders: {
      search: t('placeholders.search'),
      searchGuests: t('placeholders.searchGuests'),
      searchHotels: t('placeholders.searchHotels'),
      searchPayments: t('placeholders.searchPayments'),
      searchUsers: t('placeholders.searchUsers'),
      enterEmail: t('placeholders.enterEmail'),
      enterPassword: t('placeholders.enterPassword'),
      enterName: t('placeholders.enterName'),
      enterPhone: t('placeholders.enterPhone'),
      enterMessage: t('placeholders.enterMessage'),
      selectOption: t('placeholders.selectOption'),
      selectCurrency: t('placeholders.selectCurrency'),
      selectCountry: t('placeholders.selectCountry'),
      selectLanguage: t('placeholders.selectLanguage'),
      selectDate: t('placeholders.selectDate'),
      selectRoom: t('placeholders.selectRoom'),
      typeHere: t('placeholders.typeHere'),
      typeMessage: t('placeholders.typeMessage'),
      typeResponse: t('placeholders.typeResponse'),
      enterDetails: t('placeholders.enterDetails'),
      generatedAutomatically: t('placeholders.generatedAutomatically')
    },
    
    // Forms
    forms: {
      required: t('forms.required'),
      invalidEmail: t('forms.invalidEmail'),
      invalidPhone: t('forms.invalidPhone'),
      invalidUrl: t('forms.invalidUrl'),
      passwordTooShort: t('forms.passwordTooShort'),
      passwordsDontMatch: t('forms.passwordsDontMatch'),
      pleaseSelectDate: t('forms.pleaseSelectDate'),
      invalidBooking: t('forms.invalidBooking'),
      noRoomsAvailable: t('forms.noRoomsAvailable')
    },
    
    // Titles
    titles: {
      bookYourStay: t('titles.bookYourStay'),
      userReports: t('titles.userReports'),
      hotelReferrals: t('titles.hotelReferrals'),
      basicInformation: t('titles.basicInformation'),
      hotelsRegistered: t('titles.hotelsRegistered'),
      userAffinities: t('titles.userAffinities'),
      bookingsHistory: t('titles.bookingsHistory'),
      favoriteHotels: t('titles.favoriteHotels'),
      preferredAffinities: t('titles.preferredAffinities'),
      paymentMethods: t('titles.paymentMethods'),
      threeNightsProgram: t('titles.threeNightsProgram'),
      frequentlyAskedQuestions: t('titles.frequentlyAskedQuestions'),
      totalHotels: t('titles.totalHotels'),
      totalUsers: t('titles.totalUsers'),
      totalBookings: t('titles.totalBookings'),
      totalRevenue: t('titles.totalRevenue'),
      activeCountries: t('titles.activeCountries'),
      averageRating: t('titles.averageRating'),
      monthlyGrowth: t('titles.monthlyGrowth'),
      pageViews: t('titles.pageViews'),
      countries: t('titles.countries'),
      months: t('titles.months'),
      priceRanges: t('titles.priceRanges'),
      amenities: t('titles.amenities'),
      activities: t('titles.activities'),
      activity: t('titles.activity'),
      clientAffinity: t('titles.clientAffinity'),
      hotelFeature: t('titles.hotelFeature'),
      roomFeature: t('titles.roomFeature')
    },
    
    // Messages
    messages: {
      bookingConfirmed: t('messages.bookingConfirmed'),
      datasetGenerated: t('messages.datasetGenerated'),
      exportFailed: t('messages.exportFailed'),
      exportCompleted: t('messages.exportCompleted'),
      copyReferralCode: t('messages.copyReferralCode'),
      microphoneNotSupported: t('messages.microphoneNotSupported'),
      mediaRecorderNotSupported: t('messages.mediaRecorderNotSupported'),
      microphonePermissionDenied: t('messages.microphonePermissionDenied'),
      microphoneRequiresHttps: t('messages.microphoneRequiresHttps'),
      noMicrophoneFound: t('messages.noMicrophoneFound'),
      googleMapsUnavailable: t('messages.googleMapsUnavailable')
    },
    
    // Recording
    recording: {
      recording: t('recording.recording'),
      starting: t('recording.starting'),
      speaking: t('recording.speaking'),
      stopRecording: t('recording.stopRecording'),
      startVoiceChat: t('recording.startVoiceChat'),
      waitingForIntro: t('recording.waitingForIntro'),
      avatarSpeaking: t('recording.avatarSpeaking'),
      processing: t('recording.processing')
    },
    
    // Test results
    test: {
      allPassed: t('test.allPassed'),
      partial: t('test.partial'),
      failed: t('test.failed'),
      testsPassed: t('test.testsPassed'),
      yes: t('test.yes'),
      no: t('test.no'),
      isCoherent: t('test.isCoherent'),
      withinLimit: t('test.withinLimit'),
      hasAudio: t('test.hasAudio'),
      outputsIdentical: t('test.outputsIdentical'),
      hasAudioOutput: t('test.hasAudioOutput')
    },
    
    // Navigation
    navigation: {
      skipToMainContent: t('navigation.skipToMainContent')
    },
    
    // Direct translation function for complex cases
    t
  };
};