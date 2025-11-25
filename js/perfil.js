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

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const publicoUsuarioId = urlParams.get("usuarioId");

    initializeTabs();
    setupContactButton();

    if (publicoUsuarioId) {
        carregarPerfilPublico(publicoUsuarioId);
        hideEditorControls();
    } else {
        carregarMeuPerfilParaEdicao();
        setupEditorControls();
    }
});

function setupContactButton() {
    const contactButton = document.getElementById("btn-contato");
    if (contactButton) {
        contactButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "den.html";
        });
    }
}

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
            if (e.target.classList.contains("delete-skill-btn") || e.target.parentElement?.classList.contains("delete-skill-btn")) {
                const skillItem = e.target.closest(".skill-item");
                if (skillItem) {
                    skillItem.classList.add("fade-out");
                    setTimeout(() => skillItem.remove(), 250);
                }
            }
        });
    }
}

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
                carregarEventosInscritos();
            } else if (targetTab === "historico") {
                carregarHistoricoEventos();
            }
        });
    });
}

async function carregarMeuPerfilParaEdicao() {
    try {
        const resp = await fetch(`${API_URL}/perfis/me`, { headers: { Authorization: "Bearer " + token } });
        if (!resp.ok) throw new Error("Erro");
        const perfil = await resp.json();
        preencherDadosPerfil(perfil, true);
    } catch (e) {
        preencherDadosPerfil({ nomeCompleto: "Erro", titulo: "Verifique conexão", sobreMim: "", habilidades: initialSkills }, true);
    }
}

async function carregarPerfilPublico(usuarioId) {
    try {
        const resp = await fetch(`${API_URL}/perfis/usuario/${usuarioId}`, { headers: { Authorization: "Bearer " + token } });
        if (!resp.ok) throw new Error("Erro");
        const perfil = await resp.json();
        preencherDadosPerfil(perfil, false);
    } catch (e) { alert("Erro ao carregar perfil."); }
}

function preencherDadosPerfil(perfil, modoEdicao) {
    const imgPreview = document.getElementById("main-profile-pic");
    if (imgPreview && perfil.fotoPerfilUrl) {
        imgPreview.src = (perfil.fotoPerfilUrl.startsWith("http") ? "" : SERVER_URL) + perfil.fotoPerfilUrl;
    }
    if (modoEdicao) {
        document.getElementById("profile-nome").value = perfil.nomeCompleto || "";
        document.getElementById("profile-titulo").value = perfil.titulo || "";
        document.getElementById("profile-sobre").value = perfil.sobreMim || "";
        renderizarSkills(perfil.habilidades || [], true);
    } else {
        const elNome = document.getElementById("profile-nome");
        if(elNome) elNome.replaceWith(criarElementoTexto("h1", perfil.nomeCompleto));
        
        const elTitulo = document.getElementById("profile-titulo");
        if(elTitulo) elTitulo.replaceWith(criarElementoTexto("h3", perfil.titulo));
        
        const elSobre = document.getElementById("profile-sobre");
        if(elSobre) elSobre.replaceWith(criarElementoTexto("p", perfil.sobreMim));
        
        renderizarSkills(perfil.habilidades || [], false);
    }
}

function criarElementoTexto(tag, texto) {
    const el = document.createElement(tag);
    el.textContent = texto || "";
    return el;
}

async function salvarMeuPerfil(e) {
    e.preventDefault();
    const btn = e.target;
    btn.disabled = true; btn.textContent = "Salvando...";
    const dados = {
        nomeCompleto: document.getElementById("profile-nome").value,
        titulo: document.getElementById("profile-titulo").value,
        sobreMim: document.getElementById("profile-sobre").value,
        habilidades: getSkillsDaLista(),
    };
    try {
        await fetch(`${API_URL}/perfis/me`, {
            method: "PUT", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
            body: JSON.stringify(dados),
        });
        alert("Perfil salvo!");
    } catch (err) { alert("Erro ao salvar."); } finally { btn.disabled = false; btn.textContent = "Salvar Alterações"; }
}

async function uploadMinhaFoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
        const resp = await fetch(`${API_URL}/perfis/foto`, {
            method: "POST", headers: { Authorization: "Bearer " + token }, body: formData,
        });
        const data = await resp.json();
        const img = document.getElementById("main-profile-pic");
        if (img) img.src = (data.novaUrl.startsWith("http") ? "" : SERVER_URL) + data.novaUrl + "?t=" + Date.now();
    } catch (err) { alert("Erro na foto."); }
}

function adicionarSkillDaCaixa() {
    const input = document.getElementById("skill-input");
    if (!input.value.trim()) return;
    document.getElementById("skills-list").appendChild(createSkillElement(input.value.trim(), true));
    input.value = "";
}

function createSkillElement(skillName, editavel) {
    const icon = skillIcons[skillName.toLowerCase()] || '<i class="fas fa-code" style="color:#00318f;"></i>';
    const div = document.createElement("div");
    div.classList.add("skill-item");
    div.innerHTML = `<div class="skill-pill">${icon}<span>${skillName}</span>${editavel ? `<button class="delete-skill-btn"><i class="fas fa-times"></i></button>` : ""}</div>`;
    return div;
}

function renderizarSkills(arr, editavel) {
    const list = document.getElementById("skills-list");
    list.innerHTML = "";
    let skillsArray = Array.isArray(arr) ? arr : (arr ? arr.split(",").map(s => s.trim()) : []);
    skillsArray.forEach((s) => list.appendChild(createSkillElement(s, editavel)));
}

function getSkillsDaLista() {
    return [...document.querySelectorAll("#skills-list span")].map((s) => s.textContent.trim());
}

async function carregarEventosInscritos() {
    const loading = document.getElementById("eventos-loading");
    const list = document.getElementById("eventos-list");
    const empty = document.getElementById("eventos-empty");

    loading.style.display = "flex";
    list.style.display = "none";
    empty.style.display = "none";

    try {
        const resp = await fetch(`${API_URL}/inscricoes/minhas-inscricoes`, {
            headers: { Authorization: "Bearer " + token },
        });
        const todasInscricoes = await resp.json();
        loading.style.display = "none";

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const eventosFuturos = todasInscricoes.filter(inscricao => {
            if (!inscricao.evento || !inscricao.evento.data) return false;
            const dataEvento = new Date(inscricao.evento.data);
            return dataEvento >= hoje && inscricao.status !== 'CANCELADA' && inscricao.status !== 'CONCLUIDA';
        });

        if (eventosFuturos.length === 0) {
            empty.style.display = "block";
            return;
        }

        list.style.display = "flex";
        list.innerHTML = "";
        eventosFuturos.forEach((i) => list.appendChild(criarCardEvento(i.evento, i)));
    } catch (err) {
        loading.style.display = "none";
    }
}

function criarCardEvento(evento, inscricao) {
    const status = (inscricao.status || "PENDENTE").toUpperCase();
    const div = document.createElement("div");
    div.className = "evento-card";
    div.innerHTML = `
        <span class="evento-status ${status.toLowerCase()}">${capitalize(status)}</span>
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
                <button class="btn-evento btn-cancelar-inscricao" onclick="cancelarInscricao(${inscricao.id})"><i class="fas fa-times-circle"></i> Cancelar</button>
            </div>
        </div>
    `;
    return div;
}

async function carregarHistoricoEventos() {
    const loading = document.getElementById("historico-loading");
    const list = document.getElementById("historico-list");
    const empty = document.getElementById("historico-empty");

    loading.style.display = "flex";
    list.style.display = "none";
    empty.style.display = "none";

    try {
        const [respHist, respAtivas] = await Promise.all([
            fetch(`${API_URL}/inscricoes/historico`, { headers: { Authorization: "Bearer " + token } }),
            fetch(`${API_URL}/inscricoes/minhas-inscricoes`, { headers: { Authorization: "Bearer " + token } })
        ]);

        let lista = [];
        if(respHist.ok) lista = [...lista, ...await respHist.json()];
        if(respAtivas.ok) lista = [...lista, ...await respAtivas.json()];

        loading.style.display = "none";

        const unicos = Array.from(new Map(lista.map(item => [item.id, item])).values());
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const historico = unicos.filter(inscricao => {
            if (!inscricao.evento || !inscricao.evento.data) return false;
            const dataEvento = new Date(inscricao.evento.data);
            return dataEvento < hoje || inscricao.status === 'CONCLUIDA' || inscricao.status === 'CANCELADA';
        });

        if (historico.length === 0) {
            empty.style.display = "block";
            return;
        }

        list.style.display = "flex";
        list.innerHTML = "";
        historico.forEach((i) => list.appendChild(criarCardHistorico(i.evento, i)));
    } catch (err) {
        loading.style.display = "none";
    }
}

function criarCardHistorico(evento, inscricao) {
    let status = (inscricao.status || "CONCLUIDO").toUpperCase();
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const dataEvento = new Date(evento.data);

    if(dataEvento < hoje && status !== 'CANCELADA') status = 'CONCLUIDO';

    let nomeUsuario = document.getElementById("profile-nome")?.value || "Participante";
    let acoesHtml = `<button class="btn-evento btn-detalhes" onclick="verDetalhesEvento(${evento.id})"><i class="fas fa-eye"></i> Ver Detalhes</button>`;

    if (status === 'CONCLUIDO' || status === 'CONCLUIDA') {
        const urlCertificado = `certificado.html?nome=${encodeURIComponent(nomeUsuario)}&evento=${encodeURIComponent(evento.nome)}&data=${encodeURIComponent(formatarData(evento.data))}`;
        acoesHtml += `<a href="${urlCertificado}" target="_blank" class="btn-evento btn-certificado"><i class="fas fa-certificate"></i> Ver Certificado</a>`;
    }

    const div = document.createElement("div");
    div.className = "evento-card";
    div.style.opacity = "0.95";
    div.innerHTML = `
        <span class="evento-status ${status.toLowerCase()}">${capitalize(status)}</span>
        <div class="evento-icon"><i class="${getIconeCategoria(evento.categoria)}"></i></div>
        <div class="evento-content">
            <h3>${evento.nome}</h3>
            <div class="evento-meta">
                <div class="evento-meta-item"><i class="fas fa-calendar-alt"></i><span>${formatarData(evento.data)}</span></div>
            </div>
            ${(status === 'CONCLUIDO' || status === 'CONCLUIDA') ? `<div class="certificado-tag"><i class="fas fa-check-circle"></i> Finalizado</div>` : ""}
            <div class="evento-actions">${acoesHtml}</div>
        </div>
    `;
    return div;
}

async function cancelarInscricao(inscricaoId) {
    if (!confirm("Deseja cancelar?")) return;
    try {
        await fetch(`${API_URL}/inscricoes/${inscricaoId}/cancelar`, {
            method: "PUT", headers: { Authorization: "Bearer " + token },
        });
        carregarEventosInscritos();
        carregarHistoricoEventos();
    } catch (e) { alert("Erro ao cancelar."); }
}

function getIconeCategoria(cat) {
    const c = { workshop: "fas fa-laptop-code", palestra: "fas fa-microphone-alt", hackathon: "fas fa-trophy", networking: "fas fa-users" };
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