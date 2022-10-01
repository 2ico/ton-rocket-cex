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

import React from 'react';
import telegramHooks from './hooks/telegram';
// import { withTelegramWebApp, useTelegramWebApp } from 'react-telegram-webapp';



function App() {
  return (
    <div className="App">
            <div>Test React app !!</div>
            <button onClick={toggleMainButton}>
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