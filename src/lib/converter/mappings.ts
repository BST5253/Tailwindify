/**
 * CSS property to Tailwind class mappings
 * Organized by CSS property with value-to-class mappings
 */

import { 
  pxToSpacing, 
  parseNumericValue, 
  fontSizeToTailwind, 
  borderRadiusToTailwind 
} from './spacing';

type ConversionFunction = (value: string) => string | null;

// Direct value mappings (property -> value -> tailwind class)
const DIRECT_MAPPINGS: Record<string, Record<string, string>> = {
  display: {
    flex: 'flex',
    block: 'block',
    'inline-block': 'inline-block',
    inline: 'inline',
    grid: 'grid',
    'inline-flex': 'inline-flex',
    'inline-grid': 'inline-grid',
    none: 'hidden',
  },
  'flex-direction': {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse',
  },
  'justify-content': {
    'flex-start': 'justify-start',
    'flex-end': 'justify-end',
    center: 'justify-center',
    'space-between': 'justify-between',
    'space-around': 'justify-around',
    'space-evenly': 'justify-evenly',
  },
  'align-items': {
    'flex-start': 'items-start',
    'flex-end': 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  },
  'text-align': {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  },
  'font-weight': {
    '100': 'font-thin',
    '200': 'font-extralight',
    '300': 'font-light',
    '400': 'font-normal',
    '500': 'font-medium',
    '600': 'font-semibold',
    '700': 'font-bold',
    '800': 'font-extrabold',
    '900': 'font-black',
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
  },
  position: {
    static: 'static',
    fixed: 'fixed',
    absolute: 'absolute',
    relative: 'relative',
    sticky: 'sticky',
  },
  overflow: {
    auto: 'overflow-auto',
    hidden: 'overflow-hidden',
    visible: 'overflow-visible',
    scroll: 'overflow-scroll',
  },
};

/**
 * Convert a single spacing value to a Tailwind class
 */
function convertSingleSpacing(prefix: string, value: string): string | null {
  if (value === 'auto') {
    return `${prefix}-auto`;
  }
  
  const num = parseNumericValue(value);
  if (num === null) {
    return null;
  }

  const spacing = pxToSpacing(Math.abs(num));
  if (!spacing) return null;

  const isNegative = num < 0;
  const negPrefix = isNegative ? '-' : '';
  
  return `${negPrefix}${prefix}-${spacing}`;
}

/**
 * Convert spacing properties (margin, padding) to Tailwind classes
 * Handles shorthand syntax with 1, 2, 3, or 4 values
 */
function convertSpacing(property: string, value: string): string | null {
  // Map property to Tailwind prefixes
  const prefixMap: Record<string, { all: string; t: string; r: string; b: string; l: string; x: string; y: string }> = {
    margin: { all: 'm', t: 'mt', r: 'mr', b: 'mb', l: 'ml', x: 'mx', y: 'my' },
    padding: { all: 'p', t: 'pt', r: 'pr', b: 'pb', l: 'pl', x: 'px', y: 'py' },
  };

  // Single-direction properties
  const singlePrefixMap: Record<string, string> = {
    'margin-top': 'mt',
    'margin-right': 'mr',
    'margin-bottom': 'mb',
    'margin-left': 'ml',
    'padding-top': 'pt',
    'padding-right': 'pr',
    'padding-bottom': 'pb',
    'padding-left': 'pl',
    // Logical properties
    'margin-inline': 'mx',
    'margin-block': 'my',
    'padding-inline': 'px',
    'padding-block': 'py',
    'margin-inline-start': 'ms',
    'margin-inline-end': 'me',
    'padding-inline-start': 'ps',
    'padding-inline-end': 'pe',
    'margin-block-start': 'mt',
    'margin-block-end': 'mb',
    'padding-block-start': 'pt',
    'padding-block-end': 'pb',
  };

  // Handle single-direction properties
  if (singlePrefixMap[property]) {
    return convertSingleSpacing(singlePrefixMap[property], value);
  }

  // Handle shorthand margin/padding
  const prefixes = prefixMap[property];
  if (!prefixes) return null;

  // Split value into parts (handle multiple values)
  const values = value.split(/\s+/).filter(v => v);

  if (values.length === 1) {
    // Single value: applies to all sides
    return convertSingleSpacing(prefixes.all, values[0]);
  }

  if (values.length === 2) {
    // Two values: vertical horizontal
    const yClass = convertSingleSpacing(prefixes.y, values[0]);
    const xClass = convertSingleSpacing(prefixes.x, values[1]);
    if (yClass && xClass) return `${yClass} ${xClass}`;
    if (yClass) return yClass;
    if (xClass) return xClass;
    return null;
  }

  if (values.length === 3) {
    // Three values: top horizontal bottom
    const tClass = convertSingleSpacing(prefixes.t, values[0]);
    const xClass = convertSingleSpacing(prefixes.x, values[1]);
    const bClass = convertSingleSpacing(prefixes.b, values[2]);
    const classes = [tClass, xClass, bClass].filter(Boolean);
    return classes.length > 0 ? classes.join(' ') : null;
  }

  if (values.length === 4) {
    // Four values: top right bottom left
    const tClass = convertSingleSpacing(prefixes.t, values[0]);
    const rClass = convertSingleSpacing(prefixes.r, values[1]);
    const bClass = convertSingleSpacing(prefixes.b, values[2]);
    const lClass = convertSingleSpacing(prefixes.l, values[3]);
    const classes = [tClass, rClass, bClass, lClass].filter(Boolean);
    return classes.length > 0 ? classes.join(' ') : null;
  }

  return null;
}

/**
 * Convert width/height to Tailwind classes
 */
function convertDimension(property: string, value: string): string | null {
  const prefix = property === 'width' ? 'w' : 'h';

  // Handle special values
  if (value === 'auto') return `${prefix}-auto`;
  if (value === '100%') return `${prefix}-full`;
  if (value === '100vw') return `${prefix}-screen`;
  if (value === '100vh') return `${prefix}-screen`;
  if (value === 'fit-content') return `${prefix}-fit`;
  if (value === 'min-content') return `${prefix}-min`;
  if (value === 'max-content') return `${prefix}-max`;

  // Handle px values
  const num = parseNumericValue(value);
  if (num !== null) {
    const spacing = pxToSpacing(num);
    if (spacing) return `${prefix}-${spacing}`;
    return `${prefix}-[${num}px]`;
  }

  // Handle percentage values
  const percentMatch = value.match(/^(\d+(?:\.\d+)?)%$/);
  if (percentMatch) {
    const percent = parseFloat(percentMatch[1]);
    const fractionMap: Record<number, string> = {
      50: '1/2',
      33.333333: '1/3',
      66.666667: '2/3',
      25: '1/4',
      75: '3/4',
      20: '1/5',
      40: '2/5',
      60: '3/5',
      80: '4/5',
    };
    if (fractionMap[percent]) {
      return `${prefix}-${fractionMap[percent]}`;
    }
    return `${prefix}-[${value}]`;
  }

  return `${prefix}-[${value}]`;
}

/**
 * Convert color values to Tailwind classes
 */
function convertColor(property: string, value: string): string | null {
  const prefix = property === 'color' ? 'text' : 'bg';
  
  // Handle named colors with common mappings
  const colorMap: Record<string, string> = {
    white: 'white',
    black: 'black',
    transparent: 'transparent',
    inherit: 'inherit',
    currentColor: 'current',
  };

  if (colorMap[value]) {
    return `${prefix}-${colorMap[value]}`;
  }

  // Use arbitrary value for hex, rgb, etc.
  // Clean up the value for arbitrary syntax
  const cleanValue = value.replace(/\s+/g, '_');
  return `${prefix}-[${cleanValue}]`;
}

/**
 * Convert font-size to Tailwind classes
 */
function convertFontSize(value: string): string | null {
  const num = parseNumericValue(value);
  if (num !== null) {
    return fontSizeToTailwind(num);
  }
  return `text-[${value}]`;
}

/**
 * Convert border-radius to Tailwind classes
 */
function convertBorderRadius(value: string): string | null {
  if (value === '50%' || value === '100%') {
    return 'rounded-full';
  }
  
  const num = parseNumericValue(value);
  if (num !== null) {
    return borderRadiusToTailwind(num);
  }
  
  return `rounded-[${value}]`;
}

// Build the function-based mappings
const FUNCTION_MAPPINGS: Record<string, ConversionFunction> = {
  margin: (v) => convertSpacing('margin', v),
  'margin-top': (v) => convertSpacing('margin-top', v),
  'margin-right': (v) => convertSpacing('margin-right', v),
  'margin-bottom': (v) => convertSpacing('margin-bottom', v),
  'margin-left': (v) => convertSpacing('margin-left', v),
  // Logical margin properties
  'margin-inline': (v) => convertSpacing('margin-inline', v),
  'margin-block': (v) => convertSpacing('margin-block', v),
  'margin-inline-start': (v) => convertSpacing('margin-inline-start', v),
  'margin-inline-end': (v) => convertSpacing('margin-inline-end', v),
  'margin-block-start': (v) => convertSpacing('margin-block-start', v),
  'margin-block-end': (v) => convertSpacing('margin-block-end', v),
  padding: (v) => convertSpacing('padding', v),
  'padding-top': (v) => convertSpacing('padding-top', v),
  'padding-right': (v) => convertSpacing('padding-right', v),
  'padding-bottom': (v) => convertSpacing('padding-bottom', v),
  'padding-left': (v) => convertSpacing('padding-left', v),
  // Logical padding properties
  'padding-inline': (v) => convertSpacing('padding-inline', v),
  'padding-block': (v) => convertSpacing('padding-block', v),
  'padding-inline-start': (v) => convertSpacing('padding-inline-start', v),
  'padding-inline-end': (v) => convertSpacing('padding-inline-end', v),
  'padding-block-start': (v) => convertSpacing('padding-block-start', v),
  'padding-block-end': (v) => convertSpacing('padding-block-end', v),
  width: (v) => convertDimension('width', v),
  height: (v) => convertDimension('height', v),
  'min-width': (v) => {
    const result = convertDimension('width', v);
    return result ? result.replace('w-', 'min-w-') : null;
  },
  'max-width': (v) => {
    const result = convertDimension('width', v);
    return result ? result.replace('w-', 'max-w-') : null;
  },
  'min-height': (v) => {
    const result = convertDimension('height', v);
    return result ? result.replace('h-', 'min-h-') : null;
  },
  'max-height': (v) => {
    const result = convertDimension('height', v);
    return result ? result.replace('h-', 'max-h-') : null;
  },
  color: (v) => convertColor('color', v),
  'background-color': (v) => convertColor('background-color', v),
  'font-size': convertFontSize,
  'border-radius': convertBorderRadius,
};

/**
 * Convert a CSS property-value pair to a Tailwind class
 * @param property - The CSS property name
 * @param value - The CSS property value
 * @returns The Tailwind class or null if unsupported
 */
export function convertProperty(property: string, value: string): string | null {
  // Normalize property and value
  const normalizedProperty = property.toLowerCase().trim();
  const normalizedValue = value.toLowerCase().trim();

  // Check direct mappings first
  if (DIRECT_MAPPINGS[normalizedProperty]?.[normalizedValue]) {
    return DIRECT_MAPPINGS[normalizedProperty][normalizedValue];
  }

  // Check function mappings
  if (FUNCTION_MAPPINGS[normalizedProperty]) {
    return FUNCTION_MAPPINGS[normalizedProperty](normalizedValue);
  }

  return null;
}

/**
 * Get list of supported CSS properties
 */
export function getSupportedProperties(): string[] {
  return [
    ...Object.keys(DIRECT_MAPPINGS),
    ...Object.keys(FUNCTION_MAPPINGS),
  ];
}
