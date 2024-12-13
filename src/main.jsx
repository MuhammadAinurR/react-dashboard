import { StrictMode } from "react";
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
    dynamicActivate(defaultLocale);
  }, []);
  return (
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <App />
        <Toaster />
      </I18nProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root").render(<I18nApp />));
