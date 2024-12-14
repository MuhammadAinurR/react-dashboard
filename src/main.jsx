import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "@/components/ui/toaster";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { defaultLocale, dynamicActivate } from "./i18n";

const I18nApp = () => {
  useEffect(() => {
    // with this method we dynamically laod the catalogs
    const currentLanguage = window.localStorage.getItem("language");
    if (!currentLanguage) {
      window.localStorage.setItem("language", defaultLocale);
      dynamicActivate(defaultLocale);
    } else {
      dynamicActivate(currentLanguage);
    }
  });
  return (
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <App />
        <Toaster />
      </I18nProvider>
    </StrictMode>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<I18nApp />);
