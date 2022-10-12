// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )


import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material';
import WebApp from '@twa-dev/sdk'

//TODO validate user data hash
async function validateHash(hash: string) {
  // TODO
  // const response = await fetch(`/api/validate`, {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ hash }),
  // });

  // return response.ok;

  return true;
}

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
        h6: {
          color: "var(--tg-theme-link-color)"
          // color: WebApp.themeParams.link_color
        }
      }
    }
  },
});


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={androidTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);