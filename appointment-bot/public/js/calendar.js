/**
 * Dental Bot Admin Panel - Calendar JavaScript
 */

let currentDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  document.getElementById('prevMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
  
  document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
}

// Render Calendar
async function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // Update month title
  document.getElementById('currentMonth').textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  
  // Get first day of month and number of days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  // Keep header
  const headerHTML = `
    <div class="calendar-header">Dom</div>
    <div class="calendar-header">Lun</div>
    <div class="calendar-header">Mar</div>
    <div class="calendar-header">Mié</div>
    <div class="calendar-header">Jue</div>
    <div class="calendar-header">Vie</div>
    <div class="calendar-header">Sáb</div>
  `;
  
  // Get appointments for this month
  const appointments = await getMonthAppointments(year, month);
  
  let daysHTML = '';
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    daysHTML += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
  }
  
  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    
    // Find appointments for this day
    const dayAppointments = appointments.filter(a => {
      const aptDate = new Date(a.appointment_at);
      return aptDate.getDate() === day;
    });
    
    // Group by status for display priority
    const confirmed = dayAppointments.filter(a => a.status === 'confirmada');
    const pending = dayAppointments.filter(a => a.status === 'pendiente');
    const others = dayAppointments.filter(a => !['confirmada', 'pendiente'].includes(a.status));
    
    // Limit display to first 3 appointments
    const displayAppointments = [...confirmed, ...pending, ...others].slice(0, 3);
    const moreCount = dayAppointments.length - displayAppointments.length;
    
    daysHTML += `
      <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}" data-count="${dayAppointments.length}">
        <div class="calendar-day-number">${day}</div>
        ${displayAppointments.map(apt => `
          <div class="calendar-event ${getStatusClass(apt.status)}" onclick="event.stopPropagation(); viewDayAppointment(${apt.id})">
            ${formatTimeShort(apt.appointment_at)} ${apt.patient_name}
          </div>
        `).join('')}
        ${moreCount > 0 ? `<div class="calendar-event" style="background: var(--bg-main); color: var(--text-secondary);">+${moreCount} más</div>` : ''}
      </div>
    `;
  }
  
  // Next month days to fill grid (6 rows × 7 columns = 42)
  const totalCells = firstDay + daysInMonth;
  const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;
  for (let day = 1; day <= remainingCells; day++) {
    daysHTML += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
  }
  
  calendar.innerHTML = headerHTML + daysHTML;
  
  // Add click handlers
  calendar.querySelectorAll('.calendar-day:not(.other-month)[data-count="0"]').forEach(day => {
    day.addEventListener('click', () => {
      const date = day.dataset.date;
      createAppointmentForDate(date);
    });
  });
}

// Get Month Appointments
async function getMonthAppointments(year, month) {
  try {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`;
    
    // Get appointments for the month
    const appointments = await DentalBot.apiRequest(`/appointments?limit=200`);
    
    // Filter to current month
    return appointments.filter(a => {
      const aptDate = new Date(a.appointment_at);
      return aptDate.getMonth() === month && aptDate.getFullYear() === year;
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

// Get status class for calendar event
function getStatusClass(status) {
  const statusMap = {
    'confirmada': 'confirmed',
    'pendiente': 'pending',
    'completada': 'completed',
    'cancelada': 'cancelled'
  };
  return statusMap[status] || 'pending';
}

// Format time short
function formatTimeShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// View day appointments
function showDayAppointments(date) {
  window.location.href = `appointments.html?date=${date}`;
}

// View single appointment
function viewDayAppointment(id) {
  window.location.href = `appointments.html?view=${id}`;
}

// Create appointment for date
function createAppointmentForDate(date) {
  window.location.href = `appointments.html?new=${date}`;
}
