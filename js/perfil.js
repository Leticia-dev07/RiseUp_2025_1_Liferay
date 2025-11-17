// ===============================================
// ARQUIVO: perfil.js (COMPLETO E ATUALIZADO)
// ===============================================

// -----------------------------
// CONFIGURAÇÕES GLOBAIS
// -----------------------------
// As variáveis API_URL, SERVER_URL e token devem vir do global.js
// Se não estiverem lá, descomente abaixo:
// const API_URL = "http://localhost:8080/api"; 
// const SERVER_URL = "http://localhost:8080";
// const token = localStorage.getItem("token"); 

const initialSkills = ["React", "Next.js", "JavaScript", "Python"];

const skillIcons = {
    javascript: '<i class="fab fa-js-square" style="color:#f7df1e;"></i>',
    react: '<i class="fab fa-react" style="color:#61dafb;"></i>',
    "next.js": '<i class="fa-brands fa-react" style="color:#000;"></i>',
    python: '<i class="fab fa-python" style="color:#3776ab;"></i>',
    java: '<i class="fab fa-java" style="color:#f89820;"></i>',
    html: '<i class="fab fa-html5" style="color:#e34c26;"></i>',
    css: '<i class="fab fa-css3-alt" style="color:#264de4;"></i>',
    "node.js": '<i class="fab fa-node-js" style="color:#3c873a;"></i>',
    git: '<i class="fab fa-git-alt" style="color:#f1502f;"></i>',
    github: '<i class="fab fa-github"></i>',
    typescript: '<i class="fab fa-js" style="color:#3178c6;"></i>',
    "c++": '<i class="fab fa-cuttlefish" style="color:#00599C;"></i>',
    "c#": '<i class="fas fa-hashtag" style="color:#68217a;"></i>',
    php: '<i class="fab fa-php" style="color:#777bb3;"></i>',
    sql: '<i class="fas fa-database" style="color:#4479A1;"></i>',
};

// -----------------------------
// INICIALIZAÇÃO
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicoUsuarioId = urlParams.get("usuarioId");

    initializeTabs();

    if (publicoUsuarioId) {
        // Visualizando perfil público
        carregarPerfilPublico(publicoUsuarioId);
        hideEditorControls();
    } else {
        // Meu perfil (edição)
        carregarMeuPerfilParaEdicao();
        setupEditorControls();
    }
});

// -----------------------------
// CONTROLES DE INTERFACE
// -----------------------------
function hideEditorControls() {
    const saveBtn = document.getElementById("save-profile-btn");
    if (saveBtn) saveBtn.style.display = "none";

    const editIcon = document.querySelector(".edit-icon");
    if (editIcon) editIcon.style.display = "none";

    const addSkillForm = document.querySelector(".add-skill-form");
    if (addSkillForm) addSkillForm.style.display = "none";
}

function setupEditorControls() {
    const saveBtn = document.getElementById("save-profile-btn");
    if (saveBtn) saveBtn.addEventListener("click", salvarMeuPerfil);

    const fileUpload = document.getElementById("file-upload");
    if (fileUpload) fileUpload.addEventListener("change", uploadMinhaFoto);

    const addSkillBtn = document.getElementById("add-skill-btn");
    if (addSkillBtn) addSkillBtn.addEventListener("click", adicionarSkillDaCaixa);

    const skillInput = document.getElementById("skill-input");
    if (skillInput) {
        skillInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                adicionarSkillDaCaixa();
            }
        });
    }

    const skillsList = document.getElementById("skills-list");
    if (skillsList) {
        skillsList.addEventListener("click", (e) => {
            if (
                e.target.classList.contains("delete-skill-btn") ||
                e.target.parentElement?.classList.contains("delete-skill-btn")
            ) {
                const skillItem = e.target.closest(".skill-item");
                if (skillItem) {
                    skillItem.classList.add("fade-out");
                    setTimeout(() => skillItem.remove(), 250);
                }
            }
        });
    }
}

// -----------------------------
// SISTEMA DE ABAS (TABS)
// -----------------------------
function initializeTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    if (!tabBtns) return;

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            tabBtns.forEach((b) => b.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            btn.classList.add("active");
            const contentEl = document.getElementById(`tab-${targetTab}`);
            if (contentEl) contentEl.classList.add("active");

            // Carregamento Lazy (apenas quando clica na aba)
            if (targetTab === "eventos") {
                const eventosList = document.getElementById("eventos-list");
                if (eventosList && eventosList.children.length === 0) {
                    carregarEventosInscritos();
                }
            } else if (targetTab === "historico") {
                const historicoList = document.getElementById("historico-list");
                if (historicoList && historicoList.children.length === 0) {
                    carregarHistoricoEventos();
                }
            }
        });
    });
}

// -----------------------------
// CARREGAR PERFIL (API)
// -----------------------------
async function carregarMeuPerfilParaEdicao() {
    try {
        const resp = await fetch(`${API_URL}/perfis/me`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (!resp.ok) throw new Error("Erro ao carregar perfil");

        const perfil = await resp.json();
        preencherDadosPerfil(perfil, true);
    } catch (e) {
        console.error("Erro carregarMeuPerfilParaEdicao:", e);
        preencherDadosPerfil(
            {
                nomeCompleto: "Erro ao carregar",
                titulo: "Verifique conexão",
                sobreMim: "Não foi possível carregar os dados.",
                habilidades: initialSkills,
            },
            true
        );
    }
}

async function carregarPerfilPublico(usuarioId) {
    try {
        const resp = await fetch(`${API_URL}/perfis/usuario/${usuarioId}`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (!resp.ok) throw new Error("Erro ao carregar perfil público");

        const perfil = await resp.json();
        preencherDadosPerfil(perfil, false);
    } catch (e) {
        console.error("Erro carregarPerfilPublico:", e);
        alert("Erro ao carregar o perfil do usuário.");
    }
}

function preencherDadosPerfil(perfil, modoEdicao) {
    // Foto
    const imgPreview = document.getElementById("main-profile-pic");
    if (imgPreview && perfil.fotoPerfilUrl) {
        imgPreview.src = (perfil.fotoPerfilUrl.startsWith("http") ? "" : SERVER_URL) + perfil.fotoPerfilUrl;
    }

    // Campos
    if (modoEdicao) {
        const nomeEl = document.getElementById("profile-nome");
        const tituloEl = document.getElementById("profile-titulo");
        const sobreEl = document.getElementById("profile-sobre");

        if (nomeEl) nomeEl.value = perfil.nomeCompleto || "";
        if (tituloEl) tituloEl.value = perfil.titulo || "";
        if (sobreEl) sobreEl.value = perfil.sobreMim || "";

        renderizarSkills(perfil.habilidades || [], true);
    } else {
        // Modo Visualização (Substitui inputs por texto)
        const nomeInput = document.getElementById("profile-nome");
        const tituloInput = document.getElementById("profile-titulo");
        const sobreInput = document.getElementById("profile-sobre");

        if (nomeInput) nomeInput.replaceWith(criarElementoTexto("h1", perfil.nomeCompleto));
        if (tituloInput) tituloInput.replaceWith(criarElementoTexto("h3", perfil.titulo));
        if (sobreInput) sobreInput.replaceWith(criarElementoTexto("p", perfil.sobreMim));

        renderizarSkills(perfil.habilidades || [], false);
    }
}

function criarElementoTexto(tag, texto) {
    const el = document.createElement(tag);
    el.textContent = texto || "";
    return el;
}

// -----------------------------
// SALVAR PERFIL (PUT)
// -----------------------------
async function salvarMeuPerfil(e) {
    e.preventDefault();
    const btn = e.target;
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Salvando...";
    }

    const dados = {
        nomeCompleto: document.getElementById("profile-nome").value,
        titulo: document.getElementById("profile-titulo").value,
        sobreMim: document.getElementById("profile-sobre").value,
        habilidades: getSkillsDaLista(),
    };

    try {
        const resp = await fetch(`${API_URL}/perfis/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(dados),
        });

        if (!resp.ok) throw new Error("Erro ao salvar perfil");

        alert("Perfil salvo com sucesso!");
    } catch (err) {
        console.error("Erro salvarMeuPerfil:", err);
        alert("Não foi possível salvar o perfil.");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Salvar Alterações";
        }
    }
}

// -----------------------------
// UPLOAD DE FOTO
// -----------------------------
async function uploadMinhaFoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const btn = document.querySelector(".edit-icon");
    if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    const formData = new FormData();
    formData.append("file", file);

    try {
        const resp = await fetch(`${API_URL}/perfis/foto`, {
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            body: formData,
        });

        if (!resp.ok) throw new Error("Erro ao enviar foto");

        const data = await resp.json();
        const img = document.getElementById("main-profile-pic");
        // Adiciona timestamp para forçar atualização do cache do navegador
        if (img) img.src = (data.novaUrl.startsWith("http") ? "" : SERVER_URL) + data.novaUrl + "?t=" + Date.now();

    } catch (err) {
        console.error("Erro uploadMinhaFoto:", err);
        alert("Falha ao enviar foto.");
    } finally {
        if (btn) btn.innerHTML = '<i class="fas fa-camera"></i>';
    }
}

// -----------------------------
// GERENCIAMENTO DE SKILLS
// -----------------------------
function adicionarSkillDaCaixa() {
    const input = document.getElementById("skill-input");
    if (!input || !input.value.trim()) return;

    const list = document.getElementById("skills-list");
    const el = createSkillElement(input.value.trim(), true);
    list.appendChild(el);
    input.value = "";
}

function createSkillElement(skillName, editavel) {
    const icon = skillIcons[skillName.toLowerCase()] || '<i class="fas fa-code" style="color:#00318f;"></i>';

    const div = document.createElement("div");
    div.classList.add("skill-item");

    div.innerHTML = `
        <div class="skill-pill">
            ${icon}
            <span>${skillName}</span>
            ${editavel ? `<button class="delete-skill-btn"><i class="fas fa-times"></i></button>` : ""}
        </div>
    `;
    return div;
}

function renderizarSkills(arr, editavel) {
    const list = document.getElementById("skills-list");
    if (!list) return;
    list.innerHTML = "";

    let skillsArray = arr;
    if (!Array.isArray(arr) && typeof arr === "string") {
        skillsArray = arr.split(",").map(s => s.trim()).filter(Boolean);
    }
    (skillsArray || initialSkills).forEach((s) => list.appendChild(createSkillElement(s, editavel)));
}

function getSkillsDaLista() {
    return [...document.querySelectorAll("#skills-list span")].map((s) => s.textContent.trim());
}

// -----------------------------
// EVENTOS INSCRITOS (API)
// -----------------------------
async function carregarEventosInscritos() {
    const loading = document.getElementById("eventos-loading");
    const list = document.getElementById("eventos-list");
    const empty = document.getElementById("eventos-empty");

    if (loading) loading.style.display = "flex";
    if (list) list.style.display = "none";
    if (empty) empty.style.display = "none";

    try {
        const resp = await fetch(`${API_URL}/inscricoes/minhas-inscricoes`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (!resp.ok) throw new Error(`Status ${resp.status}`);

        const inscricoes = await resp.json();

        if (loading) loading.style.display = "none";

        if (!inscricoes || inscricoes.length === 0) {
            if (empty) {
                empty.style.display = "block";
                empty.querySelector("h3") && (empty.querySelector("h3").textContent = "Nenhuma inscrição");
                empty.querySelector("p") && (empty.querySelector("p").textContent = "Você ainda não se inscreveu em nenhum evento.");
            }
            return;
        }

        if (list) {
            list.style.display = "flex";
            list.innerHTML = "";
            renderizarEventos(inscricoes);
        }
    } catch (err) {
        console.error("Erro carregarEventosInscritos:", err);
        if (loading) loading.style.display = "none";
        if (empty) {
            empty.style.display = "block";
            empty.querySelector("h3") && (empty.querySelector("h3").textContent = "Erro ao carregar eventos");
        }
    }
}

function renderizarEventos(inscricoes) {
    const list = document.getElementById("eventos-list");
    if (!list) return;
    list.innerHTML = "";

    inscricoes.forEach((i) => {
        if (i.evento) list.appendChild(criarCardEvento(i.evento, i));
    });
}

function criarCardEvento(evento, inscricao) {
    const status = (inscricao && inscricao.status) ? inscricao.status.toUpperCase() : "PENDENTE";
    const statusClass = status.toLowerCase();

    const div = document.createElement("div");
    div.className = "evento-card";

    div.innerHTML = `
        <span class="evento-status ${statusClass}">${capitalize(status)}</span>
        <div class="evento-icon"><i class="${getIconeCategoria(evento.categoria)}"></i></div>
        <div class="evento-content">
            <h3>${evento.nome}</h3>
            <div class="evento-meta">
                <div class="evento-meta-item"><i class="fas fa-calendar-alt"></i><span>${formatarData(evento.data)}</span></div>
                <div class="evento-meta-item"><i class="fas fa-clock"></i><span>${evento.hora?.substring(0, 5) || "N/A"}</span></div>
                <div class="evento-meta-item"><i class="fas fa-map-marker-alt"></i><span>${evento.local || "Online"}</span></div>
                <div class="evento-meta-item"><i class="fas fa-tag"></i><span>${capitalize(evento.categoria)}</span></div>
            </div>
            <p class="evento-description">${evento.descricao || ""}</p>
            <div class="evento-actions">
                <button class="btn-evento btn-detalhes" onclick="verDetalhesEvento(${evento.id})">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                ${status === "CONFIRMADA" ? `<button class="btn-evento btn-cancelar-inscricao" onclick="cancelarInscricao(${inscricao.id}, ${evento.id})"><i class="fas fa-times-circle"></i> Cancelar Inscrição</button>` : ""}
            </div>
        </div>
    `;
    return div;
}

// -----------------------------
// HISTÓRICO DE EVENTOS (API + CERTIFICADO DINÂMICO)
// -----------------------------
async function carregarHistoricoEventos() {
    const loading = document.getElementById("historico-loading");
    const list = document.getElementById("historico-list");
    const empty = document.getElementById("historico-empty");

    if (loading) loading.style.display = "flex";
    if (list) list.style.display = "none";
    if (empty) empty.style.display = "none";

    try {
        const resp = await fetch(`${API_URL}/inscricoes/historico`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (!resp.ok) throw new Error(`Status ${resp.status}`);

        const historico = await resp.json();

        if (loading) loading.style.display = "none";

        if (!historico || historico.length === 0) {
            if (empty) {
                empty.style.display = "block";
                empty.querySelector("h3") && (empty.querySelector("h3").textContent = "Nenhum histórico disponível");
                empty.querySelector("p") && (empty.querySelector("p").textContent = "Você ainda não participou de nenhum evento finalizado.");
            }
            return;
        }

        if (list) {
            list.style.display = "flex";
            list.innerHTML = "";
            renderizarHistorico(historico);
        }
    } catch (err) {
        console.error("Erro carregarHistoricoEventos:", err);
        if (loading) loading.style.display = "none";
        if (empty) {
            empty.style.display = "block";
            empty.querySelector("h3") && (empty.querySelector("h3").textContent = "Erro ao carregar histórico");
        }
    }
}

function renderizarHistorico(historico) {
    const list = document.getElementById("historico-list");
    if (!list) return;
    list.innerHTML = "";

    historico.forEach((i) => {
        if (i.evento) list.appendChild(criarCardHistorico(i.evento, i));
    });
}

// ------------------------------------------------------------
// FUNÇÃO DO CARD DE HISTÓRICO (LINKS PARA CERTIFICADO.HTML)
// ------------------------------------------------------------
function criarCardHistorico(evento, inscricao) {
    const status = (inscricao && inscricao.status) ? inscricao.status.toUpperCase() : "CONCLUIDO";
    const statusClass = status.toLowerCase();

    // Tenta obter o nome do usuário da interface atual
    let nomeUsuario = "Participante";
    const inputNome = document.getElementById("profile-nome");
    const headerNome = document.getElementById("header-profile-name");

    if (inputNome && inputNome.value) nomeUsuario = inputNome.value;
    else if (headerNome && headerNome.textContent !== "Carregando...") nomeUsuario = headerNome.textContent;

    let acoesHtml = `
        <button class="btn-evento btn-detalhes" onclick="verDetalhesEvento(${evento.id})">
            <i class="fas fa-eye"></i> Ver Detalhes
        </button>
    `;

    // LÓGICA: Se CONCLUÍDO, gera o link para a página dinâmica HTML
    if (status === "CONCLUIDO") {
        // Monta a URL com Query Params
        const urlCertificado = `certificado.html?nome=${encodeURIComponent(nomeUsuario)}&evento=${encodeURIComponent(evento.nome)}&data=${encodeURIComponent(formatarData(evento.data))}`;

        acoesHtml += `
            <a href="${urlCertificado}" target="_blank" class="btn-evento btn-certificado">
                <i class="fas fa-certificate"></i> Ver Certificado
            </a>
        `;
    }

    const div = document.createElement("div");
    div.className = "evento-card";

    div.innerHTML = `
        <span class="evento-status ${statusClass}">${capitalize(status)}</span>
        <div class="evento-icon"><i class="${getIconeCategoria(evento.categoria)}"></i></div>
        <div class="evento-content">
            <h3>${evento.nome}</h3>
            <div class="evento-meta">
                <div class="evento-meta-item"><i class="fas fa-calendar-alt"></i><span>${formatarData(evento.data)}</span></div>
                <div class="evento-meta-item"><i class="fas fa-clock"></i><span>${evento.hora?.substring(0,5) || "N/A"}</span></div>
                <div class="evento-meta-item"><i class="fas fa-map-marker-alt"></i><span>${evento.local || "Online"}</span></div>
                <div class="evento-meta-item"><i class="fas fa-tag"></i><span>${capitalize(evento.categoria)}</span></div>
            </div>
            
            ${(status === "CONCLUIDO") ? `<div class="certificado-tag"><i class="fas fa-check-circle"></i> Certificado Disponível</div>` : ""}
            
            <p class="evento-description">${evento.descricao || ""}</p>
            <div class="evento-actions">${acoesHtml}</div>
        </div>
    `;

    return div;
}

// -----------------------------
// CANCELAR INSCRIÇÃO
// -----------------------------
async function cancelarInscricao(inscricaoId) {
    const confirmar = confirm("Deseja cancelar sua inscrição?");
    if (!confirmar) return;

    try {
        const resp = await fetch(`${API_URL}/inscricoes/${inscricaoId}/cancelar`, {
            method: "PUT",
            headers: { Authorization: "Bearer " + token },
        });

        if (!resp.ok) throw new Error("Falha ao cancelar inscrição.");

        // Recarregar ambas as listas
        carregarEventosInscritos();
        carregarHistoricoEventos();
    } catch (e) {
        console.error("Erro cancelarInscricao:", e);
        alert("Não foi possível cancelar a inscrição.");
    }
}

// -----------------------------
// UTILITÁRIOS
// -----------------------------
function getIconeCategoria(cat) {
    const c = {
        workshop: "fas fa-laptop-code",
        palestra: "fas fa-microphone-alt",
        hackathon: "fas fa-trophy",
        networking: "fas fa-users",
        treinamento: "fas fa-chalkboard-teacher",
        mentoria: "fas fa-user-tie",
        outro: "fas fa-calendar-day",
    };
    return c[cat?.toLowerCase()] || "fas fa-calendar-day";
}

function formatarData(data) {
    if (!data) return "";
    // aceita string "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm:..."
    const d = data.split("T")[0].split("-");
    if (d.length < 3) return data;
    return `${d[2]}/${d[1]}/${d[0]}`;
}

function capitalize(str) {
    if (!str) return "";
    str = String(str).toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function verDetalhesEvento(id) {
    window.location.href = `detalhes-evento.html?id=${id}`;
}

// -----------------------------
// FIM DO ARQUIVO
// -----------------------------