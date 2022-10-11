import React, { useState, useEffect } from 'react';
import telegramHooks from '@/hooks/telegram';
import {Query, QueryClient, QueryClientProvider} from 'react-query';
import Trade from "@/views/Trade";
import Orders from '@/views/Orders';
import Settings from "@/views/Settings";
import NotFound from "@/views/NotFound";
import './App.css'

// import { withTelegramWebApp, useTelegramWebApp } from 'react-telegram-webapp';

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Currencies from '@/views/Currencies';
import CustomBackdrop from '@/components/CustomBackdrop';

function App() {
  const queryClient = new QueryClient();

  const {isReady, telegram} = telegramHooks();
  const navigate = useNavigate();

  // const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    if(!isReady) return
    //@ts-ignore
    telegram.onEvent('settingsButtonClicked', () => {
      navigate("/settings")
    }) 
  }, [isReady, telegram]);

  // useEffect(() => {
  //   if (isReady) {
  //     telegram.MainButton.setParams({
  //       text: "VIEW ORDER",
  //       is_visible: true
  //     });
  //   }
  // }, [telegram, isReady]);
  if(!isReady) return (
    <CustomBackdrop />
  );

  return (
     <QueryClientProvider client={queryClient}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Currencies />} />
            <Route path="/trade/:pair" element={<Trade />} />
            <Route path="/orders" element={<Orders />} />
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