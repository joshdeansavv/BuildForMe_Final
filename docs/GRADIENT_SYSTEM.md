# BuildForMe Gradient System

This document describes the signature gradient system implemented in BuildForMe.

## Overview

The gradient system provides beautiful, animated backgrounds and accents using the signature color scheme:

### Primary Signature Gradient

**Signature Gradient** (`rgba(131, 58, 180, 1)` to `rgba(244, 114, 182, 1)` to `rgba(251, 146, 60, 1)`)
   - Used for: Primary buttons, text accents, badges, premium features
   - Class: `gradient-primary`, `gradient-primary-text`, `gradient-primary-animated`
   - Direction: 90deg linear gradient with three color stops

### Secondary Gradients

- **Ocean Gradient** (`#667eea` to `#764ba2`) - Used for secondary elements
- **Sunset Gradient** (`#f093fb` to `#f5576c`) - Used for accent elements
- **Forest Gradient** (`#4facfe` to `#00f2fe`) - Used for special highlights

## Usage

### Background Classes

```css
.gradient-primary              /* Static signature gradient background */
.gradient-primary-animated     /* Animated signature gradient background */
.gradient-primary-zoomed       /* Zoomed signature gradient background */
```

### Text Gradient Classes

```css
.gradient-primary-text         /* Static signature gradient text */
.gradient-primary-text-animated /* Animated signature gradient text */
.gradient-primary-text-zoomed  /* Zoomed signature gradient text */
```

### Button Classes

```css
.btn-gradient                  /* Signature gradient button */
```

### Badge Classes

```css
.badge-gradient                /* Signature gradient badge */
```

## Implementation Details

### CSS Variables

The signature gradient is defined in CSS variables:

```css
--gradient-primary: linear-gradient(90deg, rgba(131, 58, 180, 1) 0%, rgba(244, 114, 182, 1) 50%, rgba(251, 146, 60, 1) 100%);
```

### Animations

- `gradient-shift` - Shifts gradient positions for animated backgrounds
- `gradient-shift` - 3s ease infinite animation for text and background gradients

### Color Values

- **Primary Purple**: `rgba(131, 58, 180, 1)` (#833ab4)
- **Pink**: `rgba(244, 114, 182, 1)` (#f472b6) 
- **Orange**: `rgba(251, 146, 60, 1)` (#fb923c)

## Best Practices

1. **Use sparingly** - Don't overuse gradients on every element
2. **Maintain contrast** - Ensure text remains readable over gradients
3. **Consistent theming** - Use the signature gradient for primary elements
4. **Performance** - Animated gradients are GPU-intensive, use with care
5. **Accessibility** - Ensure sufficient contrast ratios for text over gradients

## Customization

To modify the signature gradient, update the CSS variable in `src/index.css`:

```css
--gradient-primary: linear-gradient(90deg, rgba(131, 58, 180, 1) 0%, rgba(244, 114, 182, 1) 50%, rgba(251, 146, 60, 1) 100%);
```

And update the corresponding Tailwind configuration in `tailwind.config.ts`:

```typescript
backgroundImage: {
  'gradient-primary': 'linear-gradient(90deg, rgba(131, 58, 180, 1) 0%, rgba(244, 114, 182, 1) 50%, rgba(251, 146, 60, 1) 100%)',
}
``` 