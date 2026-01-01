/**
 * TypeScript type definitions for the CSS to Tailwind converter
 */

/** Parsed CSS declaration */
export interface CSSDeclaration {
  property: string;
  value: string;
}

/** Conversion result */
export interface ConversionResult {
  classes: string[];
  unsupported: string[];
}

/** Spacing scale mapping (px to Tailwind) */
export interface SpacingScale {
  [key: number]: string;
}

/** CSS property mapping entry */
export interface PropertyMapping {
  [value: string]: string;
}

/** CSS to Tailwind mapping configuration */
export interface MappingConfig {
  [property: string]: PropertyMapping | ((value: string) => string | null);
}
