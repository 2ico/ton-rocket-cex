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
import App from './App'
import './index.css'
import { TelegramWebApp } from 'react-telegram-webapp';

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
  <TelegramWebApp validateHash={validateHash}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </TelegramWebApp>
  </React.StrictMode>
);