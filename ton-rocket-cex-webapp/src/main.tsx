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
import {androidTheme} from '@/theme/theme'
import { ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux'
import { store } from "@/context/storeUserSelection"

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


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={androidTheme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);