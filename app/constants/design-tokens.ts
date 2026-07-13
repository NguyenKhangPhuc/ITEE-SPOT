// app/constants/design-tokens.ts

export const colors = {
  // Mint Accent
  mint: '#00e0b3',

  // Core Theme Colors
  background: '#151312',
  surface: '#151312',
  surfaceDim: '#151312',
  surfaceBright: '#3b3937',

  // Surface containers
  surfaceContainerLowest: '#100e0d',
  surfaceContainerLow: '#1d1b1a',
  surfaceContainer: '#211f1e',
  surfaceContainerHigh: '#2c2928',
  surfaceContainerHighest: '#373433',
  surfaceVariant: '#373433',

  // Outlines & Borders
  outline: '#83958d',
  outlineVariant: '#3a4a44',

  // On-surfaces & Text
  onBackground: '#e8e1df',
  onSurface: '#e8e1df',
  onSurfaceVariant: '#b9cbc2',

  // Primary
  primary: '#fdfffc',
  onPrimary: '#00382b',
  primaryContainer: '#00ffcc',
  onPrimaryContainer: '#00725a',
  primaryFixed: '#24ffcd',
  primaryFixedDim: '#00e0b3',

  // Secondary
  secondary: '#b5cbc5',
  onSecondary: '#203430',
  secondaryContainer: '#364b46',
  onSecondaryContainer: '#a3bab4',

  // Error colors
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
} as const;

export const tw = {
  bg: {
    background: 'bg-[#151312]',
    surface: 'bg-[#151312]',
    surfaceContainerLowest: 'bg-[#100e0d]',
    surfaceContainerLow: 'bg-[#1d1b1a]',
    surfaceContainer: 'bg-[#211f1e]',
    surfaceContainerHigh: 'bg-[#2c2928]',
    surfaceContainerHighest: 'bg-[#373433]',
    mint: 'bg-[#00e0b3]',
    mintSubtle: 'bg-[#00e0b3]/5',
  },
  text: {
    mint: 'text-[#00e0b3]',
    onBackground: 'text-[#e8e1df]',
    onSurface: 'text-[#e8e1df]',
    onSurfaceVariant: 'text-[#b9cbc2]',
    outline: 'text-[#83958d]',
    onPrimary: 'text-[#00382b]',
  },
  border: {
    outlineVariant: 'border-[#3a4a44]',
    outlineVariantSubtle: 'border-[#3a4a44]/30',
    whiteSubtle: 'border-white/5',
    mintSubtle: 'border-[#00e0b3]/20',
  }
} as const;
