 # Theme System Documentation

This directory contains the JSON-based theme system for the Fleek application. The theme system provides a structured way to manage colors, typography, spacing, and component styles across light and dark themes.

## File Structure

```
app/themes/
├── light.json          # Light theme configuration
├── dark.json           # Dark theme configuration
├── theme-config.json   # Global theme settings
├── index.ts           # Theme utilities and types
└── README.md          # This documentation
```

## Usage

### Using Theme Hooks

```tsx
import { useThemeJson, useThemeColor, useThemeComponent } from '~/hooks/useThemeJson';

function MyComponent() {
  const { colors, typography, spacing, getColor } = useThemeJson();
  
  // Direct access to theme properties
  const primaryBg = colors.background.primary;
  const textColor = colors.text.primary;
  
  // Using helper functions
  const successColor = getColor('success.500');
  const buttonStyles = getComponent('button.primary');
  
  return (
    <div style={{ backgroundColor: primaryBg, color: textColor }}>
      <button style={{
        backgroundColor: buttonStyles.background,
        color: buttonStyles.text,
        padding: `${spacing.sm} ${spacing.md}`
      }}>
        Themed Button
      </button>
    </div>
  );
}
```

## Color Path Examples

```tsx
// Access nested color values using dot notation
getColor('primary.500')        // Main primary color
getColor('text.secondary')     // Secondary text color
getColor('background.primary') // Primary background
getColor('success.400')        // Success color variant
```

## Component Path Examples

```tsx
// Access component styles using dot notation
getComponent('button.primary')     // Primary button styles
getComponent('button.secondary')   // Secondary button styles
getComponent('input')              // Input field styles
getComponent('card')               // Card component styles
```

## Best Practices

1. **Consistency**: Keep the same structure between light and dark themes
2. **Accessibility**: Ensure sufficient contrast ratios in both themes
3. **Semantic Naming**: Use descriptive names for colors and components
4. **Performance**: Use the memoized hooks to prevent unnecessary re-renders
5. **Type Safety**: Leverage TypeScript for better developer experience 