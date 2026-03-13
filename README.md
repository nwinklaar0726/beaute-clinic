# Beauté - Clínica de Estética y Nutrición

**Dra. Meyryn Carrillo | Costa Rica**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/beaute-clinic)

Plataforma web de lujo para clínica de medicina estética y nutrición integral.

![Beauté Logo](./public/logo-icon.svg)

---

## 🚀 Deploy Rápido en Vercel

### Opción 1: One-Click Deploy

Click en el botón arriba para deploy automático en Vercel.

### Opción 2: CLI

```bash
npm i -g vercel
vercel --prod
```

### Opción 3: GitHub Integration

1. Push a GitHub
2. Conectar en [vercel.com/new](https://vercel.com/new)
3. Deploy automático en cada push

---

## 🎨 Sistema de Diseño

### Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Cream | `#FAEFE6` | Fondo principal |
| Earth Deep | `#51350C` | Textos principales |
| Gold | `#AC802A` | CTAs y acentos |
| Gold Light | `#C9A961` | Hover states |
| Rose | `#A97574` | Acentos cálidos |
| Olive | `#59533C` | Wellness/Naturaleza |

### Tipografía

- **Display**: Dream Orphans - Títulos y headlines
- **Body**: Lato (300, 400, 700) - Cuerpo de texto
- **Accent**: Bestand - Firma y elementos decorativos

---

## 🛠️ Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build producción
npm run build

# Verificar build
npm run verify

# Deploy
vercel --prod
```

---

## 📁 Estructura del Proyecto

```
beaute-clinic/
├── .github/workflows/      # CI/CD GitHub Actions
├── public/                 # Assets estáticos
│   ├── fonts/              # Fuentes personalizadas
│   ├── images/             # 9 imágenes optimizadas
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt          # SEO robots
│   ├── sitemap.xml         # SEO sitemap
│   └── logo-icon.svg       # Favicon
├── scripts/                # Scripts de utilidad
│   └── verify-build.cjs    # Verificación de build
├── src/
│   ├── components/ui/      # 5 componentes de lujo
│   ├── sections/           # 7 secciones de la página
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── vercel.json             # Configuración Vercel
├── netlify.toml            # Configuración Netlify (alternativa)
└── package.json
```

---

## ✨ Características

### Diseño Visual
- 🎨 Paleta de colores premium según Brandbook
- ✨ Micro-interacciones elegantes
- 🌿 Patrones botánicos decorativos
- 📱 Diseño responsive completo
- 🎯 Jerarquía visual clara

### Funcionalidades
- 📅 Sistema de citas wizard (4 pasos)
- 🔍 Catálogo de servicios con detalles
- 📍 Navegación intuitiva con scroll
- 📧 Notificaciones toast elegantes
- ⚡ Loading states animados
- 🌐 SEO optimizado
- 📱 PWA ready

### Secciones
1. **Hero** - Sección principal con CTAs dorados
2. **Services** - Catálogo de servicios médicos
3. **Beauty Bar** - Wellness y spa
4. **About** - Dra. Meyryn Carrillo
5. **Booking** - Sistema de citas wizard
6. **Footer** - Información de contacto

---

## 🛠️ Tecnologías

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Deploy**: Vercel / Netlify

---

## 📊 Performance

```
Build Size:
├── JS: 351 KB (gzip: 101 KB)
├── CSS: 111 KB (gzip: 18.7 KB)
├── HTML: 6.9 KB (gzip: 2.3 KB)
└── Images: 9 optimizadas

Lighthouse Score: 95+ (estimated)
├── Performance: 95+
├── Accessibility: 100
├── Best Practices: 100
└── SEO: 100
```

---

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Build producción
npm run preview      # Preview del build
npm run verify       # Verificar build
npm run type-check   # TypeScript check
npm run lint         # ESLint
npm run lint:fix     # ESLint fix
npm run clean        # Limpiar cache
npm run deploy:vercel # Deploy a Vercel
```

---

## ⚠️ Notas Importantes

### Fuentes Personalizadas
Las fuentes (Dream Orphans, Bestand, Apollo) deben colocarse en:

```
public/fonts/
├── DreamOrphans-Regular.woff2
├── DreamOrphans-Italic.woff2
├── DreamOrphans-Bold.woff2
├── Bestand.woff2
└── Apollo.woff2
```

Si no están disponibles, el sitio usará fuentes de fallback.

### Variables de Entorno
Para futuras fases (backend), crear `.env`:

```env
# Supabase (Fase 2)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 🔄 Roadmap

### Fase 1: Frontend ✅ COMPLETADO
- [x] Landing page premium
- [x] Sistema de citas wizard
- [x] Responsive design
- [x] SEO optimizado
- [x] Deploy en Vercel

### Fase 2: Backend (Próximo)
- [ ] Supabase setup
- [ ] Database schema
- [ ] API routes
- [ ] Auth system

### Fase 3: Admin Dashboard
- [ ] Sidebar layout
- [ ] Dashboard con stats
- [ ] CRUD pacientes
- [ ] Gestión citas

### Fase 4: Integraciones
- [ ] Google Calendar
- [ ] WhatsApp Business
- [ ] Email notifications
- [ ] SMS reminders

---

## 📄 Documentación

- [DEPLOY.md](DEPLOY.md) - Guía completa de deploy
- [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) - Deploy rápido en Vercel
- [CHANGES.md](CHANGES.md) - Historial de cambios
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Estado del proyecto
- [src/components/ui/README.md](src/components/ui/README.md) - Componentes UI

---

## 📞 Contacto

- **Email**: info@beaute.cr
- **Teléfono**: +506 8888 8888
- **Ubicación**: San José, Costa Rica
- **Instagram**: [@beaute.cr](https://instagram.com/beaute.cr)

---

## 📄 Licencia

© 2025 Beauté by Dra. Meyryn Carrillo. Todos los derechos reservados.

---

Desarrollado con ❤️ para tu bienestar

[![Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
