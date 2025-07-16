import { normalizeCategory } from './index';

describe('normalizeCategory', () => {
  it('should return null for undefined', () => {
    expect(normalizeCategory(undefined)).toBeNull();
  });

  it('should return null for null', () => {
    expect(normalizeCategory(null)).toBeNull();
  });

  it('should capitalize first letter and lowercase the rest', () => {
    expect(normalizeCategory('electronics')).toBe('Electronics');
    expect(normalizeCategory('ELECTRONICS')).toBe('Electronics');
    expect(normalizeCategory('eLeCtRoNiCs')).toBe('Electronics');
  });

  it('should handle single character', () => {
    expect(normalizeCategory('a')).toBe('A');
    expect(normalizeCategory('A')).toBe('A');
  });

  it('should handle empty string', () => {
    expect(normalizeCategory('')).toBeNull();
  });
});
