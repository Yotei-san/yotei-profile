export type AuraQuestCategory =
  | "profile-setup"
  | "social"
  | "collector";

export type AuraQuestReward =
  | {
      type: "aura";
      amount: number;
    }
  | {
      type: "badge";
      badgeSlug: string;
    }
  | {
      type: "cosmetic";
      cosmeticId: string;
    };

export type AuraQuestProgressState = {
  current: number;
  target: number;
  completed: boolean;
};

export type AuraQuestProgressSnapshot = {
  hasAvatar: boolean;
  hasBanner: boolean;
  hasBio: boolean;
  linkCount: number;
  socialPlatforms: string[];
  likes: number;
  dislikes: number;
  comments: number;
  views: number;
  badgeCount: number;
  rareBadgeCount: number;
  legendaryBadgeCount: number;
};

export type AuraQuestDefinition = {
  id: string;
  category: AuraQuestCategory;
  titleKey: string;
  rewards: AuraQuestReward[];
  getProgress: (
    snapshot: AuraQuestProgressSnapshot,
  ) => AuraQuestProgressState;
};

export type AuraQuestCompletionSummary = {
  totalCount: number;
  completedCount: number;
  remainingCount: number;
  completionPercent: number;
  completedQuestIds: string[];
  remainingQuestIds: string[];
  currentQuest: AuraQuestDefinition | null;
  totalAuraRewards: number;
};

const QUEST_DEFINITIONS: AuraQuestDefinition[] = [
  createBooleanQuest("addAvatar", "profile-setup", "quests.items.addAvatar.title", 25, (snapshot) =>
    snapshot.hasAvatar
  ),
  createBooleanQuest("addBanner", "profile-setup", "quests.items.addBanner.title", 25, (snapshot) =>
    snapshot.hasBanner
  ),
  createBooleanQuest("writeBio", "profile-setup", "quests.items.writeBio.title", 15, (snapshot) =>
    snapshot.hasBio
  ),
  createThresholdQuest(
    "addFirstLink",
    "profile-setup",
    "quests.items.addFirstLink.title",
    20,
    (snapshot) => snapshot.linkCount,
    1,
  ),
  createBooleanQuest(
    "addSpotify",
    "profile-setup",
    "quests.items.addSpotify.title",
    30,
    (snapshot) => snapshot.socialPlatforms.includes("spotify"),
  ),
  createBooleanQuest(
    "addDiscord",
    "profile-setup",
    "quests.items.addDiscord.title",
    30,
    (snapshot) => snapshot.socialPlatforms.includes("discord"),
  ),
  createThresholdQuest(
    "firstLike",
    "social",
    "quests.items.firstLike.title",
    25,
    (snapshot) => snapshot.likes,
    1,
  ),
  createThresholdQuest(
    "tenLikes",
    "social",
    "quests.items.tenLikes.title",
    50,
    (snapshot) => snapshot.likes,
    10,
  ),
  createThresholdQuest(
    "firstComment",
    "social",
    "quests.items.firstComment.title",
    30,
    (snapshot) => snapshot.comments,
    1,
  ),
  createThresholdQuest(
    "fiveComments",
    "social",
    "quests.items.fiveComments.title",
    60,
    (snapshot) => snapshot.comments,
    5,
  ),
  createThresholdQuest(
    "oneHundredViews",
    "social",
    "quests.items.oneHundredViews.title",
    100,
    (snapshot) => snapshot.views,
    100,
  ),
  createThresholdQuest(
    "oneThousandViews",
    "social",
    "quests.items.oneThousandViews.title",
    250,
    (snapshot) => snapshot.views,
    1000,
  ),
  createThresholdQuest(
    "firstBadge",
    "collector",
    "quests.items.firstBadge.title",
    50,
    (snapshot) => snapshot.badgeCount,
    1,
  ),
  createThresholdQuest(
    "rareBadge",
    "collector",
    "quests.items.rareBadge.title",
    100,
    (snapshot) => snapshot.rareBadgeCount,
    1,
  ),
  createThresholdQuest(
    "legendaryBadge",
    "collector",
    "quests.items.legendaryBadge.title",
    250,
    (snapshot) => snapshot.legendaryBadgeCount,
    1,
  ),
];

export function getAuraQuestDefinitions() {
  return QUEST_DEFINITIONS;
}

export function getAuraQuestDefinition(questId: string) {
  return QUEST_DEFINITIONS.find((quest) => quest.id === questId) ?? null;
}

export function getAuraQuestProgressState(
  questId: string,
  snapshot: AuraQuestProgressSnapshot,
) {
  return getAuraQuestDefinition(questId)?.getProgress(snapshot) ?? null;
}

export function getQuestAuraRewardAmount(quest: AuraQuestDefinition) {
  return quest.rewards.reduce((total, reward) => {
    return reward.type === "aura" ? total + reward.amount : total;
  }, 0);
}

export function getTotalQuestAuraReward(completedQuestIds: Iterable<string>) {
  const completedQuestIdSet = new Set(completedQuestIds);

  return QUEST_DEFINITIONS.reduce((total, quest) => {
    return completedQuestIdSet.has(quest.id)
      ? total + getQuestAuraRewardAmount(quest)
      : total;
  }, 0);
}

export function getAuraQuestCompletionSummary(
  completedQuestIds: Iterable<string>,
): AuraQuestCompletionSummary {
  const completedQuestIdSet = new Set(completedQuestIds);
  const completedQuestIdsList = QUEST_DEFINITIONS.filter((quest) =>
    completedQuestIdSet.has(quest.id),
  ).map((quest) => quest.id);
  const remainingQuestIds = QUEST_DEFINITIONS.filter(
    (quest) => !completedQuestIdSet.has(quest.id),
  ).map((quest) => quest.id);
  const totalCount = QUEST_DEFINITIONS.length;
  const completedCount = completedQuestIdsList.length;
  const remainingCount = totalCount - completedCount;

  return {
    totalCount,
    completedCount,
    remainingCount,
    completionPercent:
      totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    completedQuestIds: completedQuestIdsList,
    remainingQuestIds,
    currentQuest:
      QUEST_DEFINITIONS.find((quest) => !completedQuestIdSet.has(quest.id)) ?? null,
    totalAuraRewards: getTotalQuestAuraReward(completedQuestIdsList),
  };
}

function createBooleanQuest(
  id: string,
  category: AuraQuestCategory,
  titleKey: string,
  auraRewardAmount: number,
  selector: (snapshot: AuraQuestProgressSnapshot) => boolean,
): AuraQuestDefinition {
  return {
    id,
    category,
    titleKey,
    rewards: [{ type: "aura", amount: auraRewardAmount }],
    getProgress(snapshot) {
      return buildProgressState(selector(snapshot) ? 1 : 0, 1);
    },
  };
}

function createThresholdQuest(
  id: string,
  category: AuraQuestCategory,
  titleKey: string,
  auraRewardAmount: number,
  selector: (snapshot: AuraQuestProgressSnapshot) => number,
  target: number,
): AuraQuestDefinition {
  return {
    id,
    category,
    titleKey,
    rewards: [{ type: "aura", amount: auraRewardAmount }],
    getProgress(snapshot) {
      return buildProgressState(selector(snapshot), target);
    },
  };
}

function buildProgressState(current: number, target: number): AuraQuestProgressState {
  const normalizedTarget = Math.max(1, Math.floor(target));
  const normalizedCurrent = Math.max(0, Math.floor(current));

  return {
    current: Math.min(normalizedCurrent, normalizedTarget),
    target: normalizedTarget,
    completed: normalizedCurrent >= normalizedTarget,
  };
}
