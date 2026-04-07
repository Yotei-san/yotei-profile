import { prisma } from "@/app/lib/prisma";
import { awardBadgeByKey, ensureDefaultBadges } from "@/app/lib/badges";

export type BadgeMissionProgress = {
  key: string;
  title: string;
  description: string;
  current: number;
  target: number;
  completed: boolean;
  rewardBadgeKey: string;
};

function isPremiumPlan(user: { plan: string; premiumUntil: Date | null }) {
  if (user.plan !== "premium") return false;
  if (!user.premiumUntil) return true;
  return new Date(user.premiumUntil) > new Date();
}

export async function getBadgeMissionProgress(userId: string): Promise<BadgeMissionProgress[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      avatarUrl: true,
      bannerUrl: true,
      bio: true,
      plan: true,
      premiumUntil: true,
    },
  });

  if (!user) return [];

  const [linkCount, profileViewsCount, totalClicks] = await Promise.all([
    prisma.link.count({ where: { userId } }),
    prisma.profileView.count({ where: { userId } }),
    prisma.click.count({
      where: {
        link: {
          userId,
        },
      },
    }),
  ]);

  const completeProfileScore = [
    Boolean(user.avatarUrl),
    Boolean(user.bannerUrl),
    Boolean(user.bio && user.bio.trim().length >= 10),
  ].filter(Boolean).length;

  return [
    {
      key: "complete-profile",
      title: "Complete Profile",
      description: "Adicione avatar, banner e bio no seu perfil.",
      current: completeProfileScore,
      target: 3,
      completed: completeProfileScore >= 3,
      rewardBadgeKey: "complete-profile",
    },
    {
      key: "creator-mission",
      title: "Creator Mission",
      description: "Crie pelo menos 5 links no seu perfil.",
      current: linkCount,
      target: 5,
      completed: linkCount >= 5,
      rewardBadgeKey: "creator",
    },
    {
      key: "popular-mission",
      title: "Popular Mission",
      description: "Alcance 100 visualizações de perfil.",
      current: profileViewsCount,
      target: 100,
      completed: profileViewsCount >= 100,
      rewardBadgeKey: "popular",
    },
    {
      key: "click-master",
      title: "Click Master",
      description: "Acumule 25 cliques nos seus links.",
      current: totalClicks,
      target: 25,
      completed: totalClicks >= 25,
      rewardBadgeKey: "click-master",
    },
    {
      key: "premium-mission",
      title: "Premium Upgrade",
      description: "Ative o plano premium.",
      current: isPremiumPlan(user) ? 1 : 0,
      target: 1,
      completed: isPremiumPlan(user),
      rewardBadgeKey: "premium",
    },
  ];
}

export async function syncMissionBadges(userId: string) {
  await ensureDefaultBadges();

  const missions = await getBadgeMissionProgress(userId);

  for (const mission of missions) {
    if (mission.completed) {
      await awardBadgeByKey(userId, mission.rewardBadgeKey);
    }
  }
}
