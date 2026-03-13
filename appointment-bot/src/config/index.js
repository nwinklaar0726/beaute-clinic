require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  meta: {
    verifyToken: process.env.META_VERIFY_TOKEN,
    appSecret: process.env.META_APP_SECRET,
    whatsappToken: process.env.WHATSAPP_ACCESS_TOKEN,
    whatsappPhoneId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    instagramToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    instagramPageId: process.env.INSTAGRAM_PAGE_ID,
    apiVersion: 'v19.0',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'dental_bot',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },

  clinic: {
    name: process.env.CLINIC_NAME || 'Consultorio Dental',
    doctorName: process.env.DOCTOR_NAME || 'Dr. García',
    timezone: process.env.TIMEZONE || 'America/Costa_Rica',
    workingHours: {
      start: parseInt(process.env.WORKING_HOURS_START) || 8,
      end: parseInt(process.env.WORKING_HOURS_END) || 17,
    },
    appointmentDurationMinutes: parseInt(process.env.APPOINTMENT_DURATION) || 60,
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
  },
};

module.exports = config;
