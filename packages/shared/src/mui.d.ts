// MUI Palette augmentation for MD3 tonal surface tokens
declare module '@mui/material/styles' {
  interface Palette {
    surfaceVariant: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
  }
  interface PaletteOptions {
    surfaceVariant?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    tertiaryContainer?: string;
    onTertiaryContainer?: string;
  }
}
