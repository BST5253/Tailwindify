/**
 * Tailwind CSS default spacing scale
 * Mapping from px values to Tailwind spacing units
 */

// Tailwind's default spacing scale (in rem, where 1rem = 16px by default)
const SPACING_SCALE: Record<number, string> = {
  0: '0',
  1: '0.5',    // 0.125rem = 2px
  2: '1',      // 0.25rem = 4px
  4: '1',      // 0.25rem = 4px
  6: '1.5',    // 0.375rem = 6px
  8: '2',      // 0.5rem = 8px
  10: '2.5',   // 0.625rem = 10px
  12: '3',     // 0.75rem = 12px
  14: '3.5',   // 0.875rem = 14px
  16: '4',     // 1rem = 16px
  20: '5',     // 1.25rem = 20px
  24: '6',     // 1.5rem = 24px
  28: '7',     // 1.75rem = 28px
  32: '8',     // 2rem = 32px
  36: '9',     // 2.25rem = 36px
  40: '10',    // 2.5rem = 40px
  44: '11',    // 2.75rem = 44px
  48: '12',    // 3rem = 48px
  56: '14',    // 3.5rem = 56px
  64: '16',    // 4rem = 64px
  80: '20',    // 5rem = 80px
  96: '24',    // 6rem = 96px
  112: '28',   // 7rem = 112px
  128: '32',   // 8rem = 128px
  144: '36',   // 9rem = 144px
  160: '40',   // 10rem = 160px
  176: '44',   // 11rem = 176px
  192: '48',   // 12rem = 192px
  208: '52',   // 13rem = 208px
  224: '56',   // 14rem = 224px
  240: '60',   // 15rem = 240px
  256: '64',   // 16rem = 256px
  288: '72',   // 18rem = 288px
  320: '80',   // 20rem = 320px
  384: '96',   // 24rem = 384px
};

/**
 * Get the closest Tailwind spacing value for a given px value
 * @param pxValue - The pixel value to convert
 * @returns The Tailwind spacing unit or null if not mappable
 */
export function pxToSpacing(pxValue: number): string | null {
  // Direct match
  if (SPACING_SCALE[pxValue] !== undefined) {
    return SPACING_SCALE[pxValue];
  }

  // Find closest match
  const pxValues = Object.keys(SPACING_SCALE).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < pxValues.length - 1; i++) {
    const lower = pxValues[i];
    const upper = pxValues[i + 1];
    
    if (pxValue > lower && pxValue < upper) {
      // Return closest value
      const lowerDiff = pxValue - lower;
      const upperDiff = upper - pxValue;
      return SPACING_SCALE[lowerDiff <= upperDiff ? lower : upper];
    }
  }

  // Return arbitrary value for large numbers
  if (pxValue > 384) {
    return `[${pxValue}px]`;
  }

  return null;
}

/**
 * Parse a CSS value and extract the numeric px value
 * @param value - CSS value like "16px" or "1rem"
 * @returns The numeric value in pixels or null
 */
export function parseNumericValue(value: string): number | null {
  const pxMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*px$/);
  if (pxMatch) {
    return parseFloat(pxMatch[1]);
  }

  // Convert rem to px (assuming 16px base)
  const remMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*rem$/);
  if (remMatch) {
    return parseFloat(remMatch[1]) * 16;
  }

  return null;
}

/**
 * Font size mappings (px to Tailwind text-* classes)
 */
export const FONT_SIZE_MAP: Record<number, string> = {
  12: 'xs',
  14: 'sm',
  16: 'base',
  18: 'lg',
  20: 'xl',
  24: '2xl',
  30: '3xl',
  36: '4xl',
  48: '5xl',
  60: '6xl',
  72: '7xl',
  96: '8xl',
  128: '9xl',
};

/**
 * Border radius mappings (px to Tailwind rounded-* classes)
 */
export const BORDER_RADIUS_MAP: Record<number, string> = {
  0: 'none',
  2: 'sm',
  4: 'DEFAULT',
  6: 'md',
  8: 'lg',
  12: 'xl',
  16: '2xl',
  24: '3xl',
};

/**
 * Convert font size px value to Tailwind class
 */
export function fontSizeToTailwind(pxValue: number): string | null {
  if (FONT_SIZE_MAP[pxValue]) {
    return `text-${FONT_SIZE_MAP[pxValue]}`;
  }
  
  // Find closest match
  const sizes = Object.keys(FONT_SIZE_MAP).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < sizes.length - 1; i++) {
    if (pxValue >= sizes[i] && pxValue < sizes[i + 1]) {
      return `text-${FONT_SIZE_MAP[sizes[i]]}`;
    }
  }
  
  // Arbitrary value for unmatched
  return `text-[${pxValue}px]`;
}

/**
 * Convert border radius px value to Tailwind class
 */
export function borderRadiusToTailwind(pxValue: number): string | null {
  if (pxValue === 9999 || pxValue >= 9999) {
    return 'rounded-full';
  }
  
  if (BORDER_RADIUS_MAP[pxValue]) {
    const value = BORDER_RADIUS_MAP[pxValue];
    return value === 'DEFAULT' ? 'rounded' : `rounded-${value}`;
  }
  
  // Find closest match
  const sizes = Object.keys(BORDER_RADIUS_MAP).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < sizes.length - 1; i++) {
    if (pxValue >= sizes[i] && pxValue < sizes[i + 1]) {
      const value = BORDER_RADIUS_MAP[sizes[i]];
      return value === 'DEFAULT' ? 'rounded' : `rounded-${value}`;
    }
  }
  
  return `rounded-[${pxValue}px]`;
}
