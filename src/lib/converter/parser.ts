/**
 * CSS Parser utilities using css-tree
 * Handles parsing CSS input and extracting declarations
 */

import * as csstree from 'css-tree';
import type { CSSDeclaration } from '@/types';

/**
 * Parse CSS string and extract all declarations
 * @param css - Raw CSS string input
 * @returns Array of CSS declarations with property and value
 */
export function parseCss(css: string): CSSDeclaration[] {
  const declarations: CSSDeclaration[] = [];

  try {
    // Parse the CSS string into an AST
    const ast = csstree.parse(css, {
      parseValue: false, // Keep values as raw strings
      parseCustomProperty: false,
    });

    // Walk through the AST and extract declarations
    csstree.walk(ast, {
      visit: 'Declaration',
      enter(node) {
        const property = node.property;
        const value = csstree.generate(node.value);
        
        declarations.push({
          property,
          value,
        });
      },
    });
  } catch (error) {
    // Log error but don't throw - return partial results
    console.warn('CSS parsing error:', error);
  }

  return declarations;
}

/**
 * Validate if a string is valid CSS
 * @param css - CSS string to validate
 * @returns true if valid CSS
 */
export function isValidCss(css: string): boolean {
  try {
    csstree.parse(css);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract unique selectors from CSS
 * @param css - CSS string
 * @returns Array of selector strings
 */
export function extractSelectors(css: string): string[] {
  const selectors: string[] = [];

  try {
    const ast = csstree.parse(css);
    
    csstree.walk(ast, {
      visit: 'Selector',
      enter(node) {
        selectors.push(csstree.generate(node));
      },
    });
  } catch {
    // Ignore parsing errors
  }

  return [...new Set(selectors)];
}
