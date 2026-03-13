/**
 * Dental Bot Admin Panel - Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
  
  // Refresh data every 30 seconds
  setInterval(loadDashboardData, 30000);
});

// Chart instances
let appointmentsChart = null;
let channelsChart = null;

// Load all dashboard data
async function loadDashboardData() {
  showLoadingState();
  
  try {
    await Promise.all([
      loadStats(),
      loadTodayAppointments(),
      loadUpcomingAppointments(),
      loadRecentMessages(),
      loadCharts()
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Error', 'No se pudieron cargar los datos del dashboard', 'error');
  }
}

function showLoadingState() {
  // Use skeleton loaders instead of spinners for better UX
  const skeletonHTML = '<div class="skeleton" style="width: 60px; height: 32px; display: inline-block;"></div>';
  document.getElementById('todayAppointments').innerHTML = skeletonHTML;
  document.getElementById('confirmedAppointments').innerHTML = skeletonHTML;
  document.getElementById('pendingAppointments').innerHTML = skeletonHTML;
  document.getElementById('totalPatients').innerHTML = skeletonHTML;
  
  // Skeleton for tables
  const tbody = document.querySelector('#todayTable tbody');
  if (tbody) {
    tbody.innerHTML = Array(3).fill(0).map(() => `
      <tr>
        <td><div class="skeleton skeleton-text" style="width: 50px;"></div></td>
        <td>
          <div class="skeleton skeleton-text" style="width: 120px;"></div>
          <div class="skeleton skeleton-text" style="width: 80px;"></div>
        </td>
        <td><div class="skeleton skeleton-text" style="width: 100px;"></div></td>
        <td><div class="skeleton skeleton-text" style="width: 80px;"></div></td>
        <td><div class="skeleton skeleton-text" style="width: 60px;"></div></td>
      </tr>
    `).join('');
  }
}

// Load Statistics
async function loadStats() {
  try {
    const stats = await DentalBot.apiRequest('/dashboard/stats');
    
    document.getElementById('todayAppointments').textContent = stats.todayAppointments;
    document.getElementById('confirmedAppointments').textContent = stats.confirmedAppointments;
    document.getElementById('pendingAppointments').textContent = stats.pendingAppointments;
    document.getElementById('totalPatients').textContent = stats.totalPatients;
    
    // Animate numbers
    animateNumbers();
  } catch (error) {
    console.error('Error loading stats:', error);
    document.getElementById('todayAppointments').textContent = '-';
    document.getElementById('confirmedAppointments').textContent = '-';
    document.getElementById('pendingAppointments').textContent = '-';
    document.getElementById('totalPatients').textContent = '-';
  }
}

// Animate number counters
function animateNumbers() {
  const counters = document.querySelectorAll('.stat-info h3');
  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    if (isNaN(target)) return;
    
    let current = 0;
    const increment = target / 20;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 30);
  });
}

// Load Today's Appointments
async function loadTodayAppointments() {
  const tbody = document.querySelector('#todayTable tbody');
  
  try {
    const appointments = await DentalBot.apiRequest('/appointments/today');
    
    if (appointments.length === 0) {
      tbody.innerHTML = `
        <tr class="empty-state">
          <td colspan="5">
            <div class="empty-message">
              <i class="fas fa-inbox"></i>
              <p>No hay citas para hoy</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = appointments.map(apt => `
      <tr>
        <td>${formatTime(apt.appointment_at)}</td>
        <td>
          <strong>${apt.patient_name || 'N/A'}</strong>
          <br><small>${apt.patient_phone || ''}</small>
        </td>
        <td>${apt.service_name}</td>
        <td>${getStatusBadge(apt.status)}</td>
        <td>
          <div class="action-btns">
            <button class="btn-action" onclick="viewAppointment(${apt.id})" title="Ver">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error loading today appointments:', error);
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="5">
          <div class="empty-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error al cargar las citas</p>
          </div>
        </td>
      </tr>
    `;
  }
}

// Load Upcoming Appointments
async function loadUpcomingAppointments() {
  const tbody = document.querySelector('#upcomingTable tbody');
  
  try {
    const appointments = await DentalBot.apiRequest('/appointments/upcoming?days=7');
    
    if (appointments.length === 0) {
      tbody.innerHTML = `
        <tr class="empty-state">
          <td colspan="6">
            <div class="empty-message">
              <i class="fas fa-inbox"></i>
              <p>No hay citas próximas</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }
    
    tbody.innerHTML = appointments.map(apt => `
      <tr>
        <td>${formatDate(apt.appointment_at)}</td>
        <td>${formatTime(apt.appointment_at)}</td>
        <td>${apt.patient_name || 'N/A'}</td>
        <td>${apt.service_name}</td>
        <td>${getChannelBadge(apt.channel)}</td>
        <td>${getStatusBadge(apt.status)}</td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error loading upcoming appointments:', error);
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="6">
          <div class="empty-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error al cargar las citas</p>
          </div>
        </td>
      </tr>
    `;
  }
}

// Load Recent Messages
async function loadRecentMessages() {
  const container = document.getElementById('recentMessages');
  
  try {
    const messages = await DentalBot.apiRequest('/messages?limit=5');
    
    if (messages.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No hay mensajes recientes</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = messages.map(msg => {
      const messageText = extractMessageText(msg);
      return `
        <div class="message-item">
          <div class="message-avatar ${msg.channel}">
            <i class="fab fa-${msg.channel}"></i>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">${msg.patient_name || 'Paciente'}</span>
              <span class="message-time">${formatTimeAgo(msg.created_at)}</span>
            </div>
            <p class="message-text">${messageText}</p>
          </div>
        </div>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error loading recent messages:', error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error al cargar los mensajes</p>
      </div>
    `;
  }
}

// Extract message text from payload
function extractMessageText(msg) {
  try {
    const payload = typeof msg.payload === 'string' ? JSON.parse(msg.payload) : msg.payload;
    
    // WhatsApp format
    if (payload.text?.body) return payload.text.body;
    
    // Instagram format
    if (payload.message?.text) return payload.message.text;
    
    // Outbound message format
    if (payload.body) return payload.body;
    
    return 'Mensaje multimedia';
  } catch (e) {
    return 'Mensaje';
  }
}

// View Appointment Details
async function viewAppointment(id) {
  const modal = document.getElementById('appointmentModal');
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
  openModal('appointmentModal');
  
  try {
    const apt = await DentalBot.apiRequest(`/appointments/${id}`);
    
    modalBody.innerHTML = `
      <div class="form-group">
        <label class="form-label">Paciente</label>
        <input type="text" class="form-input" value="${apt.patient_name || 'N/A'}" readonly>
      </div>
      <div class="form-group">
        <label class="form-label">Servicio</label>
        <input type="text" class="form-input" value="${apt.service_name}" readonly>
      </div>
      <div class="form-group">
        <label class="form-label">Fecha y Hora</label>
        <input type="text" class="form-input" value="${formatDateTime(apt.appointment_at)}" readonly>
      </div>
      <div class="form-group">
        <label class="form-label">Duración</label>
        <input type="text" class="form-input" value="${apt.duration_minutes} minutos" readonly>
      </div>
      <div class="form-group">
        <label class="form-label">Estado</label>
        <div>${getStatusBadge(apt.status)}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Canal</label>
        <div>${getChannelBadge(apt.channel)}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Notas</label>
        <textarea class="form-textarea" readonly>${apt.notes || 'Sin notas'}</textarea>
      </div>
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;">
        <button class="btn btn-secondary" onclick="closeModal('appointmentModal')">Cerrar</button>
        <a href="pages/appointments.html" class="btn btn-primary">Ver Todas las Citas</a>
      </div>
    `;
  } catch (error) {
    modalBody.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error al cargar la cita</p>
      </div>
    `;
  }
}

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateTime(dateString) {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Hace un momento';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 30) return `Hace ${diffDays} días`;
  return formatDate(dateString);
}

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

function getChannelBadge(channel) {
  const channelMap = {
    'whatsapp': { class: 'channel-whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp' },
    'instagram': { class: 'channel-instagram', icon: 'fa-instagram', label: 'Instagram' }
  };
  
  const channelInfo = channelMap[channel] || { class: '', icon: 'fa-comment', label: channel };
  return `<span class="channel-badge ${channelInfo.class}"><i class="fab ${channelInfo.icon}"></i> ${channelInfo.label}</span>`;
}

function showToast(title, message, type = 'info') {
  if (window.DentalBot) {
    window.DentalBot.showToast(title, message, type);
  } else {
    alert(`${title}: ${message}`);
  }
}

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

// Load Charts
async function loadCharts() {
  try {
    const appointments = await DentalBot.apiRequest('/appointments?limit=200');
    
    // Prepare data for status chart
    const statusCounts = {
      confirmada: 0,
      pendiente: 0,
      completada: 0,
      cancelada: 0
    };
    
    const channelCounts = {
      whatsapp: 0,
      instagram: 0
    };
    
    appointments.forEach(apt => {
      if (statusCounts.hasOwnProperty(apt.status)) {
        statusCounts[apt.status]++;
      }
      if (channelCounts.hasOwnProperty(apt.channel)) {
        channelCounts[apt.channel]++;
      }
    });
    
    renderAppointmentsChart(statusCounts);
    renderChannelsChart(channelCounts);
  } catch (error) {
    console.error('Error loading charts:', error);
  }
}

// Render Appointments Status Chart
function renderAppointmentsChart(data) {
  const ctx = document.getElementById('appointmentsChart');
  if (!ctx) return;
  
  if (appointmentsChart) {
    appointmentsChart.destroy();
  }
  
  appointmentsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Confirmadas', 'Pendientes', 'Completadas', 'Canceladas'],
      datasets: [{
        data: [data.confirmada, data.pendiente, data.completada, data.cancelada],
        backgroundColor: [
          '#22c55e', // green
          '#f59e0b', // orange
          '#3b82f6', // blue
          '#ef4444'  // red
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            usePointStyle: true
          }
        }
      }
    }
  });
}

// Render Channels Chart
function renderChannelsChart(data) {
  const ctx = document.getElementById('channelsChart');
  if (!ctx) return;
  
  if (channelsChart) {
    channelsChart.destroy();
  }
  
  channelsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['WhatsApp', 'Instagram'],
      datasets: [{
        label: 'Citas',
        data: [data.whatsapp, data.instagram],
        backgroundColor: [
          '#25d366', // WhatsApp green
          '#e4405f'  // Instagram pink
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}
