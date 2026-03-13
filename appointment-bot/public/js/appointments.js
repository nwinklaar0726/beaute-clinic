/**
 * Dental Bot Admin Panel - Appointments JavaScript
 */

let allAppointments = [];
let filteredAppointments = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  loadAppointments();
  loadFilters();
  setupEventListeners();
});

// Load Appointments
async function loadAppointments() {
  const tbody = document.querySelector('#appointmentsTable tbody');
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
    allAppointments = await DentalBot.apiRequest('/appointments?limit=100');
    filteredAppointments = [...allAppointments];
    
    renderAppointments(filteredAppointments);
    updateCount();
  } catch (error) {
    console.error('Error loading appointments:', error);
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="8">
          <div class="empty-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error al cargar las citas</p>
          </div>
        </td>
      </tr>
    `;
    showToast('Error', 'No se pudieron cargar las citas', 'error');
  }
}

// Render Appointments Table
function renderAppointments(appointments) {
  const tbody = document.querySelector('#appointmentsTable tbody');
  
  if (appointments.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="8">
          <div class="empty-message">
            <i class="fas fa-inbox"></i>
            <p>No hay citas registradas</p>
          </div>
        </td>
      </tr>
    `;
    renderPagination(0);
    return;
  }
  
  // Paginate
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);
  
  tbody.innerHTML = paginatedAppointments.map(apt => `
    <tr>
      <td>#${apt.id}</td>
      <td>${formatDate(apt.appointment_at)}</td>
      <td>${formatTime(apt.appointment_at)}</td>
      <td>
        <strong>${apt.patient_name || 'N/A'}</strong>
        <br><small>${apt.patient_phone || ''}</small>
      </td>
      <td>${apt.service_name}</td>
      <td>${getChannelBadge(apt.channel)}</td>
      <td>${getStatusBadge(apt.status)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-action" onclick="viewAppointment(${apt.id})" title="Ver">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-action" onclick="editAppointment(${apt.id})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action delete" onclick="deleteAppointment(${apt.id})" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  renderPagination(totalPages, appointments.length);
}

// Render Pagination
function renderPagination(totalPages, totalItems) {
  // Remove existing pagination
  const existingPagination = document.querySelector('.pagination');
  if (existingPagination) {
    existingPagination.remove();
  }
  
  if (totalPages <= 1) return;
  
  const card = document.querySelector('.card .card-body');
  const paginationHTML = `
    <div class="pagination">
      <div class="pagination-info">
        Mostrando ${((currentPage - 1) * itemsPerPage) + 1} - ${Math.min(currentPage * itemsPerPage, totalItems)} de ${totalItems}
      </div>
      <div class="pagination-controls">
        <button class="pagination-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
          <i class="fas fa-chevron-left"></i>
        </button>
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
          <button class="pagination-btn ${page === currentPage ? 'active' : ''}" onclick="goToPage(${page})">
            ${page}
          </button>
        `).join('')}
        <button class="pagination-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `;
  
  card.insertAdjacentHTML('beforeend', paginationHTML);
}

// Go to page
function goToPage(page) {
  currentPage = page;
  renderAppointments(filteredAppointments);
  // Scroll to top of table
  document.querySelector('.table-responsive').scrollIntoView({ behavior: 'smooth' });
}

// Update count
function updateCount() {
  document.getElementById('totalCount').textContent = `${filteredAppointments.length} citas`;
}

// Setup Event Listeners
function setupEventListeners() {
  // New Appointment Button
  document.getElementById('newAppointmentBtn')?.addEventListener('click', () => {
    openNewAppointmentModal();
  });
  
  // Close Modal
  document.getElementById('closeModal')?.addEventListener('click', () => {
    closeModal('appointmentModal');
  });
  
  document.getElementById('cancelBtn')?.addEventListener('click', () => {
    closeModal('appointmentModal');
  });
  
  // Form Submit
  document.getElementById('appointmentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveAppointment();
  });
  
  // Filters
  document.getElementById('searchInput')?.addEventListener('input', debounce(filterAppointments, 300));
  document.getElementById('statusFilter')?.addEventListener('change', filterAppointments);
  document.getElementById('dateFilter')?.addEventListener('change', filterAppointments);
  document.getElementById('clearFilters')?.addEventListener('click', clearFilters);
  
  // Date change loads time slots
  document.getElementById('appointmentDate')?.addEventListener('change', loadTimeSlots);
}

// Load Filters Data
async function loadFilters() {
  try {
    // Load patients for select
    const patientSelect = document.getElementById('patientSelect');
    const patients = await DentalBot.apiRequest('/patients?limit=100');
    
    patientSelect.innerHTML = `
      <option value="">Seleccionar paciente...</option>
      ${patients.map(p => `<option value="${p.id}">${p.full_name || p.channel_id}</option>`).join('')}
    `;
    
    // Load services for select
    const serviceSelect = document.getElementById('serviceSelect');
    const services = await DentalBot.apiRequest('/services');
    
    serviceSelect.innerHTML = `
      <option value="">Seleccionar servicio...</option>
      ${services.map(s => `<option value="${s.key}" data-duration="${s.duration}">${s.name}</option>`).join('')}
    `;
  } catch (error) {
    console.error('Error loading filters:', error);
  }
}

// Load Time Slots
async function loadTimeSlots() {
  const dateInput = document.getElementById('appointmentDate');
  const timeSelect = document.getElementById('timeSlot');
  
  if (!dateInput.value) return;
  
  timeSelect.innerHTML = '<option value="">Cargando...</option>';
  timeSelect.disabled = true;
  
  try {
    const slots = await DentalBot.apiRequest(`/slots/available?date=${dateInput.value}`);
    
    timeSelect.innerHTML = `
      <option value="">Seleccionar hora...</option>
      ${slots.map(s => `<option value="${s}">${s}</option>`).join('')}
    `;
    timeSelect.disabled = false;
  } catch (error) {
    console.error('Error loading time slots:', error);
    timeSelect.innerHTML = '<option value="">Error al cargar horarios</option>';
  }
}

// Open New Appointment Modal
function openNewAppointmentModal() {
  document.getElementById('modalTitle').textContent = 'Nueva Cita';
  document.getElementById('appointmentForm').reset();
  document.getElementById('appointmentId').value = '';
  document.getElementById('timeSlot').innerHTML = '<option value="">Seleccionar hora...</option>';
  
  // Set min date to today
  document.getElementById('appointmentDate').min = new Date().toISOString().split('T')[0];
  
  openModal('appointmentModal');
}

// Open Edit Appointment Modal
async function editAppointment(id) {
  document.getElementById('modalTitle').textContent = 'Editar Cita';
  document.getElementById('appointmentId').value = id;
  
  try {
    const apt = await DentalBot.apiRequest(`/appointments/${id}`);
    
    // Set form values
    document.getElementById('patientSelect').value = apt.patient_id;
    
    // Find service key from name
    const serviceSelect = document.getElementById('serviceSelect');
    const serviceOption = Array.from(serviceSelect.options).find(opt => opt.text === apt.service_name);
    if (serviceOption) serviceSelect.value = serviceOption.value;
    
    // Set date and time
    const aptDate = new Date(apt.appointment_at);
    const dateStr = aptDate.toISOString().split('T')[0];
    const timeStr = `${String(aptDate.getHours()).padStart(2, '0')}:${String(aptDate.getMinutes()).padStart(2, '0')}`;
    
    document.getElementById('appointmentDate').value = dateStr;
    await loadTimeSlots();
    document.getElementById('timeSlot').value = timeStr;
    
    document.getElementById('statusSelect').value = apt.status;
    document.getElementById('notes').value = apt.notes || '';
    
    openModal('appointmentModal');
  } catch (error) {
    showToast('Error', 'No se pudo cargar la cita', 'error');
  }
}

// Save Appointment
async function saveAppointment() {
  const appointmentId = document.getElementById('appointmentId').value;
  const patientId = document.getElementById('patientSelect').value;
  const serviceSelect = document.getElementById('serviceSelect');
  const serviceKey = serviceSelect.value;
  const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('timeSlot').value;
  const status = document.getElementById('statusSelect').value;
  const notes = document.getElementById('notes').value;
  
  if (!patientId || !serviceKey || !date || !time) {
    showToast('Error', 'Por favor complete todos los campos requeridos', 'error');
    return;
  }
  
  const appointmentAt = new Date(`${date}T${time}`).toISOString();
  const duration = parseInt(serviceSelect.options[serviceSelect.selectedIndex].dataset.duration) || 30;
  
  try {
    if (appointmentId) {
      // Update existing
      await DentalBot.apiRequest(`/appointments/${appointmentId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          appointmentAt,
          notes
        })
      });
      showToast('Éxito', 'Cita actualizada correctamente', 'success');
    } else {
      // Create new
      await DentalBot.apiRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          serviceKey,
          serviceName,
          appointmentAt,
          durationMinutes: duration,
          notes
        })
      });
      showToast('Éxito', 'Cita creada correctamente', 'success');
    }
    
    closeModal('appointmentModal');
    loadAppointments();
  } catch (error) {
    console.error('Error saving appointment:', error);
    showToast('Error', 'No se pudo guardar la cita', 'error');
  }
}

// View Appointment
async function viewAppointment(id) {
  showToast('Cargando...', 'Obteniendo detalles de la cita', 'info');
  await editAppointment(id);
}

// Delete Appointment
function deleteAppointment(id) {
  confirmDialog('¿Estás seguro de que deseas eliminar esta cita?', async () => {
    try {
      await DentalBot.apiRequest(`/appointments/${id}`, {
        method: 'DELETE'
      });
      showToast('Éxito', 'Cita eliminada correctamente', 'success');
      loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showToast('Error', 'No se pudo eliminar la cita', 'error');
    }
  });
}

// Filter Appointments
function filterAppointments() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const date = document.getElementById('dateFilter').value;
  
  filteredAppointments = allAppointments.filter(apt => {
    const matchesSearch = !search || 
      (apt.patient_name && apt.patient_name.toLowerCase().includes(search)) ||
      apt.service_name.toLowerCase().includes(search);
    
    const matchesStatus = !status || apt.status === status;
    
    const matchesDate = !date || new Date(apt.appointment_at).toISOString().split('T')[0] === date;
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  currentPage = 1; // Reset to first page
  renderAppointments(filteredAppointments);
  updateCount();
}

// Clear Filters
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('dateFilter').value = '';
  filteredAppointments = [...allAppointments];
  renderAppointments(filteredAppointments);
  updateCount();
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

function confirmDialog(message, onConfirm) {
  if (confirm(message)) {
    onConfirm();
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
