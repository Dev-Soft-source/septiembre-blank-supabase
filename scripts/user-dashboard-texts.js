const fs = require('fs');
const path = require('path');

// User Dashboard text extraction and translation management
const userDashboardTexts = {
  // Dashboard main content
  dashboard: {
    welcome: "Welcome back",
    stats: "Your Stats",
    general: "General",
    myExperience: "My Experience",
    discoverJourney: "Discover your journey with Hotel-Living and see how far you've traveled.",
    yourMilestones: "Your Milestones",
    startJourney: "Start your journey to unlock achievements!",
    travelSummary: "Travel Summary",
    totalStays: "Total Stays",
    citiesVisited: "Cities Visited", 
    daysBooked: "Days Booked",
    totalSpent: "Total Spent",
    topAffinities: "Top Affinities",
    addAffinities: "Add affinities to your profile to see your preferences here.",
    visitedDestinations: "Visited Destinations",
    travelDestinations: "Your travel destinations will appear here after your first stay.",
    timelineBookings: "Timeline of Bookings",
    bookingHistory: "Your booking history will appear here after your first stay.",
    readyNextAdventure: "Ready for your next adventure?",
    exploreHotels: "Explore Hotels"
  },
  
  // Bookings section
  bookings: {
    title: "Bookings",
    subtitle: "Manage your hotel reservations and upcoming stays"
  },
  
  // Experience section  
  experience: {
    title: "Experience",
    subtitle: "Track your travel journey and achievements"
  },
  
  // Groups section
  groups: {
    title: "Join a Group", 
    myGroupMemberships: "My Group Memberships",
    noGroupsYet: "You haven't joined any groups yet. Browse available groups below to get started!",
    availableGroups: "Available Groups",
    joinGroupLeaderCode: "Join Group with Leader Code",
    enterGroupCode: "Enter group code (e.g., HT245)",
    groupName: "Group name",
    requestJoinGroup: "Request to Join Group"
  },
  
  // Three Nights Program
  threeNights: {
    title: "Three Free Nights Program",
    subtitle: "Our Three Free Nights program rewards you for helping us grow the Hotel-Living community. For every hotel you personally present to our platform and that joins within 15 days, you'll earn three free nights.",
    howItWorks: "How it works:",
    step1: "Recommend hotels you love and personally present them to Hotel-Living",
    step2: "The hotel must register on our platform within 15 days of your referral",
    step3: "Once verified, you'll receive credits for three free nights",
    step4: "Redeem your free nights at any hotel participating in our platform",
    rewardProgram: "This program rewards personal referrals and networking. After 15 days, great registration opportunities are closed. There's no limit to how many hotels you can refer or how many nights you can earn!",
    benefits: "Benefits:",
    benefit1: "Earn three free nights per successful referral",
    benefit2: "No limit on how many hotels you can refer",
    benefit3: "Help your favorite hotels gain exposure", 
    benefit4: "Enjoy free stays at exceptional properties",
    referHotel: "Refer a Hotel",
    importantRegistrationWindow: "Important: 15-Day Registration Window",
    registrationInfo: "After your referral, the hotel must register within 15 calendar days for you to receive the three free nights reward.",
    makeIntroduction: "Make sure to personally introduce the hotel to our platform and encourage them to sign up promptly.",
    hotelName: "Hotel Name",
    enterHotelName: "Enter the hotel name",
    cityOptional: "City (Optional)",
    enterCity: "Enter city name",
    contactPerson: "Contact Person", 
    enterContactPerson: "Enter contact person name",
    contactEmail: "Contact Email",
    enterContactEmail: "Enter contact email"
  },
  
  // Ambassador Program
  ambassador: {
    title: "Become an Ambassador",
    subtitle: "Get rewarded for successful referrals", 
    earnRewards: "Earn Rewards",
    earnRewardsDesc: "Get rewarded for successful referrals",
    shareHotels: "Share Hotels", 
    shareHotelsDesc: "Recommend amazing hotels to travelers",
    buildNetwork: "Build Network",
    buildNetworkDesc: "Connect with hotels and travelers",
    ambassadorApplication: "Ambassador Application",
    name: "Name",
    email: "Email",
    additionalMessage: "Additional Message (Optional)",
    interestedBecoming: "I'm interested in becoming an ambassador and learning more about this opportunity.",
    submitApplication: "Submit Application"
  },
  
  // History section
  history: {
    title: "History",
    subtitle: "View your complete booking and activity history"
  },
  
  // Payments section
  payments: {
    title: "Payments", 
    subtitle: "Manage your payment methods and billing information"
  },
  
  // Profile section
  profile: {
    title: "Profile",
    subtitle: "Manage your personal information and preferences"
  },
  
  // Settings section
  settings: {
    title: "Settings",
    subtitle: "Customize your account preferences and privacy settings",
    themePreferences: "Theme Preferences",
    selectThemesDesc: "Select themes that interest you to get personalized hotel recommendations",
    favoriteThemes: "Your Favorite Themes",
    favoriteThemesDesc: "Select themes that interest you the most to see personalized recommendations", 
    noThemesSelected: "No themes selected yet",
    selectTheme: "Select a Theme",
    browseAvailableThemes: "Browse Available Themes",
    exploreCollection: "Explore our curated collection of themed hotel experiences",
    natureOutdoors: "Nature & Outdoors",
    culturalExperiences: "Cultural Experiences", 
    wellnessLifestyle: "Wellness & Lifestyle",
    professionalEducation: "Professional & Education",
    specialInterests: "Special Interests",
    suggestNewTheme: "Suggest a New Theme",
    suggestThemeDesc: "Don't see a theme that matches your interests? Suggest a new one!",
    themeName: "Theme Name",
    themeDescription: "Theme Description",
    submitThemeSuggestion: "Submit Theme Suggestion",
    languagePreferences: "Language Preferences", 
    chooseLanguage: "Choose your preferred language for the application",
    preferredLanguage: "Preferred Language"
  },
  
  // Notifications section
  notifications: {
    title: "Notifications",
    subtitle: "Stay updated with your latest activity and messages"
  },
  
  // Navigation/Sidebar
  navigation: {
    dashboard: "Dashboard",
    bookings: "Bookings", 
    experience: "Experience",
    joinGroup: "Join a Group",
    threeNights: "Get Three Nights",
    becomeAmbassador: "Become an Ambassador", 
    history: "History",
    payments: "Payments",
    profile: "Profile",
    settings: "Settings",
    notifications: "Notifications",
    logout: "Logout"
  },
  
  // Support section
  support: {
    helpDesk: "Help Desk",
    supportTeamAvailable: "Our support team is available 24/7 to help with any questions or concerns.",
    contactSupport: "Contact Support"
  }
};

// Translation mapping for all languages
const translations = {
  en: userDashboardTexts,
  
  es: {
    // Dashboard main content in Spanish
    dashboard: {
      welcome: "Bienvenido de vuelta",
      stats: "Tus Estadísticas",
      general: "General",
      myExperience: "Mi Experiencia",
      discoverJourney: "Descubre tu jornada con Hotel-Living y ve qué tan lejos has viajado.",
      yourMilestones: "Tus Hitos",
      startJourney: "¡Comienza tu viaje para desbloquear logros!",
      travelSummary: "Resumen de Viajes",
      totalStays: "Estancias Totales",
      citiesVisited: "Ciudades Visitadas",
      daysBooked: "Días Reservados",
      totalSpent: "Total Gastado",
      topAffinities: "Principales Afinidades",
      addAffinities: "Agrega afinidades a tu perfil para ver tus preferencias aquí.",
      visitedDestinations: "Destinos Visitados",
      travelDestinations: "Tus destinos de viaje aparecerán aquí después de tu primera estadía.",
      timelineBookings: "Cronología de Reservas",
      bookingHistory: "Tu historial de reservas aparecerá aquí después de tu primera estadía.",
      readyNextAdventure: "¿Listo para tu próxima aventura?",
      exploreHotels: "Explorar Hoteles"
    },
    
    bookings: {
      title: "Reservas",
      subtitle: "Administra tus reservas de hotel y próximas estadías"
    },
    
    experience: {
      title: "Experiencia", 
      subtitle: "Rastrea tu viaje de viaje y logros"
    },
    
    groups: {
      title: "Unirse a un Grupo",
      myGroupMemberships: "Mis Membresías de Grupo",
      noGroupsYet: "Aún no te has unido a ningún grupo. ¡Navega por los grupos disponibles a continuación para comenzar!",
      availableGroups: "Grupos Disponibles", 
      joinGroupLeaderCode: "Unirse al Grupo con Código de Líder",
      enterGroupCode: "Ingresa código de grupo (ej., HT245)",
      groupName: "Nombre del grupo",
      requestJoinGroup: "Solicitar Unirse al Grupo"
    },
    
    threeNights: {
      title: "Programa de Tres Noches Gratis",
      subtitle: "Nuestro programa de Tres Noches Gratis te recompensa por ayudarnos a hacer crecer la comunidad Hotel-Living. Por cada hotel que presentes personalmente a nuestra plataforma y que se una dentro de 15 días, ganarás tres noches gratis.",
      howItWorks: "Cómo funciona:",
      step1: "Recomienda hoteles que amas y preséntalos personalmente a Hotel-Living",
      step2: "El hotel debe registrarse en nuestra plataforma dentro de 15 días de tu referencia",
      step3: "Una vez verificado, recibirás créditos por tres noches gratis",
      step4: "Canjea tus noches gratis en cualquier hotel participante en nuestra plataforma",
      rewardProgram: "Este programa recompensa las referencias personales y el networking. Después de 15 días, las grandes oportunidades de registro están cerradas. ¡No hay límite en cuántos hoteles puedes referir o cuántas noches puedes ganar!",
      benefits: "Beneficios:",
      benefit1: "Gana tres noches gratis por referencia exitosa",
      benefit2: "Sin límite en cuántos hoteles puedes referir",
      benefit3: "Ayuda a tus hoteles favoritos a ganar exposición",
      benefit4: "Disfruta de estadías gratis en propiedades excepcionales",
      referHotel: "Referir un Hotel",
      importantRegistrationWindow: "Importante: Ventana de Registro de 15 Días",
      registrationInfo: "Después de tu referencia, el hotel debe registrarse dentro de 15 días calendario para que recibas la recompensa de tres noches gratis.",
      makeIntroduction: "Asegúrate de presentar personalmente el hotel a nuestra plataforma y animarlo a registrarse pronto.",
      hotelName: "Nombre del Hotel",
      enterHotelName: "Ingresa el nombre del hotel",
      cityOptional: "Ciudad (Opcional)",
      enterCity: "Ingresa el nombre de la ciudad",
      contactPerson: "Persona de Contacto",
      enterContactPerson: "Ingresa el nombre de la persona de contacto",
      contactEmail: "Email de Contacto",
      enterContactEmail: "Ingresa el email de contacto"
    },
    
    ambassador: {
      title: "Conviértete en Embajador",
      subtitle: "Recibe recompensas por referencias exitosas",
      earnRewards: "Gana Recompensas",
      earnRewardsDesc: "Recibe recompensas por referencias exitosas",
      shareHotels: "Comparte Hoteles",
      shareHotelsDesc: "Recomienda hoteles increíbles a viajeros",
      buildNetwork: "Construye Red",
      buildNetworkDesc: "Conecta con hoteles y viajeros",
      ambassadorApplication: "Aplicación de Embajador",
      name: "Nombre",
      email: "Email",
      additionalMessage: "Mensaje Adicional (Opcional)",
      interestedBecoming: "Estoy interesado en convertirme en embajador y aprender más sobre esta oportunidad.",
      submitApplication: "Enviar Aplicación"
    },
    
    history: {
      title: "Historial",
      subtitle: "Ve tu historial completo de reservas y actividades"
    },
    
    payments: {
      title: "Pagos",
      subtitle: "Administra tus métodos de pago e información de facturación"
    },
    
    profile: {
      title: "Perfil",
      subtitle: "Administra tu información personal y preferencias"
    },
    
    settings: {
      title: "Configuraciones",
      subtitle: "Personaliza las preferencias de tu cuenta y configuraciones de privacidad",
      themePreferences: "Preferencias de Tema",
      selectThemesDesc: "Selecciona temas que te interesen para obtener recomendaciones de hotel personalizadas",
      favoriteThemes: "Tus Temas Favoritos",
      favoriteThemesDesc: "Selecciona los temas que más te interesen para ver recomendaciones personalizadas",
      noThemesSelected: "Aún no se han seleccionado temas",
      selectTheme: "Seleccionar un Tema",
      browseAvailableThemes: "Navegar Temas Disponibles",
      exploreCollection: "Explora nuestra colección curada de experiencias hoteleras temáticas",
      natureOutdoors: "Naturaleza y Actividades al Aire Libre",
      culturalExperiences: "Experiencias Culturales",
      wellnessLifestyle: "Bienestar y Estilo de Vida",
      professionalEducation: "Profesional y Educación",
      specialInterests: "Intereses Especiales",
      suggestNewTheme: "Sugerir un Nuevo Tema",
      suggestThemeDesc: "¿No ves un tema que coincida con tus intereses? ¡Sugiere uno nuevo!",
      themeName: "Nombre del Tema",
      themeDescription: "Descripción del Tema",
      submitThemeSuggestion: "Enviar Sugerencia de Tema",
      languagePreferences: "Preferencias de Idioma",
      chooseLanguage: "Elige tu idioma preferido para la aplicación",
      preferredLanguage: "Idioma Preferido"
    },
    
    notifications: {
      title: "Notificaciones",
      subtitle: "Mantente actualizado con tu última actividad y mensajes"
    },
    
    navigation: {
      dashboard: "Panel de Control",
      bookings: "Reservas",
      experience: "Experiencia", 
      joinGroup: "Unirse a un Grupo",
      threeNights: "Obtener Tres Noches",
      becomeAmbassador: "Convertirse en Embajador",
      history: "Historial",
      payments: "Pagos",
      profile: "Perfil",
      settings: "Configuraciones",
      notifications: "Notificaciones",
      logout: "Cerrar Sesión"
    },
    
    support: {
      helpDesk: "Mesa de Ayuda",
      supportTeamAvailable: "Nuestro equipo de soporte está disponible 24/7 para ayudar con cualquier pregunta o inquietud.",
      contactSupport: "Contactar Soporte"
    }
  },
  
  pt: {
    // Dashboard main content in Portuguese
    dashboard: {
      welcome: "Bem-vindo de volta",
      stats: "Suas Estatísticas",
      general: "Geral",
      myExperience: "Minha Experiência",
      discoverJourney: "Descubra sua jornada com o Hotel-Living e veja o quão longe você viajou.",
      yourMilestones: "Seus Marcos",
      startJourney: "Comece sua jornada para desbloquear conquistas!",
      travelSummary: "Resumo de Viagens",
      totalStays: "Estadias Totais",
      citiesVisited: "Cidades Visitadas",
      daysBooked: "Dias Reservados",
      totalSpent: "Total Gasto",
      topAffinities: "Principais Afinidades",
      addAffinities: "Adicione afinidades ao seu perfil para ver suas preferências aqui.",
      visitedDestinations: "Destinos Visitados",
      travelDestinations: "Seus destinos de viagem aparecerão aqui após sua primeira estadia.",
      timelineBookings: "Cronologia de Reservas",
      bookingHistory: "Seu histórico de reservas aparecerá aqui após sua primeira estadia.",
      readyNextAdventure: "Pronto para sua próxima aventura?",
      exploreHotels: "Explorar Hotéis"
    },
    
    bookings: {
      title: "Reservas",
      subtitle: "Gerencie suas reservas de hotel e próximas estadias"
    },
    
    experience: {
      title: "Experiência",
      subtitle: "Acompanhe sua jornada de viagem e conquistas"
    },
    
    groups: {
      title: "Participar de um Grupo",
      myGroupMemberships: "Minhas Participações em Grupos",
      noGroupsYet: "Você ainda não participou de nenhum grupo. Navegue pelos grupos disponíveis abaixo para começar!",
      availableGroups: "Grupos Disponíveis",
      joinGroupLeaderCode: "Participar do Grupo com Código do Líder",
      enterGroupCode: "Digite o código do grupo (ex., HT245)",
      groupName: "Nome do grupo",
      requestJoinGroup: "Solicitar Participação no Grupo"
    },
    
    threeNights: {
      title: "Programa Três Noites Grátis",
      subtitle: "Nosso programa de Três Noites Grátis recompensa você por nos ajudar a crescer a comunidade Hotel-Living. Para cada hotel que você apresentar pessoalmente à nossa plataforma e que se junte dentro de 15 dias, você ganhará três noites grátis.",
      howItWorks: "Como funciona:",
      step1: "Recomende hotéis que você ama e apresente-os pessoalmente ao Hotel-Living",
      step2: "O hotel deve se registrar em nossa plataforma dentro de 15 dias da sua indicação",
      step3: "Uma vez verificado, você receberá créditos por três noites grátis",
      step4: "Resgate suas noites grátis em qualquer hotel participante em nossa plataforma",
      rewardProgram: "Este programa recompensa indicações pessoais e networking. Após 15 dias, grandes oportunidades de registro estão fechadas. Não há limite para quantos hotéis você pode indicar ou quantas noites pode ganhar!",
      benefits: "Benefícios:",
      benefit1: "Ganhe três noites grátis por indicação bem-sucedida",
      benefit2: "Sem limite de quantos hotéis você pode indicar",
      benefit3: "Ajude seus hotéis favoritos a ganhar exposição",
      benefit4: "Desfrute de estadias grátis em propriedades excepcionais",
      referHotel: "Indicar um Hotel",
      importantRegistrationWindow: "Importante: Janela de Registro de 15 Dias",
      registrationInfo: "Após sua indicação, o hotel deve se registrar dentro de 15 dias corridos para você receber a recompensa de três noites grátis.",
      makeIntroduction: "Certifique-se de apresentar pessoalmente o hotel à nossa plataforma e incentivá-lo a se inscrever prontamente.",
      hotelName: "Nome do Hotel",
      enterHotelName: "Digite o nome do hotel",
      cityOptional: "Cidade (Opcional)",
      enterCity: "Digite o nome da cidade",
      contactPerson: "Pessoa de Contato",
      enterContactPerson: "Digite o nome da pessoa de contato",
      contactEmail: "Email de Contato",
      enterContactEmail: "Digite o email de contato"
    },
    
    ambassador: {
      title: "Torne-se um Embaixador",
      subtitle: "Seja recompensado por indicações bem-sucedidas",
      earnRewards: "Ganhe Recompensas",
      earnRewardsDesc: "Seja recompensado por indicações bem-sucedidas",
      shareHotels: "Compartilhe Hotéis",
      shareHotelsDesc: "Recomende hotéis incríveis para viajantes",
      buildNetwork: "Construa Rede",
      buildNetworkDesc: "Conecte-se com hotéis e viajantes",
      ambassadorApplication: "Aplicação de Embaixador",
      name: "Nome",
      email: "Email",
      additionalMessage: "Mensagem Adicional (Opcional)",
      interestedBecoming: "Estou interessado em me tornar um embaixador e aprender mais sobre esta oportunidade.",
      submitApplication: "Enviar Aplicação"
    },
    
    history: {
      title: "Histórico",
      subtitle: "Veja seu histórico completo de reservas e atividades"
    },
    
    payments: {
      title: "Pagamentos",
      subtitle: "Gerencie seus métodos de pagamento e informações de cobrança"
    },
    
    profile: {
      title: "Perfil",
      subtitle: "Gerencie suas informações pessoais e preferências"
    },
    
    settings: {
      title: "Configurações",
      subtitle: "Personalize as preferências da sua conta e configurações de privacidade",
      themePreferences: "Preferências de Tema",
      selectThemesDesc: "Selecione temas que lhe interessam para obter recomendações de hotel personalizadas",
      favoriteThemes: "Seus Temas Favoritos",
      favoriteThemesDesc: "Selecione os temas que mais lhe interessam para ver recomendações personalizadas",
      noThemesSelected: "Nenhum tema selecionado ainda",
      selectTheme: "Selecionar um Tema",
      browseAvailableThemes: "Navegar Temas Disponíveis",
      exploreCollection: "Explore nossa coleção curada de experiências hoteleiras temáticas",
      natureOutdoors: "Natureza e Atividades ao Ar Livre",
      culturalExperiences: "Experiências Culturais",
      wellnessLifestyle: "Bem-estar e Estilo de Vida",
      professionalEducation: "Profissional e Educação",
      specialInterests: "Interesses Especiais",
      suggestNewTheme: "Sugerir um Novo Tema",
      suggestThemeDesc: "Não vê um tema que combine com seus interesses? Sugira um novo!",
      themeName: "Nome do Tema",
      themeDescription: "Descrição do Tema",
      submitThemeSuggestion: "Enviar Sugestão de Tema",
      languagePreferences: "Preferências de Idioma",
      chooseLanguage: "Escolha seu idioma preferido para a aplicação",
      preferredLanguage: "Idioma Preferido"
    },
    
    notifications: {
      title: "Notificações",
      subtitle: "Mantenha-se atualizado com sua última atividade e mensagens"
    },
    
    navigation: {
      dashboard: "Painel",
      bookings: "Reservas",
      experience: "Experiência",
      joinGroup: "Participar de um Grupo",
      threeNights: "Obter Três Noites",
      becomeAmbassador: "Tornar-se Embaixador",
      history: "Histórico",
      payments: "Pagamentos",
      profile: "Perfil",
      settings: "Configurações",
      notifications: "Notificações",
      logout: "Sair"
    },
    
    support: {
      helpDesk: "Central de Ajuda",
      supportTeamAvailable: "Nossa equipe de suporte está disponível 24/7 para ajudar com qualquer dúvida ou preocupação.",
      contactSupport: "Contatar Suporte"
    }
  },
  
  ro: {
    // Dashboard main content in Romanian
    dashboard: {
      welcome: "Bine ai revenit",
      stats: "Statisticile Tale",
      general: "General",
      myExperience: "Experiența Mea",
      discoverJourney: "Descoperă călătoria ta cu Hotel-Living și vezi cât de departe ai călătorit.",
      yourMilestones: "Rezultatele Tale",
      startJourney: "Începe călătoria ta pentru a debloca realizări!",
      travelSummary: "Rezumat Călătorii",
      totalStays: "Șederi Totale",
      citiesVisited: "Orașe Vizitate",
      daysBooked: "Zile Rezervate",
      totalSpent: "Total Cheltuit",
      topAffinities: "Afinități Principale",
      addAffinities: "Adaugă afinități la profilul tău pentru a-ți vedea preferințele aici.",
      visitedDestinations: "Destinații Vizitate",
      travelDestinations: "Destinațiile tale de călătorie vor apărea aici după prima ta ședere.",
      timelineBookings: "Cronologia Rezervărilor",
      bookingHistory: "Istoricul rezervărilor tale va apărea aici după prima ta ședere.",
      readyNextAdventure: "Gata pentru următoarea aventură?",
      exploreHotels: "Explorează Hoteluri"
    },
    
    bookings: {
      title: "Rezervări",
      subtitle: "Gestionează rezervările tale de hotel și șederile viitoare"
    },
    
    experience: {
      title: "Experiență",
      subtitle: "Urmărește călătoria ta de călătorie și realizările"
    },
    
    groups: {
      title: "Alătură-te unui Grup",
      myGroupMemberships: "Calitățile Mele de Membru în Grup",
      noGroupsYet: "Nu te-ai alăturat încă niciunui grup. Navighează grupurile disponibile de mai jos pentru a începe!",
      availableGroups: "Grupuri Disponibile",
      joinGroupLeaderCode: "Alătură-te Grupului cu Codul Liderului",
      enterGroupCode: "Introdu codul grupului (ex., HT245)",
      groupName: "Numele grupului",
      requestJoinGroup: "Solicită Alăturarea la Grup"
    },
    
    threeNights: {
      title: "Programul Trei Nopți Gratuite",
      subtitle: "Programul nostru de Trei Nopți Gratuite te recompensează pentru că ne ajuți să creștem comunitatea Hotel-Living. Pentru fiecare hotel pe care îl prezinți personal platformei noastre și care se alătură în 15 zile, vei câștiga trei nopți gratuite.",
      howItWorks: "Cum funcționează:",
      step1: "Recomandă hotelurile pe care le iubești și prezintă-le personal la Hotel-Living",
      step2: "Hotelul trebuie să se înregistreze pe platforma noastră în 15 zile de la recomandarea ta",
      step3: "Odată verificat, vei primi credite pentru trei nopți gratuite",
      step4: "Folosește nopțile gratuite la orice hotel participant în platforma noastră",
      rewardProgram: "Acest program recompensează recomandările personale și networking-ul. După 15 zile, oportunitățile mari de înregistrare sunt închise. Nu există limită pentru câte hoteluri poți recomanda sau câte nopți poți câștiga!",
      benefits: "Beneficii:",
      benefit1: "Câștigă trei nopți gratuite per recomandare de succes",
      benefit2: "Fără limită pentru câte hoteluri poți recomanda",
      benefit3: "Ajută hotelurile tale preferate să câștige expunere",
      benefit4: "Bucură-te de șederi gratuite la proprietăți excepționale",
      referHotel: "Recomandă un Hotel",
      importantRegistrationWindow: "Important: Fereastra de Înregistrare de 15 Zile",
      registrationInfo: "După recomandarea ta, hotelul trebuie să se înregistreze în 15 zile calendaristice pentru ca tu să primești recompensa de trei nopți gratuite.",
      makeIntroduction: "Asigură-te să prezinți personal hotelul platformei noastre și să îl încurajezi să se înscrie prompt.",
      hotelName: "Numele Hotelului",
      enterHotelName: "Introdu numele hotelului",
      cityOptional: "Orașul (Opțional)",
      enterCity: "Introdu numele orașului",
      contactPerson: "Persoana de Contact",
      enterContactPerson: "Introdu numele persoanei de contact",
      contactEmail: "Email-ul de Contact",
      enterContactEmail: "Introdu email-ul de contact"
    },
    
    ambassador: {
      title: "Devino Ambasador",
      subtitle: "Fii recompensat pentru recomandări de succes",
      earnRewards: "Câștigă Recompense",
      earnRewardsDesc: "Fii recompensat pentru recomandări de succes",
      shareHotels: "Împărtășește Hoteluri",
      shareHotelsDesc: "Recomandă hoteluri uimitoare călătorilor",
      buildNetwork: "Construiește Rețea",
      buildNetworkDesc: "Conectează-te cu hoteluri și călători",
      ambassadorApplication: "Aplicație Ambasador",
      name: "Nume",
      email: "Email",
      additionalMessage: "Mesaj Adițional (Opțional)",
      interestedBecoming: "Sunt interesant să devin ambasador și să aflu mai multe despre această oportunitate.",
      submitApplication: "Trimite Aplicația"
    },
    
    history: {
      title: "Istoric",
      subtitle: "Vezi istoricul complet al rezervărilor și activităților tale"
    },
    
    payments: {
      title: "Plăți",
      subtitle: "Gestionează metodele tale de plată și informațiile de facturare"
    },
    
    profile: {
      title: "Profil",
      subtitle: "Gestionează informațiile tale personale și preferințele"
    },
    
    settings: {
      title: "Setări",
      subtitle: "Personalizează preferințele contului tău și setările de confidențialitate",
      themePreferences: "Preferințe Temă",
      selectThemesDesc: "Selectează temele care te interesează pentru a primi recomandări de hotel personalizate",
      favoriteThemes: "Temele Tale Preferate",
      favoriteThemesDesc: "Selectează temele care te interesează cel mai mult pentru a vedea recomandări personalizate",
      noThemesSelected: "Încă nu au fost selectate teme",
      selectTheme: "Selectează o Temă",
      browseAvailableThemes: "Navighează Temele Disponibile",
      exploreCollection: "Explorează colecția noastră curată de experiențe hoteliere tematice",
      natureOutdoors: "Natură și Activități în Aer Liber",
      culturalExperiences: "Experiențe Culturale",
      wellnessLifestyle: "Wellness și Stil de Viață",
      professionalEducation: "Profesional și Educație",
      specialInterests: "Interese Speciale",
      suggestNewTheme: "Sugerează o Temă Nouă",
      suggestThemeDesc: "Nu vezi o temă care să se potrivească intereselor tale? Sugerează una nouă!",
      themeName: "Numele Temei",
      themeDescription: "Descrierea Temei",
      submitThemeSuggestion: "Trimite Sugestia de Temă",
      languagePreferences: "Preferințe Limbă",
      chooseLanguage: "Alege limba ta preferată pentru aplicație",
      preferredLanguage: "Limba Preferată"
    },
    
    notifications: {
      title: "Notificări",
      subtitle: "Rămâi la curent cu ultima ta activitate și mesaje"
    },
    
    navigation: {
      dashboard: "Panou de Control",
      bookings: "Rezervări",
      experience: "Experiență",
      joinGroup: "Alătură-te unui Grup",
      threeNights: "Obține Trei Nopți",
      becomeAmbassador: "Devino Ambasador",
      history: "Istoric",
      payments: "Plăți",
      profile: "Profil",
      settings: "Setări",
      notifications: "Notificări",
      logout: "Deconectare"
    },
    
    support: {
      helpDesk: "Birou de Ajutor",
      supportTeamAvailable: "Echipa noastră de suport este disponibilă 24/7 pentru a ajuta cu orice întrebări sau preocupări.",
      contactSupport: "Contactează Suportul"
    }
  }
};

// Update translation function
function updateTranslations() {
  const localesDir = path.join(__dirname, '../src/i18n/locales');
  
  // Ensure directories exist
  ['en', 'es', 'pt', 'ro'].forEach(lang => {
    const langDir = path.join(localesDir, lang, 'dashboard');
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    // Write user dashboard translations
    const userTranslationPath = path.join(langDir, 'user.json');
    const existingTranslations = fs.existsSync(userTranslationPath) 
      ? JSON.parse(fs.readFileSync(userTranslationPath, 'utf8'))
      : {};
    
    // Merge existing with new translations
    const updatedTranslations = {
      ...existingTranslations,
      userDashboard: translations[lang]
    };
    
    fs.writeFileSync(userTranslationPath, JSON.stringify(updatedTranslations, null, 2));
    console.log(`✅ Updated ${lang} user dashboard translations`);
  });
  
  console.log('🎯 All user dashboard translations updated successfully!');
}

module.exports = { userDashboardTexts, translations, updateTranslations };