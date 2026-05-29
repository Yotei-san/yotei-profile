export const AURA_POINTS = {
  view: 1,
  like: 10,
  dislike: -5,
  comment: 15,
  configuredLink: 5,
  rareBadge: 25,
  legendaryBadge: 50,
} as const;

export const AURA_RANKS = [
  {
    rank: "E",
    minScore: 0,
    maxScore: 99,
    nextRank: "D",
    nextMinScore: 100,
  },
  {
    rank: "D",
    minScore: 100,
    maxScore: 249,
    nextRank: "C",
    nextMinScore: 250,
  },
  {
    rank: "C",
    minScore: 250,
    maxScore: 499,
    nextRank: "B",
    nextMinScore: 500,
  },
  {
    rank: "B",
    minScore: 500,
    maxScore: 999,
    nextRank: "A",
    nextMinScore: 1000,
  },
  {
    rank: "A",
    minScore: 1000,
    maxScore: 1999,
    nextRank: "S",
    nextMinScore: 2000,
  },
  {
    rank: "S",
    minScore: 2000,
    maxScore: Number.POSITIVE_INFINITY,
    nextRank: null,
    nextMinScore: null,
  },
] as const;

export type AuraRank = (typeof AURA_RANKS)[number]["rank"];

export type AuraCalculationInput = {
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  configuredLinks: number;
  rareBadges: number;
  legendaryBadges: number;
  questAura: number;
};

export type AuraStaticMetrics = Pick<
  AuraCalculationInput,
  "configuredLinks" | "rareBadges" | "legendaryBadges"
>;

export type AuraBadgeCounts = {
  rare: number;
  legendary: number;
};

export type AuraCalculationResult = {
  score: number;
  rank: AuraRank;
  rawScore: number;
  metrics: AuraCalculationInput;
};

export type AuraProgress = {
  rank: AuraRank;
  nextRank: AuraRank | null;
  progressPercent: number;
  currentFloor: number;
  nextFloor: number | null;
  pointsIntoRank: number;
  pointsToNextRank: number;
};

export function getAuraRank(score: number): AuraRank {
  const normalizedScore = Math.max(0, Math.floor(score));
  const tier =
    AURA_RANKS.find(
      (candidate) =>
        normalizedScore >= candidate.minScore &&
        normalizedScore <= candidate.maxScore,
    ) ?? AURA_RANKS[0];

  return tier.rank;
}

export function calculateAura(
  user: Partial<AuraCalculationInput>,
): AuraCalculationResult {
  const metrics: AuraCalculationInput = {
    views: normalizeAuraMetric(user.views),
    likes: normalizeAuraMetric(user.likes),
    dislikes: normalizeAuraMetric(user.dislikes),
    comments: normalizeAuraMetric(user.comments),
    configuredLinks: normalizeAuraMetric(user.configuredLinks),
    rareBadges: normalizeAuraMetric(user.rareBadges),
    legendaryBadges: normalizeAuraMetric(user.legendaryBadges),
    questAura: normalizeAuraMetric(user.questAura),
  };

  const rawScore =
    metrics.views * AURA_POINTS.view +
    metrics.likes * AURA_POINTS.like +
    metrics.dislikes * AURA_POINTS.dislike +
    metrics.comments * AURA_POINTS.comment +
    metrics.configuredLinks * AURA_POINTS.configuredLink +
    metrics.rareBadges * AURA_POINTS.rareBadge +
    metrics.legendaryBadges * AURA_POINTS.legendaryBadge +
    metrics.questAura;
  const score = Math.max(0, rawScore);

  return {
    score,
    rank: getAuraRank(score),
    rawScore,
    metrics,
  };
}

export function getAuraProgress(score: number): AuraProgress {
  const normalizedScore = Math.max(0, Math.floor(score));
  const tier =
    AURA_RANKS.find(
      (candidate) =>
        normalizedScore >= candidate.minScore &&
        normalizedScore <= candidate.maxScore,
    ) ?? AURA_RANKS[0];
  const pointsIntoRank = normalizedScore - tier.minScore;

  if (!tier.nextRank || tier.nextMinScore === null) {
    return {
      rank: tier.rank,
      nextRank: null,
      progressPercent: 100,
      currentFloor: tier.minScore,
      nextFloor: null,
      pointsIntoRank,
      pointsToNextRank: 0,
    };
  }

  const span = tier.nextMinScore - tier.minScore;
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round((pointsIntoRank / span) * 100)),
  );

  return {
    rank: tier.rank,
    nextRank: tier.nextRank,
    progressPercent,
    currentFloor: tier.minScore,
    nextFloor: tier.nextMinScore,
    pointsIntoRank,
    pointsToNextRank: Math.max(0, tier.nextMinScore - normalizedScore),
  };
}

export function countAuraBadges(
  rarities: Array<string | null | undefined>,
): AuraBadgeCounts {
  return rarities.reduce<AuraBadgeCounts>(
    (counts, rarity) => {
      if (rarity === "rare") {
        counts.rare += 1;
      }

      if (rarity === "legendary" || rarity === "owner") {
        counts.legendary += 1;
      }

      return counts;
    },
    { rare: 0, legendary: 0 },
  );
}

function normalizeAuraMetric(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}
