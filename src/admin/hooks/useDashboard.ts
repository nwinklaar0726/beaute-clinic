import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

// Types
export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  channel: 'web' | 'whatsapp' | 'instagram' | 'phone';
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  // Citas
  totalAppointments: number;
  appointmentsToday: number;
  appointmentsWeek: number;
  appointmentsMonth: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  
  // Pacientes
  totalPatients: number;
  newPatientsMonth: number;
  returningPatients: number;
  
  // Finanzas
  totalRevenue: number;
  revenueMonth: number;
  revenueWeek: number;
  revenueToday: number;
  averageTicket: number;
  projectedRevenue: number;
  
  // Servicios
  mostPopularService: { name: string; count: number } | null;
  servicesCount: number;
  
  // Canales
  channelStats: {
    web: number;
    whatsapp: number;
    instagram: number;
    phone: number;
  };
  
  // Tasa
  cancellationRate: number;
  noShowRate: number;
  conversionRate: number;
}

// Mock data generator
const generateMockAppointments = (): Appointment[] => {
  const services = [
    { id: '1', name: 'Facial Hidratante', price: 45000, duration: 60 },
    { id: '2', name: 'Mesoterapia Facial', price: 85000, duration: 90 },
    { id: '3', name: 'Radiofrecuencia', price: 65000, duration: 60 },
    { id: '4', name: 'Consulta Nutricional', price: 35000, duration: 45 },
    { id: '5', name: 'Dermapen', price: 75000, duration: 75 },
    { id: '6', name: 'Manicure Spa', price: 18000, duration: 45 },
  ];
  
  const patients = [
    { name: 'María González', phone: '8888-1111' },
    { name: 'Ana Rodríguez', phone: '8888-2222' },
    { name: 'Carmen Silva', phone: '8888-3333' },
    { name: 'Laura Martínez', phone: '8888-4444' },
    { name: 'Patricia López', phone: '8888-5555' },
    { name: 'Diana Herrera', phone: '8888-6666' },
    { name: 'Sofia Ramírez', phone: '8888-7777' },
    { name: 'Gabriela Torres', phone: '8888-8888' },
  ];
  
  const channels: ('web' | 'whatsapp' | 'instagram' | 'phone')[] = ['web', 'whatsapp', 'instagram', 'phone'];
  const statuses: ('pending' | 'confirmed' | 'completed' | 'cancelled')[] = ['pending', 'confirmed', 'completed', 'cancelled'];
  
  const appointments: Appointment[] = [];
  const today = new Date();
  
  // Generate 100 appointments over last 3 months
  for (let i = 0; i < 100; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    const service = services[Math.floor(Math.random() * services.length)];
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    appointments.push({
      id: `apt-${i}`,
      patientName: patient.name,
      patientPhone: patient.phone,
      serviceId: service.id,
      serviceName: service.name,
      date: date.toISOString().split('T')[0],
      time: `${9 + Math.floor(Math.random() * 9)}:${Math.random() > 0.5 ? '00' : '30'}`,
      duration: service.duration,
      price: service.price,
      status,
      channel,
      createdAt: date.toISOString(),
    });
  }
  
  return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Calculate all dashboard stats
const calculateStats = (appointments: Appointment[]): DashboardStats => {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Filter by time periods
  const todayAppointments = appointments.filter(a => a.date === today);
  const weekAppointments = appointments.filter(a => a.date >= weekAgo);
  const monthAppointments = appointments.filter(a => a.date >= monthAgo);
  
  // Revenue calculations
  const revenueToday = todayAppointments
    .filter(a => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + a.price, 0);
    
  const revenueWeek = weekAppointments
    .filter(a => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + a.price, 0);
    
  const revenueMonth = monthAppointments
    .filter(a => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + a.price, 0);
    
  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.price, 0);
  
  // Service popularity
  const serviceCount: Record<string, number> = {};
  appointments.forEach(a => {
    serviceCount[a.serviceName] = (serviceCount[a.serviceName] || 0) + 1;
  });
  const mostPopular = Object.entries(serviceCount)
    .sort((a, b) => b[1] - a[1])[0];
  
  // Channel stats
  const channelStats = {
    web: appointments.filter(a => a.channel === 'web').length,
    whatsapp: appointments.filter(a => a.channel === 'whatsapp').length,
    instagram: appointments.filter(a => a.channel === 'instagram').length,
    phone: appointments.filter(a => a.channel === 'phone').length,
  };
  
  // Rates
  const totalCompleted = appointments.filter(a => a.status === 'completed').length;
  const totalCancelled = appointments.filter(a => a.status === 'cancelled').length;
  const totalConfirmed = appointments.filter(a => a.status === 'confirmed').length;
  const totalPending = appointments.filter(a => a.status === 'pending').length;
  
  const processedAppointments = totalCompleted + totalCancelled;
  
  return {
    totalAppointments: appointments.length,
    appointmentsToday: todayAppointments.length,
    appointmentsWeek: weekAppointments.length,
    appointmentsMonth: monthAppointments.length,
    pendingAppointments: totalPending,
    confirmedAppointments: totalConfirmed,
    completedAppointments: totalCompleted,
    cancelledAppointments: totalCancelled,
    
    totalPatients: new Set(appointments.map(a => a.patientPhone)).size,
    newPatientsMonth: Math.floor(Math.random() * 15) + 5,
    returningPatients: Math.floor(Math.random() * 30) + 20,
    
    totalRevenue,
    revenueMonth,
    revenueWeek,
    revenueToday,
    averageTicket: totalCompleted > 0 ? Math.round(totalRevenue / totalCompleted) : 0,
    projectedRevenue: Math.round(revenueMonth * 1.2),
    
    mostPopularService: mostPopular ? { name: mostPopular[0], count: mostPopular[1] } : null,
    servicesCount: Object.keys(serviceCount).length,
    
    channelStats,
    
    cancellationRate: processedAppointments > 0 ? Math.round((totalCancelled / processedAppointments) * 100) : 0,
    noShowRate: 3,
    conversionRate: 85,
  };
};

// Hook for dashboard data
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const appointments = generateMockAppointments();
      const stats = calculateStats(appointments);
      return { appointments, stats };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for appointments with filters
export function useAppointments(filters?: { 
  status?: string; 
  date?: string; 
  channel?: string;
  search?: string;
}) {
  const { data } = useDashboardData();
  
  return useMemo(() => {
    if (!data) return [];
    
    return data.appointments.filter(apt => {
      if (filters?.status && apt.status !== filters.status) return false;
      if (filters?.date && apt.date !== filters.date) return false;
      if (filters?.channel && apt.channel !== filters.channel) return false;
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        return apt.patientName.toLowerCase().includes(search) ||
               apt.serviceName.toLowerCase().includes(search);
      }
      return true;
    });
  }, [data, filters]);
}

// Hook for updating appointment status
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Appointment['status'] }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Hook for creating appointment
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        ...appointment, 
        id: `apt-${Date.now()}`, 
        createdAt: new Date().toISOString() 
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
