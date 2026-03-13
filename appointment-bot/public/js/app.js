/**
 * Dental Bot Admin Panel - Main Application JavaScript
 */

// API Base URL
const API_BASE_URL = '';

// App State
const appState = {
  sidebarOpen: false,
  notifications: [],
  currentUser: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initNotifications();
  initThemeToggle();
  loadUserInfo();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  // Set initial state
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    themeToggle.classList.add('active');
  }
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.classList.toggle('active');
    
    // Show feedback
    showToast('Tema cambiado', newTheme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado', 'info');
  });
}

// Sidebar Toggle
function initSidebar() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  function toggleSidebar() {
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    appState.sidebarOpen = !appState.sidebarOpen;
  }
  
  function closeSidebar() {
    sidebar.classList.remove('active');
    menuToggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    appState.sidebarOpen = false;
  }
  
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // Close sidebar when clicking a nav item on mobile
  const navItems = sidebar?.querySelectorAll('.nav-item');
  navItems?.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && appState.sidebarOpen) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        closeSidebar();
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && appState.sidebarOpen) {
      closeSidebar();
    }
  });
}

// Notifications
function initNotifications() {
  const notificationBtn = document.getElementById('notificationBtn');
  
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      showToast('Notificaciones', 'No tienes notificaciones nuevas', 'info');
    });
  }
  
  // Update badge
  updateNotificationBadge();
}

function updateNotificationBadge() {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    const count = appState.notifications.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// API Helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (response.status === 401) {
      showToast('Error', 'No autorizado. Por favor inicie sesión.', 'error');
      throw new Error('Unauthorized');
    }
    
    if (response.status === 403) {
      showToast('Error', 'Acceso denegado.', 'error');
      throw new Error('Forbidden');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    
    // Show user-friendly error message
    if (error.message === 'Failed to fetch') {
      showToast('Error de conexión', 'No se pudo conectar con el servidor. Verifique su conexión.', 'error');
    }
    
    throw error;
  }
}

// Format Date
function formatDate(dateString, options = {}) {
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return date.toLocaleDateString('es-ES', defaultOptions);
}

// Format Time
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format DateTime
function formatDateTime(dateString) {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

// Get Status Badge HTML
function getStatusBadge(status) {
  const statusMap = {
    'confirmada': { class: 'status-confirmed', label: 'Confirmada' },
    'confirmado': { class: 'status-confirmed', label: 'Confirmada' },
    'pendiente': { class: 'status-pending', label: 'Pendiente' },
    'cancelada': { class: 'status-cancelled', label: 'Cancelada' },
    'cancelado': { class: 'status-cancelled', label: 'Cancelada' },
    'completada': { class: 'status-completed', label: 'Completada' },
    'completado': { class: 'status-completed', label: 'Completada' },
    'recordatorio_enviado': { class: 'status-confirmed', label: 'Recordatorio Enviado' }
  };
  
  const statusInfo = statusMap[status] || { class: 'status-pending', label: status };
  return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
}

// Get Channel Badge HTML
function getChannelBadge(channel) {
  const channelMap = {
    'whatsapp': { class: 'channel-whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp' },
    'instagram': { class: 'channel-instagram', icon: 'fa-instagram', label: 'Instagram' }
  };
  
  const channelInfo = channelMap[channel] || { class: '', icon: 'fa-comment', label: channel };
  return `<span class="channel-badge ${channelInfo.class}"><i class="fab ${channelInfo.icon}"></i> ${channelInfo.label}</span>`;
}

// Toast Notifications
function showToast(title, message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = `
    <i class="fas ${iconMap[type]}"></i>
    <div>
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal on close button click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-close')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// Load User Info
function loadUserInfo() {
  // This can be extended to fetch actual user data from the API
  appState.currentUser = {
    name: 'Admin',
    role: 'Clínica Dental'
  };
}

// Confirm Dialog
function confirmDialog(message, onConfirm) {
  if (confirm(message)) {
    onConfirm();
  }
}

// Debounce Function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Real-time Notifications System
const notificationSystem = {
  lastCheck: new Date(),
  checkInterval: null,
  unreadCount: 0,
  
  start() {
    // Check every 30 seconds
    this.checkInterval = setInterval(() => this.checkForUpdates(), 30000);
    this.checkForUpdates();
  },
  
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  },
  
  async checkForUpdates() {
    try {
      // Get recent appointments
      const appointments = await apiRequest('/appointments?limit=10');
      const recentAppointments = appointments.filter(a => 
        new Date(a.created_at) > this.lastCheck
      );
      
      // Get recent messages
      const messages = await apiRequest('/messages?limit=10');
      const recentMessages = messages.filter(m => 
        new Date(m.created_at) > this.lastCheck
      );
      
      // Show notifications
      recentAppointments.forEach(apt => {
        showToast('Nueva Cita', `${apt.patient_name || 'Paciente'} agendó ${apt.service_name}`, 'success');
      });
      
      recentMessages.forEach(msg => {
        if (msg.direction === 'inbound') {
          showToast('Nuevo Mensaje', `Mensaje de ${msg.patient_name || 'Paciente'}`, 'info');
        }
      });
      
      // Update badge
      const totalNew = recentAppointments.length + recentMessages.filter(m => m.direction === 'inbound').length;
      if (totalNew > 0) {
        this.unreadCount += totalNew;
        updateNotificationBadge(this.unreadCount);
      }
      
      this.lastCheck = new Date();
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }
};

// Start notifications when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Start notification system after 5 seconds
  setTimeout(() => notificationSystem.start(), 5000);
});

// Update notification badge
function updateNotificationBadge(count) {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    
    // Animate badge
    if (count > 0) {
      badge.style.transform = 'scale(1.2)';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
      }, 200);
    }
  }
}

// Export functions for use in other scripts
window.DentalBot = {
  apiRequest,
  formatDate,
  formatTime,
  formatDateTime,
  getStatusBadge,
  getChannelBadge,
  showToast,
  openModal,
  closeModal,
  confirmDialog,
  debounce,
  notificationSystem
};
