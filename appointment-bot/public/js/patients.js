/**
 * Dental Bot Admin Panel - Patients JavaScript
 */

let allPatients = [];
let filteredPatients = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  loadPatients();
  setupEventListeners();
});

// Load Patients
async function loadPatients() {
  const tbody = document.querySelector('#patientsTable tbody');
  tbody.innerHTML = `
    <tr class="empty-state">
      <td colspan="8">
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      </td>
    </tr>
  `;
  
  try {
    allPatients = await DentalBot.apiRequest('/patients?limit=100');
    filteredPatients = [...allPatients];
    
    renderPatients(filteredPatients);
    updateCount();
  } catch (error) {
    console.error('Error loading patients:', error);
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="8">
          <div class="empty-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error al cargar los pacientes</p>
          </div>
        </td>
      </tr>
    `;
    showToast('Error', 'No se pudieron cargar los pacientes', 'error');
  }
}

// Render Patients Table
function renderPatients(patients) {
  const tbody = document.querySelector('#patientsTable tbody');
  
  if (patients.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="8">
          <div class="empty-message">
            <i class="fas fa-inbox"></i>
            <p>No hay pacientes registrados</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = patients.map(patient => `
    <tr>
      <td>#${patient.id}</td>
      <td>
        <strong>${patient.full_name || 'Sin nombre'}</strong>
      </td>
      <td>${patient.phone || '-'}</td>
      <td>${getChannelBadge(patient.channel)}</td>
      <td><code>${patient.channel_id}</code></td>
      <td>
        <span class="badge-count">${patient.appointments_count || 0}</span>
      </td>
      <td>${patient.last_appointment ? formatTimeAgo(patient.last_appointment) : 'Nunca'}</td>
      <td>
        <div class="action-btns">
          <button class="btn-action" onclick="viewPatient(${patient.id})" title="Ver">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-action" onclick="viewPatientHistory(${patient.id})" title="Historial">
            <i class="fas fa-history"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Update count
function updateCount() {
  document.getElementById('totalCount').textContent = `${filteredPatients.length} pacientes`;
}

// Setup Event Listeners
function setupEventListeners() {
  // Search
  document.getElementById('searchInput')?.addEventListener('input', debounce(filterPatients, 300));
  
  // Channel Filter
  document.getElementById('channelFilter')?.addEventListener('change', filterPatients);
  
  // Close Modal
  document.getElementById('closeModal')?.addEventListener('click', () => {
    closeModal('patientModal');
  });
}

// Filter Patients
function filterPatients() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const channel = document.getElementById('channelFilter').value;
  
  filteredPatients = allPatients.filter(patient => {
    const matchesSearch = !search || 
      (patient.full_name && patient.full_name.toLowerCase().includes(search)) ||
      (patient.phone && patient.phone.includes(search)) ||
      patient.channel_id.toLowerCase().includes(search);
    
    const matchesChannel = !channel || patient.channel === channel;
    
    return matchesSearch && matchesChannel;
  });
  
  renderPatients(filteredPatients);
  updateCount();
}

// View Patient Details
async function viewPatient(id) {
  const modal = document.getElementById('patientModal');
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
  openModal('patientModal');
  
  try {
    const patient = await DentalBot.apiRequest(`/patients/${id}`);
    
    const completedAppointments = patient.appointments?.filter(a => a.status === 'completada').length || 0;
    const upcomingAppointments = patient.appointments?.filter(a => 
      ['confirmada', 'pendiente'].includes(a.status) && 
      new Date(a.appointment_at) >= new Date()
    ) || [];
    
    modalBody.innerHTML = `
      <div class="patient-details">
        <div class="patient-header" style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
          <div class="patient-avatar-large" style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
            <i class="fas fa-user"></i>
          </div>
          <div style="flex: 1;">
            <h2 style="margin-bottom: 0.25rem;">${patient.full_name || 'Sin nombre'}</h2>
            <p style="color: var(--text-secondary);">
              ${getChannelBadge(patient.channel)} · ID: ${patient.channel_id}
            </p>
            <p style="color: var(--text-secondary); margin-top: 0.25rem;">
              <i class="fas fa-phone"></i> ${patient.phone || 'No registrado'}
              ${patient.email ? `<br><i class="fas fa-envelope"></i> ${patient.email}` : ''}
            </p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <div class="stat-box" style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius); text-align: center;">
            <h4 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${patient.appointments?.length || 0}</h4>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Citas Totales</p>
          </div>
          <div class="stat-box" style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius); text-align: center;">
            <h4 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${completedAppointments}</h4>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Completadas</p>
          </div>
          <div class="stat-box" style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius); text-align: center;">
            <h4 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${upcomingAppointments.length}</h4>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Próximas</p>
          </div>
        </div>
        
        ${upcomingAppointments.length > 0 ? `
          <h3 style="margin-bottom: 1rem; color: var(--primary);">
            <i class="fas fa-calendar-day"></i> Próximas Citas
          </h3>
          <div class="appointments-list" style="margin-bottom: 1.5rem;">
            ${upcomingAppointments.slice(0, 3).map(apt => `
              <div class="appointment-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.875rem; background: #eff6ff; border-radius: var(--radius); margin-bottom: 0.5rem; border-left: 3px solid var(--primary);">
                <div>
                  <strong>${apt.service_name}</strong>
                  <p style="font-size: 0.85rem; color: var(--text-secondary);">${formatDate(apt.appointment_at)} · ${formatTime(apt.appointment_at)}</p>
                </div>
                ${getStatusBadge(apt.status)}
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <h3 style="margin-bottom: 1rem;">Historial de Citas</h3>
        <div class="appointments-list" style="max-height: 250px; overflow-y: auto;">
          ${patient.appointments?.length ? patient.appointments.slice(0, 5).map(apt => `
            <div class="appointment-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.875rem; background: var(--bg-main); border-radius: var(--radius); margin-bottom: 0.5rem;">
              <div>
                <strong>${apt.service_name}</strong>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${formatDate(apt.appointment_at)} · ${formatTime(apt.appointment_at)}</p>
              </div>
              ${getStatusBadge(apt.status)}
            </div>
          `).join('') : '<p style="color: var(--text-light); text-align: center; padding: 1rem;">Sin citas registradas</p>'}
        </div>
        
        <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button class="btn btn-secondary" onclick="closeModal('patientModal')">Cerrar</button>
          <a href="appointments.html" class="btn btn-primary">
            <i class="fas fa-calendar-plus"></i> Nueva Cita
          </a>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading patient:', error);
    modalBody.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error al cargar el paciente</p>
      </div>
    `;
  }
}

// View Patient History
function viewPatientHistory(id) {
  viewPatient(id);
}

// Helper Functions
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

function getChannelBadge(channel) {
  const channelMap = {
    'whatsapp': { class: 'channel-whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp' },
    'instagram': { class: 'channel-instagram', icon: 'fa-instagram', label: 'Instagram' }
  };
  
  const channelInfo = channelMap[channel] || { class: '', icon: 'fa-comment', label: channel };
  return `<span class="channel-badge ${channelInfo.class}"><i class="fab ${channelInfo.icon}"></i> ${channelInfo.label}</span>`;
}

function getStatusBadge(status) {
  const statusMap = {
    'confirmada': { class: 'status-confirmed', label: 'Confirmada' },
    'confirmado': { class: 'status-confirmed', label: 'Confirmada' },
    'pendiente': { class: 'status-pending', label: 'Pendiente' },
    'cancelada': { class: 'status-cancelled', label: 'Cancelada' },
    'cancelado': { class: 'status-cancelled', label: 'Cancelada' },
    'completada': { class: 'status-completed', label: 'Completada' },
    'completado': { class: 'status-completed', label: 'Completada' }
  };
  
  const statusInfo = statusMap[status] || { class: 'status-pending', label: status };
  return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
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
