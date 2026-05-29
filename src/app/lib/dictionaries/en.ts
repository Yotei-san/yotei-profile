import { dashboardProfileEn } from "@/app/lib/dictionaries/dashboard-profile";

const en = {
  common: {
    appName: "Yotei",
    language: "Language",
    aura: "Aura",
    rank: "Rank",
    nextRank: "Next rank",
    untilRank: "until Rank {rank}",
    close: "Close",
    loading: "Loading...",
  },
  auraLevels: {
    E: {
      name: "Dormant",
      description: "A calm profile presence with only a faint aura trace.",
    },
    D: {
      name: "Awakening",
      description: "A light signal starts to gather around your identity.",
    },
    C: {
      name: "Charged",
      description: "Your profile begins to feel brighter, sharper, and more alive.",
    },
    B: {
      name: "Radiant",
      description: "A stronger halo and richer energy make the profile feel established.",
    },
    A: {
      name: "Ascendant",
      description: "Premium glow, richer motion, and stronger accents define the experience.",
    },
    S: {
      name: "Sovereign",
      description: "An elegant signature aura turns the whole hero into a rare presence.",
    },
  },
  languageSwitcher: {
    label: "Language",
    ariaLabel: "Select language",
    english: "English",
    portugueseBrazil: "Portuguese (Brazil)",
  },
  nav: {
    mainNavigation: "Main navigation",
    mobileNavigation: "Mobile navigation",
    mobileMenu: "Mobile navigation menu",
    discord: "Discord",
    leaderboard: "Leaderboard",
    help: "Help",
    pricing: "Pricing",
    login: "Login",
    signUp: "Sign Up",
    menu: "Menu",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },
  home: {
    brandSubtitle: "Identity OS for profiles with presence",
    mobileMenuTitle: "Menu",
    heroEyebrow: "Launch-ready profile OS for gamers, streamers, creators and devs",
    heroTitle: "Build a profile",
    heroTitleAccent: "that feels alive.",
    heroBody:
      "Yotei puts links, socials, badges, music, comments, leaderboard presence and profile customization into one identity page that feels cinematic, sharp and easy to read.",
    claimCaption:
      "Reserve your username first. Shape the aura, profile systems and public presence after.",
    claimInputAriaLabel: "Reserve username",
    claimPlaceholder: "username",
    claimButton: "Reserve Username",
    heroChips: {
      links: "Links",
      badges: "Badges",
      music: "Music",
      comments: "Comments",
      leaderboard: "Leaderboard",
      aura: "Aura",
    },
    trust: {
      free: "Free to start",
      noCard: "No card required",
      comments: "Comments ready",
      leaderboard: "Leaderboard ready",
    },
    preview: {
      eyebrow: "Yotei Identity Reactor",
      live: "Presence live",
      synced: "Aura synced",
      handle: "@yourname",
      role: "Creator / streamer / dev profile with collectible identity fragments.",
      modulesTitle: "Profile OS panel",
      modulesBody:
        "A living surface for links, live presence, badge status and audio taste.",
      moduleLabels: {
        links: "Links",
        presence: "Presence",
        badges: "Badges",
        audio: "Audio",
      },
      moduleValues: {
        links: "Launch stack",
        presence: "Discord + live",
        badges: "Rarity active",
        audio: "Spotify pulse",
      },
      artifactTitle: "Identity fragments",
      artifactA: "Founder badge",
      artifactB: "Comments open",
      artifactC: "Profile FX online",
      footerLeft: "Leaderboard visibility enabled",
      footerRight: "Ready for public launch",
      fragmentTitle: "Profile signal",
      fragmentLabels: {
        comments: "Comments",
        leaderboard: "Rank",
        effects: "FX",
      },
      fragmentValues: {
        comments: "Thread live",
        leaderboard: "Climb ready",
        effects: "Lightweight glow",
      },
    },
    identity: {
      eyebrow: "Identity OS",
      title: "More than a link page. More like a premium profile operating system.",
      body:
        "Yotei organizes the parts of your public identity into one stronger surface so people understand your vibe, status and destinations instantly.",
      cards: {
        identityCore: {
          title: "Orbital identity core",
          body: "Build around a central brand aura instead of a plain avatar-plus-links layout.",
        },
        creatorAura: {
          title: "Creator aura control",
          body: "Tune mood, density and profile energy so the page feels personal without becoming noisy.",
        },
        profileSystems: {
          title: "Profile systems that connect",
          body: "Links, comments, media, badges and stats feel like one ecosystem instead of disconnected widgets.",
        },
      },
      rail: {
        title: "Everything ships inside one surface",
        body:
          "The page architecture is built to feel like a profile OS: readable first, expressive second, memorable all the way through.",
        items: {
          links: "Action links that look intentional",
          socials: "Discord, Spotify and GitHub identity blocks",
          badges: "Badge rarity and collectible profile fragments",
          comments: "Community comments tied to your page",
          leaderboard: "Leaderboard presence and visible status",
        },
      },
    },
    gamers: {
      eyebrow: "Built for gamers and streamers",
      title: "Show the stack behind your identity, not just a bio.",
      body:
        "Yotei is shaped for people whose profile needs to carry platforms, status, collectibles, reactions and a stronger visual signature.",
      cardTag: "Launch module",
      cards: {
        discord: {
          title: "Discord presence",
          body: "Turn community presence into part of the profile instead of a lonely external icon.",
        },
        spotify: {
          title: "Spotify energy",
          body: "Show what you are listening to with a cleaner audio layer that supports the page mood.",
        },
        github: {
          title: "GitHub credibility",
          body: "Developers can surface projects and activity without breaking the creator-facing vibe.",
        },
        badges: {
          title: "Badge identity",
          body: "Collect status markers that make the page feel earned, not randomly decorated.",
        },
        comments: {
          title: "Comment threads",
          body: "Let visitors react and leave visible notes that make the profile feel inhabited.",
        },
        leaderboard: {
          title: "Leaderboard visibility",
          body: "Give competitive profiles a reason to come back, climb and stay visible.",
        },
      },
    },
    collectible: {
      eyebrow: "Collectible identity",
      title: "Make your profile feel collectible, not disposable.",
      body:
        "Badges, rarity, profile fragments and visible progression give people reasons to remember the page and return to it.",
      tiers: {
        signal: {
          tag: "Signal tier",
          title: "Starter identity with clear presence",
          body: "Keep the silhouette clean while leaving room for future rarity, comments and visual upgrades.",
        },
        rare: {
          tag: "Rare tier",
          title: "Badge and aura combinations",
          body: "Layer earned status and mood so the page feels owned and recognizable in screenshots.",
        },
        ascendant: {
          tag: "Ascendant tier",
          title: "Profile drops worth returning to",
          body: "Build toward a page that can hold events, launches, leaderboard pushes and collectible moments.",
        },
      },
      fragments: {
        founder: "Founder ready",
        mission: "Mission badges",
        drop: "Drop moments",
        rarity: "Rarity visible",
      },
      footer:
        "The point is not decoration for decoration's sake. It is identity that feels persistent, visible and worth collecting.",
    },
    performance: {
      eyebrow: "Performance-first visuals",
      title: "Atmosphere that respects weaker PCs, mobile devices and reduced motion.",
      body:
        "Yotei keeps the look premium while adapting effects to the device, motion preference and safe mode so the page stays readable and fast.",
      items: {
        adaptive: {
          title: "Adaptive performance",
          body: "Atmosphere, blur and motion intensity scale with the current performance profile.",
        },
        reducedMotion: {
          title: "Reduced motion support",
          body: "The launch page softens or removes decorative movement when the user asks for calmer motion.",
        },
        lighterFx: {
          title: "Lightweight effects",
          body: "Orbit motion, glow breathing and scanline accents stay on transform and opacity where possible.",
        },
        fastSurface: {
          title: "Fast launch surface",
          body: "No canvas, no heavy video and no overloaded particles standing between the visitor and the profile.",
        },
      },
      badge:
        "The homepage respects adaptive performance settings, safe mode and reduced-motion preferences.",
    },
    cta: {
      eyebrow: "Launch CTA",
      title: "Claim your place on the board before the page even goes live.",
      body:
        "Reserve your username now, then come back to shape the visuals, comments, badges and profile systems around it.",
      proofs: {
        discord: "Discord-ready",
        pricing: "Pricing visible",
        leaderboard: "Leaderboard connected",
      },
      primaryButton: "Reserve Username",
      secondaryButton: "Sign In",
      pricingButton: "View Pricing",
      helper: "Keep it simple: claim the name first, refine the identity after.",
    },
  },
  auth: {
    identitySystem: "Digital identity system for gamers, creators and devs",
    heroNote:
      "Persistent login, cleaner flows and a safer premium experience.",
    secureAccess: "Secure Access",
    identityBadge: "Yotei Identity",
    rememberMe: "Keep me signed in on this device",
    showPassword: "Show password",
    hidePassword: "Hide password",
    unexpectedError: "An unexpected error occurred.",
    login: {
      badge: "Access Node",
      title: "Sign in to your Yotei space.",
      subtitle:
        "Return to your digital identity with a steadier, cleaner, more premium entry flow.",
      backLabel: "Back to home",
      formIntro:
        "Use email or username to access your dashboard. Your session can stay active on this device.",
      statusSecureSession: "Secure Session",
      statusDashboardAccess: "Dashboard Access",
      statusIdentityReady: "Identity Ready",
      forgotPassword: "Forgot my password",
      createAccount: "Create account",
      identifierLabel: "Email or username",
      identifierPlaceholder: "your email or username",
      passwordLabel: "Password",
      passwordPlaceholder: "enter your password",
      submitIdle: "Sign In",
      submitPending: "Signing In...",
    },
    register: {
      badge: "Identity Creation",
      title: "Create your account and enter Yotei.",
      subtitle:
        "Build your digital presence with a registration experience that feels cleaner, stronger, and built to last.",
      backLabel: "Back to home",
      formIntro:
        "Set up your initial access. Yotei already includes a modern persistent session to avoid repeated logins.",
      statusPremiumOnboarding: "Premium Onboarding",
      statusPersistentSession: "Persistent Session",
      statusCreatorReady: "Creator Ready",
      alreadyHaveAccount: "I already have an account",
      forgotPassword: "Forgot my password",
      displayNameLabel: "Display name",
      displayNamePlaceholder: "how your name appears",
      usernameLabel: "Username",
      usernamePlaceholder: "your username",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "create a secure password",
      submitIdle: "Create Account",
      submitPending: "Creating Account...",
    },
    forgotPassword: {
      badge: "Recovery Link",
      title: "Recover access without leaving the flow.",
      subtitle:
        "A clearer, safer, more immersive flow to get back into your Yotei space quickly.",
      backLabel: "Back to login",
      formIntro:
        "Enter your email and we will send reset instructions if the account exists.",
      statusPasswordReset: "Password Reset",
      statusSecureFlow: "Secure Flow",
      statusInboxReady: "Inbox Ready",
      backToLogin: "Back to login",
      createNewAccount: "Create new account",
      emailRequired: "Enter your email.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      success:
        "If an account exists for that email, you will receive password reset instructions.",
      error: "Unable to request a password reset.",
      submitIdle: "Send Instructions",
      submitPending: "Sending...",
    },
  },
  dashboard: {
    sections: {
      main: "main",
      customization: "customization",
      admin: "admin",
    },
    sidebar: {
      control: "dashboard control",
      navigation: "Navigation",
      openNavigation: "Open dashboard navigation",
      closeNavigation: "Close dashboard navigation",
      premium: "Premium",
      free: "Free",
      premiumActive: "Premium profile active",
      freeReady: "Upgrade-ready workspace",
      viewPublicProfile: "View public profile",
      editProfile: "Edit profile",
      logout: "Logout",
      verify: "Verify",
      verifyTooltip: "Verify your email to unlock this area.",
    },
    nav: {
      overview: "Overview",
      socials: "Socials",
      templates: "Templates",
      links: "Links",
      analytics: "Analytics",
      pricing: "Pricing",
      decorations: "Decorations",
      badges: "Badges",
      profile: "Profile",
      admin: "Admin",
      users: "Users",
      adminBadges: "Admin Badges",
      audit: "Audit",
    },
    overview: {
      eyebrow: "Dashboard overview",
      title: "Welcome back, {name}",
      description:
        "Track setup progress, keep key profile systems aligned, and focus on the next actions that make your public page feel launch ready.",
      openProfile: "Open profile",
      editProfile: "Edit profile",
      links: "Links",
      clickableActions: "Clickable profile actions",
      totalClicks: "Total clicks",
      linkTraffic: "Traffic across your links",
      socialBlocks: "Social blocks",
      identityBlocks: "Identity blocks configured",
      auraEyebrow: "Aura system",
      auraTitle: "Your Aura",
      auraDescription:
        "A persisted progression snapshot built from profile views, reactions, comments, links, and badge rarity.",
      auraProgress: "Progress to next rank",
      auraScore: "Aura Score",
      auraRank: "Aura Rank",
      auraPointsToNext: "{count} points to rank {rank}",
      auraMaxRank: "You are already at max rank.",
      leaderboardEyebrow: "Leaderboard",
      rankingTitle: "Your ranking",
      rankingDescription:
        "A quick snapshot of how your public profile is stacking up across visibility and engagement.",
      openLeaderboard: "Open leaderboard",
      viewsRank: "Views rank",
      viewsHint: "Position on the most viewed board",
      likesRank: "Likes rank",
      likesHint: "Position on the most liked board",
      comments: "Comments",
      commentsHint: "Visible public comments on your profile",
      performanceEyebrow: "Performance",
      topLinks: "Top links",
      topLinksDescription:
        "A ranked snapshot of the destinations currently getting the most clicks.",
      openAnalytics: "Open analytics",
      untitledLink: "Untitled link",
      clicks: "{count} clicks",
      noLinkActivityTitle: "No link activity yet",
      noLinkActivityDescription:
        "Your analytics panel will start filling in as soon as visitors interact with your first published links.",
      inventoryEyebrow: "Inventory",
      allLinks: "All links",
      allLinksDescription:
        "A quick reference view of the destinations currently powering your profile.",
      manageLinks: "Manage links",
      noLinksTitle: "No links created yet",
      noLinksDescription:
        "Create your first link to give visitors a clear place to click from your profile.",
      createFirstLink: "Create first link",
    },
    onboarding: {
      badge: "Yotei Onboarding",
      readyTitle: "Profile launch ready",
      readyDescription:
        "Your profile has the core identity, content, and structure it needs to feel complete.",
      pendingTitle: "Finish the essentials before you launch",
      pendingDescription:
        "Follow the checklist to tighten identity, links, layout, and content so new visitors immediately understand who you are.",
      completion: "Completion",
      completedSummary: "{completed} of {total} completed",
      allComplete: "All checklist items complete",
      next: "Next: {title}",
      synced: "Checklist synced",
      progressLabel: "Premium setup progress",
      step: "Step {index}",
      completed: "Completed",
      incomplete: "Incomplete",
      completeHint: "This part of your profile is already in place.",
      incompleteHint:
        "Complete this step to move closer to a launch-ready profile.",
      review: "Review",
      items: {
        verifyEmail: {
          title: "Verify email",
          description:
            "Confirm your inbox so locked Yotei features can be unlocked safely.",
          cta: "Verify now",
        },
        addAvatar: {
          title: "Add avatar",
          description:
            "Give your profile a recognizable face before people land on it.",
          cta: "Open profile",
        },
        addBanner: {
          title: "Add banner",
          description:
            "Set the mood with a premium header image or stronger visual identity.",
          cta: "Upload banner",
        },
        addFirstLink: {
          title: "Add first link",
          description:
            "Create the first action your visitors can actually click.",
          cta: "Add link",
        },
        chooseLayout: {
          title: "Choose profile layout",
          description:
            "Move beyond the starter presentation and pick a layout that feels intentional.",
          cta: "Choose layout",
        },
        addSocialBlock: {
          title: "Add a social block",
          description:
            "Connect a richer identity block like Discord, GitHub, Spotify or Live.",
          cta: "Add social",
        },
        createTemplate: {
          title: "Create or use a template",
          description:
            "Build your first reusable template so your profile setup can be repeated and shared.",
          cta: "Open templates",
        },
      },
    },
    profile: dashboardProfileEn,
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Premium that stays in test mode.",
    description:
      "Keep Stripe safely pointed at test mode while presenting a cleaner, more stable upgrade experience for demos, internal reviews, and sales conversations.",
    backToDashboard: "Back to dashboard",
    openHome: "Open home",
    premiumActive: "Premium active",
    freePlan: "Free plan",
    premiumSummary: "Your account has premium access.",
    freeSummary: "Your account is on free.",
    premiumSummaryBody:
      "Billing controls stay available through Stripe test mode without touching production settings.",
    freeSummaryBody:
      "Upgrade testing stays available, and the webhook flow remains unchanged for future production rollout.",
    starter: "Starter",
    freeTitle: "Free",
    freeDescription:
      "The core profile setup for creators who want a clean launch-ready page with links, profile media, and public identity basics.",
    freeFeatureLinks: "Up to 5 links",
    freeFeatureGallery: "Up to 2 gallery images",
    freeFeatureAnalytics: "Basic analytics",
    freeFeatureReactions: "Public reactions",
    freeFeatureCustomization: "Core profile customization",
    currentPlan: "Current plan",
    availableAnytime: "Available anytime",
    premiumTitle: "Premium",
    premiumDescription:
      "The fuller presentation layer for richer visuals, more customization, and a stronger premium profile impression during demos and creator sales.",
    premiumFeatureLinks: "Unlimited links",
    premiumFeatureGallery: "Expanded gallery slots",
    premiumFeatureVideo: "Video banner support",
    premiumFeatureBadge: "Premium badge state",
    premiumFeatureLayouts: "Saved presets and advanced layouts",
    stripeTestMode:
      "Stripe remains in test mode. No production switch was made in this cleanup pass.",
    signInToUpgrade: "Sign in to upgrade",
    manageSubscription: "Manage subscription",
    openingPortal: "Opening portal...",
    startCheckout: "Start premium test checkout",
    startingCheckout: "Starting checkout...",
    openPortalError: "Unable to open the billing portal right now.",
    startCheckoutError: "Unable to start premium checkout right now.",
    openingBillingPortal: "Opening billing portal...",
    redirectingCheckout: "Redirecting to Stripe checkout...",
  },
  leaderboard: {
    tabs: {
      views: {
        eyebrow: "Reach",
        label: "Most viewed",
        description: "Profiles pulling the most attention right now.",
      },
      likes: {
        eyebrow: "Affection",
        label: "Most liked",
        description: "Profiles earning the strongest positive reactions.",
      },
      dislikes: {
        eyebrow: "Heat",
        label: "Most disliked",
        description: "Profiles collecting the most negative reactions.",
      },
      newest: {
        eyebrow: "Fresh faces",
        label: "Newest profiles",
        description: "The latest public profiles to join the Yotei board.",
      },
    },
    title: "Leaderboard",
    heroDescription:
      "{description} All boards are limited to active public profiles and refresh from the same counts used on profile pages.",
    backToDashboard: "Back to dashboard",
    boardMeta: "Top 50 active public profiles",
    noData: "No leaderboard data is available yet.",
    openProfile: "Open profile",
    metrics: {
      views: "Views",
      likes: "Likes",
      dislikes: "Dislikes",
      joined: "Joined",
    },
  },
  publicProfile: {
    scrollForMore: "Scroll down for more",
    auraScore: "Aura Score",
    auraRank: "Aura Rank",
    views: "Views",
    likes: "Likes",
    dislikes: "Dislikes",
    comments: "Comments",
    location: "Location",
    commentModalEyebrow: "Public Interaction",
    commentModalTitle: "Profile Comments",
    commentCountOne: "{count} comment",
    commentCountOther: "{count} comments",
    closeComments: "Close comments",
    newest: "Newest",
    oldest: "Oldest",
    ownProfileNote:
      "You can comment on your own profile if you want to leave notes.",
    ownProfilePlaceholder: "Leave a note on your own profile...",
    visitorPlaceholder: "Write something for @{username}...",
    postComment: "Post Comment",
    postingComment: "Posting...",
    writeCommentOwnProfile: "Write Comment (Own Profile)",
    signInConversation: "Sign in to join the conversation.",
    signInConversationBody:
      "Comments are account-based in this phase to keep profile interactions safer and easier to moderate.",
    signIn: "Sign in",
    loadingComments: "Loading comments...",
    noCommentsYet: "No comments yet.",
    startFirstThread: "Start the first thread.",
    beFirstAfterSignIn: "Be the first after signing in.",
    delete: "Delete",
    deleting: "Deleting...",
    justNow: "Just now",
    loadCommentsError: "Unable to load comments right now.",
    postCommentError: "Unable to post that comment right now.",
    deleteCommentError: "Unable to delete that comment right now.",
  },
} as const;

export default en;
