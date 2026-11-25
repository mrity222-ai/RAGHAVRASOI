import crypto from 'crypto';

/**
 * Hashes a plain-text password using Node's built-in scrypt with a random 16-byte salt.
 * Format: scrypt:<hex-salt>:<hex-derived-key>
 */
export function hashPassword(password: string): string {
  const clean = password.trim();
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(clean, salt, 64).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

/**
 * Verifies a plain-text password against a stored password hash.
 * Supports:
 * 1. Modern salted scrypt hashes ("scrypt:<salt>:<hash>")
 * 2. Legacy unsalted SHA-256 hex hashes (64 hex chars)
 * 3. Legacy plain-text passwords (for seamless migration)
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!password || !stored) return false;
  const clean = password.trim();

  if (stored.startsWith('scrypt:')) {
    const parts = stored.split(':');
    if (parts.length !== 3) return false;
    const [, salt, originalHash] = parts;
    const derived = crypto.scryptSync(clean, salt, 64);
    const originalBuf = Buffer.from(originalHash, 'hex');
    if (derived.length !== originalBuf.length) return false;
    return crypto.timingSafeEqual(derived, originalBuf);
  }

  // Legacy SHA-256 hex check
  if (/^[a-f0-9]{64}$/i.test(stored)) {
    const sha256 = crypto.createHash('sha256').update(clean).digest('hex');
    return sha256 === stored.toLowerCase();
  }

  // Legacy plain-text fallback
  return clean === stored;
}
