import { useState, useCallback } from 'react';
import { useCreateAppointment } from './useDashboard';

// WhatsApp message parser
export interface WhatsAppMessage {
  from: string;
  name: string;
  message: string;
  timestamp: string;
}

export interface ParsedBookingIntent {
  hasIntent: boolean;
  service?: string;
  date?: string;
  time?: string;
  name?: string;
  confidence: number;
}

// Keywords for booking detection
const bookingKeywords = [
  'cita', 'agendar', 'reservar', 'quiero', 'me gustaría', 'podría', 'disponible',
  'horario', 'turno', 'consulta', 'tratamiento', 'facial', 'masaje', 'depilación'
];

const serviceKeywords: Record<string, string[]> = {
  'Facial Hidratante': ['facial', 'hidratante', 'cara', 'rostro', 'limpieza'],
  'Mesoterapia Facial': ['mesoterapia', 'vitaminas', 'rejuvenecimiento', 'colágeno'],
  'Radiofrecuencia': ['radiofrecuencia', 'reafirmante', 'flacidez', 'lifting'],
  'Consulta Nutricional': ['nutrición', 'dieta', 'peso', 'alimentación', 'nutri'],
  'Dermapen': ['dermapen', 'microneedling', 'micropunción', 'piel'],
  'Manicure Spa': ['manicure', 'uñas', 'manos', 'esmaltado'],
  'Pedicure Spa': ['pedicure', 'pies', 'uñas pies'],
  'Terapia IV': ['terapia iv', 'vitaminas iv', 'suero', 'intravenoso'],
};

// Parse WhatsApp/Instagram message for booking intent
export function parseBookingMessage(message: string): ParsedBookingIntent {
  const lowerMessage = message.toLowerCase();
  let confidence = 0;
  
  // Check for booking keywords
  const hasBookingIntent = bookingKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  if (!hasBookingIntent) {
    return { hasIntent: false, confidence: 0 };
  }
  
  confidence += 30;
  
  // Detect service
  let detectedService: string | undefined;
  for (const [service, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      detectedService = service;
      confidence += 40;
      break;
    }
  }
  
  // Detect date patterns
  let detectedDate: string | undefined;
  const datePatterns = [
    /(\d{1,2})\s*de\s*(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    /(hoy|mañana|pasado mañana)/i,
    /(\d{1,2})\/(\d{1,2})/,
  ];
  
  for (const pattern of datePatterns) {
    const match = message.match(pattern);
    if (match) {
      detectedDate = match[0];
      confidence += 20;
      break;
    }
  }
  
  // Detect time patterns
  let detectedTime: string | undefined;
  const timePattern = /(\d{1,2}):?(\d{2})?\s*(am|pm|a\.m\.|p\.m\.)?/i;
  const timeMatch = message.match(timePattern);
  if (timeMatch) {
    detectedTime = timeMatch[0];
    confidence += 10;
  }
  
  return {
    hasIntent: confidence > 30,
    service: detectedService,
    date: detectedDate,
    time: detectedTime,
    confidence: Math.min(confidence, 100),
  };
}

// Generate WhatsApp deep link
export function generateWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

// Generate Instagram deep link
export function generateInstagramLink(username: string): string {
  return `https://instagram.com/${username}`;
}

// Auto-reply templates
export const autoReplyTemplates = {
  greeting: `¡Hola! 👋 Soy el asistente virtual de *Beauté by Dra. Meyryn Carrillo*.

Puedo ayudarte a agendar tu cita. Por favor dime:
• ¿Qué servicio te interesa?
• ¿Qué día y hora prefieres?

Nuestros servicios:
💆‍♀️ Facial Hidratante - ₡45,000
💉 Mesoterapia - ₡85,000
📻 Radiofrecuencia - ₡65,000
🥗 Consulta Nutricional - ₡35,000
✨ Dermapen - ₡75,000
💅 Manicure Spa - ₡18,000
🦶 Pedicure Spa - ₡22,000
💉 Terapia IV - ₡75,000

Horario: Lunes a Sábado 9am - 7pm`,

  requestDateTime: (serviceName: string) => 
    `Perfecto, elegiste *${serviceName}* ✨\n\n` +
    `¿Qué día y hora te gustaría agendar?\n\n` +
    `Ejemplo: "Mañana a las 3pm" o "Viernes 15 de marzo"`,

  confirmBooking: (service: string, date: string, time: string, price: number) =>
    `¡Excelente! Resumen de tu cita:\n\n` +
    `📋 Servicio: ${service}\n` +
    `📅 Fecha: ${date}\n` +
    `⏰ Hora: ${time}\n` +
    `💰 Precio: ₡${price.toLocaleString()}\n\n` +
    `¿Confirmamos tu reserva? Responde *SÍ* para confirmar.`,

  bookingConfirmed: (date: string, time: string) =>
    `🎉 ¡Cita confirmada!\n\n` +
    `Te esperamos el ${date} a las ${time}.\n\n` +
    `📍 Dirección: [Tu dirección]\n` +
    `⏰ Llega 10 minutos antes\n` +
    `📱 Si necesitas cancelar, avísanos con 24h de anticipación.\n\n` +
    `¡Gracias por elegir Beauté! 💕`,

  notUnderstood: `Lo siento, no entendí bien 😅\n\n` +
    `Para agendar una cita, por favor dime:\n` +
    `1️⃣ Qué servicio deseas\n` +
    `2️⃣ Fecha y hora preferida\n\n` +
    `O escribe *AYUDA* para ver las opciones.`,
};

// Hook for social media booking
export function useSocialBooking() {
  const [conversations, setConversations] = useState<Record<string, WhatsAppMessage[]>>({});
  const createAppointment = useCreateAppointment();
  
  // Process incoming message
  const processMessage = useCallback((message: WhatsAppMessage) => {
    const intent = parseBookingMessage(message.message);
    
    // Store conversation
    setConversations(prev => ({
      ...prev,
      [message.from]: [...(prev[message.from] || []), message],
    }));
    
    return intent;
  }, []);
  
  // Create booking from social media
  const createSocialBooking = useCallback(async (data: {
    patientName: string;
    patientPhone: string;
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    price: number;
    channel: 'whatsapp' | 'instagram';
  }) => {
    return createAppointment.mutateAsync({
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      date: data.date,
      time: data.time,
      duration: 60,
      price: data.price,
      status: 'confirmed',
      channel: data.channel,
      notes: `Agendado vía ${data.channel}`,
    });
  }, [createAppointment]);
  
  return {
    conversations,
    processMessage,
    createSocialBooking,
    parseBookingMessage,
    generateWhatsAppLink,
    generateInstagramLink,
    autoReplyTemplates,
  };
}
