/**
 * Dental Bot Admin Panel - Settings JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadSettings();
});

// Setup Event Listeners
function setupEventListeners() {
  document.getElementById('clinicForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveClinicSettings();
  });
  
  document.getElementById('scheduleForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveScheduleSettings();
  });
  
  document.getElementById('remindersForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveRemindersSettings();
  });
}

// Load Settings
async function loadSettings() {
  try {
    // TODO: Load settings from API
    // For now, settings are already set in HTML defaults
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Save Clinic Settings
async function saveClinicSettings() {
  const settings = {
    name: document.getElementById('clinicName').value,
    phone: document.getElementById('clinicPhone').value,
    email: document.getElementById('clinicEmail').value,
    address: document.getElementById('clinicAddress').value
  };
  
  try {
    // TODO: Call API to save settings
    console.log('Saving clinic settings:', settings);
    showToast('Éxito', 'Configuración guardada correctamente', 'success');
  } catch (error) {
    showToast('Error', 'No se pudo guardar la configuración', 'error');
  }
}

// Save Schedule Settings
async function saveScheduleSettings() {
  const settings = {
    openTime: document.getElementById('openTime').value,
    closeTime: document.getElementById('closeTime').value,
    appointmentDuration: parseInt(document.getElementById('appointmentDuration').value),
    timezone: document.getElementById('timezone').value
  };
  
  try {
    // TODO: Call API to save settings
    console.log('Saving schedule settings:', settings);
    showToast('Éxito', 'Horario guardado correctamente', 'success');
  } catch (error) {
    showToast('Error', 'No se pudo guardar el horario', 'error');
  }
}

// Save Reminders Settings
async function saveRemindersSettings() {
  try {
    // TODO: Call API to save settings
    showToast('Éxito', 'Configuración de recordatorios guardada', 'success');
  } catch (error) {
    showToast('Error', 'No se pudo guardar la configuración', 'error');
  }
}

function showToast(title, message, type = 'info') {
  if (window.DentalBot) {
    window.DentalBot.showToast(title, message, type);
  } else {
    alert(`${title}: ${message}`);
  }
}
