# Beauté Clínica - Dra. Meyryn Carrillo

Sistema de gestión de citas y administración para clínica de estética y nutrición.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ 
- npm o pnpm

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (localhost)
npm run dev

# Iniciar servidor en red (para acceder desde celular)
npm run dev:network
```

### Acceso desde Red Local

1. Inicia el servidor con `npm run dev:network`
2. El servidor se iniciará en `http://0.0.0.0:5173`
3. Para acceder desde tu celular:
   - Asegúrate de que tu celular esté en la misma red WiFi
   - Obtén la IP de tu computadora: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
   - En tu celular abre: `http://[TU_IP]:5173`
   - Ejemplo: `http://192.168.1.100:5173`

## 📁 Estructura del Proyecto

```
src/
├── admin/                    # Panel de administración
│   ├── components/           # Componentes reutilizables
│   ├── pages/               # Páginas del admin
│   ├── hooks/               # Hooks de datos
│   └── types/               # Tipos TypeScript
├── sections/                # Secciones del landing
│   ├── HeroVideo.tsx       # Hero con video
│   ├── Services.tsx        # Servicios
│   ├── BeautyBar.tsx       # Beauty Bar
│   ├── About.tsx           # Sobre nosotros
│   └── BookingWizard.tsx   # Formulario de citas
├── features/                # Funcionalidades
│   ├── appointments/       # Gestión de citas
│   └── services/           # Gestión de servicios
├── components/ui/          # Componentes UI base
└── shared/                 # Utilidades compartidas
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Para producción:
```env
VITE_API_URL=https://api.beaute-clinic.com
```

## 📱 Funcionalidades

### Landing Page (Cliente)
- Hero con video/imagen de fondo
- Listado de servicios
- Beauty Bar
- Sobre la Dra. Meyryn
- **Reserva de citas online** (wizard de 4 pasos)

### Admin Dashboard
- **Dashboard**: Estadísticas y citas recientes
- **Citas**: Gestión completa de citas (CRUD)
- **Pacientes**: Gestión de pacientes
- **Servicios**: Gestión de servicios ofrecidos
- **Reportes**: Análisis y estadísticas
- **Configuración**: Ajustes del sistema

## 🎨 Sistema de Diseño

### Colores
- **Gold**: `#AC802A` (Primary)
- **Cream**: `#FAEFE6` (Background)
- **Earth**: `#51350C` (Text)
- **Rose**: `#A97574` (Accent)

### Tipografía
- **Títulos**: Dream Orphans
- **Cuerpo**: Lato

## 🔄 Integración con Backend

El sistema está preparado para integrarse con el `appointment-bot`:

### Endpoints Esperados
- `GET /api/services` - Lista de servicios
- `GET /api/slots/available?date=YYYY-MM-DD` - Horarios disponibles
- `POST /api/appointments` - Crear cita
- `GET /api/appointments` - Listar citas
- `PATCH /api/appointments/:id` - Actualizar cita
- `DELETE /api/appointments/:id` - Eliminar cita

### Datos Mock
Si el backend no está disponible, el sistema usa datos mock para demostración.

## 🚀 Despliegue

### Vercel
```bash
npm run deploy:vercel
```

### Construcción Manual
```bash
npm run build
# Los archivos se generan en /dist
```

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo localhost |
| `npm run dev:network` | Servidor accesible desde red |
| `npm run build` | Construir para producción |
| `npm run preview` | Previsualizar build |
| `npm run type-check` | Verificar tipos |
| `npm run lint` | Ejecutar linter |

## 🐛 Solución de Problemas

### No se ven los servicios
- Verifica que el hook `useServices` tenga `initialData`
- Los datos mock se cargan automáticamente si el backend no responde

### Error de CORS
- Verifica la configuración del proxy en `vite.config.ts`
- Asegúrate de que el backend permita requests desde el frontend

### No carga el video del Hero
- Coloca el video en `public/videos/beaute-hero.mp4`
- El sistema usa imagen de fallback si no hay video

## 👩‍💻 Autor

**Dra. Meyryn Carrillo** - Clínica de Estética y Nutrición

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.
