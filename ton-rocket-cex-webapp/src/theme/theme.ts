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
      MuiGrid: {
        styleOverrides: {
          root: {
            "&.SectionContainer": {
              marginLeft: "32px",
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            color: "var(--tg-theme-button-color)"
          },
        }
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-button-color)",
            // ":hover": {
            //   backgroundColor: "" 
            // },
          },
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-button-color)",
            "&.Mui-disabled": {
              color: "var(--tg-theme-hint-color)"
            }
          }
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
            color: "var(--tg-theme-text-color)",
            "&.SectionTitle": {
              color: "var(--tg-theme-link-color)",
              marginLeft: "32px",
              marginTop: "16px",
              marginBottom: "8px",
            }
          },
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
          root: {
            backgroundColor: "var(--tg-theme-bg-color)",
          },
          indicator: {
            height: "4px",
            borderRadius: "4px 4px 0 0"
          }
        }
      },
      MuiInput: {
        styleOverrides: {
          root: {
              "&::after": { 
                borderBottom: "2px solid var(--tg-theme-button-color)"
              }
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-text-color)",
            "&::placeholder": { 
              color: "var(--tg-theme-hint-color)"
            },
          },
        }
      },
      MuiInputLabel: {
        styleOverrides:{
          root: {
            transform: "scale(0.75)",
            "&.Mui-focused": {
              color: "var(--tg-theme-button-color)"
            }
          }
        }
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            ".MuiTypography-root": {
              color: "var(--tg-theme-hint-color)"
            }
          }
        }
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-hint-color)",
          }
        }
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-button-color)"
          }
        }
      },
      // MuiSvgIcon: {
      //   styleOverrides: {
      //     root: {
      //       fill: "var(--tg-theme-hint-color)"
      //     },
      //   }
      // },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: "var(--tg-theme-text-color)",
          },
          secondary: {
            color: "var(--tg-theme-hint-color)",
          },
        }
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            ".grid-label": {
              color: "var(--tg-theme-hint-color)",
            }
          }
        }
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            ".MuiTableCell-root": {
            backgroundColor: "var(--tg-theme-bg-color)",
            color: "var(--tg-theme-text-color)"
            }
          }
        }
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--tg-theme-secondary-bg-color)",
            ".MuiTableCell-root": {
              color: "var(--tg-theme-text-color)"
            }
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            "&.ListItemDivider": {
              marginLeft: "32px",
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            color: "var(--tg-theme-hint-color)",
            backgroundColor: "var(--tg-theme-secondary-bg-color)",
            ".MuiButtonBase-root": {
              //TODO
              color: "var(--tg-theme-button-color) !important",
            }
          }
        }
      }
    },
  });

export {androidTheme};