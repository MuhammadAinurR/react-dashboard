import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dynamicActivate } from "../i18n";

export default function LanguageToggler() {
  const [locale, setLocale] = useState(window.localStorage.getItem("language") || "en");

  useEffect(() => {
    dynamicActivate(locale);
  }, [locale]);

  const languageOptions = [
    { value: "zh", label: "Chinese" },
    { value: "en", label: "English" },
    { value: "id", label: "Indonesian" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "vi", label: "Vietnamese" },
  ];

  const changeLanguage = (value) => {
    if (value) {
      setLocale(value);
      window.localStorage.setItem("language", value);
    }
  };

  return (
    <Select onValueChange={changeLanguage}>
      <SelectTrigger className="shadcn-select" name="language">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
