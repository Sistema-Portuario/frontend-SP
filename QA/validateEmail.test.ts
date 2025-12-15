import { describe, it, expect } from 'vitest';
import { validateEmail } from '../src/pages/AdminDashboard';

describe('validateEmail unit tests', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('A.B_c-1@sub.domain.co')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('bad_email')).toBe(false);
    expect(validateEmail('no-at-symbol.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});
