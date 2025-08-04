import lightTheme from './light.json';
import darkTheme from './dark.json';

export type ThemeColors = typeof lightTheme.colors;
export type ThemeTypography = typeof lightTheme.typography;
export type ThemeSpacing = typeof lightTheme.spacing;
export type ThemeBorderRadius = typeof lightTheme.borderRadius;
export type ThemeShadows = typeof lightTheme.shadows;
export type ThemeComponents = typeof lightTheme.components;

export interface Theme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  components: ThemeComponents;
}

export const themes = {
  light: lightTheme as Theme,
  dark: darkTheme as Theme,
};

export const getTheme = (themeName: 'light' | 'dark'): Theme => {
  return themes[themeName];
};

export const getThemeColor = (
  themeName: 'light' | 'dark',
  colorPath: string
): string => {
  const theme = getTheme(themeName);
  const pathArray = colorPath.split('.');
  
  let current: any = theme.colors;
  for (const key of pathArray) {
    if (current[key] === undefined) {
      throw new Error(`Color path "${colorPath}" not found in ${themeName} theme`);
    }
    current = current[key];
  }
  
  return current;
};

export const getThemeComponent = (
  themeName: 'light' | 'dark',
  componentPath: string
): any => {
  const theme = getTheme(themeName);
  const pathArray = componentPath.split('.');
  
  let current: any = theme.components;
  for (const key of pathArray) {
    if (current[key] === undefined) {
      throw new Error(`Component path "${componentPath}" not found in ${themeName} theme`);
    }
    current = current[key];
  }
  
  return current;
};

// Helper functions for Material Design 3 color tokens
export const getMaterialColor = (
  themeName: 'light' | 'dark',
  palette: 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral' | 'neutral_variant',
  tone: string | number
): string => {
  return getThemeColor(themeName, `${palette}.${tone}`);
};

export const getSurfaceColor = (
  themeName: 'light' | 'dark',
  surface: keyof ThemeColors['surface']
): string => {
  return getThemeColor(themeName, `surface.${surface}`);
};

export const getTextColor = (
  themeName: 'light' | 'dark',
  textType: keyof ThemeColors['text']
): string => {
  return getThemeColor(themeName, `text.${textType}`);
};

// Helper functions for common color operations
export const rgba = (hex: string, alpha: number): string => {
  // Handle rgba strings
  if (hex.startsWith('rgba')) {
    return hex.replace(/[\d\.]+\)$/g, `${alpha})`);
  }
  
  // Handle hex colors
  if (hex.startsWith('#')) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // Return as-is for other formats
  return hex;
};

export const lighten = (hex: string, amount: number): string => {
  if (!hex.startsWith('#')) return hex;
  
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};

export const darken = (hex: string, amount: number): string => {
  return lighten(hex, -amount);
};

// Material Design 3 semantic color helpers
export const getSemanticColors = (themeName: 'light' | 'dark') => {
  const theme = getTheme(themeName);
  return {
    // Primary semantic colors
    primary: theme.colors.primary['60'],
    onPrimary: theme.colors.text.on_primary,
    primaryContainer: theme.colors.primary['90'],
    onPrimaryContainer: theme.colors.primary['10'],
    
    // Secondary semantic colors
    secondary: theme.colors.secondary['60'],
    onSecondary: theme.colors.text.on_secondary,
    secondaryContainer: theme.colors.secondary['90'],
    onSecondaryContainer: theme.colors.secondary['10'],
    
    // Error semantic colors
    error: theme.colors.error['60'],
    onError: theme.colors.text.on_error,
    errorContainer: theme.colors.error['90'],
    onErrorContainer: theme.colors.error['10'],
    
    // Surface semantic colors
    surface: theme.colors.surface.primary,
    onSurface: theme.colors.text.on_surface,
    surfaceVariant: theme.colors.surface.variant,
    outline: theme.colors.border.primary,
  };
};

// Export default themes
export { lightTheme, darkTheme };
export default themes; 