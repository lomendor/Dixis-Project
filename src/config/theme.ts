export const theme = {
  colors: {
    primary: {
      50: '#F0F7FF',  // Light blue - Greek flag inspired
      100: '#E0EFFF',
      200: '#B8DBFF',
      300: '#8AC2FF',
      400: '#5CA9FF',
      500: '#2E90FF', // Primary blue
      600: '#1B6FD1',
      700: '#1351A3',
      800: '#0B3775',
      900: '#041D47',
    },
    accent: {
      50: '#FFF5F0',
      100: '#FFE6D9',
      200: '#FFC7B3',
      300: '#FFA88C',
      400: '#FF8966',
      500: '#FF6A40', // Terracotta - Greek pottery inspired
      600: '#D14E2B',
      700: '#A3361B',
      800: '#75210D',
      900: '#470C00',
    },
    olive: {
      50: '#F7F9F3',
      100: '#EFF2E6',
      200: '#D9E1C3',
      300: '#C2CF9F',
      400: '#ACBE7C',
      500: '#96AD59', // Olive green - Greek olive inspired
      600: '#7A8D47',
      700: '#5D6B36',
      800: '#414A24',
      900: '#242912',
    },
  },
  fonts: {
    sans: '"Inter", system-ui, -apple-system, sans-serif',
    serif: '"Roboto Slab", Georgia, serif',
  },
  spacing: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    DEFAULT: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    FAST: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    SLOW: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;