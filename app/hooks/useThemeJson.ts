import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getTheme, getThemeColor, getThemeComponent, type Theme } from '../themes';

export function useThemeJson() {
  const { actualTheme } = useTheme();
  
  const currentTheme = useMemo(() => {
    return getTheme(actualTheme);
  }, [actualTheme]);

  const getColor = useMemo(() => {
    return (colorPath: string): string => {
      return getThemeColor(actualTheme, colorPath);
    };
  }, [actualTheme]);

  const getComponent = useMemo(() => {
    return (componentPath: string): any => {
      return getThemeComponent(actualTheme, componentPath);
    };
  }, [actualTheme]);

  // Helper functions for easy access to common properties
  const colors = useMemo(() => currentTheme.colors, [currentTheme]);
  const typography = useMemo(() => currentTheme.typography, [currentTheme]);
  const spacing = useMemo(() => currentTheme.spacing, [currentTheme]);
  const borderRadius = useMemo(() => currentTheme.borderRadius, [currentTheme]);
  const shadows = useMemo(() => currentTheme.shadows, [currentTheme]);
  const components = useMemo(() => currentTheme.components, [currentTheme]);

  return {
    theme: currentTheme,
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    components,
    getColor,
    getComponent,
    themeName: actualTheme,
  };
}

// Type-safe color getter
export function useThemeColor(colorPath: string): string {
  const { getColor } = useThemeJson();
  return getColor(colorPath);
}

// Type-safe component getter
export function useThemeComponent(componentPath: string): any {
  const { getComponent } = useThemeJson();
  return getComponent(componentPath);
} 