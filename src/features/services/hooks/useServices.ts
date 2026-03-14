import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price?: number;
  description?: string;
  category?: string;
}

// Mock services data for when backend is not available
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Facial Hidratante Profundo',
    duration: 60,
    price: 45000,
    description: 'Tratamiento facial completo con hidratación intensiva para todo tipo de piel',
    category: 'Faciales'
  },
  {
    id: '2',
    name: 'Mesoterapia Facial',
    duration: 90,
    price: 85000,
    description: 'Tratamiento con vitaminas y minerales para rejuvenecimiento facial',
    category: 'Medicina Estética'
  },
  {
    id: '3',
    name: 'Radiofrecuencia',
    duration: 60,
    price: 65000,
    description: 'Tratamiento reafirmante con tecnología de última generación',
    category: 'Aparatología'
  },
  {
    id: '4',
    name: 'Consulta Nutricional',
    duration: 45,
    price: 35000,
    description: 'Evaluación completa y plan nutricional personalizado',
    category: 'Nutrición'
  },
  {
    id: '5',
    name: 'Dermapen',
    duration: 75,
    price: 75000,
    description: 'Microneedling para estimulación de colágeno',
    category: 'Medicina Estética'
  },
  {
    id: '6',
    name: 'Manicure Spa',
    duration: 45,
    price: 18000,
    description: 'Cuidado completo de manos con productos premium',
    category: 'Beauty Bar'
  },
  {
    id: '7',
    name: 'Pedicure Spa',
    duration: 60,
    price: 22000,
    description: 'Tratamiento completo para pies con masaje relajante',
    category: 'Beauty Bar'
  },
  {
    id: '8',
    name: 'Terapia IV',
    duration: 60,
    price: 75000,
    description: 'Vitaminas y minerales vía intravenosa para máxima absorción',
    category: 'Wellness'
  }
];

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  detail: (id: string) => [...serviceKeys.all, 'detail', id] as const,
  slots: (date: string) => [...serviceKeys.all, 'slots', date] as const,
};

// Get all services - uses mock data if API fails
export function useServices() {
  return useQuery({
    queryKey: serviceKeys.lists(),
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const data = await api.get<Service[]>('/api/services');
        if (data && data.length > 0) {
          return data;
        }
        // Fallback to mock data if API returns empty
        return mockServices;
      } catch (error) {
        // Return mock data on error
        console.log('Using mock services data');
        return mockServices;
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    initialData: mockServices, // Show mock data immediately while fetching
  });
}

// Get available time slots for a date - returns mock slots
export function useAvailableSlots(date: string | null) {
  return useQuery({
    queryKey: serviceKeys.slots(date || ''),
    queryFn: async () => {
      if (!date) return [];
      try {
        const data = await api.get<string[]>(`/api/slots/available?date=${date}`);
        if (data && data.length > 0) {
          return data;
        }
        // Return mock time slots
        return generateMockSlots();
      } catch (error) {
        return generateMockSlots();
      }
    },
    enabled: !!date,
    staleTime: 1000 * 60,
    initialData: [],
  });
}

// Generate mock time slots
function generateMockSlots(): string[] {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  return slots;
}
