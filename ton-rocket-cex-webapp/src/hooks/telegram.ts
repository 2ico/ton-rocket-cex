import { useState, useContext, useCallback } from "react";
// import { sendMessagePost as useSend } from "@api";
// import { useSearchParams } from "react-router-dom";
import {
  useTelegramWebApp,
  useIsTelegramWebAppReady,
} from "react-telegram-webapp";

const useHooks = () => {
//   const [callbackPost] = useSend();
//   const [payment, setPayment] = useState(null);
  const isReady = useIsTelegramWebAppReady();
  const telegram = useTelegramWebApp();

  return {
    isReady,
    telegram,
  };
};

export default useHooks;