// i18n/index.ts - 简化版：保留中文、英语、日语
import { en } from './en';
import { zh } from './zh';
import { jp } from './jp';
import { useConfigStore } from '../utils/state';

const translations = {
    en,
    zh,
    jp,
} as const;

type TranslationKeys<T> = T extends object
    ? { [K in keyof T]: K extends string ? T[K] extends string ? K : `${K}.${TranslationKeys<T[K]>}` : never }[keyof T]
    : never;

export type TranslationKey = TranslationKeys<typeof en>;
export type Language = 'en' | 'zh' | 'jp';

function getTranslation(key: TranslationKey, language: Language): string {
    const keys = key.split('.');
    let value: any = translations[language] || translations.en;

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            // Fallback to English
            value = translations.en;
            for (const fallbackKey of keys) {
                value = value?.[fallbackKey];
                if (value === undefined) break;
            }
            break;
        }
    }

    return value || key;
}

// type-safe translation hook
export function useTranslation() {
    const language = useConfigStore((state) => state.language);
    const t = (key: TranslationKey): string => getTranslation(key, language as Language);
    return { t, language };
}

export function t(key: TranslationKey): string {
    const language = useConfigStore.getState().language as Language;
    return getTranslation(key, language);
}

export { en, zh, jp };