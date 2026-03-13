# 🔗 Integración Frontend + Backend (appointment-bot)

Esta guía explica cómo integrar el frontend de Beauté con el backend del appointment-bot.

---

## 📋 Arquitectura

```
┌─────────────────────┐      HTTP/API       ┌─────────────────────┐
│   Frontend (Vite)   │ ◄──────────────────► │  Backend (Express)  │
│   Port: 5173        │                      │   Port: 3000        │
│                     │                      │                     │
│  • React + TS       │                      │  • Express          │
│  • Tailwind         │                      │  • PostgreSQL       │
│  • Vite             │                      │  • WhatsApp Bot     │
└─────────────────────┘                      └─────────────────────┘
         │                                            │
         │           Proxy (dev)                      │
         └────────────────────────────────────────────┘
```

---

## 🚀 Inicio Rápido

### Paso 1: Iniciar el Backend (appointment-bot)

```bash
cd appointment-bot

# Instalar dependencias (si no están instaladas)
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### Paso 2: Iniciar el Frontend

```bash
# Desde la raíz del proyecto
cd ..

# Instalar dependencias (si no están instaladas)
npm install

# Configurar variables de entorno
cp .env.example .env
# Asegurar que VITE_API_URL=http://localhost:3000

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración del Proxy

En desarrollo, Vite está configurado para hacer proxy de las peticiones `/api` al backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: process.env.VITE_API_URL || 'http://localhost:3000',
      changeOrigin: true,
    },
    '/webhook': {
      target: process.env.VITE_API_URL || 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

Esto permite que el frontend haga peticiones a `/api/appointments` y Vite las redirija automáticamente al backend.

---

## 🔧 Variables de Entorno

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

### Backend (appointment-bot/.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beauty_clinic
DB_USER=postgres
DB_PASSWORD=your_password

# WhatsApp (Meta)
WHATSAPP_TOKEN=your_token
WHATSAPP_PHONE_ID=your_phone_id
WHATSAPP_WEBHOOK_TOKEN=your_webhook_token

# Admin Auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password

# Google Calendar (opcional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...
```

---

## 📊 Endpoints API Integrados

El frontend utiliza estos endpoints del backend:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/dashboard/stats` | GET | Estadísticas del dashboard |
| `/api/appointments` | GET | Listar citas |
| `/api/appointments` | POST | Crear cita |
| `/api/appointments/:id` | PATCH | Actualizar cita |
| `/api/appointments/:id` | DELETE | Eliminar cita |
| `/api/slots/available` | GET | Slots disponibles |
| `/api/services` | GET | Servicios disponibles |
| `/api/patients` | GET | Pacientes |
| `/api/messages` | GET | Mensajes |

---

## 🔄 Flujo de Datos

### Crear Cita (Desde Web)

```
1. Usuario selecciona servicio
   └─► GET /api/services

2. Usuario selecciona fecha
   └─► GET /api/slots/available?date=2025-03-20

3. Usuario completa datos
   
4. Usuario confirma
   └─► POST /api/appointments
       {
         patient_name: "María González",
         patient_phone: "+50688888888",
         appointment_at: "2025-03-20T14:00:00Z",
         service: "Limpieza Dental",
         notes: "...",
         channel: "web"
       }

5. Backend crea:
   - Paciente (si no existe)
   - Cita en database
   - Recordatorio programado
   
6. Respuesta exitosa al frontend
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"

**Problema:** El frontend no puede conectar con el backend

**Solución:**
1. Verificar que el backend está corriendo:
   ```bash
   curl http://localhost:3000/health
   ```
2. Verificar `VITE_API_URL` en `.env`
3. Reiniciar el servidor de Vite

### Error: "CORS policy"

**Problema:** Error de CORS en navegador

**Solución:** 
El proxy de Vite debería manejar esto automáticamente. Si persiste:
1. Verificar que el backend tiene CORS habilitado
2. Verificar que las URLs coinciden

### Error: "Database connection failed"

**Problema:** Backend no puede conectar a PostgreSQL

**Solución:**
1. Verificar PostgreSQL está corriendo
2. Verificar credenciales en `.env`
3. Crear la base de datos:
   ```sql
   CREATE DATABASE beauty_clinic;
   ```

---

## 🚀 Deploy en Producción

### Opción 1: Mismo Servidor

```
Servidor VPS
├── /var/www/frontend (dist/)
│   └── index.html + assets
├── /var/www/backend (appointment-bot)
│   └── server.js
└── Nginx
    ├── / → frontend
    └── /api → backend:3000
```

### Opción 2: Separados

```
Vercel (Frontend) ←──API──→ Railway/Render (Backend)
     │                            │
     │                            └── PostgreSQL
     └── Static Files
```

---

## 📁 Estructura de Archivos

```
beaute-clinic/
├── src/
│   └── services/
│       └── api.ts          # Cliente API del frontend
├── appointment-bot/        # Backend
│   ├── src/
│   │   ├── routes/
│   │   │   └── api.js      # Endpoints API
│   │   ├── models/
│   │   │   └── db.js       # Database connection
│   │   └── server.js       # Entry point
│   └── .env                # Backend env
├── .env                    # Frontend env
└── vite.config.ts          # Proxy config
```

---

## 🧪 Testing

### Test Backend

```bash
cd appointment-bot
npm test
```

### Test Frontend

```bash
cd ..
npm run type-check
npm run build
```

### Test Integración

```bash
# 1. Iniciar backend
cd appointment-bot && npm run dev

# 2. En otra terminal, iniciar frontend
npm run dev

# 3. Abrir navegador
open http://localhost:5173

# 4. Crear una cita y verificar en:
# - Frontend: Mensaje de éxito
# - Backend: Consola muestra la creación
# - Database: Cita aparece en tabla
```

---

## 📝 Notas Importantes

1. **El backend debe estar corriendo antes del frontend** para que el proxy funcione
2. **Las variables de entorno del frontend deben empezar con `VITE_`** para ser accesibles
3. **El backend usa puerto 3000 por defecto** - asegurar que no esté ocupado
4. **En producción**, configurar el proxy inverso (Nginx) para redirigir `/api` al backend

---

## 📞 Soporte

Si tienes problemas con la integración:

1. Revisar logs del backend: `appointment-bot/logs/`
2. Verificar consola del navegador (F12)
3. Probar endpoints directamente con curl/Postman
4. Verificar configuración de CORS en backend
