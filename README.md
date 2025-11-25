# 🚀 RiseUp 2025.2 - Liferay

> Sistema web de gerenciamento de perfis, habilidades e eventos desenvolvido como parte do programa RiseUp 2025.1.

## 📋 Sobre o Projeto

Esta é uma plataforma web completa para gerenciamento de perfis profissionais, habilidades e criação de eventos. A aplicação permite que usuários:

- Realizem login na plataforma
- Visualizem e editem seus perfis profissionais
- Gerenciem suas habilidades técnicas com ícones personalizados
- Criem e organizem eventos
- Naveguem por eventos e cursos disponíveis
- Interajam com outros colaboradores

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Tela de login responsiva
- Autenticação de usuários
- Interface moderna e intuitiva
- Links para política de privacidade e ajuda

### ✅ Página Inicial (Dashboard)
- Visualização de próximos eventos
- Carrossel de eventos com navegação
- Seção de cursos disponíveis
- Sistema de paginação com dots
- Navegação por setas (anterior/próximo)
- Design responsivo e moderno

### ✅ Perfil do Usuário
- Visualização de informações pessoais e profissionais
- Foto de perfil e avatar em tamanho grande
- Seção "Sobre mim" customizável
- Grid layout organizado (habilidades | sobre mim)

### ✅ Gerenciamento de Habilidades
- Adicionar novas habilidades com ícones personalizados
- Sistema de ícones para tecnologias populares (React, JavaScript, Python, etc.)
- Visualizar habilidades existentes com badges estilizados
- Remover habilidades individualmente
- Interface intuitiva com animações
- Efeito hover nos cards de habilidades

### ✅ Criação de Eventos
- Formulário completo para criação de eventos
- Campos: nome, descrição, data, hora, local, categoria e vagas
- Validação de campos obrigatórios
- Validação de data mínima (não permite datas passadas)
- Integração com backend (API REST)
- Página de confirmação após criação
- Botão flutuante para criar eventos

### ✅ Confirmação de Eventos
- Página de sucesso com animações
- Exibição dos detalhes do evento criado
- Opções para voltar ao início ou criar outro evento
- Design amigável com ícone de sucesso

### ✅ Interface do Usuário
- Design responsivo e moderno
- Integração com a identidade visual Liferay
- Barra de pesquisa funcional
- Navegação intuitiva
- Header consistente em todas as páginas
- Ícones do Font Awesome
- Notificações visuais

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estruturação das páginas
- **CSS3** - Estilização e design responsivo
  - Variáveis CSS (Custom Properties)
  - Flexbox e Grid Layout
  - Animações e transições
- **JavaScript (ES6+)** - Interatividade e manipulação do DOM
  - Event Listeners
  - Manipulação de Arrays
  - Async/Await para requisições
- **Font Awesome 6.5.2** - Biblioteca de ícones
- **Google Fonts** - Fonte Source Sans Pro
- **LocalStorage** - Armazenamento local de dados temporários
- **API REST** - Comunicação com backend (em desenvolvimento)

## 📁 Estrutura do Projeto

```
RiseUp_2025_1_Liferay/
│
├── .vscode/
│   └── settings.json          # Configurações do VS Code
│
├── assets/
│   ├── logos/                 # Logos da Liferay (SVG e PNG)
│   │   ├── liferay-logo-black.svg
│   │   ├── liferay-logo-full.svg
│   │   ├── liferay-logo-white.svg
│   │   └── logo_liferay_semfundo.png
│   ├── icons/                 # Ícones da interface
│   └── pictures/              # Imagens e fotos
│       ├── profile-pic.png
│       └── liferay-devcon.jpg
│
├── login.html                 # Página de login
├── login.css                  # Estilos da página de login
├── login.js                   # Scripts da página de login
│
├── homepage.html              # Dashboard/Página inicial
├── homepage.css               # Estilos do dashboard
├── homepage.js                # Scripts do dashboard (carrosséis)
│
├── perfil.html                # Página de perfil do usuário
├── perfil.css                 # Estilos da página de perfil
├── perfil.js                  # Scripts da página de perfil
│
├── criar-evento.html          # Página de criação de eventos
├── evento-style.css           # Estilos da página de eventos
├── evento-script.js           # Scripts da página de eventos
│
├── confirmacao.html           # Página de confirmação
├── confirmacao-style.css      # Estilos da confirmação
├── confirmacao-script.js      # Scripts da confirmação
│
└── README.md                  # Este arquivo
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (recomendado: VS Code)
- Servidor local (opcional, mas recomendado)

### Executando

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/RiseUp_2025_1_Liferay.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd RiseUp_2025_1_Liferay
   ```

3. **Opção 1 - Com Servidor Local (Recomendado):**
   
   **Usando Live Server (VS Code):**
   - Instale a extensão "Live Server" no VS Code
   - Clique com botão direito em `login.html`
   - Selecione "Open with Live Server"
   
   **Usando Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   Acesse: `http://localhost:8000/login.html`

4. **Opção 2 - Diretamente no Navegador:**
   - Abra o arquivo `login.html` no navegador
   - **Nota:** Algumas funcionalidades podem não funcionar corretamente devido a restrições CORS

5. Siga as instruções do repositório para implementar o back-end:
   ```bash
   https://github.com/Jorgefigueredoo/Back-End-RiseUp-Liferay
   ```

### Fluxo de Navegação

1. **Login** (`login.html`) → Digite qualquer usuário/email
2. **Dashboard** (`homepage.html`) → Visualize eventos e cursos
3. **Perfil** (`perfil.html`) → Gerencie suas habilidades
4. **Criar Evento** (`criar-evento.html`) → Preencha o formulário
5. **Confirmação** (`confirmacao.html`) → Veja o resumo do evento criado

## 🎨 Design System

O projeto utiliza a identidade visual da Liferay:

### Cores Principais
```css
--cor-principal: #00318F;        /* Azul Liferay */
--cor-texto-navegacao: #A1A2AF;  /* Cinza Navegação */
--cor-texto-claro: #BDBDC7;      /* Cinza Claro */
--cor-fundo-claro: #F4F4F6;      /* Fundo Claro */
--cor-fundo-icone: #F5F7FA;      /* Fundo Ícones */
--cor-borda: #EAEAEA;            /* Borda */
--cor-branco: #FFFFFF;           /* Branco */
--cor-notificacao: #FA0000;      /* Vermelho Notificação */
```

### Tipografia
- **Fonte Principal**: Source Sans Pro (Google Fonts)
- **Pesos**: 400 (Regular), 600 (Semi-Bold), 700 (Bold)
- **Tamanhos**:
  - Corpo: 16px
  - Subtítulos: 20-24px
  - Títulos: 28-32px
  - Títulos Grandes: 36-48px

### Componentes Reutilizáveis

#### Header
- Logo Liferay (35px altura)
- Barra de pesquisa centralizada
- Ícones de configuração e notificações
- Avatar e nome do usuário

#### Botões
- **Primário**: Fundo azul (`#00318F`), texto branco
- **Secundário**: Fundo branco, borda cinza
- **Flutuante**: Posição fixa, sombra elevada
- **Ícone**: Circular, 44px, fundo claro

#### Cards
- Fundo branco
- Borda sutil (`#EAEAEA`)
- Border-radius: 8-10px
- Sombra suave
- Hover com elevação

## 📱 Responsividade

O projeto é totalmente responsivo e funciona em:

### Mobile (< 768px)
- Layout em coluna única
- Stack vertical dos elementos
- Carrossel adaptado para toque
- Botões em largura total
- Menu colapsável

### Tablet (768px - 1200px)
- Layout em duas colunas quando apropriado
- Cards menores
- Espaçamentos ajustados

### Desktop (> 1200px)
- Layout completo em grid
- Três colunas quando aplicável
- Carrossel com múltiplos cards visíveis
- Espaçamentos otimizados

## 💡 Funcionalidades Detalhadas

### Sistema de Carrossel
- Navegação por setas (anterior/próximo)
- Paginação com dots
- Slides por visualização configurável
- Animações suaves (CSS transitions)
- Responsivo (recalcula ao redimensionar)
- Suporte a múltiplos carrosséis na mesma página

### Gerenciamento de Habilidades
```javascript
// Habilidades com ícones personalizados
const skillIcons = {
  javascript: 'fab fa-js-square',
  react: 'fab fa-react',
  python: 'fab fa-python',
  // ... mais tecnologias
}
```
- Adicionar: Input + botão ou tecla Enter
- Remover: Botão X em cada skill
- Animações: Fade in/out
- Persistência: LocalStorage (planejado)

### Criação de Eventos
```javascript
// Estrutura de dados do evento
{
  nome: string,
  descricao: string,
  data: date,
  hora: time,
  local: string (opcional),
  categoria: select,
  vagas: number (opcional)
}
```
- Validação de campos obrigatórios
- Validação de data (não permite passado)
- Envio para API REST
- Feedback visual de sucesso/erro

## 🔄 Integrações e APIs

### Backend (Em Desenvolvimento)
```javascript
// Endpoint para criar eventos
POST http://localhost:8080/api/eventos/criar
Content-Type: application/json

{
  "nome": "Workshop de React",
  "descricao": "...",
  "data": "2025-11-15",
  "hora": "14:00",
  "local": "Sala 201",
  "categoria": "workshop",
  "vagas": 50
}
```

### LocalStorage
```javascript
// Salvar evento recém-criado
localStorage.setItem('eventoRecemCriado', JSON.stringify(eventoData));

// Recuperar na página de confirmação
const evento = JSON.parse(localStorage.getItem('eventoRecemCriado'));
```

## 🐛 Problemas Conhecidos e Limitações

### Conhecidos
1. **LocalStorage Temporário**: Dados podem ser limpos pelo navegador
2. **CORS**: Requisições à API podem falhar sem servidor adequado
3. **Performance**: Animações podem ser lentas em dispositivos antigos
4. **Validação**: Formulários poderiam ter validação mais robusta

### Limitações Atuais
- Autenticação apenas visual (sem backend real)
- Eventos não são persistidos em banco de dados
- Sistema de busca não implementado
- Upload de imagens não funcional
- Sem sistema de notificações real

## 📝 Notas de Versão

### v0.2.0 (Atual - Outubro 2025)
- ✅ Implementado sistema de carrosséis
- ✅ Adicionada página de dashboard
- ✅ Criado sistema de habilidades com ícones
- ✅ Implementada página de confirmação
- ✅ Melhorias no design responsivo
- ✅ Adicionada validação de formulários
- ✅ Integração inicial com API REST

### v0.1.0 (Inicial)
- ✅ Estrutura base do projeto
- ✅ Página de perfil funcional
- ✅ Formulário de criação de eventos
- ✅ Design responsivo básico

## 🔮 Roadmap - Próximas Features

### Fase 1 - Autenticação (Prioridade Alta)
- [ ] Sistema de login funcional com backend
- [ ] Registro de novos usuários
- [ ] Recuperação de senha
- [ ] Validação de email
- [ ] Gestão de sessões

### Fase 2 - Perfil Avançado
- [ ] Upload de foto de perfil
- [ ] Edição inline de informações
- [ ] Histórico profissional
- [ ] Badges e conquistas
- [ ] Exportar perfil em PDF

### Fase 3 - Eventos
- [ ] Lista completa de eventos
- [ ] Filtros e busca avançada
- [ ] Sistema de inscrição
- [ ] Calendário visual
- [ ] Eventos favoritos
- [ ] Compartilhamento de eventos

### Fase 4 - Social
- [ ] Sistema de conexões
- [ ] Chat entre usuários
- [ ] Feed de atividades
- [ ] Comentários em eventos
- [ ] Sistema de avaliações

### Fase 5 - Cursos
- [ ] Catálogo completo de cursos
- [ ] Sistema de matrícula
- [ ] Acompanhamento de progresso
- [ ] Certificados digitais

### Fase 6 - Analytics
- [ ] Dashboard de estatísticas
- [ ] Métricas de engajamento
- [ ] Relatórios personalizados
- [ ] Exportação de dados

## 🤝 Como Contribuir

Este projeto está em desenvolvimento ativo. Contribuições são bem-vindas!

### Processo de Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```
3. **Commit** suas mudanças:
   ```bash
   git commit -m 'Add: Minha nova feature incrível'
   ```
4. **Push** para a branch:
   ```bash
   git push origin feature/MinhaNovaFeature
   ```
5. Abra um **Pull Request**

### Padrões de Código

- Use nomes descritivos para variáveis e funções
- Comente código complexo
- Siga a identidade visual existente
- Teste em múltiplos navegadores
- Mantenha responsividade

### Tipos de Commit
- `Add:` Nova funcionalidade
- `Fix:` Correção de bug
- `Update:` Atualização de funcionalidade
- `Refactor:` Refatoração de código
- `Style:` Mudanças de estilo/formatação
- `Docs:` Atualização de documentação

## 👥 Equipe de Desenvolvimento

* **Lucas Vinicius** - Desenvolvimento Full Stack
* **Gustavo Koichi** - Desenvolvimento Full Stack
* **Gustavo Bezerra** - Desenvolvimento Front End
* **Leticia Gabrielle** - Desenvolvimento Front End
* **Luciana Cristina** - Desenvolvimento Front End
* **Lucas Souza** - Desenvolvimento Front End
* **Jorge Antônio** - Desenvolvimento Full Stack
* **Kauan Nicolas** - Desenvolvimento Front End
* **Luiz Eduardo** - Desenvolvimento Front End
* **Luiz Miguel** - Desenvolvimento Front End

## 🎓 Aprendizados

Este projeto proporcionou aprendizado em:
- Desenvolvimento web full-stack
- Design responsivo e mobile-first
- Manipulação de DOM com JavaScript
- Integração com APIs REST
- Trabalho em equipe usando Git
- Boas práticas de código
- Acessibilidade web

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do programa RiseUp 2025.1 da Liferay.

## 📞 Contato e Suporte

Para dúvidas, sugestões ou reportar problemas:

- 📧 Email: [contato do programa]
- 💬 Issues: Use a aba "Issues" do GitHub
- 📚 Documentação: Este README

## 🙏 Agradecimentos

Agradecimentos especiais:
- **Liferay** pelo programa RiseUp 2025.1
- **Mentores e instrutores** pela orientação
- **Comunidade open-source** pelas ferramentas utilizadas

---

**Status do Projeto**: 🚧 Em Desenvolvimento Ativo

**Versão Atual**: v0.1.0

**Última Atualização**: Outubro 2025

---

<div align="center">

Desenvolvido com 💙 pela equipe 21 **RiseUp 2025.2 - Liferay**

[⬆ Voltar ao topo](#-riseup-20251---liferay)

</div>
