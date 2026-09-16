import { describe, expect, it } from 'vitest';
import { isPackageUrl } from './sass-language';

describe('sass-language', () => {
  describe('isPackageUrl', () => {
    it('should identify pkg: scheme URLs as package URLs', () => {
      expect(isPackageUrl('pkg:@angular/material')).toBe(true);
      expect(isPackageUrl('pkg:bootstrap')).toBe(true);
      expect(isPackageUrl('pkg:@material/button/button')).toBe(true);
    });

    it('should identify bare specifiers as package URLs', () => {
      expect(isPackageUrl('@angular/material')).toBe(true);
      expect(isPackageUrl('@angular/material/button')).toBe(true);
      expect(isPackageUrl('@material/button/button.scss')).toBe(true);
      expect(isPackageUrl('bootstrap')).toBe(true);
      expect(isPackageUrl('bootstrap/scss/bootstrap')).toBe(true);
    });

    it('should not identify relative paths as package URLs', () => {
      expect(isPackageUrl('./styles.scss')).toBe(false);
      expect(isPackageUrl('../shared/variables')).toBe(false);
      expect(isPackageUrl('.hidden')).toBe(false);
      expect(isPackageUrl('.\\styles.scss')).toBe(false);
      expect(isPackageUrl('..\\shared\\variables')).toBe(false);
    });

    it('should not identify absolute paths or non-pkg URLs as package URLs', () => {
      expect(isPackageUrl('/styles/theme.scss')).toBe(false);
      expect(isPackageUrl('\\styles\\theme.scss')).toBe(false);
      expect(isPackageUrl('file:///path/to/theme.scss')).toBe(false);
      expect(isPackageUrl('http://example.com/styles.css')).toBe(false);
      expect(isPackageUrl('https://example.com/styles.css')).toBe(false);
      expect(isPackageUrl('C:\\path\\to\\theme.scss')).toBe(false);
      expect(isPackageUrl('C:/path/to/theme.scss')).toBe(false);
    });

    it('should not identify empty string as a package URL', () => {
      expect(isPackageUrl('')).toBe(false);
    });
  });
});
