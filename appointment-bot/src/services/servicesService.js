/**
 * servicesService.js
 *
 * Dental clinic service catalog.
 * Each service has: key, name, price, keywords (for text matching), duration override (optional).
 */

const SERVICES = [
  {
    key: 'limpieza',
    name: 'Limpieza Dental',
    price: '₡25,000',
    keywords: ['limpieza', 'profilaxis', 'higiene', '1'],
  },
  {
    key: 'blanqueamiento',
    name: 'Blanqueamiento Dental',
    price: '₡80,000',
    keywords: ['blanqueamiento', 'blanqueo', 'whitening', '2'],
  },
  {
    key: 'extraccion',
    name: 'Extracción',
    price: '₡35,000',
    keywords: ['extraccion', 'extracción', 'saca', 'muela', '3'],
  },
  {
    key: 'empaste',
    name: 'Empaste / Resina',
    price: '₡45,000',
    keywords: ['empaste', 'resina', 'caries', 'relleno', '4'],
  },
  {
    key: 'revision',
    name: 'Revisión General',
    price: '₡15,000',
    keywords: ['revision', 'revisión', 'chequeo', 'consulta', 'general', '5'],
  },
  {
    key: 'ortodoncia',
    name: 'Consulta de Ortodoncia',
    price: '₡20,000',
    keywords: ['ortodoncia', 'brackets', 'frenos', '6'],
  },
];

/**
 * Match user input to a service by number or keyword.
 * @param {string} text - raw input from user
 * @returns {object|null} matched service or null
 */
const getServiceByKeyword = (text) => {
  const normalized = text.trim().toLowerCase();
  return (
    SERVICES.find((s) =>
      s.keywords.some((kw) => normalized === kw || normalized.includes(kw))
    ) || null
  );
};

/**
 * Format the services menu for display in a WhatsApp/Instagram message.
 * @returns {string}
 */
const formatServicesMenu = () => {
  return SERVICES.map(
    (s, i) => `  ${i + 1}. *${s.name}* — ${s.price}`
  ).join('\n');
};

module.exports = { SERVICES, getServiceByKeyword, formatServicesMenu };
