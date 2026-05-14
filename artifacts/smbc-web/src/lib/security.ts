// Security utilities — input validation, rate limiting, sanitization

const RATE_LIMIT_KEY = "smbc_rl";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

/** Strip HTML tags and dangerous characters to prevent XSS */
export function sanitizeInput(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "") // strip all HTML tags
    .replace(/[<>"'`]/g, "") // strip remaining dangerous chars
    .trim()
    .slice(0, 200); // hard cap — never accept more than 200 chars
}

/** Validate that input looks like an email OR a phone number */
export function validateContactInfo(value: string): { valid: boolean; message: string } {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: "Please enter your email or phone number." };

  // Email pattern
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Phone — allow digits, spaces, +, -, (, ) — between 7 and 20 characters of digits
  const phoneDigits = trimmed.replace(/[\s\-().+]/g, "");
  const phoneRe = /^\d{7,20}$/;

  if (emailRe.test(trimmed) || phoneRe.test(phoneDigits)) {
    return { valid: true, message: "" };
  }

  return { valid: false, message: "Please enter a valid email address or phone number." };
}

/** Check whether this browser is within rate limit. Returns allowed=true if OK. */
export function checkRateLimit(): { allowed: boolean } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { allowed: true };

    const record: RateLimitRecord = JSON.parse(raw);
    const now = Date.now();

    // Window has expired — reset
    if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
      localStorage.removeItem(RATE_LIMIT_KEY);
      return { allowed: true };
    }

    return { allowed: record.count < RATE_LIMIT_MAX };
  } catch {
    return { allowed: true };
  }
}

/** Record a successful submission toward the rate limit counter */
export function recordSubmission(): void {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();

    if (!raw) {
      const record: RateLimitRecord = { count: 1, windowStart: now };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
      return;
    }

    const record: RateLimitRecord = JSON.parse(raw);
    if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, windowStart: now }));
    } else {
      record.count += 1;
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
    }
  } catch {
    // Non-fatal — continue
  }
}

// Admin lockout constants
const ADMIN_LOCKOUT_KEY = "smbc_adm_lk";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface AdminLockout {
  attempts: number;
  lockedUntil: number | null;
}

export function getAdminLockoutState(): { locked: boolean; remainingMs: number; attempts: number } {
  try {
    const raw = localStorage.getItem(ADMIN_LOCKOUT_KEY);
    if (!raw) return { locked: false, remainingMs: 0, attempts: 0 };

    const state: AdminLockout = JSON.parse(raw);
    const now = Date.now();

    if (state.lockedUntil && now < state.lockedUntil) {
      return { locked: true, remainingMs: state.lockedUntil - now, attempts: state.attempts };
    }

    // Lockout expired — clear it
    if (state.lockedUntil && now >= state.lockedUntil) {
      localStorage.removeItem(ADMIN_LOCKOUT_KEY);
      return { locked: false, remainingMs: 0, attempts: 0 };
    }

    return { locked: false, remainingMs: 0, attempts: state.attempts };
  } catch {
    return { locked: false, remainingMs: 0, attempts: 0 };
  }
}

export function recordFailedAdminAttempt(): { locked: boolean; attemptsLeft: number } {
  try {
    const raw = localStorage.getItem(ADMIN_LOCKOUT_KEY);
    const state: AdminLockout = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: null };
    state.attempts += 1;

    if (state.attempts >= MAX_ATTEMPTS) {
      state.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify(state));
      return { locked: true, attemptsLeft: 0 };
    }

    localStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify(state));
    return { locked: false, attemptsLeft: MAX_ATTEMPTS - state.attempts };
  } catch {
    return { locked: false, attemptsLeft: MAX_ATTEMPTS };
  }
}

export function clearAdminLockout(): void {
  localStorage.removeItem(ADMIN_LOCKOUT_KEY);
}
