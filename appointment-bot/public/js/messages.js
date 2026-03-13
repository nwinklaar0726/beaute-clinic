/**
 * Dental Bot Admin Panel - Messages JavaScript
 */

let allMessages = [];
let filteredMessages = [];

document.addEventListener('DOMContentLoaded', () => {
  loadMessages();
  setupEventListeners();
  
  // Refresh messages every 10 seconds
  setInterval(() => loadMessages(false), 10000);
});

// Load Messages
async function loadMessages(showLoading = true) {
  const tbody = document.querySelector('#messagesTable tbody');
  
  if (showLoading) {
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="6">
          <div class="loading-container">
            <div class="spinner"></div>
          </div>
        </td>
      </tr>
    `;
  }
  
  try {
    allMessages = await DentalBot.apiRequest('/messages?limit=100');
    filteredMessages = [...allMessages];
    
    renderMessages(filteredMessages);
    updateCount();
  } catch (error) {
    console.error('Error loading messages:', error);
    if (showLoading) {
      tbody.innerHTML = `
        <tr class="empty-state">
          <td colspan="6">
            <div class="empty-message">
              <i class="fas fa-exclamation-circle"></i>
              <p>Error al cargar los mensajes</p>
            </div>
          </td>
        </tr>
      `;
    }
  }
}

// Render Messages Table
function renderMessages(messages) {
  const tbody = document.querySelector('#messagesTable tbody');
  
  if (messages.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-state">
        <td colspan="6">
          <div class="empty-message">
            <i class="fas fa-inbox"></i>
            <p>No hay mensajes registrados</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = messages.map(msg => {
    const messageText = extractMessageText(msg);
    return `
      <tr>
        <td>${formatDateTime(msg.created_at)}</td>
        <td>${getChannelBadge(msg.channel)}</td>
        <td>${getDirectionBadge(msg.direction)}</td>
        <td>${msg.patient_name || 'Desconocido'}</td>
        <td style="max-width: 300px;">
          <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(messageText)}">
            ${escapeHtml(messageText)}
          </div>
        </td>
        <td><span class="badge-type">${msg.message_type}</span></td>
      </tr>
    `;
  }).join('');
}

// Update count
function updateCount() {
  document.getElementById('totalCount').textContent = `${filteredMessages.length} mensajes`;
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
    
    // Interactive messages
    if (payload.interactive?.button_reply?.title) return payload.interactive.button_reply.title;
    if (payload.interactive?.list_reply?.title) return payload.interactive.list_reply.title;
    
    return 'Mensaje multimedia';
  } catch (e) {
    return 'Mensaje';
  }
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Setup Event Listeners
function setupEventListeners() {
  document.getElementById('searchInput')?.addEventListener('input', debounce(filterMessages, 300));
  document.getElementById('channelFilter')?.addEventListener('change', filterMessages);
  document.getElementById('directionFilter')?.addEventListener('change', filterMessages);
  document.getElementById('clearFilters')?.addEventListener('click', clearFilters);
}

// Filter Messages
function filterMessages() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const channel = document.getElementById('channelFilter').value;
  const direction = document.getElementById('directionFilter').value;
  
  filteredMessages = allMessages.filter(msg => {
    const messageText = extractMessageText(msg).toLowerCase();
    const matchesSearch = !search || 
      messageText.includes(search) ||
      (msg.patient_name && msg.patient_name.toLowerCase().includes(search));
    
    const matchesChannel = !channel || msg.channel === channel;
    const matchesDirection = !direction || msg.direction === direction;
    
    return matchesSearch && matchesChannel && matchesDirection;
  });
  
  renderMessages(filteredMessages);
  updateCount();
}

// Clear Filters
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('channelFilter').value = '';
  document.getElementById('directionFilter').value = '';
  filteredMessages = [...allMessages];
  renderMessages(filteredMessages);
  updateCount();
}

// Helper Functions
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getChannelBadge(channel) {
  const channelMap = {
    'whatsapp': { class: 'channel-whatsapp', icon: 'fa-whatsapp', label: 'WhatsApp' },
    'instagram': { class: 'channel-instagram', icon: 'fa-instagram', label: 'Instagram' }
  };
  
  const channelInfo = channelMap[channel] || { class: '', icon: 'fa-comment', label: channel };
  return `<span class="channel-badge ${channelInfo.class}"><i class="fab ${channelInfo.icon}"></i> ${channelInfo.label}</span>`;
}

function getDirectionBadge(direction) {
  const directionMap = {
    'inbound': { class: 'direction-inbound', icon: 'fa-arrow-down', label: 'Entrante' },
    'outbound': { class: 'direction-outbound', icon: 'fa-arrow-up', label: 'Saliente' }
  };
  
  const dirInfo = directionMap[direction] || { class: '', icon: 'fa-minus', label: direction };
  return `<span class="direction-badge ${dirInfo.class}"><i class="fas ${dirInfo.icon}"></i> ${dirInfo.label}</span>`;
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
