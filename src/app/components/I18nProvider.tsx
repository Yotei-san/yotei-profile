"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createTranslator,
  defaultLocale,
  localeCookieName,
  localeStorageKey,
  normalizeLocale,
  resolveLocale,
  type Locale,
  type TranslationKey,
} from "@/app/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, values?: Record<string, string | number | boolean | null | undefined>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale = defaultLocale,
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(normalizeLocale(initialLocale));
  const hasHydratedPreferencesRef = useRef(false);

  useEffect(() => {
    const persistedLocale = readPersistedLocale();

    if (persistedLocale && persistedLocale !== locale) {
      setLocaleState(persistedLocale);
      writeLocalePreference(persistedLocale);
      document.documentElement.lang = persistedLocale;
      hasHydratedPreferencesRef.current = true;
      return;
    }

    writeLocalePreference(locale);
    document.documentElement.lang = locale;
    hasHydratedPreferencesRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedPreferencesRef.current) {
      return;
    }

    writeLocalePreference(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    const normalizedLocale = normalizeLocale(nextLocale);

    writeLocalePreference(normalizedLocale);
    document.documentElement.lang = normalizedLocale;
    setLocaleState((currentLocale) =>
      currentLocale === normalizedLocale ? currentLocale : normalizedLocale,
    );
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: createTranslator(locale),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function readPersistedLocale(): Locale | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);

  if (storedLocale) {
    return resolveLocale(storedLocale);
  }

  const cookieLocale = readLocaleCookie();
  return cookieLocale ? resolveLocale(cookieLocale) : null;
}

function readLocaleCookie() {
  const cookieEntry = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${localeCookieName}=`));

  if (!cookieEntry) {
    return null;
  }

  return cookieEntry.slice(localeCookieName.length + 1);
}

function writeLocalePreference(locale: Locale) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(localeStorageKey, locale);
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
