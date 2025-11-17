// ===============================================
// ARQUIVO: perfil.js (ATUALIZADO)
// ===============================================

// Variáveis globais esperadas:
// - API_URL
// - SERVER_URL
// - token

// -----------------------------
// CONFIGURAÇÕES INICIAIS
// -----------------------------
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
        carregarPerfilPublico(publicoUsuarioId);
        hideEditorControls();
    } else {
        carregarMeuPerfilParaEdicao();
        setupEditorControls();
    }
});

// -----------------------------
// AUX: esconder controles de edição
// -----------------------------
function hideEditorControls() {
    const saveBtn = document.getElementById("save-profile-btn");
    if (saveBtn) saveBtn.style.display = "none";

    const editIcon = document.querySelector(".edit-icon");
    if (editIcon) editIcon.style.display = "none";

    const addSkillForm = document.querySelector(".add-skill-form");
    if (addSkillForm) addSkillForm.style.display = "none";
}

// -----------------------------
// AUX: configurar controles de edição
// -----------------------------
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
// TABS
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
// CARREGAR PERFIL
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
        console.error(e);
        preencherDadosPerfil({ nomeCompleto: "Falha", titulo: "Erro", sobreMim: "N/A", habilidades: initialSkills }, true);
    }
}

async function carregarPerfilPublico(usuarioId) {
    try {
        const resp = await fetch(`${API_URL}/perfis/usuario/${usuarioId}`, {
            headers: { Authorization: "Bearer " + token },
        });
        if (!resp.ok) throw new Error("Erro");
        const perfil = await resp.json();
        preencherDadosPerfil(perfil, false);
    } catch (e) {
        console.error(e);
        alert("Erro ao carregar perfil.");
    }
}

function preencherDadosPerfil(perfil, modoEdicao) {
    const imgPreview = document.getElementById("main-profile-pic");
    if (imgPreview && perfil.fotoPerfilUrl) {
        imgPreview.src = (perfil.fotoPerfilUrl.startsWith("http") ? "" : SERVER_URL) + perfil.fotoPerfilUrl;
    }

    if (modoEdicao) {
        const nomeEl = document.getElementById("profile-nome");
        const tituloEl = document.getElementById("profile-titulo");
        const sobreEl = document.getElementById("profile-sobre");

        if (nomeEl) nomeEl.value = perfil.nomeCompleto || "";
        if (tituloEl) tituloEl.value = perfil.titulo || "";
        if (sobreEl) sobreEl.value = perfil.sobreMim || "";

        renderizarSkills(perfil.habilidades || [], true);
    } else {
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
// SALVAR / UPLOAD
// -----------------------------
async function salvarMeuPerfil(e) {
    e.preventDefault();
    const btn = e.target;
    if (btn) { btn.disabled = true; btn.textContent = "Salvando..."; }

    const dados = {
        nomeCompleto: document.getElementById("profile-nome").value,
        titulo: document.getElementById("profile-titulo").value,
        sobreMim: document.getElementById("profile-sobre").value,
        habilidades: getSkillsDaLista(),
    };

    try {
        const resp = await fetch(`${API_URL}/perfis/me`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
            body: JSON.stringify(dados),
        });
        if (!resp.ok) throw new Error("Erro");
        alert("Perfil salvo!");
    } catch (err) {
        alert("Erro ao salvar.");
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = "Salvar Alterações"; }
    }
}

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
        if (!resp.ok) throw new Error("Erro");
        const data = await resp.json();
        const img = document.getElementById("main-profile-pic");
        if (img) img.src = (data.novaUrl.startsWith("http") ? "" : SERVER_URL) + data.novaUrl + "?t=" + Date.now();
    } catch (err) {
        alert("Erro na foto.");
    } finally {
        if (btn) btn.innerHTML = '<i class="fas fa-camera"></i>';
    }
}

// -----------------------------
// SKILLS
// -----------------------------
function adicionarSkillDaCaixa() {
    const input = document.getElementById("skill-input");
    if (!input || !input.value.trim()) return;
    const list = document.getElementById("skills-list");
    list.appendChild(createSkillElement(input.value.trim(), true));
    input.value = "";
}

function createSkillElement(skillName, editavel) {
    const icon = skillIcons[skillName.toLowerCase()] || '<i class="fas fa-code" style="color:#00318f;"></i>';
    const div = document.createElement("div");
    div.classList.add("skill-item");
    div.innerHTML = `
        <div class="skill-pill">
            ${icon} <span>${skillName}</span>
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
// EVENTOS E HISTÓRICO
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
        if (!resp.ok) throw new Error("Erro");
        const inscricoes = await resp.json();
        
        if (loading) loading.style.display = "none";
        if (!inscricoes || inscricoes.length === 0) {
            if (empty) empty.style.display = "block";
            return;
        }
        if (list) {
            list.style.display = "flex";
            list.innerHTML = "";
            renderizarEventos(inscricoes);
        }
    } catch (err) {
        if (loading) loading.style.display = "none";
    }
}

function renderizarEventos(inscricoes) {
    const list = document.getElementById("eventos-list");
    if (!list) return;
    list.innerHTML = "";
    inscricoes.forEach((i) => { if (i.evento) list.appendChild(criarCardEvento(i.evento, i)); });
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
            </div>
            <p class="evento-description">${evento.descricao || ""}</p>
            <div class="evento-actions">
                <button class="btn-evento btn-detalhes" onclick="verDetalhesEvento(${evento.id})"><i class="fas fa-eye"></i> Ver Detalhes</button>
                ${status === "CONFIRMADA" ? `<button class="btn-evento btn-cancelar-inscricao" onclick="cancelarInscricao(${inscricao.id}, ${evento.id})"><i class="fas fa-times-circle"></i> Cancelar</button>` : ""}
            </div>
        </div>
    `;
    return div;
}

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
        if (!resp.ok) throw new Error("Erro");
        const historico = await resp.json();

        if (loading) loading.style.display = "none";
        if (!historico || historico.length === 0) {
            if (empty) empty.style.display = "block";
            return;
        }
        if (list) {
            list.style.display = "flex";
            list.innerHTML = "";
            renderizarHistorico(historico);
        }
    } catch (err) {
        if (loading) loading.style.display = "none";
    }
}

function renderizarHistorico(historico) {
    const list = document.getElementById("historico-list");
    if (!list) return;
    list.innerHTML = "";
    historico.forEach((i) => { if (i.evento) list.appendChild(criarCardHistorico(i.evento, i)); });
}

// ------------------------------------------
// FUNÇÃO ATUALIZADA: CARD DE HISTÓRICO
// ------------------------------------------
// ============================================================
// SUBSTITUA ESSA FUNÇÃO NO SEU ARQUIVO JS/PERFIL.JS
// ============================================================

function criarCardHistorico(evento, inscricao) {
    // Verifica status (se não tiver, assume concluído para teste)
    const status = (inscricao && inscricao.status) ? inscricao.status.toUpperCase() : "CONCLUIDO";
    const statusClass = status.toLowerCase();
    
    // -------------------------------------------------------
    // LÓGICA DO CERTIFICADO
    // -------------------------------------------------------
    let certificadoUrl = inscricao?.certificadoUrl;

    // MODO DE TESTE: Se concluído e sem URL, usa o PDF de exemplo da pasta assets
    if (status === "CONCLUIDO" && !certificadoUrl) {
        certificadoUrl = "assets/certificado_exemplo.pdf"; 
    }
    // -------------------------------------------------------

    let acoesHtml = `
        <button class="btn-evento btn-detalhes" onclick="verDetalhesEvento(${evento.id})">
            <i class="fas fa-eye"></i> Ver Detalhes
        </button>
    `;

    // Renderiza o botão se estiver concluído e tiver a URL
    if (status === "CONCLUIDO" && certificadoUrl) {
        const fullUrl = certificadoUrl.startsWith("http") 
            ? certificadoUrl 
            : (certificadoUrl.includes("assets") ? certificadoUrl : SERVER_URL + certificadoUrl);

        // AQUI FOI A ALTERAÇÃO DO NOME
        acoesHtml += `
            <a href="${fullUrl}" download="Certificado_${evento.nome}.pdf" target="_blank" class="btn-evento btn-certificado">
                <i class="fas fa-file-download"></i> Certificado Disponível
            </a>
        `;
    } else if (status === "CONCLUIDO") {
        // Botão cinza se estiver processando
        acoesHtml += `
            <button class="btn-evento btn-processando" title="Aguardando emissão">
                <i class="fas fa-clock"></i> Processando...
            </button>
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
            </div>
            
            <p class="evento-description">${evento.descricao || ""}</p>
            <div class="evento-actions">${acoesHtml}</div>
        </div>
    `;

    return div;
}

async function cancelarInscricao(inscricaoId) {
    if (!confirm("Cancelar inscrição?")) return;
    try {
        await fetch(`${API_URL}/inscricoes/${inscricaoId}/cancelar`, {
            method: "PUT", headers: { Authorization: "Bearer " + token },
        });
        carregarEventosInscritos();
        carregarHistoricoEventos();
    } catch (e) { alert("Erro ao cancelar."); }
}

// -----------------------------
// UTILITÁRIOS
// -----------------------------
function getIconeCategoria(cat) {
    const c = {
        workshop: "fas fa-laptop-code", palestra: "fas fa-microphone-alt",
        hackathon: "fas fa-trophy", networking: "fas fa-users",
        treinamento: "fas fa-chalkboard-teacher", mentoria: "fas fa-user-tie",
    };
    return c[cat?.toLowerCase()] || "fas fa-calendar-day";
}

function formatarData(data) {
    if (!data) return "";
    const d = data.split("T")[0].split("-");
    return (d.length < 3) ? data : `${d[2]}/${d[1]}/${d[0]}`;
}

function capitalize(str) {
    if (!str) return "";
    str = String(str).toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function verDetalhesEvento(id) {
    window.location.href = `detalhes-evento.html?id=${id}`;
}