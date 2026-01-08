# Funky Enterprises Design System - Extracted Colors

## Boje (Color Palette)

### Primarne boje:
- **Neon Lime/Yellow**: `#d4ff00` ili `#c9ff00` (glavni accent - "Allignment", "Engineer Demand")
- **Dark Navy/Almost Black**: `#010a0d` ili `rgb(1, 10, 13)` (pozadina)
- **White**: `#ffffff` ili `rgb(255, 255, 255)` (glavni tekst)
- **Teal/Cyan circles**: `#2d5f5d` (dekorativni elementi)

### Dodatne boje:
- **Dark Card Background**: `#0a0e1a` ili `#0d1117` (kartice)
- **Light Gray/Muted**: `#8a8a8a` (sekundarni tekst, descriptions)
- **Olive/Green dots**: Različite nijanse zelene za Sales Report grafikon

## Fontovi

### Primary Font:
- **Sans-serif** (likely Helvetica Neue, Inter, or similar modern sans-serif)
- Font weights: Regular (400), Medium (500), Bold (700)

### Typography Style:
- Large headings (48px+) sa mixed case
- Jedan ili dva riječi u **neon lime** boji za emphasis
- Clean, high contrast
- Generous line-height i letter-spacing

## Design Karakteristike:

1. **Hero Section**: 
   - Dark background (`#010a0d`)
   - Large white text sa neon lime accent words
   - CTA buttons: Neon lime background (`#d4ff00`), dark text

2. **Cards/Sections**: 
   - Slightly lighter dark background
   - Subtle borders ili shadows
   - Rounded corners

3. **Accent Elements**:
   - Neon lime za highlight words
   - Teal circles za dekoraciju
   - Olive/green dots za data visualization

4. **Layout**:
   - Generous whitespace
   - Asymmetric layouts
   - Large typography
   - High contrast

## CSS Variables (Tailwind-style)

```css
--background: 1 10 13; /* rgb(1, 10, 13) - dark navy */
--foreground: 255 255 255; /* white */
--accent: 212 255 0; /* rgb(212, 255, 0) - neon lime */
--card: 10 14 26; /* slightly lighter dark */
--muted: 138 138 138; /* gray for secondary text */
```
