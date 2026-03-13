# 🚀 Deploy en Vercel - Resumen Rápido

## Opción 1: Deploy Manual (30 segundos)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a producción
vercel --prod
```

## Opción 2: GitHub Integration (Recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Vercel detectará automáticamente Vite
4. Click en **Deploy**

## Configuración Automática

Vercel detectará estos valores automáticamente:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Dominio Personalizado

1. En el dashboard del proyecto → **Settings** → **Domains**
2. Agrega: `beaute.cr`
3. Configura DNS según instrucciones de Vercel

## ✅ Estado del Build

```
✅ TypeScript: Sin errores
✅ Build: Exitoso
✅ Imágenes: 9/9 presentes
✅ HTML: Optimizado para SEO
✅ Bundle: 351 KB JS, 111 KB CSS
```

## 🌐 URLs

- **Producción**: `https://beaute-cr.vercel.app` (ejemplo)
- **Personalizado**: `https://beaute.cr` (configurar dominio)

## 📞 Soporte

- [Vercel Docs](https://vercel.com/docs)
- [Guía completa](DEPLOY.md)
