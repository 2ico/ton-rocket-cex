import i18n from "i18next";
import ICU from 'i18next-icu';
// import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationEN from "@/locales/en.json";
import translationRU from "@/locales/ru.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  }
};

i18n
.use(ICU)
// .use(Backend)
// .use(LanguageDetector)
.use(initReactI18next) // if not using I18nextProvider
.init({
fallbackLng: 'en',
debug: true,
resources: resources,
interpolation: {
    escapeValue: false, // not needed for react!!
}});


export default i18n;