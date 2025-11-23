// ===============================================
// ARQUIVO: js/global.js (VERSÃO FINAL CORRIGIDA E ROBUSTA)
// ===============================================

// 1. Definições globais - ATUALIZADAS PARA O SERVIDOR RENDER
const API_URL = "https://back-end-riseup-liferay-5.onrender.com/api"; 
const SERVER_URL = "https://back-end-riseup-liferay-5.onrender.com";

// Tenta pegar o token (verifica ambos os nomes comuns para garantir)
const token = localStorage.getItem("token") || localStorage.getItem("authToken");

// 2. Verificação de segurança (ATIVADA 🚀)
// Se NÃO tem token E o utilizador NÃO está na página de login ou criar conta...
if (!token) {
    const path = window.location.pathname;
    // Verifica se não estamos na página de login ou registo para evitar loop infinito
    if (!path.endsWith('login.html') && !path.endsWith('criar-conta.html')) {
        console.warn("Sem token, redirecionando para login.");
        window.location.href = "login.html"; // CHUTA PARA O LOGIN
    }
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

        // 🌟 PROTEÇÃO EXTRA: Se o token for inválido (403/401), desloga.
        if (response.status === 403 || response.status === 401) {
            console.warn("Token inválido ou expirado. Deslogando...");
            localStorage.removeItem("token");
            localStorage.removeItem("authToken");
            window.location.href = "login.html"; 
            return;
        }

        if (!response.ok) return;

        const perfil = await response.json();
        
        const userImage = document.getElementById("header-profile-pic"); 
        const userNameSpan = document.getElementById("header-profile-name");

        if (userNameSpan && perfil.nomeCompleto) {
            userNameSpan.textContent = perfil.nomeCompleto;
        }

        if (userImage && perfil.fotoPerfilUrl) {
            let fotoUrl = perfil.fotoPerfilUrl;
            // Se for link local (/fotos/...), adiciona o domínio. Se for http (Cloudinary), usa direto.
            if (!fotoUrl.startsWith("http")) {
                fotoUrl = SERVER_URL + (fotoUrl.startsWith("/") ? "" : "/") + fotoUrl;
            }
            userImage.src = fotoUrl;
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
            console.log("Resultados da busca:", data); // DEBUG
            renderResults(data);

        } catch (error) {
            console.error('Falha na busca:', error);
            resultsContainer.style.display = 'none';
        }
    };

    // 🚀 FUNÇÃO DE RENDERIZAÇÃO (CORRIGIDA E SEGURA)
    const renderResults = (results) => {
        resultsContainer.innerHTML = ""; 

        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<div style="padding:10px; color:#777; text-align:center;">Nenhum resultado encontrado.</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        results.forEach(item => {
            // === 1. IDENTIFICAÇÃO INTELIGENTE DE CAMPOS ===
            const rawImg = item.imagemUrl || item.fotoPerfilUrl || item.fotoUrl || item.urlPerfil;
            const rawLink = item.link;

            let fotoFinal = "assets/pictures/profile-pic.png";
            let linkDestino = "#";

            // Funções para identificar o conteúdo
            // Link: contém .html ou ?id=
            const isLink = (val) => val && typeof val === 'string' && (val.includes(".html") || val.includes("?id=") || val.includes("usuarioId="));
            // Imagem: contém cloudinary, /fotos/ ou extensões de imagem
            const isImage = (val) => val && typeof val === 'string' && !val.includes(".html") && (val.includes("cloudinary") || val.includes("/fotos/") || val.match(/\.(jpg|jpeg|png|gif)$/i));

            // === 2. ATRIBUIÇÃO CRUZADA (CORREÇÃO DE DADOS TROCADOS) ===
            let foundImg = null;
            let foundLink = null;

            // Tenta achar a imagem no campo de imagem OU no campo de link
            if (isImage(rawImg)) foundImg = rawImg;
            else if (isImage(rawLink)) foundImg = rawLink;

            // Tenta achar o link no campo de link OU no campo de imagem
            if (isLink(rawLink)) foundLink = rawLink;
            else if (isLink(rawImg)) foundLink = rawImg;

            // === 3. PROCESSAMENTO DA FOTO ===
            if (foundImg) {
                if (foundImg.startsWith("http")) {
                    fotoFinal = foundImg; // URL Completa (Cloudinary)
                } else {
                    // URL Relativa (Local) - Adiciona barra se faltar
                    fotoFinal = SERVER_URL + (foundImg.startsWith("/") ? "" : "/") + foundImg;
                }
            }

            // === 4. PROCESSAMENTO DO LINK ===
            if (foundLink) {
                linkDestino = foundLink;
            } else {
                // Se não achou link pronto, monta manualmente pelo ID
                let idFinal = item.id || item.usuarioId;
                
                // Tenta extrair ID de strings se necessário
                if (!idFinal && rawLink) {
                    const match = rawLink.match(/(\d+)/);
                    if (match) idFinal = match[1];
                }

                if (idFinal) {
                    if (filtroAtual === 'eventos' || item.descricao === 'Evento') {
                        linkDestino = `detalhes-evento.html?id=${idFinal}`;
                    } else {
                        linkDestino = `perfil.html?usuarioId=${idFinal}`;
                    }
                }
            }

            // === 5. ESTILOS ===
            let imgRadius = "50%";
            let imgDefault = "assets/pictures/profile-pic.png";

            if (filtroAtual === 'eventos' || item.descricao === 'Evento') {
                imgRadius = "8px"; 
                imgDefault = "assets/pictures/liferay-devcon.jpg"; 
            }

            // === 6. CRIAÇÃO DO ELEMENTO HTML ===
            const link = document.createElement('a');
            link.href = linkDestino;
            
            link.style.cssText = `
                display: flex; align-items: center; padding: 10px 15px; 
                border-bottom: 1px solid #eee; text-decoration: none; 
                color: #333; cursor: pointer; background: #fff; transition: background 0.2s;
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

            link.onclick = () => {
                resultsContainer.style.display = 'none';
            };

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