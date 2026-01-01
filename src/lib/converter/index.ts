/**
 * Main CSS to Tailwind conversion function
 * Orchestrates parsing, mapping, and output generation
 */

import { parseCss } from './parser';
import { convertProperty } from './mappings';
import type { ConversionResult } from '@/types';

/**
 * Convert CSS string to Tailwind utility classes
 * @param css - Raw CSS string input
 * @returns Space-separated string of Tailwind classes
 */
export function convertCssToTailwind(css: string): string {
  const result = convertCssToTailwindDetailed(css);
  return result.classes.join(' ');
}

/**
 * Convert CSS string to Tailwind with detailed result
 * @param css - Raw CSS string input
 * @returns ConversionResult with classes and unsupported properties
 */
export function convertCssToTailwindDetailed(css: string): ConversionResult {
  const declarations = parseCss(css);
  const classes: string[] = [];
  const unsupported: string[] = [];

  for (const declaration of declarations) {
    const tailwindClass = convertProperty(declaration.property, declaration.value);
    
    if (tailwindClass) {
      // Avoid duplicates
      if (!classes.includes(tailwindClass)) {
        classes.push(tailwindClass);
      }
    } else {
      // Track unsupported properties
      const entry = `${declaration.property}: ${declaration.value}`;
      if (!unsupported.includes(entry)) {
        unsupported.push(entry);
      }
    }
  }

  return {
    classes,
    unsupported,
  };
}

/**
 * Check if conversion is available for a property
 * @param property - CSS property name
 * @returns true if property is supported
 */
export function isPropertySupported(property: string): boolean {
  // Try converting with a dummy value
  const testValues = ['flex', 'center', '16px', '#000'];
  
  for (const value of testValues) {
    if (convertProperty(property, value) !== null) {
      return true;
    }
  }
  
  return false;
}

// Re-export utilities for convenience
export { parseCss } from './parser';
export { convertProperty, getSupportedProperties } from './mappings';
export { pxToSpacing, parseNumericValue } from './spacing';
