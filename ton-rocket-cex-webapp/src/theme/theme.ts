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
      MuiButtonBase: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-text-color)"
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
          h6: {
            color: "var(--tg-theme-link-color)"
            // color: WebApp.themeParams.link_color
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-text-color)"
          }
        }
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: "4px",
            borderRadius: "4px 4px 0 0"
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-text-color)"
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fill: "var(--tg-theme-text-color)"
          }
        }
      }
    },
  });

export {androidTheme};