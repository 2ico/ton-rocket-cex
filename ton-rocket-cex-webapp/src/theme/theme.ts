import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
    interface Theme {
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
    }
  }
  
  const androidTheme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--tg-theme-secondary-bg-color)"
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          subtitle1: {
            color: "var(--tg-theme-link-color)"
            // color: WebApp.themeParams.link_color
          }
        }
      }
    },
  });

export {androidTheme};