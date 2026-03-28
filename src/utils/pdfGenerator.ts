import jsPDF from 'jspdf';

interface HotelRegistrationPDFOptions {
  language: 'es' | 'en';
}

export const generateHotelRegistrationPDF = (options: HotelRegistrationPDFOptions): jsPDF => {
  const doc = new jsPDF();
  const { language } = options;
  
  // Set brand colors
  const primaryColor = '#7E26A6'; // Hotel Living purple
  const textColor = '#333333';
  
  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Language-specific content
  const content = {
    es: {
      title: 'FORMULARIO DE REGISTRO DE HOTEL',
      subtitle: 'Hotel-living.com',
      instructions: 'Complete este formulario y envíelo por email a support@hotel-living.com',
      sections: {
        basic: 'INFORMACIÓN BÁSICA',
        classification: 'CLASIFICACIÓN DEL HOTEL',
        property: 'TIPO Y ESTILO DE PROPIEDAD',
        description: 'DESCRIPCIÓN DEL HOTEL',
        features: 'CARACTERÍSTICAS',
        services: 'SERVICIOS Y COMIDAS',
        availability: 'DISPONIBILIDAD',
        pricing: 'MATRIZ DE PRECIOS',
        terms: 'TÉRMINOS Y CONDICIONES'
      },
      fields: {
        hotelName: 'Nombre del hotel:',
        address: 'Dirección completa:',
        classification: 'Clasificación (1★ a 5★):',
        propertyType: 'Tipo de propiedad:',
        propertyStyle: 'Estilo de propiedad:',
        description: 'Descripción del hotel:',
        roomDescription: 'Descripción de habitaciones:',
        idealGuests: 'Huéspedes ideales:',
        atmosphere: 'Atmósfera:',
        location: 'Ubicación perfecta:',
        hotelFeatures: 'Características del hotel (escriba entre 3 y 10 de la lista al final):',
        roomFeatures: 'Características de habitaciones (mínimo 3, máximo 10):',
        affinities: 'Afinidades de clientes (máximo 3 de la lista al final):',
        activities: 'Actividades (mínimo 3, máximo 10 de la lista al final):',
        mealPlan: 'Plan de comida:',
        laundryService: 'Servicio de lavandería:',
        stayLengths: 'Duraciones de estancia disponibles:',
        checkInDay: 'Día semanal de check-in/check-out:',
        packages: 'PAQUETES DE DISPONIBILIDAD',
        pricing: 'MATRIZ DE PRECIOS',
        signature: 'FIRMA DEL RESPONSABLE'
      },
      options: {
        propertyTypes: ['Hotel', 'Hotel Boutique', 'Resort', 'Casa Rural', 'Hostel'],
        propertyStyles: ['Clásico', 'Clásico Elegante', 'Moderno', 'Fusión', 'Urbano', 'Rural', 'Minimalista', 'Lujo'],
        mealPlans: ['Solo alojamiento', 'Desayuno incluido', 'Media pensión', 'Pensión completa', 'Todo incluido'],
        laundryOptions: ['Incluido en el precio', 'No incluido. Se puede redireccionar a servicio externo'],
        stayOptions: ['8 días', '15 días', '22 días', '29 días'],
        weekdays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      },
      instructions2: {
        packages: 'Complete máximo 10 filas. Si necesita más, envíe información adicional por email.',
        pricing: 'Revise la política de precios máximos en el paso 3 de "Calcule su modelo de tarifas".',
        features: 'Por favor, copie exactamente de las listas al final las opciones que seleccione.'
      },
      footer: 'El equipo de Hotel-living.com'
    },
    en: {
      title: 'HOTEL REGISTRATION FORM',
      subtitle: 'Hotel-living.com',
      instructions: 'Complete this form and send it by email to support@hotel-living.com',
      sections: {
        basic: 'BASIC INFORMATION',
        classification: 'HOTEL CLASSIFICATION',
        property: 'PROPERTY TYPE AND STYLE',
        description: 'HOTEL DESCRIPTION',
        features: 'FEATURES',
        services: 'SERVICES AND MEALS',
        availability: 'AVAILABILITY',
        pricing: 'PRICING MATRIX',
        terms: 'TERMS AND CONDITIONS'
      },
      fields: {
        hotelName: 'Hotel name:',
        address: 'Complete address:',
        classification: 'Classification (1★ to 5★):',
        propertyType: 'Property type:',
        propertyStyle: 'Property style:',
        description: 'Hotel description:',
        roomDescription: 'Room description:',
        idealGuests: 'Ideal guests:',
        atmosphere: 'Atmosphere:',
        location: 'Perfect location:',
        hotelFeatures: 'Hotel features (write between 3 and 10 from the list at the end):',
        roomFeatures: 'Room features (minimum 3, maximum 10):',
        affinities: 'Client affinities (maximum 3 from the list at the end):',
        activities: 'Activities (minimum 3, maximum 10 from the list at the end):',
        mealPlan: 'Meal plan:',
        laundryService: 'Laundry service:',
        stayLengths: 'Available stay durations:',
        checkInDay: 'Weekly check-in/check-out day:',
        packages: 'AVAILABILITY PACKAGES',
        pricing: 'PRICING MATRIX',
        signature: 'RESPONSIBLE PERSON SIGNATURE'
      },
      options: {
        propertyTypes: ['Hotel', 'Boutique Hotel', 'Resort', 'Rural House', 'Hostel'],
        propertyStyles: ['Classic', 'Classic Elegant', 'Modern', 'Fusion', 'Urban', 'Rural', 'Minimalist', 'Luxury'],
        mealPlans: ['Room only', 'Breakfast included', 'Half board', 'Full board', 'All inclusive'],
        laundryOptions: ['Included in price', 'Not included. Can redirect to external service'],
        stayOptions: ['8 days', '15 days', '22 days', '29 days'],
        weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      instructions2: {
        packages: 'Complete maximum 10 rows. If you need more, send additional information by email.',
        pricing: 'Review the maximum pricing policy in step 3 of "Calculate your rates model".',
        features: 'Please copy exactly from the lists at the end the options you select.'
      },
      footer: 'The Hotel-living.com team'
    }
  };
  
  const texts = content[language];
  
  // Helper function to add text with auto line break
  const addText = (text: string, x: number, y: number, maxWidth: number = contentWidth, fontSize: number = 10): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * (fontSize * 0.4));
  };
  
  // Helper function to add form field
  const addFormField = (label: string, fieldHeight: number = 8, options?: string[]): number => {
    const currentY = yPosition;
    
    // Add label
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    yPosition = addText(label, margin, yPosition);
    yPosition += 2;
    
    // Add field box or checkboxes
    if (options) {
      // Create checkboxes for multiple options
      options.forEach((option, index) => {
        const boxSize = 4;
        const spacing = contentWidth / Math.min(options.length, 3);
        const x = margin + (index % 3) * spacing;
        
        if (index % 3 === 0 && index > 0) {
          yPosition += 8;
        }
        
        // Checkbox
        doc.rect(x, yPosition, boxSize, boxSize);
        doc.text(option, x + boxSize + 2, yPosition + 3);
      });
      yPosition += 12;
    } else {
      // Create text field
      doc.rect(margin, yPosition, contentWidth, fieldHeight);
      yPosition += fieldHeight + 4;
    }
    
    return yPosition;
  };
  
  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(texts.title, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(texts.subtitle, pageWidth / 2, 30, { align: 'center' });
  
  yPosition = 50;
  
  // Instructions
  doc.setTextColor(textColor);
  doc.setFontSize(10);
  yPosition = addText(texts.instructions, margin, yPosition);
  yPosition += 10;
  
  // Section 1: Basic Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  yPosition = addText(texts.sections.basic, margin, yPosition);
  yPosition += 5;
  
  yPosition = addFormField(texts.fields.hotelName, 8);
  yPosition = addFormField(texts.fields.address, 20);
  
  // Section 2: Classification
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.sections.classification, margin, yPosition);
  yPosition += 5;
  
  yPosition = addFormField(texts.fields.classification, 8, ['1★', '2★', '3★', '4★', '5★']);
  
  // Section 3: Property Type and Style
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.sections.property, margin, yPosition);
  yPosition += 5;
  
  yPosition = addFormField(texts.fields.propertyType, 8, texts.options.propertyTypes);
  yPosition = addFormField(texts.fields.propertyStyle, 8, texts.options.propertyStyles);
  
  // Check if we need a new page
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Section 4: Descriptions
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.sections.description, margin, yPosition);
  yPosition += 5;
  
  yPosition = addFormField(texts.fields.description, 25);
  yPosition = addFormField(texts.fields.roomDescription, 25);
  yPosition = addFormField(texts.fields.idealGuests, 15);
  yPosition = addFormField(texts.fields.atmosphere, 15);
  yPosition = addFormField(texts.fields.location, 15);
  
  // New page for features
  doc.addPage();
  yPosition = margin;
  
  // Section 5: Features
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.sections.features, margin, yPosition);
  yPosition += 5;
  
  yPosition = addFormField(texts.fields.hotelFeatures, 25);
  yPosition = addFormField(texts.fields.roomFeatures, 25);
  yPosition = addFormField(texts.fields.affinities, 20);
  yPosition = addFormField(texts.fields.activities, 25);
  
  // Section 6: Services
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.sections.services, margin, yPosition);
  yPosition += 5;
  
  yPosition = addFormField(texts.fields.mealPlan, 8, texts.options.mealPlans);
  yPosition = addFormField(texts.fields.laundryService, 8, texts.options.laundryOptions);
  yPosition = addFormField(texts.fields.stayLengths, 8, texts.options.stayOptions);
  yPosition = addFormField(texts.fields.checkInDay, 8, texts.options.weekdays);
  
  // New page for availability packages
  doc.addPage();
  yPosition = margin;
  
  // Section 7: Availability Packages
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.fields.packages, margin, yPosition);
  yPosition += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  yPosition = addText(texts.instructions2.packages, margin, yPosition);
  yPosition += 10;
  
  // Create availability packages table
  const tableHeaders = language === 'es' 
    ? ['Fecha entrada', 'Fecha salida', 'Nº habitaciones']
    : ['Check-in date', 'Check-out date', 'Number of rooms'];
  
  const colWidth = contentWidth / 3;
  
  // Table header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  tableHeaders.forEach((header, index) => {
    doc.rect(margin + (index * colWidth), yPosition, colWidth, 8);
    doc.text(header, margin + (index * colWidth) + 2, yPosition + 5);
  });
  yPosition += 8;
  
  // Table rows (10 rows)
  doc.setFont('helvetica', 'normal');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 3; j++) {
      doc.rect(margin + (j * colWidth), yPosition, colWidth, 8);
    }
    yPosition += 8;
  }
  yPosition += 10;
  
  // Section 8: Pricing Matrix
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.fields.pricing, margin, yPosition);
  yPosition += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  yPosition = addText(texts.instructions2.pricing, margin, yPosition);
  yPosition += 10;
  
  // Pricing matrix table
  const pricingHeaders = language === 'es'
    ? ['', '8 días', '15 días', '22 días', '29 días']
    : ['', '8 days', '15 days', '22 days', '29 days'];
  
  const pricingRows = language === 'es'
    ? ['Habitación Doble', 'Habitación Individual']
    : ['Double Room', 'Single Room'];
  
  const matrixColWidth = contentWidth / 5;
  
  // Matrix header
  doc.setFont('helvetica', 'bold');
  pricingHeaders.forEach((header, index) => {
    doc.rect(margin + (index * matrixColWidth), yPosition, matrixColWidth, 8);
    if (header) {
      doc.text(header, margin + (index * matrixColWidth) + 2, yPosition + 5);
    }
  });
  yPosition += 8;
  
  // Matrix rows
  doc.setFont('helvetica', 'normal');
  pricingRows.forEach((rowLabel, rowIndex) => {
    doc.rect(margin, yPosition, matrixColWidth, 8);
    doc.text(rowLabel, margin + 2, yPosition + 5);
    
    for (let i = 1; i < 5; i++) {
      doc.rect(margin + (i * matrixColWidth), yPosition, matrixColWidth, 8);
    }
    yPosition += 8;
  });
  
  // New page for terms and signature
  doc.addPage();
  yPosition = margin;
  
  // Section 9: Terms and signature
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.sections.terms, margin, yPosition);
  yPosition += 5;
  
  const termsText = language === 'es'
    ? '☐ Declaro haber leído y aceptado los términos y condiciones que he leído en el Panel de Usuario.'
    : '☐ I declare that I have read and accepted the terms and conditions that I have read in the User Panel.';
  
  doc.setFont('helvetica', 'normal');
  yPosition = addText(termsText, margin, yPosition);
  yPosition += 20;
  
  // Signature section
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.fields.signature, margin, yPosition);
  yPosition += 10;
  
  const signatureFields = language === 'es'
    ? ['Nombre completo:', 'Cargo:', 'Firma:', 'Fecha:']
    : ['Full name:', 'Position:', 'Signature:', 'Date:'];
  
  signatureFields.forEach(field => {
    yPosition = addFormField(field, 8);
    yPosition += 5;
  });
  
  // New page for reference lists
  doc.addPage();
  yPosition = margin;
  
  // Reference lists instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const listsTitle = language === 'es'
    ? 'LISTAS DE REFERENCIA - COPIE EXACTAMENTE'
    : 'REFERENCE LISTS - COPY EXACTLY';
  yPosition = addText(listsTitle, margin, yPosition);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  yPosition = addText(texts.instructions2.features, margin, yPosition);
  yPosition += 15;
  
  // Add sample lists (this would need to be populated with actual data from the database)
  const sampleLists = {
    es: {
      hotelFeatures: ['WiFi gratuito', 'Piscina', 'Gimnasio', 'Spa', 'Restaurante', 'Bar', 'Servicio de habitaciones', 'Recepción 24h', 'Aparcamiento', 'Aire acondicionado'],
      roomFeatures: ['Televisión', 'Minibar', 'Caja fuerte', 'Balcón', 'Vista al mar', 'Baño privado', 'Secador de pelo', 'Plancha', 'Escritorio', 'Sofá'],
      activities: ['Conversa Español', 'Conversa Inglés', 'Juegos de Mesa', 'Yoga', 'Excursiones', 'Deportes acuáticos', 'Senderismo', 'Talleres de cocina', 'Meditación', 'Trivia Quiz'],
      affinities: ['Arquitectura', 'Arte', 'Historia', 'Gastronomía', 'Naturaleza', 'Fotografía', 'Música', 'Literatura', 'Deportes', 'Bienestar']
    },
    en: {
      hotelFeatures: ['Free WiFi', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Room Service', '24h Reception', 'Parking', 'Air Conditioning'],
      roomFeatures: ['Television', 'Minibar', 'Safe', 'Balcony', 'Sea View', 'Private Bathroom', 'Hair Dryer', 'Iron', 'Desk', 'Sofa'],
      activities: ['English Conversation', 'Spanish Conversation', 'Board Games', 'Yoga', 'Excursions', 'Water Sports', 'Hiking', 'Cooking Workshops', 'Meditation', 'Trivia Quiz'],
      affinities: ['Architecture', 'Art', 'History', 'Gastronomy', 'Nature', 'Photography', 'Music', 'Literature', 'Sports', 'Wellness']
    }
  };
  
  const lists = sampleLists[language];
  
  Object.entries(lists).forEach(([listName, items]) => {
    const listTitle = language === 'es'
      ? listName === 'hotelFeatures' ? 'CARACTERÍSTICAS DEL HOTEL:'
        : listName === 'roomFeatures' ? 'CARACTERÍSTICAS DE HABITACIONES:'
        : listName === 'activities' ? 'ACTIVIDADES:'
        : 'AFINIDADES:'
      : listName === 'hotelFeatures' ? 'HOTEL FEATURES:'
        : listName === 'roomFeatures' ? 'ROOM FEATURES:'
        : listName === 'activities' ? 'ACTIVITIES:'
        : 'AFFINITIES:';
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    yPosition = addText(listTitle, margin, yPosition);
    yPosition += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    const itemsPerRow = 3;
    const colWidth = contentWidth / itemsPerRow;
    
    items.forEach((item, index) => {
      const col = index % itemsPerRow;
      const x = margin + (col * colWidth);
      
      if (col === 0 && index > 0) {
        yPosition += 5;
      }
      
      doc.text(`• ${item}`, x, yPosition);
    });
    
    yPosition += 15;
    
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }
  });
  
  // Footer on last page
  yPosition = pageHeight - 30;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor);
  doc.text(texts.footer, pageWidth / 2, yPosition, { align: 'center' });
  
  return doc;
};

export const downloadHotelRegistrationPDF = (language: 'es' | 'en' = 'es') => {
  const pdf = generateHotelRegistrationPDF({ language });
  const filename = language === 'es' 
    ? 'formulario_registro_hotel.pdf'
    : 'hotel_registration_form.pdf';
  pdf.save(filename);
};