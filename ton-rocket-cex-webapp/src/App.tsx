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

import React, { useState } from 'react';
import telegramHooks from './hooks/telegram';
import { useEffect } from "react";

// import { withTelegramWebApp, useTelegramWebApp } from 'react-telegram-webapp';



function App() {
  const {isReady, telegram} = telegramHooks();

  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      telegram.MainButton.setParams({
        color: "rgb(49, 181, 69)",
        text: "VIEW ORDER",
        is_visible: userReady
      });
      console.log(userReady);
    }
  }, [telegram, isReady, userReady]);

  return (
    <div className="App">
            <div>Test React app !!</div>
            <button onClick={() => setUserReady(!userReady)}>
              Toggle Main button
            </button>
        </div>
    )
  }
  
  function toggleMainButton(){
    const {isReady, telegram} = telegramHooks();
    if(isReady){
      telegram.MainButton.show();
    }
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