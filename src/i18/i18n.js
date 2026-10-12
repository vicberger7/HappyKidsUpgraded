import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ua from "./ua.json";
import en from "./en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ua",
    fallbackLng: "en",
    debug: true,
    resources: {
      en: { translation: en },
      ua: { translation: ua },
    },
    ns: ["translation"],
    defaultNS: "translation",
  });

export default i18n;
