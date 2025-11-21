// ===============================================
// ARQUIVO: js/global.js (VERSÃO FINAL COMPLETA)
// ===============================================

// 1. Definições globais - ATUALIZADAS PARA O SERVIDOR RENDER
const API_URL = "https://back-end-riseup-liferay-5.onrender.com/api"; 
const SERVER_URL = "https://back-end-riseup-liferay-5.onrender.com";

// Tenta pegar o token (verifica ambos os nomes comuns para garantir)
const token = localStorage.getItem("token") || localStorage.getItem("authToken");

// 2. Verificação de segurança (Opcional - Redireciona se não tiver logado)
if (!token && !window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('criar-conta.html')) {
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
        
        const userImage = document.getElementById("header-profile-pic"); 
        const userNameSpan = document.getElementById("header-profile-name");

        if (userNameSpan && perfil.nomeCompleto) {
            userNameSpan.textContent = perfil.nomeCompleto;
        }

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
    const logoutButton = document.getElementById("logout-button"); 
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
// 3. BARRA DE PESQUISA GLOBAL (COM FOTOS E FILTRO)
// =====================
function setupGlobalSearch() {
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("global-search-results");

    // Elementos do Filtro (Se existirem na página)
    const btnFiltro = document.getElementById("btn-filtro-home");
    const dropdownFiltro = document.getElementById("filter-dropdown-home");
    const opcoesFiltro = dropdownFiltro ? dropdownFiltro.querySelectorAll("a") : [];
    
    // Variável de estado do filtro (Padrão: busca tudo)
    let filtroAtual = "todos"; 

    if (!searchInput || !resultsContainer) return;

    // --- LÓGICA DO MENU FILTRO ---
    if (btnFiltro && dropdownFiltro) {
        btnFiltro.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownFiltro.style.display = dropdownFiltro.style.display === "block" ? "none" : "block";
        });

        opcoesFiltro.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                filtroAtual = e.target.getAttribute("data-value");
                btnFiltro.innerHTML = `<i class="fas fa-filter"></i> ${e.target.textContent} <i class="fas fa-caret-down"></i>`;
                dropdownFiltro.style.display = "none";

                if (searchInput.value.trim().length >= 2) {
                    fetchResults(searchInput.value);
                }
            });
        });

        document.addEventListener("click", () => {
            dropdownFiltro.style.display = "none";
        });
    }

    // --- LÓGICA DA BUSCA ---
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const fetchResults = async (query) => {
        if (query.length < 2) { 
            resultsContainer.style.display = "none";
            return;
        }
        try {
            // Envia o filtro para o Java
            const url = `${API_URL}/perfis/buscar?q=${encodeURIComponent(query)}&filtro=${filtroAtual}`;
            
            const response = await fetch(url, {
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

    const renderResults = (results) => {
        resultsContainer.innerHTML = ""; 

        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<div style="padding:10px; color:#777; text-align:center;">Nenhum resultado encontrado.</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        results.forEach(item => {
            const fotoBanco = item.fotoPerfilUrl || item.fotoUrl || item.urlPerfil; 
            let fotoFinal = "assets/pictures/profile-pic.png"; 

            if (fotoBanco && fotoBanco.length > 5) { 
                fotoFinal = fotoBanco.startsWith("http") ? fotoBanco : SERVER_URL + fotoBanco;
            }

            // Lógica de Link e Formato (Pessoa vs Evento)
            let linkDestino = `perfil.html?usuarioId=${item.id || item.usuarioId}`;
            let imgRadius = "50%";
            let imgDefault = "assets/pictures/profile-pic.png";

            // Se for evento (identificado pelo Java ou pelo filtro)
            if (filtroAtual === 'eventos' || item.descricao === 'Evento') {
                linkDestino = `detalhes-evento.html?id=${item.id}`;
                imgRadius = "8px"; // Quadrado arredondado
                imgDefault = "assets/pictures/liferay-devcon.jpg"; // Imagem de evento padrão
                if(item.imagemUrl) fotoFinal = item.imagemUrl;
            }

            const link = document.createElement('a');
            link.href = linkDestino;
            
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
            
            link.innerHTML = `
                <img src="${fotoFinal}" 
                     alt="${item.nome}" 
                     style="width: 40px; height: 40px; border-radius: ${imgRadius}; object-fit: cover; margin-right: 12px; border: 1px solid #ddd;"
                     onerror="this.src='${imgDefault}'">
                
                <div style="display: flex; flex-direction: column;">
                    <strong style="font-size: 14px;">${item.nome}</strong>
                    <span style="font-size: 12px; color: #777;">${item.titulo || item.descricao || 'Membro'}</span>
                </div>
            `;
            
            link.onmouseover = () => link.style.background = "#f9f9f9";
            link.onmouseout = () => link.style.background = "#fff";

            resultsContainer.appendChild(link);
        });
        
        resultsContainer.style.display = 'block';
    };

    searchInput.addEventListener('input', debounce((e) => {
        fetchResults(e.target.value);
    }, 300));

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