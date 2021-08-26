import i18n from 'i18next/index';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: require('./en/translation'),
    },
    nb: {
        translation: require('./nb/translation'),
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'nb',
        resources,
        fallbackLng: 'nb',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
