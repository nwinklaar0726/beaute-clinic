#!/usr/bin/env node

/**
 * Script de verificación de build para Beauté
 * Verifica que el build esté listo para producción
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const REQUIRED_FILES = [
  'index.html',
  'logo-icon.svg'
];

const REQUIRED_IMAGES = [
  'hero-spa.jpg',
  'dra-meyryn.jpg',
  'aparatologia.jpg',
  'medicina-estetica.jpg',
  'nutricion.jpg',
  'terapia-iv.jpg',
  'manicure-pedicure.jpg'
];

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkFile(filePath) {
  const fullPath = path.join('dist', filePath);
  return fs.existsSync(fullPath);
}

function getFileSize(filePath) {
  const fullPath = path.join('dist', filePath);
  if (fs.existsSync(fullPath)) {
    return fs.statSync(fullPath).size;
  }
  return 0;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function verifyBuild() {
  log('\n🔍 Verificando build de Beauté...\n', 'cyan');
  
  let hasErrors = false;
  
  // 1. Verificar que existe la carpeta dist
  if (!fs.existsSync('dist')) {
    log('❌ ERROR: No existe la carpeta dist/', 'red');
    log('   Ejecuta: npm run build', 'yellow');
    process.exit(1);
  }
  
  // 2. Verificar archivos requeridos
  log('📄 Verificando archivos requeridos...', 'blue');
  for (const file of REQUIRED_FILES) {
    if (checkFile(file)) {
      const size = getFileSize(file);
      log(`  ✅ ${file} (${formatBytes(size)})`, 'green');
    } else {
      log(`  ❌ Falta: ${file}`, 'red');
      hasErrors = true;
    }
  }
  
  // 3. Verificar imágenes
  log('\n🖼️  Verificando imágenes...', 'blue');
  for (const image of REQUIRED_IMAGES) {
    if (checkFile(`images/${image}`)) {
      const size = getFileSize(`images/${image}`);
      log(`  ✅ ${image} (${formatBytes(size)})`, 'green');
    } else {
      log(`  ⚠️  Falta (opcional): ${image}`, 'yellow');
    }
  }
  
  // 4. Verificar tamaño del bundle
  log('\n📦 Verificando bundle...', 'blue');
  const assetsDir = path.join('dist', 'assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    for (const file of files) {
      const size = getFileSize(`assets/${file}`);
      log(`  ✅ ${file}: ${formatBytes(size)}`, 'green');
    }
  }
  
  // 5. Verificar HTML
  log('\n🔍 Verificando HTML...', 'blue');
  const htmlPath = path.join('dist', 'index.html');
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    const requiredMetaTags = ['viewport', 'description'];
    
    for (const tag of requiredMetaTags) {
      if (htmlContent.includes(tag)) {
        log(`  ✅ Meta tag: ${tag}`, 'green');
      } else {
        log(`  ⚠️  Falta meta tag: ${tag}`, 'yellow');
      }
    }
  }
  
  // Resultado final
  log('\n' + '='.repeat(50), 'cyan');
  if (hasErrors) {
    log('❌ Verificación fallida. Corrige los errores arriba.', 'red');
    process.exit(1);
  } else {
    log('✅ Build verificado correctamente!', 'green');
    log('\n🚀 Listo para deploy en Vercel:', 'cyan');
    log('   vercel --prod', 'yellow');
  }
  log('='.repeat(50) + '\n', 'cyan');
}

verifyBuild().catch(err => {
  log(`\n❌ Error: ${err.message}`, 'red');
  process.exit(1);
});
