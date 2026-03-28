import http from 'k6/http';
import { check, sleep } from 'k6';

// Usage:
// BASE_URL=https://staging.your-domain.com k6 run scripts/load/k6/staging-load.js
// Optional: USERS=50 DURATION=5m LANGS=es,en,pt,ro

const BASE_URL = __ENV.BASE_URL || 'https://staging.example.com';
const USERS = Number(__ENV.USERS || 50);
const DURATION = __ENV.DURATION || '5m';
const LANGS = (__ENV.LANGS || 'es,en,pt,ro').split(',');

// Paths to exercise (adjust to your app if needed)
const HOTEL_LIST_PATH = __ENV.HOTEL_LIST_PATH || '/hotels';
const AVAILABILITY_PATH = __ENV.AVAILABILITY_PATH || '/search';
const BOOKING_CREATE_PATH = __ENV.BOOKING_CREATE_PATH || '/api/bookings'; // Adjust if different

export const options = {
  scenarios: {
    browse_hotels: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: Math.ceil(USERS * 0.3) },
        { duration: '2m', target: USERS },
        { duration: '30s', target: 0 },
      ],
      exec: 'browseHotels',
    },
    search_availability: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: Math.ceil(USERS * 0.2) },
        { duration: '2m', target: Math.ceil(USERS * 0.6) },
        { duration: '30s', target: 0 },
      ],
      exec: 'searchAvailability',
      startTime: '15s',
    },
    create_booking: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: Math.ceil(USERS * 0.1) },
        { duration: '1m40s', target: Math.ceil(USERS * 0.3) },
        { duration: '20s', target: 0 },
      ],
      exec: 'createBooking',
      startTime: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800', 'p(99)<1500'], // tune as needed
    http_req_failed: ['rate<0.01'],
  },
};

function withLangHeaders(lang) {
  return {
    headers: {
      'Accept-Language': lang,
      'Cache-Control': 'no-cache',
    },
  };
}

export function browseHotels() {
  for (const lang of LANGS) {
    const res = http.get(`${BASE_URL}${HOTEL_LIST_PATH}`, withLangHeaders(lang));
    check(res, {
      'list status 200': (r) => r.status === 200,
    });
    sleep(0.5);
  }
}

export function searchAvailability() {
  for (const lang of LANGS) {
    // Example query params (adjust to your app): country & month
    const url = `${BASE_URL}${AVAILABILITY_PATH}?country=ES&month=2025-09`;
    const res = http.get(url, withLangHeaders(lang));
    check(res, {
      'search status 200/OK': (r) => r.status === 200 || r.status === 204,
    });
    sleep(0.5);
  }
}

export function createBooking() {
  for (const lang of LANGS) {
    // If your booking endpoint requires auth, run this against staging with a test token or replace with a harmless POST.
    const payload = JSON.stringify({
      package_id: __ENV.PACKAGE_ID || '00000000-0000-0000-0000-000000000000',
      check_in: '2025-09-01',
      check_out: '2025-09-29',
      guest_count: 1,
    });
    const params = {
      headers: { 'Content-Type': 'application/json', 'Accept-Language': lang },
    };
    const res = http.post(`${BASE_URL}${BOOKING_CREATE_PATH}`, payload, params);
    check(res, {
      'booking accepted (2xx/3xx)': (r) => r.status >= 200 && r.status < 400,
    });
    sleep(1);
  }
}
