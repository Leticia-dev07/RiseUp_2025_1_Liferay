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

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do programa RiseUp 2025.1 da Liferay.

## 🙏 Agradecimentos

Agradecimentos especiais:
- **Liferay** pelo programa RiseUp 2025.1
- **Mentores e instrutores** pela orientação
- **Comunidade open-source** pelas ferramentas utilizadas

<div align="center">

Desenvolvido com 💙 pelo squad 21 **RiseUp 2025.2 - Liferay**

[⬆ Voltar ao topo](#-riseup-20251---liferay)

</div>
