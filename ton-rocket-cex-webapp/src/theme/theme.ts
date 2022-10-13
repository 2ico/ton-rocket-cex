import { createTheme } from '@mui/material';
import WebApp from '@twa-dev/sdk';

declare module '@mui/material/styles' {
    interface Theme {
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
    }
  }
  
  const androidTheme = createTheme({
    // palette: {
    //   primary: {
    //     main: WebApp.themeParams.bg_color
    //   },
    //   error: {},
    //   warning: {
    //     main: WebApp.themeParams.link_color 
    //   },
    //   info: {

    //   },
    //   success: {
    //     main: "rgb(49, 181, 69)",
    //   },
    // },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            color: "var(--tg-theme-link-color)"
          },
        }
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-link-color)",
            // ":hover": {
            //   backgroundColor: "" 
            // },
          },
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-text-color)",
            backgroundColor: "var(--tg-theme-bg-color)",
            boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.2)" // 0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-text-color)"
          },
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
            color: "var(--tg-theme-text-color)",
            "::placeholder": " { color: #FF0000;}",
          },
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