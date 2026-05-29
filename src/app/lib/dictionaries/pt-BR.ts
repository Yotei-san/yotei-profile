import { dashboardProfilePtBR } from "@/app/lib/dictionaries/dashboard-profile";

const ptBR = {
  common: {
    appName: "Yotei",
    language: "Idioma",
    close: "Fechar",
    loading: "Carregando...",
  },
  languageSwitcher: {
    label: "Idioma",
    ariaLabel: "Selecionar idioma",
    english: "English",
    portugueseBrazil: "Português (Brasil)",
  },
  nav: {
    mainNavigation: "Navegação principal",
    mobileNavigation: "Navegação mobile",
    mobileMenu: "Menu de navegação mobile",
    discord: "Discord",
    leaderboard: "Ranking",
    help: "Ajuda",
    pricing: "Preços",
    login: "Entrar",
    signUp: "Criar conta",
    menu: "Menu",
    openMenu: "Abrir menu de navegação",
    closeMenu: "Fechar menu de navegação",
  },
  home: {
    brandSubtitle: "Identity OS para perfis com presença",
    mobileMenuTitle: "Menu",
    heroEyebrow: "Profile OS feita para gamers, streamers, criadores e devs",
    heroTitle: "Crie um perfil",
    heroTitleAccent: "que parece vivo.",
    heroBody:
      "O Yotei reúne links, redes, badges, música, comentários, ranking e customização em uma página de identidade cinemática, nítida e fácil de explorar.",
    claimCaption:
      "Garanta seu username primeiro. Depois ajuste a aura, os sistemas do perfil e sua presença pública.",
    claimInputAriaLabel: "Reservar username",
    claimPlaceholder: "username",
    claimButton: "Reservar username",
    heroChips: {
      links: "Links",
      badges: "Badges",
      music: "Música",
      comments: "Comentários",
      leaderboard: "Leaderboard",
      aura: "Aura",
    },
    trust: {
      free: "Grátis para começar",
      noCard: "Sem cartão para começar",
      comments: "Comentários prontos",
      leaderboard: "Leaderboard pronta",
    },
    preview: {
      eyebrow: "Yotei Identity Reactor",
      live: "Presença ao vivo",
      synced: "Aura sincronizada",
      handle: "@seunome",
      role: "Perfil de criador, streamer ou dev com fragmentos de identidade colecionáveis.",
      modulesTitle: "Painel do Profile OS",
      modulesBody:
        "Uma superfície viva para links, presença em tempo real, badges e gosto musical.",
      moduleLabels: {
        links: "Links",
        presence: "Presença",
        badges: "Badges",
        audio: "Audio",
      },
      moduleValues: {
        links: "Stack de lançamento",
        presence: "Discord + live",
        badges: "Raridade ativa",
        audio: "Pulso Spotify",
      },
      artifactTitle: "Fragmentos de identidade",
      artifactA: "Founder badge",
      artifactB: "Comentários abertos",
      artifactC: "FX do perfil online",
      footerLeft: "Visibilidade na leaderboard ativada",
      footerRight: "Pronto para o lançamento público",
      fragmentTitle: "Sinal do perfil",
      fragmentLabels: {
        comments: "Comentários",
        leaderboard: "Rank",
        effects: "FX",
      },
      fragmentValues: {
        comments: "Thread ativa",
        leaderboard: "Pronto para subir",
        effects: "Glow leve",
      },
    },
    identity: {
      eyebrow: "Identity OS",
      title: "Mais que uma página de links. Um sistema premium para o seu perfil.",
      body:
        "O Yotei organiza sua identidade pública em uma superfície mais forte, para que as pessoas entendam seu clima, seu status e para onde você quer levar a atenção.",
      cards: {
        identityCore: {
          title: "Núcleo orbital de identidade",
          body: "Construa sua página em torno de uma aura central de marca, não de um avatar com links jogados ao redor.",
        },
        creatorAura: {
          title: "Controle da aura criativa",
          body: "Ajuste clima, densidade e energia do perfil para deixar tudo pessoal sem virar ruído visual.",
        },
        profileSystems: {
          title: "Sistemas do perfil conectados",
          body: "Links, comentários, mídia, badges e status funcionam como um ecossistema, não como widgets soltos.",
        },
      },
      rail: {
        title: "Tudo sai de uma única superfície",
        body:
          "A arquitetura da página foi pensada para soar como um profile OS: leitura primeiro, expressão depois, memória visual o tempo todo.",
        items: {
          links: "Links de ação com presença",
          socials: "Blocos de identidade com Discord, Spotify e GitHub",
          badges: "Raridade de badges e fragmentos colecionáveis",
          comments: "Comentários da comunidade no seu perfil",
          leaderboard: "Presença visível na leaderboard",
        },
      },
    },
    gamers: {
      eyebrow: "Feito para gamers e streamers",
      title: "Mostre a stack por trás da sua identidade, não só uma bio.",
      body:
        "O Yotei foi pensado para quem precisa que o perfil carregue plataformas, status, colecionáveis, reações e uma assinatura visual marcante.",
      cardTag: "Módulo de lançamento",
      cards: {
        discord: {
          title: "Presença no Discord",
          body: "Transforme a comunidade em parte do perfil, em vez de deixar tudo preso a um ícone externo.",
        },
        spotify: {
          title: "Energia Spotify",
          body: "Mostre o que você está ouvindo com uma camada musical mais limpa, que sustenta o clima da página.",
        },
        github: {
          title: "Credibilidade no GitHub",
          body: "Devs podem destacar projetos e atividade sem quebrar a vibe pensada para criadores.",
        },
        badges: {
          title: "Identidade construída por badges",
          body: "Colete sinais de status que fazem a página parecer conquista, não decoração aleatória.",
        },
        comments: {
          title: "Threads de comentários",
          body: "Deixe visitantes reagirem e escreverem notas visíveis para que o perfil pareça vivo.",
        },
        leaderboard: {
          title: "Visibilidade na leaderboard",
          body: "Dê aos perfis competitivos um motivo para voltar, subir e continuar em destaque.",
        },
      },
    },
    collectible: {
      eyebrow: "Identidade colecionável",
      title: "Faça seu perfil parecer colecionável, não descartável.",
      body:
        "Badges, raridade, fragmentos e progressão visível dão aos visitantes motivos para lembrar da página e voltar.",
      tiers: {
        signal: {
          tag: "Tier signal",
          title: "Presença inicial com silhueta forte",
          body: "Mantenha a silhueta limpa e ainda abra espaço para raridade, comentários e upgrades visuais.",
        },
        rare: {
          tag: "Tier rare",
          title: "Combinações de badges e aura",
          body: "Combine status conquistado e clima visual para que a página pareça sua e fique reconhecível em screenshots.",
        },
        ascendant: {
          tag: "Tier ascendant",
          title: "Drops de perfil que valem o retorno",
          body: "Prepare a página para eventos, lançamentos, avanços na leaderboard e momentos colecionáveis.",
        },
      },
      fragments: {
        founder: "Founder ready",
        mission: "Mission badges",
        drop: "Drop moments",
        rarity: "Raridade visível",
      },
      footer:
        "A ideia não é só decorar o perfil. É criar uma identidade persistente, visível e que parece valer coleção.",
    },
    performance: {
      eyebrow: "Visual com foco em performance",
      title: "Visual premium otimizado para PCs modestos e mobile.",
      body:
        "O Yotei mantém a aparência premium enquanto adapta efeitos ao dispositivo, à preferência de movimento e ao safe mode para a página seguir rápida e legível.",
      items: {
        adaptive: {
          title: "Performance adaptativa",
          body: "Atmosfera, blur e intensidade de movimento se ajustam ao perfil de performance atual.",
        },
        reducedMotion: {
          title: "Suporte a reduced motion",
          body: "A home suaviza ou remove movimento decorativo quando a pessoa prefere uma experiência mais calma.",
        },
        lighterFx: {
          title: "Efeitos leves",
          body: "Órbitas, breathing glow e scanlines ficam em transform e opacity sempre que possível.",
        },
        fastSurface: {
          title: "Superfície rápida",
          body: "Sem canvas, sem vídeo pesado e sem chuva de partículas atrapalhando a leitura.",
        },
      },
      badge:
        "A home respeita performance adaptativa, safe mode e reduced motion.",
    },
    cta: {
      eyebrow: "CTA de lançamento",
      title: "Garanta seu lugar no board antes mesmo de o perfil ir ao ar.",
      body:
        "Reserve seu username agora e volte depois para moldar visuais, comentários, badges e sistemas do perfil ao redor dele.",
      proofs: {
        discord: "Discord pronto",
        pricing: "Preços visíveis",
        leaderboard: "Leaderboard conectada",
      },
      primaryButton: "Reservar username",
      secondaryButton: "Entrar",
      pricingButton: "Ver preços",
      helper: "Mantenha simples: reserve o nome primeiro, refine a identidade depois.",
    },
  },
  auth: {
    identitySystem: "Sistema de identidade digital para gamers, criadores e devs",
    heroNote:
      "Login persistente, fluxos mais limpos e uma experiência premium mais segura.",
    secureAccess: "Acesso Seguro",
    identityBadge: "Yotei Identity",
    rememberMe: "Manter login neste dispositivo",
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",
    unexpectedError: "Ocorreu um erro inesperado.",
    login: {
      badge: "Nó de Acesso",
      title: "Entrar no seu espaço Yotei.",
      subtitle:
        "Volte para sua identidade digital com um fluxo de entrada mais estável, limpo e premium.",
      backLabel: "Voltar para a home",
      formIntro:
        "Use email ou username para acessar seu dashboard. Sua sessão pode continuar ativa neste dispositivo.",
      statusSecureSession: "Sessão Segura",
      statusDashboardAccess: "Acesso ao Dashboard",
      statusIdentityReady: "Identidade Pronta",
      forgotPassword: "Esqueci minha senha",
      createAccount: "Criar conta",
      identifierLabel: "Email ou username",
      identifierPlaceholder: "seu email ou username",
      passwordLabel: "Senha",
      passwordPlaceholder: "digite sua senha",
      submitIdle: "Entrar",
      submitPending: "Entrando...",
    },
    register: {
      badge: "Criação de Identidade",
      title: "Crie sua conta e entre no Yotei.",
      subtitle:
        "Monte sua presença digital com uma experiência de cadastro mais forte, limpa e pronta para durar.",
      backLabel: "Voltar para a home",
      formIntro:
        "Configure seu acesso inicial. O Yotei já entra com sessão persistente moderna para evitar logins repetidos.",
      statusPremiumOnboarding: "Onboarding Premium",
      statusPersistentSession: "Sessão Persistente",
      statusCreatorReady: "Pronto para Criar",
      alreadyHaveAccount: "Já tenho conta",
      forgotPassword: "Esqueci minha senha",
      displayNameLabel: "Nome de exibição",
      displayNamePlaceholder: "como seu nome aparece",
      usernameLabel: "Username",
      usernamePlaceholder: "seu username",
      emailLabel: "Email",
      emailPlaceholder: "voce@exemplo.com",
      passwordLabel: "Senha",
      passwordPlaceholder: "crie uma senha segura",
      submitIdle: "Criar conta",
      submitPending: "Criando conta...",
    },
    forgotPassword: {
      badge: "Link de Recuperação",
      title: "Recupere o acesso sem sair do fluxo.",
      subtitle:
        "Um fluxo mais claro, seguro e imersivo para voltar rápido ao seu espaço Yotei.",
      backLabel: "Voltar para login",
      formIntro:
        "Digite seu email e enviaremos as instruções de redefinição caso a conta exista.",
      statusPasswordReset: "Redefinição de Senha",
      statusSecureFlow: "Fluxo Seguro",
      statusInboxReady: "Inbox Pronta",
      backToLogin: "Voltar para login",
      createNewAccount: "Criar conta nova",
      emailRequired: "Digite seu email.",
      emailLabel: "Email",
      emailPlaceholder: "voce@exemplo.com",
      success:
        "Se existir uma conta com esse email, você receberá instruções para redefinir a senha.",
      error: "Erro ao solicitar redefinição.",
      submitIdle: "Enviar instruções",
      submitPending: "Enviando...",
    },
  },
  dashboard: {
    sections: {
      main: "principal",
      customization: "customização",
      admin: "admin",
    },
    sidebar: {
      control: "controle do dashboard",
      navigation: "Navegação",
      openNavigation: "Abrir navegação do dashboard",
      closeNavigation: "Fechar navegação do dashboard",
      premium: "Premium",
      free: "Free",
      premiumActive: "Perfil premium ativo",
      freeReady: "Workspace pronta para upgrade",
      viewPublicProfile: "Ver perfil público",
      editProfile: "Editar perfil",
      logout: "Sair",
      verify: "Verificar",
      verifyTooltip: "Verifique seu email para desbloquear esta área.",
    },
    nav: {
      overview: "Visão geral",
      socials: "Sociais",
      templates: "Templates",
      links: "Links",
      analytics: "Analytics",
      pricing: "Preços",
      decorations: "Decorações",
      badges: "Badges",
      profile: "Perfil",
      admin: "Admin",
      users: "Usuários",
      adminBadges: "Badges Admin",
      audit: "Auditoria",
    },
    overview: {
      eyebrow: "Visão geral do dashboard",
      title: "Bem-vindo de volta, {name}",
      description:
        "Acompanhe o progresso da configuração, mantenha os sistemas principais do perfil alinhados e foque nas próximas ações que deixam sua página pública pronta para lançamento.",
      openProfile: "Abrir perfil",
      editProfile: "Editar perfil",
      links: "Links",
      clickableActions: "Ações clicáveis do perfil",
      totalClicks: "Cliques totais",
      linkTraffic: "Tráfego nos seus links",
      socialBlocks: "Blocos sociais",
      identityBlocks: "Blocos de identidade configurados",
      auraEyebrow: "Sistema Aura",
      auraTitle: "Sua Aura",
      auraDescription:
        "Um retrato persistido de progressao montado a partir de views, reacoes, comentarios, links e raridade de badges.",
      auraProgress: "Progresso ate o proximo rank",
      auraScore: "Aura Score",
      auraRank: "Aura Rank",
      auraPointsToNext: "{count} pontos para o rank {rank}",
      auraMaxRank: "Voce ja esta no rank maximo.",
      leaderboardEyebrow: "Ranking",
      rankingTitle: "Seu ranking",
      rankingDescription:
        "Um resumo rápido de como seu perfil público está se saindo em visibilidade e engajamento.",
      openLeaderboard: "Abrir ranking",
      viewsRank: "Ranking de views",
      viewsHint: "Posição no ranking de mais vistos",
      likesRank: "Ranking de likes",
      likesHint: "Posição no ranking de mais curtidos",
      comments: "Comentários",
      commentsHint: "Comentários públicos visíveis no seu perfil",
      performanceEyebrow: "Performance",
      topLinks: "Top links",
      topLinksDescription:
        "Um retrato ranqueado dos destinos que estão recebendo mais cliques agora.",
      openAnalytics: "Abrir analytics",
      untitledLink: "Link sem título",
      clicks: "{count} cliques",
      noLinkActivityTitle: "Ainda sem atividade nos links",
      noLinkActivityDescription:
        "Seu painel de analytics vai começar a preencher assim que visitantes interagirem com seus primeiros links publicados.",
      inventoryEyebrow: "Inventário",
      allLinks: "Todos os links",
      allLinksDescription:
        "Uma visão rápida dos destinos que atualmente movimentam seu perfil.",
      manageLinks: "Gerenciar links",
      noLinksTitle: "Nenhum link criado ainda",
      noLinksDescription:
        "Crie seu primeiro link para dar aos visitantes um destino claro para clicar no seu perfil.",
      createFirstLink: "Criar primeiro link",
    },
    onboarding: {
      badge: "Onboarding Yotei",
      readyTitle: "Perfil pronto para lançar",
      readyDescription:
        "Seu perfil já tem a identidade, o conteúdo e a estrutura principal para parecer completo.",
      pendingTitle: "Finalize o essencial antes de lançar",
      pendingDescription:
        "Siga a checklist para alinhar identidade, links, layout e conteúdo, para que novos visitantes entendam na hora quem você é.",
      completion: "Conclusão",
      completedSummary: "{completed} de {total} concluídos",
      allComplete: "Todos os itens da checklist concluídos",
      next: "Próximo: {title}",
      synced: "Checklist sincronizada",
      progressLabel: "Progresso da configuração premium",
      step: "Etapa {index}",
      completed: "Concluído",
      incomplete: "Incompleto",
      completeHint: "Essa parte do seu perfil já está pronta.",
      incompleteHint:
        "Complete esta etapa para chegar mais perto de um perfil pronto para lançamento.",
      review: "Revisar",
      items: {
        verifyEmail: {
          title: "Verificar email",
          description:
            "Confirme sua caixa de entrada para desbloquear recursos do Yotei com segurança.",
          cta: "Verificar agora",
        },
        addAvatar: {
          title: "Adicionar avatar",
          description:
            "Dê ao seu perfil uma imagem reconhecível antes das pessoas chegarem nele.",
          cta: "Abrir perfil",
        },
        addBanner: {
          title: "Adicionar banner",
          description:
            "Defina o clima com uma imagem de topo premium ou uma identidade visual mais forte.",
          cta: "Enviar banner",
        },
        addFirstLink: {
          title: "Adicionar primeiro link",
          description:
            "Crie a primeira ação que seus visitantes realmente poderão clicar.",
          cta: "Adicionar link",
        },
        chooseLayout: {
          title: "Escolher layout do perfil",
          description:
            "Vá além da apresentação inicial e escolha um layout com mais intenção.",
          cta: "Escolher layout",
        },
        addSocialBlock: {
          title: "Adicionar bloco social",
          description:
            "Conecte um bloco de identidade mais rico como Discord, GitHub, Spotify ou Live.",
          cta: "Adicionar social",
        },
        createTemplate: {
          title: "Criar ou usar um template",
          description:
            "Monte seu primeiro template reutilizável para repetir e compartilhar sua configuração de perfil.",
          cta: "Abrir templates",
        },
      },
    },
    profile: dashboardProfilePtBR,
  },
  pricing: {
    eyebrow: "Preços",
    title: "Premium que continua em modo de teste.",
    description:
      "Mantenha o Stripe apontado com segurança para test mode enquanto apresenta uma experiência de upgrade mais limpa e estável para demos, revisões internas e conversas comerciais.",
    backToDashboard: "Voltar para dashboard",
    openHome: "Abrir home",
    premiumActive: "Premium ativo",
    freePlan: "Plano Free",
    premiumSummary: "Sua conta tem acesso premium.",
    freeSummary: "Sua conta está no Free.",
    premiumSummaryBody:
      "Os controles de cobrança continuam disponíveis pelo Stripe em modo de teste sem tocar nas configurações de produção.",
    freeSummaryBody:
      "Os testes de upgrade continuam disponíveis, e o fluxo do webhook permanece intacto para a futura liberação em produção.",
    starter: "Starter",
    freeTitle: "Free",
    freeDescription:
      "A configuração central de perfil para criadores que querem uma página limpa e pronta para lançamento, com links, mídia e identidade pública básica.",
    freeFeatureLinks: "Até 5 links",
    freeFeatureGallery: "Até 2 imagens de galeria",
    freeFeatureAnalytics: "Analytics básica",
    freeFeatureReactions: "Reações públicas",
    freeFeatureCustomization: "Customização base do perfil",
    currentPlan: "Plano atual",
    availableAnytime: "Disponível a qualquer momento",
    premiumTitle: "Premium",
    premiumDescription:
      "A camada de apresentação mais completa para visuais mais ricos, mais customização e uma impressão premium mais forte em demos e vendas para criadores.",
    premiumFeatureLinks: "Links ilimitados",
    premiumFeatureGallery: "Mais slots de galeria",
    premiumFeatureVideo: "Suporte a banner em vídeo",
    premiumFeatureBadge: "Estado de badge premium",
    premiumFeatureLayouts: "Presets salvos e layouts avançados",
    stripeTestMode:
      "O Stripe continua em modo de teste. Nenhuma troca para produção foi feita nesta limpeza.",
    signInToUpgrade: "Entrar para fazer upgrade",
    manageSubscription: "Gerenciar assinatura",
    openingPortal: "Abrindo portal...",
    startCheckout: "Iniciar checkout premium de teste",
    startingCheckout: "Iniciando checkout...",
    openPortalError: "Não foi possível abrir o portal de cobrança agora.",
    startCheckoutError: "Não foi possível iniciar o checkout premium agora.",
    openingBillingPortal: "Abrindo portal de cobrança...",
    redirectingCheckout: "Redirecionando para o checkout do Stripe...",
  },
  leaderboard: {
    tabs: {
      views: {
        eyebrow: "Alcance",
        label: "Mais vistos",
        description: "Perfis chamando mais atenção agora.",
      },
      likes: {
        eyebrow: "Afinidade",
        label: "Mais curtidos",
        description: "Perfis recebendo as reações mais positivas.",
      },
      dislikes: {
        eyebrow: "Calor",
        label: "Mais rejeitados",
        description: "Perfis acumulando mais reações negativas.",
      },
      newest: {
        eyebrow: "Novidades",
        label: "Perfis mais novos",
        description: "Os perfis públicos mais recentes a entrar no ranking do Yotei.",
      },
    },
    title: "Ranking",
    heroDescription:
      "{description} Todos os rankings são limitados a perfis públicos ativos e usam as mesmas contagens exibidas nas páginas de perfil.",
    backToDashboard: "Voltar para dashboard",
    boardMeta: "Top 50 perfis públicos ativos",
    noData: "Ainda não há dados disponíveis no ranking.",
    openProfile: "Abrir perfil",
    metrics: {
      views: "Views",
      likes: "Likes",
      dislikes: "Dislikes",
      joined: "Entrou",
    },
  },
  publicProfile: {
    scrollForMore: "Role para ver mais",
    auraScore: "Aura Score",
    auraRank: "Aura Rank",
    views: "Views",
    likes: "Likes",
    dislikes: "Dislikes",
    comments: "Comentários",
    location: "Localização",
    commentModalEyebrow: "Interação Pública",
    commentModalTitle: "Comentários do Perfil",
    commentCountOne: "{count} comentário",
    commentCountOther: "{count} comentários",
    closeComments: "Fechar comentários",
    newest: "Mais novos",
    oldest: "Mais antigos",
    ownProfileNote:
      "Você pode comentar no próprio perfil se quiser deixar anotações.",
    ownProfilePlaceholder: "Deixe uma nota no seu próprio perfil...",
    visitorPlaceholder: "Escreva algo para @{username}...",
    postComment: "Publicar comentário",
    postingComment: "Publicando...",
    writeCommentOwnProfile: "Escrever comentário (próprio perfil)",
    signInConversation: "Entre para participar da conversa.",
    signInConversationBody:
      "Os comentários são vinculados à conta nesta fase para manter as interações mais seguras e fáceis de moderar.",
    signIn: "Entrar",
    loadingComments: "Carregando comentários...",
    noCommentsYet: "Ainda não há comentários.",
    startFirstThread: "Comece a primeira conversa.",
    beFirstAfterSignIn: "Seja a primeira pessoa depois de entrar.",
    delete: "Excluir",
    deleting: "Excluindo...",
    justNow: "Agora mesmo",
    loadCommentsError: "Não foi possível carregar os comentários agora.",
    postCommentError: "Não foi possível publicar esse comentário agora.",
    deleteCommentError: "Não foi possível excluir esse comentário agora.",
  },
} as const;

export default ptBR;
