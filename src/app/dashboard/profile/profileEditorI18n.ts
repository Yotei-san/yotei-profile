import type { TranslationKey } from "@/app/lib/i18n";

type Translator = (
  key: TranslationKey,
  values?: Record<string, string | number | boolean | null | undefined>,
) => string;

function resolveTranslation(
  t: Translator,
  key: string,
  fallback: string,
  values?: Record<string, string | number | boolean | null | undefined>,
) {
  const translated = t(key as TranslationKey, values);
  return translated || fallback;
}

export function getProfileLayoutName(
  t: Translator,
  value: "default" | "modern" | "simplistic" | "portfolio",
  fallback: string,
) {
  return resolveTranslation(t, `dashboard.profile.layouts.${value}.name`, fallback);
}

export function getProfileLayoutDescription(
  t: Translator,
  value: "default" | "modern" | "simplistic" | "portfolio",
  fallback: string,
) {
  return resolveTranslation(
    t,
    `dashboard.profile.layouts.${value}.description`,
    fallback,
  );
}

export function getNameEffectName(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.nameEffects.${value}.name`, fallback);
}

export function getNameEffectDescription(
  t: Translator,
  value: string,
  fallback: string,
) {
  return resolveTranslation(
    t,
    `dashboard.profile.nameEffects.${value}.description`,
    fallback,
  );
}

export function getMoodName(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.moods.${value}.name`, fallback);
}

export function getMoodDescription(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.moods.${value}.description`, fallback);
}

export function getAuraName(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.auras.${value}.name`, fallback);
}

export function getAuraDescription(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.auras.${value}.description`, fallback);
}

export function getSceneName(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.scenes.${value}.name`, fallback);
}

export function getSceneDescription(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.scenes.${value}.description`, fallback);
}

export function getScenePreviewLabel(t: Translator, value: string, fallback: string) {
  return resolveTranslation(
    t,
    `dashboard.profile.scenes.${value}.previewLabel`,
    fallback,
  );
}

export function getPresetName(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.presets.${value}.name`, fallback);
}

export function getPresetDescription(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.presets.${value}.description`, fallback);
}

export function getDnaName(t: Translator, value: string | null, fallback: string) {
  const key = value ?? "custom";
  return resolveTranslation(t, `dashboard.profile.dna.types.${key}.name`, fallback);
}

export function getDnaDescription(
  t: Translator,
  value: string | null,
  fallback: string,
) {
  const key = value ?? "custom";
  return resolveTranslation(
    t,
    `dashboard.profile.dna.types.${key}.description`,
    fallback,
  );
}

export function getDnaAlignmentLabel(
  t: Translator,
  value: "centered" | "balanced" | "offset",
  fallback: string,
) {
  return resolveTranslation(
    t,
    `dashboard.profile.dna.alignments.${value}`,
    fallback,
  );
}

export function getNamedOption(
  t: Translator,
  group:
    | "backgroundIntensity"
    | "glassIntensity"
    | "bannerStyle"
    | "introMode"
    | "density"
    | "cardStyle"
    | "cornerStyle"
    | "motionLevel"
    | "compositionMode"
    | "compositionDensity"
    | "compositionAlignment"
    | "compositionLinkStyle"
    | "compositionSocialStyle"
    | "metadataPlacement"
    | "badgeShowcaseMode"
    | "badgeStyle"
    | "badgeSeason"
    | "nameTypography"
    | "customBlockType"
    | "customBlockAlignment"
    | "customBlockWidth",
  value: string,
  field: "name" | "description",
  fallback: string,
) {
  return resolveTranslation(
    t,
    `dashboard.profile.options.${group}.${value}.${field}`,
    fallback,
  );
}

export function getCompositionBlockLabel(
  t: Translator,
  value: string,
  fallback: string,
) {
  return resolveTranslation(
    t,
    `dashboard.profile.compositionBlocks.${value}.label`,
    fallback,
  );
}

export function getCompositionBlockDescription(
  t: Translator,
  value: string,
  fallback: string,
) {
  return resolveTranslation(
    t,
    `dashboard.profile.compositionBlocks.${value}.description`,
    fallback,
  );
}

export function getCustomBlockTextPlaceholder(
  t: Translator,
  value: string,
  fallback: string,
) {
  return resolveTranslation(
    t,
    `dashboard.profile.customBlockPlaceholders.main.${value}`,
    fallback,
  );
}

export function getCustomBlockSecondaryPlaceholder(
  t: Translator,
  value: string,
  fallback: string,
) {
  return resolveTranslation(
    t,
    `dashboard.profile.customBlockPlaceholders.secondary.${value}`,
    fallback,
  );
}

export function getHeroPillText(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.heroPills.${value}`, fallback);
}

export function getStatusText(t: Translator, value: string, fallback: string) {
  return resolveTranslation(t, `dashboard.profile.status.${value}`, fallback);
}
