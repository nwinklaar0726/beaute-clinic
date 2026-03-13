# Beauté - Clínica de Estética y Nutrición

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.67-FF4154?logo=reactquery)](https://tanstack.com/query)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000000)](https://ui.shadcn.com/)

> **Sitio web profesional para Dra. Meyryn Carrillo - Clínica de medicina estética, nutrición y spa** 🌸

## ✨ Características

- 🎨 **Diseño Luxury** - Implementación fiel del Brandbook con colores crema, dorado y tierra
- 📱 **Totalmente Responsive** - Optimizado para móvil, tablet y desktop
- ⚡ **Alto Rendimiento** - Vite + React 19 + Lazy Loading
- 🔄 **TanStack Query** - Data fetching optimizado con caché y sincronización
- 📊 **TanStack Table** - Tablas avanzadas con filtrado, ordenamiento y paginación
- 🛣️ **TanStack Router** - Enrutamiento type-safe y eficiente
- 🎭 **Animaciones Suaves** - Transiciones elegantes con Tailwind
- 🔒 **Backend Integration** - Conectado a appointment-bot (Express.js + PostgreSQL)
- 📅 **Sistema de Citas** - Reserva en línea con calendario interactivo
- 🔔 **WhatsApp Reminders** - Recordatorios automáticos
- 🔍 **SEO Optimizado** - Meta tags, sitemap y robots.txt

## 🏗️ Arquitectura

```
src/
├── components/           # Componentes UI reutilizables (shadcn/ui + custom)
│   ├── ui/              # Componentes base de shadcn/ui
│   ├── ButtonLuxury.tsx
│   ├── CardLuxury.tsx
│   └── ServiceCard.tsx
├── features/            # Módulos por dominio (Feature-based architecture)
│   ├── appointments/    # Gestión de citas
│   │   ├── components/  # BookingWizard, AppointmentTable
│   │   ├── hooks/       # useAppointments, useCreateAppointment
│   │   └── types/       # Tipos TypeScript del dominio
│   ├── dashboard/       # Panel administrativo
│   │   └── hooks/
│   └── services/        # Catálogo de servicios
│       └── hooks/
├── providers/           # React Context providers
│   └── QueryProvider.tsx # TanStack Query configuration
├── sections/            # Secciones de landing page
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── BeautyBar.tsx
│   ├── Booking.tsx
│   └── Footer.tsx
├── services/            # API clients
│   └── api.ts           # Integración con appointment-bot
├── shared/              # Código compartido
│   ├── api/            # Cliente HTTP base
│   └── types/          # Tipos globales
├── hooks/               # Custom hooks generales
├── lib/                 # Utilidades
└── App.tsx             # Entry point
```

## 🎨 Sistema de Diseño

### Colores (Brandbook)

| Color | Hex | Uso |
|-------|-----|-----|
| Cream | `#FAEFE6` | Fondo principal |
| Gold | `#AC802A` | Acentos, CTA, bordes |
| Earth Deep | `#51350C` | Texto principal |
| Rose | `#A97574` | Acentos secundarios |
| Taupe | `#A48D82` | Texto secundario |

### Tipografía

- **Títulos**: Dream Orphans (serif elegante)
- **Cuerpo**: Lato (sans-serif legible)

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Verificación completa (types + build)
npm run verify

# Build para producción
npm run build

# Deploy a Vercel
npm run deploy:vercel
```

## 🔌 Backend Integration

El sitio se conecta a **appointment-bot** (backend en Express.js + PostgreSQL):

```typescript
// API Endpoints disponibles
GET  /api/services         # Listar servicios
GET  /api/slots/available  # Horarios disponibles
POST /api/appointments     # Crear cita
GET  /api/dashboard/stats  # Estadísticas
```

Configuración del proxy en `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

## 🛠️ Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| Framework | React 19.2 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7.3 |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Data Fetching | TanStack Query 5.67 |
| Tables | TanStack Table 8.21 |
| Routing | TanStack Router 1.114 |
| Icons | Lucide React |
| Backend | Express.js + PostgreSQL |

## 📁 Estructura de Features (TanStack Architecture)

### Appointments Feature
```typescript
// src/features/appointments/hooks/useAppointments.ts
export const useAppointmentsList = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => getAppointments(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
```

### Services Feature
```typescript
// src/features/services/hooks/useServices.ts
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: 1000 * 60 * 30, // 30 minutos (raramente cambian)
  });
};
```

## 🌐 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

O conecta tu repositorio GitHub para deploys automáticos.

### Configuración de Variables de Entorno

```bash
# .env.local
VITE_API_URL=https://api.beaute-clinic.com
```

## 📄 Licencia

Proyecto privado - Clínica Beauté © 2025

---

**Desarrollado con ❤️ para Dra. Meyryn Carrillo**
