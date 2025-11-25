const API_URL = "https://back-end-riseup-liferay-5.onrender.com/api"; 
const SERVER_URL = "https://back-end-riseup-liferay-5.onrender.com";

const token = localStorage.getItem("token") || localStorage.getItem("authToken");

if (!token) {
    const path = window.location.pathname;
    if (!path.endsWith('login.html') && !path.endsWith('criar-conta.html')) {
        window.location.href = "login.html";
    }
}

async function carregarDadosUsuario() {
    if (!token) return; 

    try {
        const response = await fetch(`${API_URL}/perfis/me`, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });

        if (response.status === 403 || response.status === 401) {
            console.warn("Token inválido. Deslogando...");
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
            if (!fotoUrl.startsWith("http")) {
                fotoUrl = SERVER_URL + (fotoUrl.startsWith("/") ? "" : "/") + fotoUrl;
            }
            userImage.src = fotoUrl;
        }
    } catch (error) {
        console.error("Erro ao carregar header:", error);
    }
}

function setupLogout() {
    const logoutButton = document.getElementById("logout-button"); 
    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("authToken");
            window.location.href = "login.html";
        });
    }
}

function setupGlobalSearch() {
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("global-search-results");
    const btnFiltro = document.getElementById("btn-filtro-home");
    const dropdownFiltro = document.getElementById("filter-dropdown-home");
    const opcoesFiltro = dropdownFiltro ? dropdownFiltro.querySelectorAll("a") : [];
    
    let filtroAtual = "todos"; 

    if (!searchInput || !resultsContainer) return;

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
                if (searchInput.value.trim().length >= 2) fetchResults(searchInput.value);
            });
        });

        document.addEventListener("click", () => dropdownFiltro.style.display = "none");
    }

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
            const url = `${API_URL}/perfis/buscar?q=${encodeURIComponent(query)}&filtro=${filtroAtual}`;
            const response = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
            
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
            const rawImg = item.imagemUrl || item.fotoPerfilUrl || item.fotoUrl || item.urlPerfil;
            const rawLink = item.link;

            let imgDefault = "assets/pictures/profile-pic.png";
            if (filtroAtual === 'eventos' || item.descricao === 'Evento') {
                imgDefault = "assets/pictures/liferay-devcon.jpg"; 
            }

            let fotoFinal = imgDefault;

            const isImage = (val) => val && typeof val === 'string' && !val.includes(".html") && (val.includes("cloudinary") || val.includes("/fotos/") || val.match(/\.(jpg|jpeg|png|gif)$/i));

            let foundImg = null;
            if (isImage(rawImg)) foundImg = rawImg;
            else if (isImage(rawLink)) foundImg = rawLink;

            if (foundImg) {
                if (foundImg.startsWith("http")) {
                    fotoFinal = foundImg; 
                } else {
                    fotoFinal = SERVER_URL + (foundImg.startsWith("/") ? "" : "/") + foundImg;
                }
            }

            let idCru = item.id || item.usuarioId;
            
            if (!idCru) {
                const textoLink = item.link || item.urlPerfil || "";
                const match = textoLink.match(/id=(\d+)/) || textoLink.match(/usuarioId=(\d+)/);
                if (match) idCru = match[1];
            }

            let idLimpo = idCru ? String(idCru).replace(/\D/g, "") : "";
            let linkDestino = "#";
            
            if (idLimpo) {
                if (filtroAtual === 'eventos' || item.descricao === 'Evento') {
                    linkDestino = `detalhes-evento.html?id=${idLimpo}`;
                } else {
                    linkDestino = `perfil.html?usuarioId=${idLimpo}`;
                }
            }

            let imgRadius = "50%";
            if (filtroAtual === 'eventos' || item.descricao === 'Evento') {
                imgRadius = "8px"; 
            }

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
                     onerror="this.onerror=null;this.src='${imgDefault}';">
                
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

document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUsuario();
    setupLogout();
    setupGlobalSearch();
});