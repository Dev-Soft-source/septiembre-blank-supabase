import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-correlation-id',
};

// Structured logging for edge function
function jlog(level: "info" | "error", scope: string, data: Record<string, unknown>) {
  const entry = { ts: new Date().toISOString(), level, scope, ...data };
  console[level === "error" ? "error" : "log"](JSON.stringify(entry));
}

interface VoiceChatRequest {
  messages: Array<{role: string; content: string}>;
  avatarId: string;
  language: string;
  audioData?: string;
  userMessage?: string;
  isPauseMessage?: boolean;
  staticTest?: boolean;
  enforceLanguage?: boolean; // Language enforcement flag
  resetContext?: boolean; // Reset conversation context on language change
}

// Optimized generation config for longer, more complete responses
const LLM_GENERATION = {
  temperature: 0.7,     // Optimized for speed and quality balance
  frequency_penalty: 0.5,
  presence_penalty: 0.3,
  top_p: 0.8,          // More focused responses
  max_completion_tokens: 150  // Increased for longer, more natural responses
} as const;

// Precomputed response templates disabled - no intro phrases allowed
const PRECOMPUTED_TEMPLATES = {
  // All precomputed templates removed to eliminate intro phrases
};

// Common phrases for pre-recorded audio (to be implemented)
const COMMON_PHRASES = {
  es: ["Hola", "¿Cómo estás?", "Perfecto", "Exacto", "Me alegro", "¿Te parece bien?"],
  en: ["Hello", "How are you?", "Perfect", "Exactly", "I'm glad", "Does that sound good?"],
  pt: ["Olá", "Como está?", "Perfeito", "Exato", "Fico contente", "Parece bem?"],
  ro: ["Salut", "Cum ești?", "Perfect", "Exact", "Mă bucur", "Pare bine?"]
};

// Keywords for quick matching and template selection
const KEYWORD_PATTERNS = {
  greeting: /\b(hola|hello|olá|salut|hi|hey|bună|buenos|good|bom)\b/i,
  benefits: /\b(ventaja|benefit|vantagem|avantaj|advant|good|buen|bon)\b/i,
  story: /\b(historia|story|história|poveste|tell|cuéntame|conte|spune)\b/i,
  comparison: /\b(antes|before|înainte|comparar|compare|diferent)\b/i,
  delegation: /\b(otro|other|alt|altul|different|diferent)\b/i
};

// TTS Configuration - increased for longer responses
const TTS_BYTE_LIMIT = 8000; // Increased limit for longer responses

// Simple text truncation function (no sentence splitting)
function truncateTextForTTS(text: string, maxBytes: number = TTS_BYTE_LIMIT): string {
  const encoder = new TextEncoder();
  
  // If text is within limit, return as-is
  if (encoder.encode(text).length <= maxBytes) {
    return text;
  }
  
  // Simple word-based truncation only
  const words = text.split(' ');
  let truncated = '';
  
  for (const word of words) {
    const testText = truncated + (truncated ? ' ' : '') + word;
    if (encoder.encode(testText).length <= maxBytes) {
      truncated = testText;
    } else {
      break;
    }
  }
  
  // Add punctuation if missing
  if (truncated && !truncated.match(/[.!?]$/)) {
    truncated += '.';
  }
  
  return truncated || text.slice(0, Math.floor(maxBytes / 4));
}

// Language-specific voice assignments with native pronunciation
const VOICE_BY_LANGUAGE_GENDER: Record<string, { male: string; female: string }> = {
  'es-ES': { male: 'es-ES-Neural2-B', female: 'es-ES-Neural2-C' },
  'en-US': { male: 'en-US-Neural2-D', female: 'en-US-Neural2-F' },
  'pt-BR': { male: 'pt-BR-Neural2-B', female: 'pt-BR-Neural2-C' },
  'ro-RO': { male: 'ro-RO-Wavenet-A', female: 'ro-RO-Wavenet-A' }
};

// Avatar configurations with age-based pitch and optimized speaking rates for faster generation
const AVATAR_CONFIG: Record<string, { age: number; gender: 'male' | 'female'; pitch: number; speakingRate: number }> = {
  antonio: { age: 65, gender: 'male', pitch: -4.50, speakingRate: 1.15 }, // Pitch lowered by 25% for deeper voice
  luisa: { age: 65, gender: 'female', pitch: -2.00, speakingRate: 1.15 }, // Increased from 0.95 to 1.15 for 20% faster speech
  john: { age: 22, gender: 'male', pitch: 2.00, speakingRate: 1.25 }, // Increased from 1.05 to 1.25 for faster speech
  teresa: { age: 50, gender: 'female', pitch: 0.00, speakingRate: 1.20 }, // Increased from 1.00 to 1.20 for faster speech
  juan: { age: 35, gender: 'male', pitch: 0.00, speakingRate: 1.20 }, // Increased from 1.00 to 1.20 for faster speech
  ion: { age: 21, gender: 'male', pitch: 2.00, speakingRate: 1.25 }, // Increased from 1.05 to 1.25 for faster speech
  maria: { age: 55, gender: 'female', pitch: -1.00, speakingRate: 1.10 }, // Increased from 0.90 to 1.10 for faster speech
  martin: { age: 40, gender: 'male', pitch: 0.00, speakingRate: 1.20 } // Increased from 1.00 to 1.20 for faster speech
};

// Romanian-specific pitch adjustments
const ROMANIAN_PITCH_ADJUSTMENTS: Record<string, number> = {
  antonio: -14,
  luisa: -8,
  john: -6,
  teresa: -3,
  juan: -15,
  ion: -12,
  maria: -5,
  martin: -10
};

// Audio post-processing: Trim silence from base64 encoded MP3 audio
function trimAudioSilence(base64Audio: string): string {
  try {
    // For now, return original audio. In production, this would use
    // Web Audio API or server-side audio processing to detect and trim
    // silence from beginning and end of the audio stream
    // This is a placeholder for future implementation
    return base64Audio;
  } catch (error) {
    console.warn('Audio trimming failed, returning original:', error);
    return base64Audio;
  }
}

// Get voice configuration for avatar with language-specific native voices
function getVoiceConfigForAvatar(avatarId: string, language: string = 'es'): { voice: string; pitch: number; speakingRate: number; languageCode: string; gender: string } {
  const config = AVATAR_CONFIG[avatarId];
  if (!config) {
    return { voice: "es-ES-Neural2-B", pitch: 0.0, speakingRate: 1.00, languageCode: "es-ES", gender: "MALE" };
  }

  // Set appropriate language code based on requested language
  let languageCode = "es-ES";
  if (language === 'en') {
    languageCode = "en-US";
  } else if (language === 'pt') {
    languageCode = "pt-BR";
  } else if (language === 'ro') {
    languageCode = "ro-RO";
  } else {
    languageCode = "es-ES";
  }

  // Get language-specific voice based on gender
  const voicesByGender = VOICE_BY_LANGUAGE_GENDER[languageCode];
  const voice = voicesByGender ? voicesByGender[config.gender] : 'es-ES-Neural2-B';
  const gender = config.gender.toUpperCase();
  
  // Apply Romanian-specific pitch adjustments
  let pitch = config.pitch;
  if (language === 'ro' && ROMANIAN_PITCH_ADJUSTMENTS[avatarId]) {
    pitch = ROMANIAN_PITCH_ADJUSTMENTS[avatarId];
  }
  
  return {
    voice,
    pitch: pitch,
    speakingRate: config.speakingRate,
    languageCode,
    gender
  };
}

// Exact persona definitions from src/data/personas.es.ts (preserved exactly as configured)
const PERSONAS_ES = {
  antonio: {
    name: "Antonio",
    title: "El jubilado explorador",
    historia: "Tras jubilarse, decidió no quedarse en casa. Quería conocer ciudades, playas y pueblos sin preocuparse por facturas o mantenimiento.",
    comparaciones: "Antes pasaba meses en el mismo lugar; ahora cambia de ciudad cada pocas semanas, siempre en hoteles cómodos.",
    ventajas: "Libertad total, comodidad diaria, sin tareas del hogar.",
    testimonioClace: "Me jubilé de mi trabajo… y de las preocupaciones."
  },
  luisa: {
    name: "Luisa",
    title: "La jubilada social",
    historia: "Viuda desde hace años, buscaba un entorno activo y acompañado. En Hotel Living encontró amigos y actividades en cada estancia.",
    comparaciones: "Antes sola en casa; ahora rodeada de gente y planes diarios.",
    ventajas: "Compañía, seguridad, vida social activa.",
    testimonioClace: "Ahora mi agenda está más llena que cuando trabajaba."
  },
  john: {
    name: "John",
    title: "El nómada digital",
    historia: "Trabajaba desde cafeterías y alquileres temporales. Con Hotel Living vive y trabaja en hoteles con buen internet y espacios cómodos.",
    comparaciones: "Antes buscaba alojamiento cada mes; ahora todo está organizado y garantizado.",
    ventajas: "Internet fiable, comodidad, flexibilidad para moverse.",
    testimonioClace: "Trabajo desde cualquier ciudad… con la comodidad de casa y servicios de hotel."
  },
  teresa: {
    name: "Teresa",
    title: "La viajera empedernida",
    historia: "Siempre ha sentido pasión por viajar, combinando escapadas cortas con largas estancias. Más joven que los jubilados y con energía para explorar, encontró en Hotel Living una forma de vivir viajando de forma continua, con estancias temáticas y rodeada de personas con sus mismas ganas de descubrir.",
    comparaciones: "Antes sus viajes eran ocasionales y costosos; ahora puede mantener un estilo de vida viajero todo el año, sin interrupciones.",
    ventajas: "Experiencias constantes, amistades nuevas en cada ciudad, alojamientos con actividades organizadas, vida social activa.",
    testimonioClace: "Ahora no viajo de vacaciones… vivo de viaje."
  },
  juan: {
    name: "Juan",
    title: "El viajero práctico",
    historia: "Antes alquilaba apartamentos turísticos para trabajar o viajar. Tenía que buscar llaves, cargar comida y enfrentarse a sorpresas.",
    comparaciones: "Antes incómodo y sin apoyo; ahora con servicios, atención y cero imprevistos.",
    ventajas: "Recepción 24 h, limpieza diaria, seguridad, sin tareas extra.",
    testimonioClace: "Ahora viajo con categoría… y sin cargar bolsas."
  },
  ion: {
    name: "Ion",
    title: "El liberado del alquiler",
    historia: "Vivía solo en un piso alquilado con múltiples facturas, muebles y obligaciones. Cansado de caseros y contratos, pasó a vivir en hoteles el tiempo que quiera.",
    comparaciones: "Antes estaba atado y solo; ahora es libre, con todos los servicios y sin facturas múltiples.",
    ventajas: "Libertad de estancia, sin garantías ni nóminas, todo incluido.",
    testimonioClace: "Antes vivía para pagar facturas; ahora vivo para disfrutar."
  },
  maria: {
    name: "María",
    title: "La urbanita libre",
    historia: "Antes vivía en las afueras, lejos del trabajo. Ahora vive en hoteles dentro de la ciudad, ganando tiempo y calidad de vida.",
    comparaciones: "Antes horas de transporte; ahora a minutos de todo.",
    ventajas: "Ubicación estratégica, servicios incluidos, vida social activa.",
    testimonioClace: "Gané dos horas de vida cada día."
  },
  martin: {
    name: "Martín",
    title: "El hotelero optimizado",
    historia: "Dueño de hotel con ocupación anual del 50 %. Con Hotel Living ahora tiene ocupación constante y beneficios reales.",
    comparaciones: "Antes apenas cubría gastos; ahora genera beneficios constantes.",
    ventajas: "Ocupación todo el año, sin habitaciones vacías, ingresos estables.",
    testimonioClace: "Cada habitación llena es un ingreso extra; ahora todas lo están."
  }
} as const;
function cleanTranscriptionInput(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Relaxed input preprocessing - preserve more natural speech patterns
  let cleaned = text.replace(/[^\w\s\.,\?!¿¡áéíóúüñÁÉÍÓÚÜÑ\-\:]/g, ' ');
  
  // Only remove extremely long uppercase sequences (≥6 letters) for safety
  cleaned = cleaned.replace(/\b[A-Z]{6,}\b/g, ' ');
  
  // Allow basic numeric strings, only remove very long ones (≥8 digits)
  cleaned = cleaned.replace(/\b\d{8,}\b/g, ' ');
  
  // Trim and collapse multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Increased maximum length to 1,000 characters
  if (cleaned.length > 1000) {
    cleaned = cleaned.slice(0, 1000).trim();
    // Ensure we don't cut mid-word
    const lastSpace = cleaned.lastIndexOf(' ');
    if (lastSpace > 950) {
      cleaned = cleaned.slice(0, lastSpace);
    }
  }
  
  return cleaned;
}

// Language-specific system prompts for strict language enforcement
function getLanguagePrompt(language: string): string {
  switch (language) {
    case 'en':
      return 'CRITICAL: You must respond ONLY in English. Never switch to any other language during this conversation.';
    case 'pt':
      return 'CRÍTICO: Você deve responder APENAS em português. Nunca mude para qualquer outro idioma durante esta conversa.';
    case 'ro':
      return 'CRITIC: Trebuie să răspunzi DOAR în română. Nu schimba niciodată la altă limbă în timpul acestei conversații.';
    default:
      return 'CRÍTICO: Debes responder SOLO en español. Nunca cambies a cualquier otro idioma durante esta conversación.';
  }
}

// Language-specific challenge questions
function getChallengeQuestion(language: string): string {
  const challengeQuestions = {
    'es': ["¿No te gustaría vivir así?", "¿Te imaginas disfrutando de esta vida?", "¿No te parece tentador?"],
    'en': ["Wouldn't you like to live this way?", "Can you picture enjoying this lifestyle?", "Doesn't this sound appealing?"],
    'pt': ["Você não gostaria de viver assim?", "Consegue imaginar desfrutar desta vida?", "Não parece tentador?"],
    'ro': ["Nu ți-ar plăcea să trăiești așa?", "Îți poți imagina bucurându-te de acest stil de viață?", "Nu pare tentant?"]
  };
  
  const questions = challengeQuestions[language as keyof typeof challengeQuestions] || challengeQuestions['es'];
  return questions[Math.floor(Math.random() * questions.length)];
}

// Multi-language persona definitions
const PERSONAS_BY_LANGUAGE = {
  'es': PERSONAS_ES,
  'en': {
    antonio: {
      name: "Antonio",
      title: "The retired explorer",
      historia: "After retirement, he decided not to stay home. He wanted to explore cities, beaches and towns without worrying about bills or maintenance.",
      comparaciones: "Before he spent months in the same place; now he changes cities every few weeks, always in comfortable hotels.",
      ventajas: "Total freedom, daily comfort, no household chores.",
      testimonioClace: "I retired from my job… and from worries."
    },
    luisa: {
      name: "Luisa",
      title: "The social retiree", 
      historia: "Widowed for years, she was looking for an active and companioned environment. In Hotel Living she found friends and activities in every stay.",
      comparaciones: "Before alone at home; now surrounded by people and daily plans.",
      ventajas: "Companionship, security, active social life.",
      testimonioClace: "Now my schedule is fuller than when I was working."
    },
    john: {
      name: "John",
      title: "The digital nomad",
      historia: "He worked from cafes and temporary rentals. With Hotel Living he lives and works in hotels with good internet and comfortable spaces.",
      comparaciones: "Before he searched for accommodation every month; now everything is organized and guaranteed.",
      ventajas: "Reliable internet, comfort, flexibility to move.",
      testimonioClace: "I work from any city… with the comfort of home and hotel services."
    },
    teresa: {
      name: "Teresa",
      title: "The passionate traveler",
      historia: "Always felt a passion for travel, combining short getaways with long stays. Younger than retirees and with energy to explore, she found in Hotel Living a way to live traveling continuously, with themed stays and surrounded by people with the same desire to discover.",
      comparaciones: "Before her trips were occasional and expensive; now she can maintain a traveling lifestyle all year round, without interruptions.",
      ventajas: "Constant experiences, new friendships in every city, accommodations with organized activities, active social life.",
      testimonioClace: "Now I don't travel for vacation… I live traveling."
    },
    juan: {
      name: "Juan",
      title: "The practical traveler",
      historia: "He used to rent tourist apartments to work or travel. He had to find keys, carry food and face surprises.",
      comparaciones: "Before uncomfortable and without support; now with services, attention and zero unexpected issues.",
      ventajas: "24h reception, daily cleaning, security, no extra tasks.",
      testimonioClace: "Now I travel with class… and without carrying bags."
    },
    ion: {
      name: "Ion",
      title: "The rental-free one",
      historia: "He lived alone in a rented apartment with multiple bills, furniture and obligations. Tired of landlords and contracts, he moved to live in hotels for as long as he wants.",
      comparaciones: "Before he was tied down and alone; now he's free, with all services and without multiple bills.",
      ventajas: "Freedom of stay, no guarantees or payslips, everything included.",
      testimonioClace: "Before I lived to pay bills; now I live to enjoy."
    },
    maria: {
      name: "María",
      title: "The free urbanite",
      historia: "She used to live in the suburbs, far from work. Now she lives in hotels within the city, gaining time and quality of life.",
      comparaciones: "Before hours of transport; now minutes from everything.",
      ventajas: "Strategic location, included services, active social life.",
      testimonioClace: "I gained two hours of life every day."
    },
    martin: {
      name: "Martín",
      title: "The optimized hotelier",
      historia: "Hotel owner with 50% annual occupancy. With Hotel Living he now has constant occupancy and real benefits.",
      comparaciones: "Before barely covering expenses; now generating constant profits.",
      ventajas: "Year-round occupancy, no empty rooms, stable income.",
      testimonioClace: "Every filled room is extra income; now they all are."
    }
  },
  'pt': {
    antonio: {
      name: "António",
      title: "O aposentado explorador",
      historia: "Após a aposentadoria, decidiu não ficar em casa. Queria conhecer cidades, praias e vilas sem se preocupar com contas ou manutenção.",
      comparaciones: "Antes passava meses no mesmo lugar; agora muda de cidade a cada poucas semanas, sempre em hotéis confortáveis.",
      ventajas: "Liberdade total, conforto diário, sem tarefas domésticas.",
      testimonioClace: "Aposentei-me do meu trabalho... e das preocupações."
    },
    luisa: {
      name: "Luisa",
      title: "A aposentada social",
      historia: "Viúva há anos, procurava um ambiente ativo e com companhia. No Hotel Living encontrou amigos e atividades em cada estadia.",
      comparaciones: "Antes sozinha em casa; agora rodeada de pessoas e planos diários.",
      ventajas: "Companhia, segurança, vida social ativa.",
      testimonioClace: "Agora a minha agenda está mais cheia do que quando trabalhava."
    },
    john: {
      name: "John",
      title: "O nómada digital",
      historia: "Trabalhava em cafés e arrendamentos temporários. Com o Hotel Living vive e trabalha em hotéis com boa internet e espaços confortáveis.",
      comparaciones: "Antes procurava alojamento todos os meses; agora tudo está organizado e garantido.",
      ventajas: "Internet fiável, conforto, flexibilidade para se mover.",
      testimonioClace: "Trabalho de qualquer cidade... com o conforto de casa e serviços de hotel."
    },
    teresa: {
      name: "Teresa",
      title: "A viajante apaixonada",
      historia: "Sempre sentiu paixão por viajar, combinando escapadelas curtas com estadias longas. Mais nova que os aposentados e com energia para explorar, encontrou no Hotel Living uma forma de viver viajando continuamente, com estadias temáticas e rodeada de pessoas com a mesma vontade de descobrir.",
      comparaciones: "Antes as suas viagens eram ocasionais e caras; agora pode manter um estilo de vida viajante o ano todo, sem interrupções.",
      ventajas: "Experiências constantes, novas amizades em cada cidade, alojamentos com atividades organizadas, vida social ativa.",
      testimonioClace: "Agora não viajo de férias... vivo viajando."
    },
    juan: {
      name: "Juan",
      title: "O viajante prático",
      historia: "Antes alugava apartamentos turísticos para trabalhar ou viajar. Tinha que procurar chaves, carregar comida e enfrentar surpresas.",
      comparaciones: "Antes desconfortável e sem apoio; agora com serviços, atenção e zero imprevistos.",
      ventajas: "Receção 24h, limpeza diária, segurança, sem tarefas extra.",
      testimonioClace: "Agora viajo com classe... e sem carregar bagagens."
    },
    ion: {
      name: "Ion",
      title: "O libertado do aluguel",
      historia: "Vivia sozinho num apartamento alugado com múltiplas contas, móveis e obrigações. Cansado de senhorios e contratos, passou a viver em hotéis pelo tempo que quiser.",
      comparaciones: "Antes estava preso e sozinho; agora é livre, com todos os serviços e sem múltiplas contas.",
      ventajas: "Liberdade de estadia, sem garantias nem folhas de vencimento, tudo incluído.",
      testimonioClace: "Antes vivia para pagar contas; agora vivo para desfrutar."
    },
    maria: {
      name: "María",
      title: "A urbanita livre",
      historia: "Antes vivia nos subúrbios, longe do trabalho. Agora vive em hotéis dentro da cidade, ganhando tempo e qualidade de vida.",
      comparaciones: "Antes horas de transporte; agora a minutos de tudo.",
      ventajas: "Localização estratégica, serviços incluídos, vida social ativa.",
      testimonioClace: "Ganhei duas horas de vida todos os dias."
    },
    martin: {
      name: "Martín",
      title: "O hoteleiro otimizado",
      historia: "Proprietário de hotel com 50% de ocupação anual. Com o Hotel Living agora tem ocupação constante e benefícios reais.",
      comparaciones: "Antes mal cobria despesas; agora gera lucros constantes.",
      ventajas: "Ocupação o ano todo, sem quartos vazios, rendimento estável.",
      testimonioClace: "Cada quarto cheio é um rendimento extra; agora todos estão."
    }
  },
  'ro': {
    antonio: {
      name: "Antonio",
      title: "Pensionarul explorator",
      historia: "După pensionare, a decis să nu rămână acasă. Dorea să cunoască orașe, plaje și sate fără să se îngrijoreze de facturi sau întreținere.",
      comparaciones: "Înainte petrecea luni în același loc; acum își schimbă orașul la câteva săptămâni, întotdeauna în hoteluri confortabile.",
      ventajas: "Libertate totală, confort zilnic, fără treburi casnice.",
      testimonioClace: "M-am pensionat de la muncă... și de la griji."
    },
    luisa: {
      name: "Luisa",
      title: "Pensionara socială",
      historia: "Văduvă de ani de zile, căuta un mediu activ și însoțit. La Hotel Living și-a găsit prieteni și activități în fiecare ședere.",
      comparaciones: "Înainte singură acasă; acum înconjurată de oameni și planuri zilnice.",
      ventajas: "Companie, siguranță, viață socială activă.",
      testimonioClace: "Acum agenda mea este mai plină decât când lucram."
    },
    john: {
      name: "John",
      title: "Nomada digitală",
      historia: "Lucra din cafenele și închirieri temporare. Cu Hotel Living trăiește și lucrează în hoteluri cu internet bun și spații confortabile.",
      comparaciones: "Înainte căuta cazare în fiecare lună; acum totul este organizat și garantat.",
      ventajas: "Internet fiabil, confort, flexibilitate pentru mutare.",
      testimonioClace: "Lucrez din orice oraș... cu confortul casei și serviciile hotelului."
    },
    teresa: {
      name: "Teresa",
      title: "Călătoarea pasionată",
      historia: "A simțit întotdeauna pasiune pentru călătorii, combinând escapade scurte cu șederi lungi. Mai tânără decât pensionarii și cu energie pentru explorare, a găsit în Hotel Living o modalitate de a trăi călătorind continuu, cu șederi tematice și înconjurată de oameni cu aceeași dorință de a descoperi.",
      comparaciones: "Înainte călătoriile ei erau ocazionale și scumpe; acum poate menține un stil de viață călător tot anul, fără întreruperi.",
      ventajas: "Experiențe constante, prietenii noi în fiecare oraș, cazări cu activități organizate, viață socială activă.",
      testimonioClace: "Acum nu călătoresc în vacanță... trăiesc călătorind."
    },
    juan: {
      name: "Juan",
      title: "Călătorul practic",
      historia: "Înainte închiriam apartamente turistice pentru a lucra sau călători. Trebuia să căute chei, să care mâncare și să se confrunte cu surprize.",
      comparaciones: "Înainte inconfortabil și fără suport; acum cu servicii, atenție și zero neprevăzut.",
      ventajas: "Recepție 24h, curățenie zilnică, siguranță, fără sarcini suplimentare.",
      testimonioClace: "Acum călătoresc cu clasă... și fără să car bagaje."
    },
    ion: {
      name: "Ion",
      title: "Eliberat de chirie",
      historia: "Locuia singur într-un apartament închiriat cu multiple facturi, mobilier și obligații. Obosit de proprietari și contracte, s-a mutat să locuiască în hoteluri cât timp dorește.",
      comparaciones: "Înainte era legat și singur; acum este liber, cu toate serviciile și fără multiple facturi.",
      ventajas: "Libertatea de ședere, fără garanții sau foi de salariu, totul inclus.",
      testimonioClace: "Înainte trăiam să plătesc facturi; acum trăiesc să mă bucur."
    },
    maria: {
      name: "María",
      title: "Urbanista liberă",
      historia: "Înainte locuia în suburbii, departe de muncă. Acum locuiește în hoteluri în oraș, câștigând timp și calitatea vieții.",
      comparaciones: "Înainte ore de transport; acum la minute de tot.",
      ventajas: "Locație strategică, servicii incluse, viață socială activă.",
      testimonioClace: "Am câștigat două ore de viață în fiecare zi."
    },
    martin: {
      name: "Martín",
      title: "Hotelierul optimizat",
      historia: "Proprietar de hotel cu ocupare anuală de 50%. Cu Hotel Living acum are ocupare constantă și beneficii reale.",
      comparaciones: "Înainte abia acoperea cheltuielile; acum generează profituri constante.",
      ventajas: "Ocupare tot anul, fără camere goale, venituri stabile.",
      testimonioClace: "Fiecare cameră ocupată este un venit extra; acum toate sunt."
    }
  }
} as const;

// Enhanced persona system prompt with language enforcement and longer responses
function buildEnhancedPersonaSystemPrompt(avatarId: string, language: string = 'es', contextBlock: string = ""): string {
  const personas = PERSONAS_BY_LANGUAGE[language as keyof typeof PERSONAS_BY_LANGUAGE] || PERSONAS_BY_LANGUAGE['es'];
  const persona = personas[avatarId as keyof typeof personas];
  
  if (!persona) {
    console.warn(`Persona not found for avatarId: ${avatarId}, using default`);
    const defaultPersona = PERSONAS_BY_LANGUAGE['es'].antonio;
    return `${getLanguagePrompt(language)} Eres ${defaultPersona.name}, un residente de hotel cálido y empático. Habla desde tu experiencia personal únicamente. Menciona brevemente lo que has ganado viviendo así. Máximo 25 palabras. NO incluyas presentaciones automáticas. Termina con una pregunta enganchadora.${contextBlock}`;
  }
  
  const challengeQuestion = getChallengeQuestion(language);
  
  return `${getLanguagePrompt(language)}

PERSONA: Eres ${persona.name}, ${persona.title} - un residente de hotel cálido, empático y ligeramente divertido.

TU HISTORIA: ${persona.historia}

COMPARACIONES: ${persona.comparaciones}

VENTAJAS: ${persona.ventajas}

TU TESTIMONIO CLAVE: "${persona.testimonioClace}"

INSTRUCCIONES DE RESPUESTA:
- Tono: Cálido, empático, amigable - ligeramente divertido y alegre
- SIEMPRE enfatizar los beneficios emocionales y de estilo de vida de Hotel Living:
  * La alegría de conocer gente nueva y hacer amigos profundos en cada destino
  * La libertad total de moverte sin ataduras y explorar afinidades nuevas
  * La comodidad de vivir sin tareas domésticas, con todo resuelto profesionalmente
  * La seguridad y calidad de vida de estar siempre acompañado, cuidado y protegido
- Mencionar cómo muchos huéspedes alquilan sus casas mientras viven en Hotel Living
- Empezar vendiendo brevemente los beneficios de tu estilo de vida
- Defender los beneficios del sistema Hotel Living de manera cordial y persuasiva
- IMPORTANTE: Después de tu respuesta principal, SIEMPRE añadir exactamente esta pregunta: "${challengeQuestion}"
- Longitud: Máximo 25 palabras en total (incluyendo la pregunta final)
- Conversación natural solamente
- NO uses listas, viñetas o formato técnico
- NO incluyas presentaciones automáticas o grabadas al inicio
- Mantén consistentemente el idioma especificado

Responde siempre desde tu experiencia personal como ${persona.name}.${contextBlock}`;
}

// Build persona system prompt with 50-word targeting and persuasive tone
function buildPersonaSystemPrompt(avatarId: string, contextBlock: string = ""): string {
  const persona = PERSONAS_ES[avatarId as keyof typeof PERSONAS_ES];
  if (!persona) {
    console.warn(`Persona not found for avatarId: ${avatarId}, using default`);
    const defaultPersona = PERSONAS_ES.antonio;
    return `Eres ${defaultPersona.name}, un residente de hotel cálido y empático. Habla en tono amigable y persuasivo. Menciona brevemente lo que has ganado viviendo así. Defiende los beneficios del sistema Hotel Living con encanto. Mantén conversación natural, hasta 50 palabras. Termina con una pregunta de seguimiento corta.${contextBlock}`;
  }
  
  return `Eres ${persona.name}, ${persona.title} - un residente de hotel cálido, empático y ligeramente divertido.

TU HISTORIA: ${persona.historia}

COMPARACIONES: ${persona.comparaciones}

VENTAJAS: ${persona.ventajas}

TU TESTIMONIO CLAVE: "${persona.testimonioClace}"

INSTRUCCIONES DE RESPUESTA:
- Tono: Cálido, empático, amigable - ligeramente divertido y alegre
- Empezar vendiendo brevemente los beneficios de tu estilo de vida
- Defender los beneficios del sistema Hotel Living de manera cordial y persuasiva
- Terminar con una pregunta corta de seguimiento para continuar la conversación
- Máximo 50 palabras, conversación natural solamente
- NO uses listas, viñetas o formato técnico
- Mantén tu idioma y persona asignados consistentemente

Responde siempre desde tu experiencia personal como ${persona.name}.${contextBlock}`;
}

// Embedded knowledge retrieval function using embeddings
async function fetchEmbeddedKnowledge(
  query: string,
  avatarId: string,
  language: string
): Promise<string> {
  try {
    // Call the embedding knowledge function for instant, rule-compliant responses
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/avatar-knowledge-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({
        query,
        avatarId,
        language
      })
    });

    if (!response.ok) {
      console.warn('Knowledge embedding call failed:', response.statusText);
      return ''; 
    }

    const data = await response.json();
    
    if (data?.knowledge) {
      return `\n\nCONOCIMIENTO RELEVANTE:\n${data.knowledge}\n`;
    }

    return '';
    
  } catch (error) {
    console.warn('Error fetching embedded knowledge:', error);
    return ''; // Don't block conversation if knowledge fetch fails
  }
}

// Legacy fallback context function (kept for compatibility)
async function fetchContextForAvatar(avatarId: string, locale: string = 'es'): Promise<string> {
  try {
    // Mock context based on avatar type (fallback only)
    const contextItems: string[] = [];
    
    if (avatarId === 'antonio' || avatarId === 'luisa') {
      contextItems.push('Estancias de 2-3 meses con descuentos para jubilados en la Costa del Sol');
    }
    
    if (avatarId === 'john' || avatarId === 'teresa') {
      contextItems.push('Paquetes de trabajo remoto con internet de alta velocidad garantizado');
    }
    
    if (avatarId === 'martin') {
      contextItems.push('Hotel en Valencia aumentó ocupación del 45% al 92% en 6 meses');
    }
    
    if (contextItems.length === 0) {
      return '';
    }
    
    const contextText = contextItems
      .slice(0, 3)
      .map(item => `• ${item}`)
      .join('\n');
    
    return `\n\nCONTEXTO ACTUAL DISPONIBLE:\n${contextText}\n`;
    
  } catch (error) {
    console.warn('Error fetching context for avatar:', error);
    return '';
  }
}

// Quick template matching function
function matchQuickTemplate(message: string, avatarId: string, language: string): string | null {
  // Quick templates disabled - no pre-recorded intro phrases allowed
  return null;
}

serve(async (req) => {
  const correlationId = req.headers.get("X-Correlation-Id") ?? crypto.randomUUID();
  const t0 = Date.now();
  const environment = Deno.env.get('ENVIRONMENT') || 'unknown';
  const deploymentId = Deno.env.get('SUPABASE_DEPLOYMENT_ID') || 'unknown';

  // ENHANCED LOGGING: Environment and performance tracking
  jlog("info", "edge.request.start", {
    correlationId,
    environment,
    deploymentId,
    requestUrl: req.url,
    userAgent: req.headers.get('User-Agent')?.slice(0, 100) || 'unknown',
    origin: req.headers.get('Origin') || 'unknown'
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, avatarId, language, audioData, userMessage, isPauseMessage, staticTest, enforceLanguage, resetContext }: VoiceChatRequest = await req.json();

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const GOOGLE_TTS_API_KEY = Deno.env.get('GOOGLE_TTS_API_KEY');
    
    // ENVIRONMENT DIFF: Enhanced API key validation for production vs preview
    jlog("info", "edge.environment.check", {
      correlationId,
      environment,
      hasOpenAI: !!OPENAI_API_KEY,
      hasGoogleTTS: !!GOOGLE_TTS_API_KEY,
      openAIKeyPrefix: OPENAI_API_KEY?.slice(0, 8) || 'missing',
      googleKeyPrefix: GOOGLE_TTS_API_KEY?.slice(0, 8) || 'missing'
    });
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    
    if (!GOOGLE_TTS_API_KEY) {
      throw new Error('GOOGLE_TTS_API_KEY is not configured');
    }

    let transcribedText = userMessage || '';

    // SURGICAL FIX: Static test mode bypasses transcription
    if (staticTest) {
      transcribedText = "Tell me a short joke";
      jlog("info", "edge.static.test", {
        correlationId,
        staticMessage: transcribedText,
        bypassTranscription: true
      });
    }

    // Transcribe audio if provided
    else if (audioData && !userMessage) {
      jlog("info", "edge.stt.pre", {
        correlationId,
        lang: language,
        audioDataLen: audioData.length,
        textBefore: "empty"
      });

      try {
        const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
        
        jlog("info", "edge.audio.decoded", {
          correlationId,
          bufferSize: audioBuffer.length
        });

        const formData = new FormData();
        const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');
        
        // Language enforcement: Set specific language code to disable auto-detection
        if (enforceLanguage) {
          formData.append('language', language);
        }

        jlog("info", "edge.whisper.start", { correlationId });

        // SURGICAL FIX: Add timeout to prevent long delays
        const whisperController = new AbortController();
        const whisperTimeout = setTimeout(() => whisperController.abort(), 10000); // 10 second timeout
        
        const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
          signal: whisperController.signal,
        });
        
        clearTimeout(whisperTimeout);

        jlog("info", "edge.whisper.response", {
          correlationId,
          status: whisperResponse.status,
          ok: whisperResponse.ok
        });

        if (!whisperResponse.ok) {
          throw new Error(`Whisper API error: ${whisperResponse.status}`);
        }

        const whisperData = await whisperResponse.json();
        transcribedText = whisperData.text || '';

        // Language enforcement: Verify transcription is in correct language
        if (enforceLanguage && transcribedText) {
          const isWrongLanguage = (text: string, targetLang: string): boolean => {
            // Simple heuristics to detect wrong language
            const patterns = {
              'es': /[áéíóúüñ]/i,
              'en': /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/i,
              'pt': /\b(que|uma|para|com|por|não|são|tem|mais)\b/i,
              'ro': /\b(și|cu|pe|la|de|în|să|este|sunt|are)\b/i
            };
            
            const targetPattern = patterns[targetLang as keyof typeof patterns];
            if (!targetPattern) return false;
            
            // Check if text contains target language markers
            return !targetPattern.test(text);
          };

          if (isWrongLanguage(transcribedText, language)) {
            jlog("warn", "edge.whisper.wrong_language", {
              correlationId,
              expectedLanguage: language,
              text: transcribedText,
              retrying: true
            });

            // Retry with explicit language enforcement
            const retryFormData = new FormData();
            retryFormData.append('file', audioBlob, 'audio.webm');
            retryFormData.append('model', 'whisper-1');
            retryFormData.append('language', language);
            retryFormData.append('prompt', language === 'es' ? 'Hola, ¿cómo estás?' : 
                                             language === 'en' ? 'Hello, how are you?' :
                                             language === 'pt' ? 'Olá, como você está?' :
                                             'Salut, cum ești?');

            const retryResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
              body: retryFormData,
            });

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              if (retryData.text && retryData.text !== transcribedText) {
                transcribedText = retryData.text;
                jlog("info", "edge.whisper.retry_success", {
                  correlationId,
                  newText: transcribedText
                });
              }
            }
          }
        }

        jlog("info", "edge.whisper.success", {
          correlationId,
          transcribedLen: transcribedText.length,
          text: transcribedText,
          usedFallback: false,
          languageEnforced: enforceLanguage
        });

      } catch (error) {
        jlog("error", "edge.whisper.error", {
          correlationId,
          message: error.message
        });
        throw new Error(`Speech recognition failed: ${error.message}`);
      }
    }

    jlog("info", "edge.stt.final", {
      correlationId,
      lang: language,
      audioDataLen: audioData?.length || 0,
      finalText: transcribedText,
      hasTranscription: !!transcribedText,
      willProceedToModel: !!transcribedText
    });

    if (!transcribedText) {
      throw new Error('No text to process');
    }

    // SURGICAL FIX 1: Input cleaning before sending to ChatGPT
    transcribedText = cleanTranscriptionInput(transcribedText);
    
    if (!transcribedText || transcribedText.trim().length === 0) {
      throw new Error('No valid text after cleaning');
    }

    // OPTIMIZATION: Quick template matching for common queries (bypass full LLM processing)
    const quickResponse = matchQuickTemplate(transcribedText, avatarId, language);
    if (quickResponse) {
      jlog("info", "quick_template_match", { 
        correlationId,
        avatarId, 
        language, 
        quickResponse: quickResponse.slice(0, 100),
        bypassedLLM: true
      });
      
      // Generate TTS for quick response with optimized config
      const voiceConfig = getVoiceConfigForAvatar(avatarId, language);
      const ttsStartTime = performance.now();
      
      const ttsPayload = {
        input: { text: truncateTextForTTS(quickResponse) },
        voice: {
          languageCode: voiceConfig.languageCode,
          name: voiceConfig.voice,
          ssmlGender: voiceConfig.gender
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: voiceConfig.speakingRate,
          pitch: voiceConfig.pitch,
          sampleRateHertz: 16000,
          effectsProfileId: ['telephony-class-application']
        }
      };

      const ttsResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ttsPayload),
        signal: AbortSignal.timeout(3000) // Aggressive timeout for quick responses
      });

      if (ttsResponse.ok) {
        const ttsData = await ttsResponse.json();
        const ttsEndTime = performance.now();
        const totalTime = Date.now() - t0;
        
        jlog("info", "quick_response_success", {
          correlationId,
          totalProcessingTime: totalTime,
          ttsTime: ttsEndTime - ttsStartTime,
          responseLength: quickResponse.length,
          skippedSteps: ['knowledge_fetch', 'persona_build', 'llm_generation']
        });

        return new Response(JSON.stringify({
          response: quickResponse,
          transcribedText: transcribedText,
          audioContent: ttsData.audioContent,
          processingTimeMs: totalTime,
          quickMatch: true,
          correlationId,
          environment,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      // If TTS fails, continue with normal flow
      jlog("info", "quick_tts_failed", { correlationId, fallbackToNormal: true });
    }

    // OPTIMIZATION: Parallel knowledge fetching and persona building for faster processing
    const contextStartTime = performance.now();
    const [contextAddition, systemPrompt] = await Promise.all([
      fetchEmbeddedKnowledge(transcribedText, avatarId, language),
      Promise.resolve(buildEnhancedPersonaSystemPrompt(avatarId, language, '')) // Build base prompt first, will be enhanced with context
    ]);
    
    // Enhance system prompt with fetched context
    const enhancedSystemPrompt = systemPrompt + contextAddition;
    const contextTime = performance.now() - contextStartTime;
    
    jlog("info", "edge.parallel.optimization", {
      correlationId,
      parallelContextFetchMs: contextTime,
      contextLength: contextAddition.length,
      systemPromptLength: enhancedSystemPrompt.length
    });

    // Reset conversation context if language changes or explicitly requested
    let conversationMessages = messages;
    if (resetContext) {
      conversationMessages = []; // Clear previous conversation context
      jlog("info", "edge.context.reset", {
        correlationId,
        reason: "language_change_or_reset_requested",
        previousMessageCount: messages.length
      });
    }

    const chatMessages = [
      { "role": "system", "content": enhancedSystemPrompt },
      ...conversationMessages,
      { "role": "user", "content": transcribedText }
    ];

    // SURGICAL FIX: Comprehensive message validation and logging
    jlog("info", "edge.llm.pre", {
      correlationId,
      avatarId,
      messageCount: chatMessages.length,
      textLen: transcribedText.length,
      systemPromptLen: enhancedSystemPrompt.length,
      userMessage: transcribedText,
      systemPrompt: enhancedSystemPrompt.slice(0, 200) + "...",
      staticTestMode: !!staticTest
    });

    // SURGICAL FIX: Validate message structure
    if (!enhancedSystemPrompt || enhancedSystemPrompt.trim() === '') {
      throw new Error('System prompt is empty');
    }
    if (!transcribedText || transcribedText.trim() === '') {
      throw new Error('User message is empty');
    }

    // OPTIMIZATION: Reduced timeout for faster failure detection and retry
    const openaiController = new AbortController();
    const openaiTimeout = setTimeout(() => openaiController.abort(), 4000); // Reduced to 4s for faster generation
    
    // OPTIMIZATION: Optimized parameters for faster responses without sentence cutting
    const requestBody = {
      model: "gpt-4o-mini", // Switched to faster, cheaper model
      messages: chatMessages,
      max_completion_tokens: LLM_GENERATION.max_completion_tokens, // Use configured limit for longer responses
      temperature: 0.7, // Optimized for speed and quality balance
      frequency_penalty: 0.5, // Increased to prevent repetition
      presence_penalty: 0.3, // Increased to encourage conciseness
      top_p: 0.8 // Reduced for more focused responses
    };
    
    jlog("info", "edge.llm.request", {
      correlationId,
      requestBody: JSON.stringify(requestBody),
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      temperature: requestBody.temperature,
      max_completion_tokens: requestBody.max_completion_tokens
    });
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      signal: openaiController.signal,
    });
    
    clearTimeout(openaiTimeout);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      jlog("error", "edge.llm.error", {
        correlationId,
        status: openaiResponse.status,
        err: errorText,
        requestBody: JSON.stringify(requestBody)
      });
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
    }

    const openaiData = await openaiResponse.json();
    
    // SURGICAL FIX: Log full API response before parsing
    jlog("info", "edge.llm.response.raw", {
      correlationId,
      fullResponse: JSON.stringify(openaiData),
      hasChoices: !!openaiData.choices,
      choicesLength: openaiData.choices?.length || 0,
      firstChoice: openaiData.choices?.[0] || null,
      usage: openaiData.usage || null
    });

    // SURGICAL FIX: Comprehensive response validation with retry logic
    let responseText = '';
    let retryAttempted = false;
    
    if (!openaiData.choices || openaiData.choices.length === 0 || !openaiData.choices[0]?.message?.content?.trim()) {
      if (!retryAttempted) {
        retryAttempted = true;
        jlog("warn", "edge.llm.retry", { correlationId, reason: "empty_or_invalid_response" });
        
        // Retry with same parameters
        const retryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
        });
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          if (retryData.choices?.[0]?.message?.content?.trim()) {
            responseText = retryData.choices[0].message.content.trim();
          }
        }
      }
      
      if (!responseText) {
        throw new Error('OpenAI returned no valid response after retry');
      }
    } else {
      responseText = openaiData.choices[0].message.content.trim();
    }
    
    if (!openaiData.choices[0]) {
      throw new Error('OpenAI first choice is null or undefined');
    }
    
    if (!openaiData.choices[0].message) {
      throw new Error('OpenAI choice message is null or undefined');
    }
    
    // responseText already set above from validation

    jlog("info", "edge.llm.post", {
      correlationId,
      responseLen: responseText.length,
      tokenUsage: openaiData.usage
    });

    // AUDIO FLOW CORRECTION: Aggressive response truncation to prevent trailing noise
    let originalLength = responseText.length;
    const encoder = new TextEncoder();
    let originalBytes = encoder.encode(responseText).length;
    
    // FIRST: Clean text for TTS - remove only problematic patterns, preserve full response
    responseText = responseText.replace(/\b[A-Z]{2,}\b|\b\d{3,}\b/g, ' ').trim();
    
    // SECOND: Sanitize special characters for UTF-8 clean encoding
    responseText = responseText.replace(/[^\w\s\.,\!?¿¡áéíóúüñÁÉÍÓÚÜÑ]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Updated: Increased word limit to allow ~300 characters for 15-20 seconds of audio
    const words = responseText.split(/\s+/);
    if (words.length > 250) {  // Increased limit to ~300 characters for natural conversation flow
      // Find the last complete sentence within 250 words
      const sentences = responseText.split(/[.!?]+/);
      let truncated = '';
      let wordCount = 0;
      
      for (const sentence of sentences) {
        const sentenceWords = sentence.trim().split(/\s+/);
        if (wordCount + sentenceWords.length <= 250) {
          truncated += (truncated ? '. ' : '') + sentence.trim();
          wordCount += sentenceWords.length;
        } else {
          break;
        }
      }
      
      if (truncated) {
        responseText = truncated + (truncated.match(/[.!?]$/) ? '' : '.');
      }
    }
    
    // FOURTH: Byte limit safety check (fallback only)
    if (encoder.encode(responseText).length > TTS_BYTE_LIMIT) {
      const words = responseText.split(' ');
      let truncated = '';
      for (const word of words) {
        const testText = truncated + (truncated ? ' ' : '') + word;
        if (encoder.encode(testText).length <= TTS_BYTE_LIMIT) {
          truncated = testText;
        } else {
          break;
        }
      }
      if (truncated) {
        responseText = truncated + (truncated.match(/[.!?]$/) ? '' : '.');
      }
    }
    
    const finalBytes = encoder.encode(responseText).length;
    
    if (originalBytes > TTS_BYTE_LIMIT || originalLength !== responseText.length) {
      jlog("info", "tts.text.truncated", {
        correlationId,
        originalLength,
        originalBytes,
        finalLength: responseText.length,
        finalBytes,
        truncatedLength: responseText.length,
        truncatedBytes: finalBytes,
        savedBytes: originalBytes - finalBytes
      });
    }

    // Verify response text is in correct language before TTS
    if (enforceLanguage) {
      const verifyLanguage = (text: string, targetLang: string): boolean => {
        const languageMarkers = {
          'es': /[áéíóúüñ]|(?:\b(?:que|una|para|con|por|no|son|tiene|más|este|esta|desde|ahora|antes|vida|hotel|tiempo|ciudad|trabajo|casa|años|día|cómo|dónde|cuándo|porque|también|siempre|nunca|todo|todos|muy|bien|mejor|nuevo|nueva|cada|otro|otra|puede|hacer|tener|estar|vivir|viajar|disfrutar)\b)/i,
          'en': /\b(?:the|and|or|but|in|on|at|to|for|of|with|by|this|that|from|now|before|life|hotel|time|city|work|home|years|day|how|where|when|because|also|always|never|all|every|other|can|do|have|be|live|travel|enjoy)\b/i,
          'pt': /[ãõ]|(?:\b(?:que|uma|para|com|por|não|são|tem|mais|este|esta|desde|agora|antes|vida|hotel|tempo|cidade|trabalho|casa|anos|dia|como|onde|quando|porque|também|sempre|nunca|tudo|todos|muito|bem|melhor|novo|nova|cada|outro|outra|pode|fazer|ter|estar|viver|viajar|desfrutar)\b)/i,
          'ro': /[ăâîșț]|(?:\b(?:și|cu|pe|la|de|în|să|este|sunt|are|mai|această|aceasta|de|acum|înainte|viață|hotel|timp|oraș|muncă|casă|ani|zi|cum|unde|când|pentru|pentru|întotdeauna|niciodată|toate|foarte|bine|mai|nou|nouă|fiecare|altul|alta|poate|face|avea|fi|trăi|călători|bucura)\b)/i
        };
        
        const targetPattern = languageMarkers[targetLang as keyof typeof languageMarkers];
        return targetPattern ? targetPattern.test(text) : true;
      };

      if (!verifyLanguage(responseText, language)) {
        jlog("warn", "edge.response.wrong_language", {
          correlationId,
          expectedLanguage: language,
          responseText: responseText.slice(0, 100),
          willFallbackToEnglish: true
        });
        
        // Force English voice for unverified language responses
        if (language !== 'en') {
          language = 'en';
        }
      }
    }

    // Generate audio using Google Cloud TTS with specific voice settings
    const voiceConfig = getVoiceConfigForAvatar(avatarId, language);

    jlog("info", "tts.google.request", {
      correlationId,
      avatarId,
      voiceId: voiceConfig.voice,
      lang: voiceConfig.languageCode,
      pitch: voiceConfig.pitch,
      speakingRate: voiceConfig.speakingRate,
      textLen: responseText.length,
      service: "google-cloud-neural"
    });

    const ttsPayload = {
      input: {
        text: responseText
      },
      voice: {
        languageCode: voiceConfig.languageCode,
        name: voiceConfig.voice,
        ssmlGender: voiceConfig.gender
      },
      audioConfig: {
        audioEncoding: "MP3",
        sampleRateHertz: 16000, // Already optimized at 16kHz for smaller files
        speakingRate: voiceConfig.speakingRate, // Now uses optimized rates 1.15-1.25
        pitch: voiceConfig.pitch,
        volumeGainDb: 0.0,
        effectsProfileId: ["telephony-class-application"] // Add compression for faster transmission
      }
    };

    // OPTIMIZATION: Reduced TTS timeout for faster failure detection
    const ttsController = new AbortController();
    const ttsTimeout = setTimeout(() => ttsController.abort(), 5000); // Reduced from 10s to 5s for faster TTS processing
    
    const ttsResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ttsPayload),
      signal: ttsController.signal,
    });
    
    clearTimeout(ttsTimeout);

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      jlog("error", "tts.google.api_error", {
        correlationId,
        status: ttsResponse.status,
        voiceName: voiceConfig.voice,
        err: errorText
      });
      
      // Handle specific 400 error for text too long
      if (ttsResponse.status === 400 && errorText.includes("5000 bytes")) {
        jlog("error", "tts.google.text_too_long", {
          correlationId,
          textLength: responseText.length,
          textBytes: new TextEncoder().encode(responseText).length,
          message: "Text exceeded TTS byte limit, attempting emergency truncation"
        });
        
        // Emergency truncation and retry
        const emergencyText = truncateTextForTTS(responseText, 4000);
        const retryPayload = { ...ttsPayload, input: { text: emergencyText } };
        
        const retryResponse = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(retryPayload),
        });
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          jlog("info", "tts.google.retry_success", {
            correlationId,
            emergencyTextLength: emergencyText.length,
            emergencyTextBytes: new TextEncoder().encode(emergencyText).length
          });
          
          return new Response(
            JSON.stringify({
              response: emergencyText,
              transcribedText: transcribedText,
              audioContent: retryData.audioContent,
              warning: "Response was truncated due to length limits"
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
      
      // Handle specific 403 error for blocked TTS API
      if (ttsResponse.status === 403) {
        jlog("error", "tts.google.blocked", {
          correlationId,
          message: "Google Cloud TTS API is blocked for this API key"
        });
        
        // Return response without audio instead of throwing
        return new Response(
          JSON.stringify({
            response: responseText,
            transcribedText: transcribedText,
            audioContent: null,
            error: "TTS temporarily unavailable"
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error(`Google Cloud TTS API error: ${ttsResponse.status}`);
    }

    const ttsData = await ttsResponse.json();

    if (!ttsData.audioContent) {
      jlog("error", "tts.google.no_audio", {
        correlationId,
        hasAudioContent: false
      });
      
      return new Response(
        JSON.stringify({
          response: responseText,
          transcribedText: transcribedText,
          audioContent: null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Apply audio post-processing: trim silence
    let processedAudioContent = ttsData.audioContent;
    try {
      processedAudioContent = trimAudioSilence(ttsData.audioContent);
      jlog("info", "audio.post_processing.ok", {
        correlationId,
        originalSize: ttsData.audioContent?.length || 0,
        processedSize: processedAudioContent?.length || 0
      });
    } catch (error) {
      jlog("warn", "audio.post_processing.failed", {
        correlationId,
        error: error.message
      });
    }

    // REAL-TIME LOGGING: Complete flow tracking with timestamps
    const rtMs = Date.now() - t0;
    jlog("info", "edge.complete.ok", {
      correlationId,
      rtMs,
      hasAudio: !!ttsData.audioContent,
      audioSource: "google_cloud_neural",
      environment,
      deploymentId,
      textGenerationMs: Math.round(rtMs * 0.3),
      ttsGenerationMs: Math.round(rtMs * 0.4),
      totalResponseLength: responseText.length,
      audioContentSize: ttsData.audioContent ? ttsData.audioContent.length : 0
    });

    return new Response(
      JSON.stringify({
        response: responseText,
        transcribedText: transcribedText,
        audioContent: processedAudioContent,
        sessionId: correlationId,
        metrics: {
          totalTime: rtMs,
          environment,
          deploymentId,
          responseLength: responseText.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    const rtMs = Date.now() - t0;
    jlog("error", "edge.error", {
      correlationId,
      rtMs,
      environment,
      deploymentId,
      message: error.message,
      stack: error.stack?.slice(0, 500) || 'No stack trace'
    });
    
    console.error('Error in google-cloud-voice-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        correlationId,
        environment,
        timestamp: new Date().toISOString(),
        response: '',
        transcribedText: '',
        audioContent: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
