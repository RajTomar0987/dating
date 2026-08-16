import crypto from 'crypto';

interface OtpRecord {
  email: string;
  hash: string;
  expiresAt: number;
  createdAt: number;
  attempts: number;
  lastSentAt: number;
  verified: boolean;
}

const OTP_SECRET = process.env.JWT_SECRET || 'aura_otp_hash_secret_key_2026';
const otpStore = new Map<string, OtpRecord>();

/**
 * Compute SHA-256 hash of OTP + email + server secret
 */
function hashOtp(email: string, otp: string): string {
  return crypto
    .createHash('sha256')
    .update(`${email.trim().toLowerCase()}:${otp.trim()}:${OTP_SECRET}`)
    .digest('hex');
}

/**
 * Generate a 6-digit numeric OTP and record it securely in memory
 */
export function generateAndStoreOtp(email: string): { otp: string; resendCooldownSeconds: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();

  const existing = otpStore.get(normalizedEmail);
  if (existing) {
    const secondsSinceLastSent = Math.floor((now - existing.lastSentAt) / 1000);
    if (secondsSinceLastSent < 60) {
      const waitTime = 60 - secondsSinceLastSent;
      throw new Error(`Please wait ${waitTime} seconds before requesting a new code.`);
    }
  }

  // Generate random 6-digit numeric code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = hashOtp(normalizedEmail, otp);
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

  const record: OtpRecord = {
    email: normalizedEmail,
    hash,
    expiresAt,
    createdAt: now,
    attempts: 0,
    lastSentAt: now,
    verified: false,
  };

  otpStore.set(normalizedEmail, record);

  console.log(`[OTP STORE] Generated 6-digit OTP for ${normalizedEmail}: ${otp} (expires in 10 minutes)`);
  return { otp, resendCooldownSeconds: 60 };
}

/**
 * Verify a 6-digit OTP code against stored hash
 */
export function verifyOtpCode(email: string, otp: string): { success: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();
  const record = otpStore.get(normalizedEmail);

  if (!record) {
    return { success: false, error: 'No verification code found. Please request a new code.' };
  }

  if (record.verified) {
    return { success: false, error: 'This code has already been used. Please request a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { success: false, error: 'This code has expired. Request a new code.' };
  }

  if (record.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    return { success: false, error: 'Too many attempts. Please request a new code.' };
  }

  const inputHash = hashOtp(normalizedEmail, cleanOtp);
  if (inputHash !== record.hash) {
    record.attempts += 1;
    const remainingAttempts = 5 - record.attempts;
    if (remainingAttempts <= 0) {
      otpStore.delete(normalizedEmail);
      return { success: false, error: 'Too many attempts. Please request a new code.' };
    }
    return { success: false, error: 'Incorrect verification code.' };
  }

  // Mark as verified
  record.verified = true;
  return { success: true };
}

/**
 * Helper to retrieve stored OTP record (used for testing/diagnostics)
 */
export function getOtpRecordForTesting(email: string): OtpRecord | undefined {
  return otpStore.get(email.trim().toLowerCase());
}
