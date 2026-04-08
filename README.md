# 🚀 Yotei Profile

Uma plataforma moderna de **biolink personalizável**, inspirada em soluções como Linktree e Haunt.gg, com foco em **visual premium, personalização avançada e analytics em tempo real**.

🔗 Deploy: https://yotei-profile.vercel.app
📦 Repositório: https://github.com/Yotei-san/yotei-profile

---

## ✨ Visão do Projeto

O **Yotei Profile** foi criado para oferecer uma experiência superior de perfil público, permitindo que usuários centralizem sua presença digital em uma página elegante, altamente customizável e com aparência de produto premium.

---

## 🔥 Principais Features

### 👤 Perfil Público Dinâmico

* Página personalizada por username (`/username`)
* Avatar, banner e background customizáveis
* Vídeo de fundo (Premium)
* Bio, redes sociais e galeria

### 🎨 Sistema de Customização

* Tema (cores, blur, glow, opacity)
* Layout (stacked, compact, wide)
* Estilo de links (rounded, square, pill)
* Ordem dos blocos configurável

### 🔗 Links Inteligentes

* Criação e edição de links
* Redirecionamento com tracking (`/go/[id]`)
* Ordenação manual (drag & drop)

### 📊 Analytics

* Visualizações de perfil
* Cliques em links
* Dispositivos dos visitantes
* Países de acesso
* Gráficos em tempo real

### ⭐ Sistema de Reações

* Likes / Dislikes públicos
* Score do perfil

### 🏆 Badges

* Sistema de badges com pin
* Badges customizadas e premium

### 💎 Sistema Premium

* Liberação de features avançadas:

  * Vídeo de fundo
  * Badges premium
  * Layouts avançados
  * Presets salvos
* Integração com Stripe

### 🧠 Presets

* Salvar e aplicar estilos de perfil
* Sistema de temas reutilizáveis

### 🛡️ Admin System

* Gestão de usuários
* Logs de auditoria
* Controle de badges
* Logs de IP

---

## 🧱 Stack Tecnológica

* **Frontend:** Next.js (App Router)
* **Backend:** Server Actions (Next.js)
* **Banco de dados:** PostgreSQL + Prisma ORM
* **Autenticação:** Sistema próprio com sessão via cookies
* **Deploy:** Vercel
* **Pagamentos:** Stripe

---

## 📁 Estrutura do Projeto

```
src/
 └── app/
     ├── dashboard/
     ├── api/
     ├── [username]/
     └── lib/

prisma/
 └── schema.prisma
```

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```
git clone https://github.com/Yotei-san/yotei-profile.git
cd yotei-profile
```

### 2. Instale as dependências

```
npm install
```

### 3. Configure o ambiente

Crie um `.env` com:

```
DATABASE_URL=
```

(Adicione também suas chaves do Stripe se necessário)

### 4. Execute as migrations

```
npx prisma migrate dev
```

### 5. Rode o projeto

```
npm run dev
```

---

## 📌 Status do Projeto

🟡 Em desenvolvimento ativo
🚀 Evoluindo para versão SaaS completa

---

## 🎯 Roadmap

* [ ] Sistema de Decorations (estilo Haunt.gg)
* [ ] Melhorias de performance
* [ ] Refatoração para arquitetura mais escalável
* [ ] Sistema de templates públicos
* [ ] SEO e otimização de perfil público

---

## 💡 Objetivo

Transformar o Yotei em uma plataforma de referência para:

* criadores de conteúdo
* desenvolvedores
* comunidades online

---

## 🤝 Contribuição

Contribuições são bem-vindas!
Sinta-se livre para abrir issues ou pull requests.

---

## 📜 Licença

MIT License

---

## 👨‍💻 Autor

Desenvolvido por **Arthur Jesus (Yotei)**
🔗 https://github.com/Yotei-san
