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
    brandSubtitle: "Identity OS para perfis com presenca",
    mobileMenuTitle: "Menu",
    heroEyebrow: "Profile OS pronta para lancamento para gamers, streamers, criadores e devs",
    heroTitle: "Crie um perfil",
    heroTitleAccent: "que parece vivo.",
    heroBody:
      "O Yotei coloca links, redes sociais, badges, musica, comentarios, leaderboard e customizacao de perfil em uma pagina de identidade que parece cinematica, nitida e facil de ler.",
    claimCaption:
      "Reserve seu username primeiro. Depois ajuste a aura, os sistemas do perfil e a presenca publica.",
    claimInputAriaLabel: "Reservar username",
    claimPlaceholder: "username",
    claimButton: "Reservar Username",
    heroChips: {
      links: "Links",
      badges: "Badges",
      music: "Musica",
      comments: "Comentarios",
      leaderboard: "Leaderboard",
      aura: "Aura",
    },
    trust: {
      free: "Gratis para comecar",
      noCard: "Sem cartao",
      comments: "Comentarios prontos",
      leaderboard: "Leaderboard pronta",
    },
    preview: {
      eyebrow: "Yotei Identity Reactor",
      live: "Presenca ao vivo",
      synced: "Aura sincronizada",
      handle: "@seunome",
      role: "Perfil de creator / streamer / dev com fragmentos colecionaveis de identidade.",
      modulesTitle: "Painel do Profile OS",
      modulesBody:
        "Uma superficie viva para links, presenca em tempo real, status de badges e gosto musical.",
      moduleLabels: {
        links: "Links",
        presence: "Presenca",
        badges: "Badges",
        audio: "Audio",
      },
      moduleValues: {
        links: "Stack de lancamento",
        presence: "Discord + live",
        badges: "Raridade ativa",
        audio: "Pulso Spotify",
      },
      artifactTitle: "Fragmentos de identidade",
      artifactA: "Founder badge",
      artifactB: "Comentarios abertos",
      artifactC: "Profile FX online",
      footerLeft: "Visibilidade na leaderboard ativada",
      footerRight: "Pronto para lancamento publico",
      fragmentTitle: "Sinal do perfil",
      fragmentLabels: {
        comments: "Comentarios",
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
      title: "Mais que uma pagina de links. Mais perto de um sistema premium para o seu perfil.",
      body:
        "O Yotei organiza as partes da sua identidade publica em uma superficie mais forte para que as pessoas entendam seu clima, status e destinos rapidamente.",
      cards: {
        identityCore: {
          title: "Nucleo orbital de identidade",
          body: "Construa ao redor de uma aura central de marca em vez de um layout comum de avatar com links.",
        },
        creatorAura: {
          title: "Controle da aura creator",
          body: "Ajuste clima, densidade e energia do perfil para ficar pessoal sem virar ruido visual.",
        },
        profileSystems: {
          title: "Sistemas do perfil conectados",
          body: "Links, comentarios, midia, badges e status se comportam como um ecossistema e nao como widgets soltos.",
        },
      },
      rail: {
        title: "Tudo sai de uma unica superficie",
        body:
          "A arquitetura da pagina foi montada para parecer um profile OS: leitura primeiro, expressao depois, memoria visual o tempo todo.",
        items: {
          links: "Links de acao com intencao",
          socials: "Blocos de identidade com Discord, Spotify e GitHub",
          badges: "Raridade de badges e fragmentos colecionaveis",
          comments: "Comentarios da comunidade no seu perfil",
          leaderboard: "Presenca visivel na leaderboard",
        },
      },
    },
    gamers: {
      eyebrow: "Feito para gamers e streamers",
      title: "Mostre a stack por tras da sua identidade, nao so uma bio.",
      body:
        "O Yotei foi moldado para quem precisa que o perfil carregue plataformas, status, colecionaveis, reacoes e uma assinatura visual mais forte.",
      cardTag: "Modulo de lancamento",
      cards: {
        discord: {
          title: "Presenca no Discord",
          body: "Transforme a comunidade em parte do perfil em vez de um icone externo solto.",
        },
        spotify: {
          title: "Energia Spotify",
          body: "Mostre o que voce esta ouvindo com uma camada musical mais limpa que sustenta o clima da pagina.",
        },
        github: {
          title: "Credibilidade no GitHub",
          body: "Devs podem destacar projetos e atividade sem quebrar a vibe pensada para creators.",
        },
        badges: {
          title: "Identidade por badges",
          body: "Colete marcadores de status que deixam a pagina com cara de conquista, nao de decoracao aleatoria.",
        },
        comments: {
          title: "Threads de comentarios",
          body: "Deixe visitantes reagirem e escreverem notas visiveis para que o perfil pareca habitado.",
        },
        leaderboard: {
          title: "Visibilidade na leaderboard",
          body: "De aos perfis competitivos um motivo para voltar, subir e continuar visiveis.",
        },
      },
    },
    collectible: {
      eyebrow: "Identidade colecionavel",
      title: "Faca seu perfil parecer colecionavel, nao descartavel.",
      body:
        "Badges, raridade, fragmentos de perfil e progressao visivel dao aos visitantes motivos para lembrar da pagina e voltar.",
      tiers: {
        signal: {
          tag: "Tier signal",
          title: "Presenca inicial com silhueta clara",
          body: "Mantenha a silhueta limpa e ainda deixe espaco para raridade, comentarios e upgrades visuais.",
        },
        rare: {
          tag: "Tier rare",
          title: "Combinacoes de badges e aura",
          body: "Empilhe status ganho e clima visual para que a pagina pareca sua e reconhecivel em screenshots.",
        },
        ascendant: {
          tag: "Tier ascendant",
          title: "Profile drops que valem retorno",
          body: "Prepare a pagina para eventos, lancamentos, pushes de leaderboard e momentos colecionaveis.",
        },
      },
      fragments: {
        founder: "Founder ready",
        mission: "Mission badges",
        drop: "Drop moments",
        rarity: "Raridade visivel",
      },
      footer:
        "A ideia nao e decorar por decorar. E criar uma identidade persistente, visivel e que parece valer colecao.",
    },
    performance: {
      eyebrow: "Visual com foco em performance",
      title: "Atmosfera que respeita PCs fracos, mobile e reduced motion.",
      body:
        "O Yotei mantem a aparencia premium enquanto adapta efeitos ao dispositivo, a preferencia de movimento e ao safe mode para a pagina continuar legivel e rapida.",
      items: {
        adaptive: {
          title: "Performance adaptativa",
          body: "Atmosfera, blur e intensidade de movimento escalam com o perfil de performance atual.",
        },
        reducedMotion: {
          title: "Suporte a reduced motion",
          body: "A home suaviza ou remove movimento decorativo quando a pessoa pede uma experiencia mais calma.",
        },
        lighterFx: {
          title: "Efeitos leves",
          body: "Orbitas, glow breathing e scanlines ficam focados em transform e opacity sempre que possivel.",
        },
        fastSurface: {
          title: "Superficie rapida",
          body: "Sem canvas, sem video pesado e sem chuva de particulas atrapalhando a leitura do perfil.",
        },
      },
      badge:
        "A homepage respeita configuracoes de performance adaptativa, safe mode e reduced motion.",
    },
    cta: {
      eyebrow: "CTA de lancamento",
      title: "Garanta seu lugar no board antes mesmo de o perfil entrar no ar.",
      body:
        "Reserve seu username agora e depois volte para moldar visuais, comentarios, badges e sistemas do perfil em volta dele.",
      proofs: {
        discord: "Discord pronto",
        pricing: "Precos visiveis",
        leaderboard: "Leaderboard conectada",
      },
      primaryButton: "Reservar Username",
      secondaryButton: "Entrar",
      pricingButton: "Ver precos",
      helper: "Mantenha simples: claim primeiro, identidade refinada depois.",
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
