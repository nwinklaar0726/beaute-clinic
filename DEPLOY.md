# 🚀 Guía de Deploy - Beauté en Vercel

Esta guía explica cómo desplegar el proyecto Beauté en Vercel de forma manual o automática.

---

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com) (gratuita)
- Cuenta en [GitHub](https://github.com)
- Node.js 20+ instalado localmente
- Proyecto subido a un repositorio de GitHub

---

## 🚀 Opción 1: Deploy Manual (Rápido)

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Login en Vercel

```bash
vercel login
```

### Paso 3: Deploy

```bash
# Desde la raíz del proyecto
cd /Users/nwinklaarc/Documents/GitHub/beaute-clinic

# Deploy a preview
vercel

# Deploy a producción
vercel --prod
```

### Paso 4: Configurar Variables de Entorno (Opcional)

```bash
vercel env add VARIABLE_NAME
```

---

## 🔗 Opción 2: GitHub Integration (Recomendado)

### Paso 1: Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Selecciona el proyecto `beaute-clinic`

### Paso 2: Configurar Build Settings

Vercel detectará automáticamente la configuración, pero verifica:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Paso 3: Deploy

Click en **"Deploy"** y Vercel hará:
1. Build del proyecto
2. Deploy automático
3. URL de preview

### Paso 4: Configurar Dominio Personalizado (Opcional)

1. En el dashboard del proyecto, ve a **"Settings"** > **"Domains"**
2. Agrega tu dominio: `beaute.cr`
3. Sigue las instrucciones de configuración DNS

---

## 🤖 Opción 3: GitHub Actions (CI/CD Automático)

### Paso 1: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** > **Secrets and variables** > **Actions**
3. Agrega los siguientes secrets:

```
VERCEL_TOKEN          # Tu token de Vercel
VERCEL_ORG_ID         # ID de tu organización
VERCEL_PROJECT_ID     # ID del proyecto
```

Para obtener estos valores:

```bash
# Instalar Vercel CLI y login
npm i -g vercel
vercel login

# Link proyecto
vercel link

# Ver variables de entorno
vercel env ls
```

O también puedes encontrar:
- `VERCEL_ORG_ID` en la URL del dashboard: `vercel.com/{ORG_ID}/...`
- `VERCEL_PROJECT_ID` en **Settings** > **General** del proyecto

### Paso 2: Verificar Workflow

El archivo `.github/workflows/deploy.yml` ya está configurado. Cada push a `main` desencadenará:

1. TypeScript check
2. ESLint
3. Build
4. Deploy automático a Vercel

### Paso 3: Verificar Deploy

Haz un push a main:

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

Ve a **Actions** en GitHub para ver el progreso.

---

## ⚙️ Configuración de Vercel (vercel.json)

El archivo `vercel.json` incluye:

- **Rewrites**: SPA routing (todas las rutas a index.html)
- **Headers**: Cache control para assets, fonts e imágenes
- **Build settings**: Configuración optimizada para Vite

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## 🔧 Variables de Entorno

Para configurar variables de entorno en Vercel:

### Via CLI:
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

### Via Dashboard:
1. Ve al proyecto en Vercel
2. **Settings** > **Environment Variables**
3. Agrega las variables

### Variables necesarias (para futuras fases):

```env
# Supabase (Fase 2)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Email (Fase 4)
VITE_SENDGRID_API_KEY=

# WhatsApp (Fase 4)
VITE_WHATSAPP_API_KEY=
```

---

## 📊 Monitoreo y Analytics

### Vercel Analytics

1. En el dashboard del proyecto, ve a **Analytics**
2. Activa **Web Analytics**
3. Agrega el script automáticamente

### Vercel Speed Insights

1. Ve a **Speed Insights**
2. Monitorea el performance Core Web Vitals

---

## 🌐 Configuración de Dominio Personalizado

### Paso 1: Comprar Dominio
- [GoDaddy](https://godaddy.com)
- [Namecheap](https://namecheap.com)
- [Google Domains](https://domains.google)

### Paso 2: Configurar en Vercel

1. Dashboard del proyecto > **Settings** > **Domains**
2. Ingresa: `beaute.cr`
3. Selecciona **Add**

### Paso 3: Configurar DNS

En tu proveedor de dominio, agrega estos registros:

**Opción A: Nameservers (Recomendado)**
```
Type: NS
Name: @
Value: ns1.vercel-dns.com
```

**Opción B: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Opción C: CNAME**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Paso 4: SSL/TLS

Vercel proporciona SSL automáticamente vía Let's Encrypt.

---

## 🔒 Seguridad

### Headers de Seguridad (ya configurados)

El archivo `vercel.json` incluye:

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-XSS-Protection", "value": "1; mode=block" },
      { "key": "X-Content-Type-Options", "value": "nosniff" }
    ]
  }
]
```

### HTTPS
Vercel fuerza HTTPS automáticamente en todos los dominios.

---

## 📱 PWA (Progressive Web App)

El proyecto incluye configuración PWA:

- `manifest.json`: Configuración de la app
- Service Worker: Generado automáticamente por Vite PWA (opcional)
- Icons: En `/public/icons/`

Para instalar como app en móvil/desktop, el usuario debe:
1. Visitar el sitio
2. Agregar a inicio / Instalar app

---

## 🧪 Testing antes de Deploy

### Local:
```bash
npm run build
npm run preview
```

### Verificar:
- [ ] Build exitoso
- [ ] TypeScript sin errores
- [ ] ESLint sin errores
- [ ] Imágenes cargan
- [ ] Formulario funciona
- [ ] Responsive design
- [ ] Performance aceptable

---

## 🚨 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Build failed"
```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar lint
npm run lint
```

### Error: "404 on refresh"
Verificar que `vercel.json` tenga la configuración de rewrites:
```json
"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
```

---

## 📞 Soporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Status Page**: [vercel-status.com](https://www.vercel-status.com)

---

## ✅ Checklist Pre-Deploy

- [ ] Build local exitoso
- [ ] Todas las imágenes presentes
- [ ] Variables de entorno configuradas
- [ ] Dominio personalizado (opcional)
- [ ] Analytics activado
- [ ] SSL funcionando
- [ ] PWA configurado

---

**¡Listo para deploy!** 🚀

El proyecto está optimizado para Vercel y debería funcionar perfectamente.
