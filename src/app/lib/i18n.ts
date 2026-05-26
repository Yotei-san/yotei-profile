import en from "@/app/lib/dictionaries/en";
import ptBR from "@/app/lib/dictionaries/pt-BR";

export const localeCookieName = "yotei-locale";
export const localeStorageKey = "yotei-locale";
export const locales = ["en", "pt-BR"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];
type DictionaryShape = typeof en;
type DeepStringMap<T> = T extends string
  ? string
  : { [K in keyof T]: DeepStringMap<T[K]> };

export type Dictionary = DeepStringMap<DictionaryShape>;

type Primitive = string | number | boolean | null | undefined;
type TranslationValues = Record<string, Primitive>;

type LeafPaths<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : {
      [K in keyof T & string]: LeafPaths<
        T[K],
        Prefix extends "" ? K : `${Prefix}.${K}`
      >;
    }[keyof T & string];

export type TranslationKey = LeafPaths<DictionaryShape>;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  "pt-BR": ptBR,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "pt-BR";
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function detectLocaleFromLanguageTag(
  value: string | null | undefined,
): Locale {
  const normalized = (value ?? "").toLowerCase();
  return normalized.startsWith("pt") ? "pt-BR" : "en";
}

export async function getRequestLocale(): Promise<Locale> {
  const { cookies, headers } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return detectLocaleFromLanguageTag(headerStore.get("accept-language"));
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

function getValueByPath(source: Dictionary, key: string): string | undefined {
  const segments = key.split(".");
  let current: unknown = source;

  for (const segment of segments) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : undefined;
}

function formatMessage(
  template: string,
  values?: TranslationValues,
): string {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = values[token];
    return value === undefined || value === null ? `{${token}}` : String(value);
  });
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  values?: TranslationValues,
): string {
  const localized = getValueByPath(getDictionary(locale), key);
  const fallback = getValueByPath(getDictionary(defaultLocale), key);
  const resolved = localized ?? fallback ?? key;
  return formatMessage(resolved, values);
}

export function createTranslator(locale: Locale) {
  return (key: TranslationKey, values?: TranslationValues) =>
    translate(locale, key, values);
}

export function toIntlLocale(locale: Locale): string {
  return locale === "pt-BR" ? "pt-BR" : "en-US";
}
