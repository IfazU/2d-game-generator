import { describe, expect, it } from 'vitest';

describe('foundation', () => {
  it('runs lightweight unit tests independently from browser smoke tests', () => {
    expect(true).toBe(true);
  });
});
