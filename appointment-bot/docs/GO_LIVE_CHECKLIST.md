# Dental Bot Go-Live Checklist (WhatsApp + Instagram)

## 1) Environment

1. Open `.env` and set real credentials:
   - `META_VERIFY_TOKEN`
   - `META_APP_SECRET`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_PAGE_ID`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
   - `GOOGLE_REFRESH_TOKEN`
   - `GOOGLE_CALENDAR_ID`
2. Change admin credentials:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

## 2) Database

1. Ensure PostgreSQL is running.
2. Run migration:

```bash
npm run migrate
```

## 3) Start the Bot

```bash
npm run dev
```

Expected:
- Server starts on `PORT`.
- Scheduler starts and checks reminders every 15 minutes.

## 4) Expose Webhook Publicly

Meta requires a public HTTPS URL. Example (with any tunneling service):

```text
https://<your-public-domain>/webhook
```

## 5) Configure Meta Webhook

In Meta App Dashboard:

1. Set callback URL to:
   - `https://<your-public-domain>/webhook`
2. Set verify token:
   - same value as `META_VERIFY_TOKEN`.
3. Subscribe to required fields:
   - WhatsApp: `messages`
   - Instagram: `messages`

## 6) Quick Validation

1. Health:
   - `GET /health` should return `200`.
2. Webhook verify:
   - Meta should validate token successfully.
3. Inbound message:
   - Send a WhatsApp/Instagram message to the connected account.
   - Bot should respond and logs should show inbound processing.

## 7) Production Notes

1. Keep `/webhook` and `/health` public.
2. Keep admin/API protected with `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
3. Rotate Meta/Google tokens if leaked.
