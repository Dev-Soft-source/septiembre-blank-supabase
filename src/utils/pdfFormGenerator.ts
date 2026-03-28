import jsPDF from 'jspdf';

interface CompletedFormData {
  hotel_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  classification: number;
  property_type: string;
  property_style: string;
  hotel_description: string;
  room_description: string;
  ideal_guests: string;
  atmosphere: string;
  perfect_location: string;
  hotel_features: string[];
  room_features: string[];
  client_affinities: string[];
  activities: string[];
  meal_plan: string;
  laundry_service: string;
  stay_lengths: number[];
  check_in_day: string;
  availability_packages: Array<{
    start_date: string;
    end_date: string;
    rooms: number;
  }>;
  pricing_matrix: {
    [key: string]: { double: number; single: number };
  };
  terms_accepted: boolean;
  signature_name: string;
  signature_position: string;
  signature_date: string;
}

export const generateCompletedFormPDF = (formData: CompletedFormData, language: 'es' | 'en' = 'es'): void => {
  const doc = new jsPDF();
  const primaryColor = '#7E26A6';
  const textColor = '#333333';
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Language-specific content
  const content = {
    es: {
      title: 'FORMULARIO DE REGISTRO DE HOTEL - COMPLETADO',
      subtitle: 'Hotel-living.com',
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
        city: 'Ciudad:',
        postalCode: 'Código postal:',
        country: 'País:',
        email: 'Email de contacto:',
        phone: 'Teléfono de contacto:',
        classification: 'Clasificación:',
        propertyType: 'Tipo de propiedad:',
        propertyStyle: 'Estilo de propiedad:',
        description: 'Descripción del hotel:',
        roomDescription: 'Descripción de habitaciones:',
        idealGuests: 'Huéspedes ideales:',
        atmosphere: 'Atmósfera:',
        location: 'Ubicación perfecta:',
        hotelFeatures: 'Características del hotel:',
        roomFeatures: 'Características de habitaciones:',
        affinities: 'Afinidades de clientes:',
        activities: 'Actividades:',
        mealPlan: 'Plan de comida:',
        laundryService: 'Servicio de lavandería:',
        stayLengths: 'Duraciones de estancia:',
        checkInDay: 'Día de check-in/check-out:',
        signature: 'FIRMA DEL RESPONSABLE'
      },
      footer: 'El equipo de Hotel-living.com'
    },
    en: {
      title: 'HOTEL REGISTRATION FORM - COMPLETED',
      subtitle: 'Hotel-living.com',
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
        city: 'City:',
        postalCode: 'Postal code:',
        country: 'Country:',
        email: 'Contact email:',
        phone: 'Contact phone:',
        classification: 'Classification:',
        propertyType: 'Property type:',
        propertyStyle: 'Property style:',
        description: 'Hotel description:',
        roomDescription: 'Room description:',
        idealGuests: 'Ideal guests:',
        atmosphere: 'Atmosphere:',
        location: 'Perfect location:',
        hotelFeatures: 'Hotel features:',
        roomFeatures: 'Room features:',
        affinities: 'Client affinities:',
        activities: 'Activities:',
        mealPlan: 'Meal plan:',
        laundryService: 'Laundry service:',
        stayLengths: 'Stay durations:',
        checkInDay: 'Check-in/check-out day:',
        signature: 'RESPONSIBLE PERSON SIGNATURE'
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
  
  // Helper function to add filled field
  const addFilledField = (label: string, value: string | number | boolean): number => {
    const currentY = yPosition;
    
    // Add label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    yPosition = addText(label, margin, yPosition);
    yPosition += 2;
    
    // Add value
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#0066CC');
    yPosition = addText(String(value || ''), margin + 5, yPosition);
    yPosition += 8;
    
    return yPosition;
  };
  
  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(texts.title, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(texts.subtitle, pageWidth / 2, 30, { align: 'center' });
  
  yPosition = 50;
  
  // Section 1: Basic Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  yPosition = addText(texts.sections.basic, margin, yPosition);
  yPosition += 8;
  
  doc.setTextColor(textColor);
  yPosition = addFilledField(texts.fields.hotelName, formData.hotel_name);
  yPosition = addFilledField(texts.fields.address, formData.address);
  yPosition = addFilledField(texts.fields.city, formData.city);
  yPosition = addFilledField(texts.fields.postalCode, formData.postal_code);
  yPosition = addFilledField(texts.fields.country, formData.country);
  yPosition = addFilledField(texts.fields.email, formData.contact_email);
  yPosition = addFilledField(texts.fields.phone, formData.contact_phone);
  
  // Check if we need a new page
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }
  
  // Section 2: Classification & Property
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  yPosition = addText(texts.sections.classification, margin, yPosition);
  yPosition += 8;
  
  doc.setTextColor(textColor);
  yPosition = addFilledField(texts.fields.classification, `${'★'.repeat(formData.classification || 0)} (${formData.classification}★)`);
  yPosition = addFilledField(texts.fields.propertyType, formData.property_type);
  yPosition = addFilledField(texts.fields.propertyStyle, formData.property_style);
  
  // Section 3: Descriptions
  if (yPosition > pageHeight - 150) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  yPosition = addText(texts.sections.description, margin, yPosition);
  yPosition += 8;
  
  doc.setTextColor(textColor);
  yPosition = addFilledField(texts.fields.description, formData.hotel_description);
  yPosition = addFilledField(texts.fields.roomDescription, formData.room_description);
  yPosition = addFilledField(texts.fields.idealGuests, formData.ideal_guests);
  yPosition = addFilledField(texts.fields.atmosphere, formData.atmosphere);
  yPosition = addFilledField(texts.fields.location, formData.perfect_location);
  
  // Section 4: Features & Activities
  if (yPosition > pageHeight - 150) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  yPosition = addText(texts.sections.features, margin, yPosition);
  yPosition += 8;
  
  doc.setTextColor(textColor);
  yPosition = addFilledField(texts.fields.hotelFeatures, formData.hotel_features?.join(', ') || '');
  yPosition = addFilledField(texts.fields.roomFeatures, formData.room_features?.join(', ') || '');
  yPosition = addFilledField(texts.fields.affinities, formData.client_affinities?.join(', ') || '');
  yPosition = addFilledField(texts.fields.activities, formData.activities?.join(', ') || '');
  
  // Section 5: Services
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  yPosition = addText(texts.sections.services, margin, yPosition);
  yPosition += 8;
  
  doc.setTextColor(textColor);
  yPosition = addFilledField(texts.fields.mealPlan, formData.meal_plan);
  yPosition = addFilledField(texts.fields.laundryService, formData.laundry_service);
  yPosition = addFilledField(texts.fields.stayLengths, formData.stay_lengths?.map(l => `${l} días`).join(', ') || '');
  yPosition = addFilledField(texts.fields.checkInDay, formData.check_in_day);
  
  // Section 6: Availability Packages
  if (formData.availability_packages && formData.availability_packages.length > 0) {
    if (yPosition > pageHeight - 150) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    yPosition = addText(texts.sections.availability, margin, yPosition);
    yPosition += 8;
    
    // Create packages table
    const tableHeaders = language === 'es' 
      ? ['Fecha entrada', 'Fecha salida', 'Nº habitaciones']
      : ['Check-in date', 'Check-out date', 'Number of rooms'];
    
    const colWidth = contentWidth / 3;
    
    // Table header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    tableHeaders.forEach((header, index) => {
      doc.rect(margin + (index * colWidth), yPosition, colWidth, 8);
      doc.text(header, margin + (index * colWidth) + 2, yPosition + 5);
    });
    yPosition += 8;
    
    // Table rows with data
    doc.setFont('helvetica', 'normal');
    formData.availability_packages.forEach((pkg) => {
      doc.rect(margin, yPosition, colWidth, 8);
      doc.rect(margin + colWidth, yPosition, colWidth, 8);
      doc.rect(margin + (2 * colWidth), yPosition, colWidth, 8);
      
      doc.text(pkg.start_date || '', margin + 2, yPosition + 5);
      doc.text(pkg.end_date || '', margin + colWidth + 2, yPosition + 5);
      doc.text(pkg.rooms?.toString() || '', margin + (2 * colWidth) + 2, yPosition + 5);
      
      yPosition += 8;
    });
    yPosition += 10;
  }
  
  // Section 7: Signature
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  yPosition = addText(texts.sections.terms, margin, yPosition);
  yPosition += 8;
  
  doc.setTextColor(textColor);
  const termsText = language === 'es'
    ? `☑ Declaro haber leído y aceptado los términos y condiciones que he leído en el Panel de Usuario.`
    : `☑ I declare that I have read and accepted the terms and conditions that I have read in the User Panel.`;
  
  doc.setFont('helvetica', 'normal');
  yPosition = addText(termsText, margin, yPosition);
  yPosition += 15;
  
  // Signature section
  doc.setFont('helvetica', 'bold');
  yPosition = addText(texts.fields.signature, margin, yPosition);
  yPosition += 10;
  
  doc.setTextColor(textColor);
  yPosition = addFilledField(language === 'es' ? 'Nombre completo:' : 'Full name:', formData.signature_name);
  yPosition = addFilledField(language === 'es' ? 'Cargo:' : 'Position:', formData.signature_position);
  yPosition = addFilledField(language === 'es' ? 'Fecha:' : 'Date:', formData.signature_date);
  
  // Footer
  yPosition = pageHeight - 30;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor);
  doc.text(texts.footer, pageWidth / 2, yPosition, { align: 'center' });
  
  // Download the PDF
  const filename = language === 'es' 
    ? `formulario_hotel_completado_${formData.hotel_name || 'sin_nombre'}.pdf`
    : `completed_hotel_form_${formData.hotel_name || 'unnamed'}.pdf`;
  
  doc.save(filename);
};