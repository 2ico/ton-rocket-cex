// import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className="App">
//       Test React app !!
//     </div>
//   )
// }

// export default App

import React, { useState, useEffect } from 'react';
import telegramHooks from './hooks/telegram';
import {Query, QueryClient, QueryClientProvider} from 'react-query';
import Trade from "@/pages/Trade";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import './App.css'

// import { withTelegramWebApp, useTelegramWebApp } from 'react-telegram-webapp';

import { Routes, Route } from "react-router-dom";

function App() {
  const queryClient = new QueryClient();

  const {isReady, telegram} = telegramHooks();

  // const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      telegram.MainButton.setParams({
        text: "VIEW ORDER",
        is_visible: true
      });
    }
  }, [telegram, isReady]);

  return (
     <QueryClientProvider client={queryClient}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Trade />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </QueryClientProvider>
    )
}

async function validateHash(hash: string) {
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

export default App