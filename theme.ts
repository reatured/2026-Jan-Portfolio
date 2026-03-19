import { createTheme } from '@mui/material/styles';

export const SHAPE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 9999,
} as const;

// M3 Dark Tonal Palette — Electric Violet (#7C3AED) source
export const M3 = {
  // Primary (Violet)
  primary: '#D0BCFF',
  onPrimary: '#381E72',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
  // Secondary (Muted Violet-Grey)
  secondary: '#CCC2DC',
  onSecondary: '#332D41',
  secondaryContainer: '#4A4458',
  onSecondaryContainer: '#E8DEF8',
  // Tertiary (Rose-Pink accent)
  tertiary: '#EFB8C8',
  onTertiary: '#492532',
  tertiaryContainer: '#633B48',
  onTertiaryContainer: '#FFD8E4',
  // Error
  error: '#F2B8B5',
  onError: '#601410',
  errorContainer: '#8C1D18',
  onErrorContainer: '#F9DEDC',
  // Neutral surfaces — more purple-tinted for richer contrast
  background: '#0E0C18',
  onBackground: '#E6E1E5',
  surface: '#0E0C18',
  onSurface: '#E6E1E5',
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',
  // Surface containers (elevation system) — lighter steps for card pop
  surfaceContainerLowest: '#090812',
  surfaceContainerLow: '#1C1830',
  surfaceContainer: '#231F3A',
  surfaceContainerHigh: '#2D2848',
  surfaceContainerHighest: '#38335A',
  // Outline
  outline: '#7A7585',
  outlineVariant: '#3A3550',
  // Inverse
  inverseSurface: '#E6E1E5',
  inverseOnSurface: '#313033',
  inversePrimary: '#6750A4',
  // Scrim
  scrim: '#000000',
  shadow: '#000000',
} as const;

export const portfolioTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: M3.primary,
      contrastText: M3.onPrimary,
    },
    secondary: {
      main: M3.secondary,
      contrastText: M3.onSecondary,
    },
    error: {
      main: M3.error,
      contrastText: M3.onError,
    },
    background: {
      default: M3.background,
      paper: M3.surfaceContainerLow,
    },
    text: {
      primary: M3.onSurface,
      secondary: M3.onSurfaceVariant,
    },
    divider: M3.outlineVariant,
    // Custom tokens via augmentColorOptions — access via theme.palette
  },
  typography: {
    fontFamily: '"Space Grotesk", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      letterSpacing: '-0.03em',
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      letterSpacing: '-0.025em',
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h4: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
    },
    h5: {
      fontFamily: '"Instrument Serif", Georgia, serif',
      fontWeight: 400,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h6: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    subtitle1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontFamily: '"Space Grotesk", sans-serif',
      lineHeight: 1.65,
    },
    body2: {
      fontFamily: '"Space Grotesk", sans-serif',
      lineHeight: 1.65,
    },
    caption: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.04em',
    },
  },
  shape: {
    borderRadius: SHAPE.xl,
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: M3.surfaceContainerLow,
          borderRadius: SHAPE.xl,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: SHAPE.full,
          textTransform: 'none' as const,
          fontWeight: 600,
          fontFamily: '"Space Grotesk", sans-serif',
        },
        containedPrimary: {
          backgroundColor: M3.primaryContainer,
          color: M3.onPrimaryContainer,
          '&:hover': {
            backgroundColor: M3.primary,
            color: M3.onPrimary,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: SHAPE.full,
          fontWeight: 500,
          fontFamily: '"Space Grotesk", sans-serif',
          backgroundColor: M3.secondaryContainer,
          color: M3.onSecondaryContainer,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: SHAPE.sm,
          color: M3.onSurfaceVariant,
          '&:hover': {
            backgroundColor: `${M3.surfaceContainerHigh}`,
            color: M3.onSurface,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: M3.inverseSurface,
          color: M3.inverseOnSurface,
          borderRadius: SHAPE.xs,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

// Extend palette to recognize custom tokens
declare module '@mui/material/styles' {
  interface Palette {
    surfaceVariant: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    onSurfaceVariant: string;
    primaryContainer: string;
    onPrimaryContainer: string;
  }
  interface PaletteOptions {
    surfaceVariant?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    tertiaryContainer?: string;
    onTertiaryContainer?: string;
    surfaceContainerLowest?: string;
    surfaceContainerLow?: string;
    surfaceContainer?: string;
    surfaceContainerHigh?: string;
    surfaceContainerHighest?: string;
    onSurfaceVariant?: string;
    primaryContainer?: string;
    onPrimaryContainer?: string;
  }
}

// Patch custom tokens into palette after theme creation
const _p = portfolioTheme.palette as unknown as Record<string, unknown>;
_p['surfaceVariant'] = M3.surfaceVariant;
_p['secondaryContainer'] = M3.secondaryContainer;
_p['onSecondaryContainer'] = M3.onSecondaryContainer;
_p['tertiaryContainer'] = M3.tertiaryContainer;
_p['onTertiaryContainer'] = M3.onTertiaryContainer;
_p['surfaceContainerLowest'] = M3.surfaceContainerLowest;
_p['surfaceContainerLow'] = M3.surfaceContainerLow;
_p['surfaceContainer'] = M3.surfaceContainer;
_p['surfaceContainerHigh'] = M3.surfaceContainerHigh;
_p['surfaceContainerHighest'] = M3.surfaceContainerHighest;
_p['onSurfaceVariant'] = M3.onSurfaceVariant;
_p['primaryContainer'] = M3.primaryContainer;
_p['onPrimaryContainer'] = M3.onPrimaryContainer;

export const adminTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    background: {
      default: '#020617',
      paper: '#0f172a',
    },
    divider: '#1e293b',
  },
  typography: {
    fontFamily: '"Space Grotesk", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
  },
});
