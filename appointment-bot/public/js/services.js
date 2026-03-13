/**
 * Dental Bot Admin Panel - Services JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  loadServices();
});

// Load Services
async function loadServices() {
  const container = document.getElementById('servicesGrid');
  
  container.innerHTML = `
    <div class="loading-container" style="grid-column: 1 / -1;">
      <div class="spinner"></div>
    </div>
  `;
  
  try {
    const services = await DentalBot.apiRequest('/services');
    
    const serviceIcons = {
      'limpieza': 'fa-tooth',
      'consulta': 'fa-stethoscope',
      'blanqueamiento': 'fa-magic',
      'extraccion': 'fa-teeth-open',
      'ortodoncia': 'fa-teeth',
      'empaste': 'fa-fill-drip'
    };
    
    const serviceColors = {
      'limpieza': 'bg-blue',
      'consulta': 'bg-green',
      'blanqueamiento': 'bg-purple',
      'extraccion': 'bg-orange',
      'ortodoncia': 'bg-cyan',
      'empaste': 'bg-red'
    };
    
    const serviceDescriptions = {
      'limpieza': 'Limpieza profunda y eliminación de placa bacteriana',
      'consulta': 'Evaluación y diagnóstico dental completo',
      'blanqueamiento': 'Tratamiento para aclarar el color de los dientes',
      'extraccion': 'Extracción de dientes con técnicas modernas',
      'ortodoncia': 'Corrección de la posición de los dientes',
      'empaste': 'Restauración de dientes con caries'
    };
    
    if (services.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-inbox"></i>
          <p>No hay servicios configurados</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = services.map(service => {
      const icon = serviceIcons[service.key] || 'fa-tooth';
      const color = serviceColors[service.key] || 'bg-blue';
      const description = serviceDescriptions[service.key] || service.name;
      
      return `
        <div class="service-card" style="background: white; border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); transition: var(--transition); border: 1px solid var(--border-color);">
          <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
            <div class="${color}" style="width: 56px; height: 56px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
              <i class="fas ${icon}"></i>
            </div>
            <div style="flex: 1;">
              <h3 style="margin-bottom: 0.25rem;">${service.name}</h3>
              <p style="color: var(--text-secondary); font-size: 0.85rem;">${service.key}</p>
            </div>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 1rem; min-height: 40px;">${description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-color);">
            <div>
              <span style="color: var(--text-light); font-size: 0.8rem;">Duración</span>
              <p style="font-weight: 600;">${service.duration} min</p>
            </div>
            <div style="text-align: right;">
              <span style="color: var(--text-light); font-size: 0.8rem;">Precio</span>
              <p style="font-weight: 600; color: var(--success);">₡${service.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Add hover effect
    container.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = 'var(--shadow-lg)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
    
  } catch (error) {
    console.error('Error loading services:', error);
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error al cargar los servicios</p>
      </div>
    `;
  }
}
