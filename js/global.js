// ===============================================
// ARQUIVO: global.js (VERSÃO FINAL INTEGRADA)
// ===============================================

// 1. Definições globais
const API_URL = "http://localhost:8080/api";
const SERVER_URL = "http://localhost:8080";

// Tenta pegar o token (verifica ambos os nomes comuns para garantir)
const token = localStorage.getItem("token") || localStorage.getItem("authToken");

// 2. Verificação de segurança (Redireciona se não tiver logado)
if (!token && !window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('criar-conta.html')) {
    // Descomente a linha abaixo quando quiser bloquear o acesso não autorizado
    // window.location.href = "login.html"; 
}

// =====================
// 1. CARREGAR DADOS DO CABEÇALHO (FOTO E NOME)
// =====================
async function carregarDadosUsuario() {
    if (!token) return; 

    try {
        const response = await fetch(`${API_URL}/perfis/me`, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });

        if (!response.ok) return;

        const perfil = await response.json();
        
        // Elementos do HTML do Header
        const userImage = document.getElementById("header-profile-pic"); 
        const userNameSpan = document.getElementById("header-profile-name");

        // Preenche Nome
        if (userNameSpan && perfil.nomeCompleto) {
            userNameSpan.textContent = perfil.nomeCompleto;
        }

        // Preenche Foto
        if (userImage && perfil.fotoPerfilUrl) {
            userImage.src = perfil.fotoPerfilUrl.startsWith("http") 
                ? perfil.fotoPerfilUrl 
                : SERVER_URL + perfil.fotoPerfilUrl;
        }
    } catch (error) {
        console.error("Erro ao carregar header:", error);
    }
}

// =====================
// 2. CONFIGURAR LOGOUT
// =====================
function setupLogout() {
    const logoutButton = document.getElementById("logout-button"); // Se existir um botão com esse ID
    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("authToken");
            alert("Você saiu da sua conta.");
            window.location.href = "login.html";
        });
    }
}

// =====================
// 3. BARRA DE PESQUISA GLOBAL (COM FOTOS)
// =====================
function setupGlobalSearch() {
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("global-search-results");

    if (!searchInput || !resultsContainer) return;

    // Função de atraso para não chamar a API a cada letra (Debounce)
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Função que chama a API
    const fetchResults = async (query) => {
        if (query.length < 2) { 
            resultsContainer.style.display = "none";
            return;
        }
        try {
            const response = await fetch(`${API_URL}/perfis/buscar?q=${encodeURIComponent(query)}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            if (!response.ok) throw new Error('Erro na busca');
            
            const data = await response.json();
            renderResults(data);

        } catch (error) {
            console.error('Falha na busca:', error);
            resultsContainer.style.display = 'none';
        }
    };

    // Função que desenha os resultados na tela
    const renderResults = (results) => {
        resultsContainer.innerHTML = ""; 

        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<div style="padding:10px; color:#777; text-align:center;">Nenhum resultado encontrado.</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        results.forEach(item => {
            // Tenta encontrar a URL da foto em vários campos possíveis
            const fotoBanco = item.fotoPerfilUrl || item.fotoUrl || item.urlPerfil; 
            
            let fotoFinal = "assets/pictures/profile-pic.png"; // Imagem padrão

            // Se tiver foto, ajusta o caminho
            if (fotoBanco && fotoBanco.length > 5) { // Checagem simples se não é string vazia
                fotoFinal = fotoBanco.startsWith("http") 
                    ? fotoBanco 
                    : SERVER_URL + fotoBanco;
            }

            // Cria o link do resultado
            const link = document.createElement('a');
            
            // Define para onde vai ao clicar (Perfil ou Evento)
            // Se o DTO tiver 'urlPerfil' (como ajustamos no Java), usa ele. Senão, tenta montar manualmente.
            if (item.urlPerfil && item.urlPerfil.includes(".html")) {
                link.href = item.urlPerfil;
            } else {
                // Fallback: assume que é um usuário
                link.href = `perfil.html?usuarioId=${item.id || item.usuarioId}`;
            }
            
            // Estilo CSS inline para garantir o layout
            link.style.cssText = `
                display: flex; 
                align-items: center; 
                padding: 10px 15px; 
                border-bottom: 1px solid #eee; 
                text-decoration: none; 
                color: #333; 
                cursor: pointer;
                background: #fff;
                transition: background 0.2s;
            `;
            
            // HTML interno do item (Foto + Texto)
            link.innerHTML = `
                <img src="${fotoFinal}" 
                     alt="${item.nome}" 
                     style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 12px; border: 1px solid #ddd;"
                     onerror="this.src='assets/pictures/profile-pic.png'">
                
                <div style="display: flex; flex-direction: column;">
                    <strong style="font-size: 14px;">${item.nome}</strong>
                    <span style="font-size: 12px; color: #777;">${item.titulo || item.descricao || 'Membro'}</span>
                </div>
            `;
            
            // Efeitos de Hover
            link.onmouseover = () => link.style.background = "#f9f9f9";
            link.onmouseout = () => link.style.background = "#fff";

            resultsContainer.appendChild(link);
        });
        
        resultsContainer.style.display = 'block';
    };

    // Evento de digitação
    searchInput.addEventListener('input', debounce((e) => {
        fetchResults(e.target.value);
    }, 300));

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}

// =====================
// INICIALIZAÇÃO
// =====================
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUsuario();
    setupLogout();
    setupGlobalSearch();
});