import React, { useState, useEffect } from 'react';
import telegramHooks from '@/hooks/telegram';
import {Query, QueryClient, QueryClientProvider} from 'react-query';
import Trade from "@/views/Trade";
import Settings from "@/views/Settings";
import NotFound from "@/views/NotFound";
import './App.css'

// import { withTelegramWebApp, useTelegramWebApp } from 'react-telegram-webapp';

import { Routes, Route } from "react-router-dom";
import Currencies from '@/views/Currencies';

function App() {
  const queryClient = new QueryClient();

  const {isReady, telegram} = telegramHooks();

  // const [userReady, setUserReady] = useState(false);

  // useEffect(() => {
  //   if (isReady) {
  //     telegram.MainButton.setParams({
  //       text: "VIEW ORDER",
  //       is_visible: true
  //     });
  //   }
  // }, [telegram, isReady]);

  return (
     <QueryClientProvider client={queryClient}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Currencies />} />
            <Route path="/trade/:pair" element={<Trade />} />
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