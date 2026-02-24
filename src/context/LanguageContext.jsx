import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // 1. Detectar idioma del navegador o usar el guardado en localStorage
    const detectDefaultLang = () => {
        const saved = localStorage.getItem("app_lang");
        if (saved) return saved;

        const browserLang = navigator.language.split('-')[0];
        return browserLang;
    };

    const [lang, setLang] = useState(detectDefaultLang());

    useEffect(() => {
        localStorage.setItem("app_lang", lang);
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);