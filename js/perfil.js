// ===============================================
// ARQUIVO: perfil.js - VERSÃO COMPLETA
// ===============================================

// ID do usuário (não usado mais)
const USUARIO_ID = 1;

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

const initialSkills = ["React", "Next.js", "JavaScript", "Python"];

// ===============================================
// DADOS MOCKADOS PARA HISTÓRICO
// ===============================================
const HISTORICO_MOCK = [
    {
        id: 1,
        evento: {
            id: 1,
            nome: "Workshop de React Avançado",
            descricao: "Workshop completo sobre React Hooks, Context API e otimização de performance para aplicações enterprise.",
            data: "2024-10-15",
            hora: "14:00:00",
            local: "Auditório Principal - Liferay HQ",
            categoria: "workshop"
        },
        status: "CONCLUIDO",
        certificadoDisponivel: true,
        dataInscricao: "2024-10-01T10:30:00"
    },
    {
        id: 2,
        evento: {
            id: 2,
            nome: "Palestra: DevOps na Prática",
            descricao: "Apresentação sobre melhores práticas de DevOps, CI/CD e automação em projetos modernos de software.",
            data: "2024-09-20",
            hora: "10:00:00",
            local: "Online - Zoom",
            categoria: "palestra"
        },
        status: "CONCLUIDO",
        certificadoDisponivel: false,
        dataInscricao: "2024-09-10T14:20:00"
    },
    {
        id: 3,
        evento: {
            id: 3,
            nome: "Hackathon Liferay 2024",
            descricao: "Competição de 24 horas para desenvolver soluções inovadoras usando Liferay DXP e tecnologias modernas.",
            data: "2024-08-10",
            hora: "09:00:00",
            local: "Campus Liferay - São Paulo",
            categoria: "hackathon"
        },
        status: "CANCELADO",
        certificadoDisponivel: false,
        dataInscricao: "2024-07-25T16:45:00"
    },
    {
        id: 4,
        evento: {
            id: 4,
            nome: "Mentoria em Arquitetura de Software",
            descricao: "Sessão de mentoria sobre design patterns, SOLID principles e arquitetura limpa em sistemas distribuídos.",
            data: "2024-07-15",
            hora: "15:30:00",
            local: "Sala de Reuniões 3",
            categoria: "mentoria"
        },
        status: "CONCLUIDO",
        certificadoDisponivel: true,
        dataInscricao: "2024-07-01T09:15:00"
    },
    {
        id: 5,
        evento: {
            id: 5,
            nome: "Treinamento: Spring Boot Essentials",
            descricao: "Curso intensivo de 3 dias sobre desenvolvimento de APIs REST com Spring Boot, Spring Security e JPA.",
            data: "2024-06-05",
            hora: "09:00:00",
            local: "Laboratório de Informática",
            categoria: "treinamento"
        },
        status: "CONCLUIDO",
        certificadoDisponivel: true,
        dataInscricao: "2024-05-20T11:00:00"
    }
];

// ===============================================
// FUNÇÕES DE VALIDAÇÃO DO HISTÓRICO
// ===============================================

/**
 * Valida se o evento já passou (data < hoje)
 * Critério 2: Só mostrar eventos que já aconteceram
 */
function eventoJaAconteceu(dataEvento) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const dataEventoObj = new Date(dataEvento);
    dataEventoObj.setHours(0, 0, 0, 0);
    
    return dataEventoObj < hoje;
}

/**
 * Valida se o status do evento é válido para histórico
 * Critério 2: Apenas eventos CONCLUIDO ou CANCELADO (sem no-show)
 */
function statusValidoParaHistorico(status) {
    const statusValidos = ['CONCLUIDO', 'CANCELADO'];
    return statusValidos.includes(status.toUpperCase());
}

/**
 * Valida se a inscrição é válida para aparecer no histórico
 * Aplica TODOS os critérios de validação
 */
function validarInscricaoParaHistorico(inscricao) {
    // Verifica se tem estrutura mínima
    if (!inscricao || !inscricao.evento) {
        console.warn('Inscrição inválida: estrutura incompleta', inscricao);
        return false;
    }
    
    // Critério 2: Evento deve ter acontecido
    if (!eventoJaAconteceu(inscricao.evento.data)) {
        console.log('Evento ainda não aconteceu:', inscricao.evento.nome);
        return false;
    }
    
    // Critério 2: Status deve ser válido (sem no-show)
    if (!statusValidoParaHistorico(inscricao.status)) {
        console.log('Status inválido para histórico:', inscricao.status);
        return false;
    }
    
    return true;
}

/**
 * Filtra e valida todas as inscrições do histórico
 */
function filtrarHistoricoValido(inscricoes) {
    return inscricoes.filter(inscricao => validarInscricaoParaHistorico(inscricao));
}

/**
 * Ordena histórico por data (mais recente primeiro)
 * Critério 3: Ordenação por data
 */
function ordenarHistoricoPorData(inscricoes) {
    return inscricoes.sort((a, b) => {
        const dataA = new Date(a.evento.data);
        const dataB = new Date(b.evento.data);
        return dataB - dataA; // Decrescente (mais recente primeiro)
    });
}

// ===============================================
// INICIALIZAÇÃO
// ===============================================
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get("usuarioId");

    initializeTabs();

    if (usuarioId) {
        carregarPerfilPublico(usuarioId);

        const saveBtn = document.getElementById("save-profile-btn");
        if (saveBtn) saveBtn.style.display = "none";

        const editIcon = document.querySelector(".edit-icon");
        if (editIcon) editIcon.style.display = "none";

        const addSkillForm = document.querySelector(".add-skill-form");
        if (addSkillForm) addSkillForm.style.display = "none";

    } else {
        carregarMeuPerfilParaEdicao();

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
});

// ===============================================
// TABS COM CONTROLE DE VISIBILIDADE
// ===============================================
function initializeTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const aboutSection = document.querySelector(".about-section");

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            tabBtns.forEach((b) => b.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(`tab-${targetTab}`).classList.add("active");

            // Controla visibilidade do "Sobre mim"
            if (aboutSection) {
                if (targetTab === "habilidades") {
                    aboutSection.style.display = "block";
                } else {
                    aboutSection.style.display = "none";
                }
            }

            // Carrega dados das abas
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

    // Garante que "Sobre mim" está visível no início
    if (aboutSection) {
        aboutSection.style.display = "block";
    }
}

// ===============================================
// CARREGAR PERFIL
// ===============================================
async function carregarMeuPerfilParaEdicao() {
    try {
        const resp = await fetch(`${API_URL}/perfis/me`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (!resp.ok) throw new Error();

        const perfil = await resp.json();
        preencherDadosPerfil(perfil, true);

    } catch {
        preencherDadosPerfil(
            {
                nomeCompleto: "Falha ao carregar",
                titulo: "Erro",
                sobreMim: "Não foi possível carregar.",
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

        if (!resp.ok) throw new Error();

        preencherDadosPerfil(await resp.json(), false);

    } catch {
        alert("Erro ao carregar o perfil do usuário.");
    }
}

function preencherDadosPerfil(perfil, modoEdicao) {
    const imgPreview = document.getElementById("main-profile-pic");
    if (imgPreview && perfil.fotoPerfilUrl) {
        imgPreview.src = SERVER_URL + perfil.fotoPerfilUrl;
    }

    if (modoEdicao) {
        document.getElementById("profile-nome").value = perfil.nomeCompleto || "";
        document.getElementById("profile-titulo").value = perfil.titulo || "";
        document.getElementById("profile-sobre").value = perfil.sobreMim || "";

        renderizarSkills(perfil.habilidades || [], true);

    } else {
        document.getElementById("profile-nome").replaceWith(criarElementoTexto("h1", perfil.nomeCompleto));
        document.getElementById("profile-titulo").replaceWith(criarElementoTexto("h3", perfil.titulo));
        document.getElementById("profile-sobre").replaceWith(criarElementoTexto("p", perfil.sobreMim));

        renderizarSkills(perfil.habilidades || [], false);
    }
}

function criarElementoTexto(tag, texto) {
    const el = document.createElement(tag);
    el.textContent = texto || "";
    return el;
}

// ===============================================
// SALVAR PERFIL
// ===============================================
async function salvarMeuPerfil(e) {
    e.preventDefault();

    const btn = e.target;
    btn.disabled = true;
    btn.textContent = "Salvando...";

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

        if (!resp.ok) throw new Error();
        alert("Perfil salvo!");

        if (typeof carregarDadosUsuario === "function") carregarDadosUsuario();

    } finally {
        btn.disabled = false;
        btn.textContent = "Salvar Alterações";
    }
}

// ===============================================
// FOTO
// ===============================================
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

        if (!resp.ok) throw new Error();

        const data = await resp.json();
        document.getElementById("main-profile-pic").src =
            SERVER_URL + data.novaUrl + "?t=" + Date.now();

        if (typeof carregarDadosUsuario === "function") carregarDadosUsuario();

    } finally {
        if (btn) btn.innerHTML = '<i class="fas fa-camera"></i>';
    }
}

// ===============================================
// SKILLS
// ===============================================
function adicionarSkillDaCaixa() {
    const input = document.getElementById("skill-input");
    if (!input.value.trim()) return;

    const list = document.getElementById("skills-list");
    const el = createSkillElement(input.value, true);

    list.appendChild(el);
    input.value = "";
}

function createSkillElement(skillName, editavel) {
    const icon =
        skillIcons[skillName.toLowerCase()] ||
        '<i class="fas fa-code" style="color:#00318f;"></i>';

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
    list.innerHTML = "";

    arr.forEach((s) => list.appendChild(createSkillElement(s, editavel)));
}

function getSkillsDaLista() {
    return [...document.querySelectorAll("#skills-list span")].map((s) =>
        s.textContent.trim()
    );
}

// ===============================================
// EVENTOS INSCRITOS
// ===============================================
async function carregarEventosInscritos() {
    const loading = document.getElementById("eventos-loading");
    const list = document.getElementById("eventos-list");
    const empty = document.getElementById("eventos-empty");

    loading.style.display = "flex";
    list.style.display = "none";
    empty.style.display = "none";

    try {
        const resp = await fetch(`${API_URL}/perfis/minhas-inscricoes`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (!resp.ok) throw new Error();

        const inscricoes = await resp.json();
        loading.style.display = "none";

        if (inscricoes.length === 0) {
            empty.style.display = "block";
            empty.querySelector("h3").textContent = "Nenhuma inscrição";
            empty.querySelector("p").textContent =
                "Você ainda não se inscreveu em nenhum evento.";
            return;
        }

        list.style.display = "flex";
        renderizarEventos(inscricoes);

    } catch {
        loading.style.display = "none";
        empty.style.display = "block";
        empty.querySelector("h3").textContent = "Erro ao carregar eventos";
        empty.querySelector("p").textContent = "Tente novamente mais tarde.";
    }
}

function renderizarEventos(inscricoes) {
    const list = document.getElementById("eventos-list");
    list.innerHTML = "";

    inscricoes.forEach((i) => {
        if (i.evento) list.appendChild(criarCardEvento(i.evento, i));
    });
}

function criarCardEvento(evento, inscricao) {
    const status = inscricao.status || "PENDENTE";
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
            <p class="evento-description">${evento.descricao}</p>
            <div class="evento-actions">
                <button class="btn-evento btn-detalhes" onclick="verDetalhesEvento(${evento.id})">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                ${
                    status === "CONFIRMADA"
                        ? `<button class="btn-evento btn-cancelar-inscricao" onclick="cancelarInscricao(${inscricao.id}, ${evento.id})">
                        <i class="fas fa-times-circle"></i> Cancelar Inscrição
                    </button>`
                        : ""
                }
            </div>
        </div>
    `;

    return div;
}

// ===============================================
// HISTÓRICO DE EVENTOS (COM VALIDAÇÃO)
// ===============================================

/**
 * Carrega o histórico de eventos do usuário
 * Aplica TODAS as validações e critérios
 */
async function carregarHistoricoEventos() {
    const loading = document.getElementById("historico-loading");
    const list = document.getElementById("historico-list");
    const empty = document.getElementById("historico-empty");

    loading.style.display = "flex";
    list.style.display = "none";
    empty.style.display = "none";

    try {
        // MODO MOCK: Usar dados locais
        // Quando o backend estiver pronto, descomente a linha abaixo:
        /*
        const resp = await fetch(`${API_URL}/perfis/historico-eventos`, {
            headers: { Authorization: "Bearer " + token },
        });
        if (!resp.ok) throw new Error();
        const historico = await resp.json();
        */
        
        // USANDO DADOS MOCK (remover quando backend estiver pronto)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        const historico = HISTORICO_MOCK;
        
        loading.style.display = "none";

        // VALIDAÇÃO: Filtrar apenas inscrições válidas (Critério 2)
        const historicoValido = filtrarHistoricoValido(historico);
        
        console.log('Total de inscrições:', historico.length);
        console.log('Inscrições válidas após filtro:', historicoValido.length);

        if (historicoValido.length === 0) {
            empty.style.display = "block";
            return;
        }

        // ORDENAÇÃO: Por data (Critério 3)
        const historicoOrdenado = ordenarHistoricoPorData(historicoValido);

        list.style.display = "flex";
        renderizarHistorico(historicoOrdenado);

    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        loading.style.display = "none";
        empty.style.display = "block";
        empty.querySelector("h3").textContent = "Erro ao carregar histórico";
        empty.querySelector("p").textContent = "Tente novamente mais tarde.";
    }
}

function renderizarHistorico(historico) {
    const list = document.getElementById("historico-list");
    list.innerHTML = "";

    historico.forEach((item) => {
        if (item.evento) {
            list.appendChild(criarCardHistorico(item.evento, item));
        }
    });
}

/**
 * Cria card de histórico
 * Critério 4: Mostra título, data/horário, status e certificado
 */
function criarCardHistorico(evento, inscricao) {
    const status = inscricao.status || "CONCLUIDO";
    const certificadoDisponivel = inscricao.certificadoDisponivel || false;
    
    const div = document.createElement("div");
    div.className = "evento-card historico-card";

    div.innerHTML = `
        <span class="evento-status ${status.toLowerCase()}">${capitalize(status)}</span>
        <div class="evento-icon"><i class="${getIconeCategoria(evento.categoria)}"></i></div>
        <div class="evento-content">
            <h3>${evento.nome}</h3>
            <div class="evento-meta">
                <div class="evento-meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatarData(evento.data)}</span>
                </div>
                <div class="evento-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${evento.hora?.substring(0, 5) || "N/A"}</span>
                </div>
                <div class="evento-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${evento.local || "Online"}</span>
                </div>
                <div class="evento-meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${capitalize(evento.categoria)}</span>
                </div>
            </div>
            <p class="evento-description">${evento.descricao}</p>
            
            ${certificadoDisponivel ? `
                <div class="certificado-info">
                    <i class="fas fa-certificate"></i>
                    <span>Certificado disponível</span>
                </div>
            ` : ''}
            
            <div class="evento-actions">
                <button class="btn-evento btn-detalhes" onclick="verDetalhesEvento(${evento.id})">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                ${certificadoDisponivel ? `
                    <button class="btn-evento btn-download-certificado" onclick="baixarCertificado(${inscricao.id})">
                        <i class="fas fa-download"></i> Baixar Certificado
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    return div;
}

/**
 * Simula download de certificado
 * Quando o backend estiver pronto, fazer requisição real
 */
async function baixarCertificado(inscricaoId) {
    try {
        // MODO MOCK: Simula download
        alert(`Download do certificado da inscrição #${inscricaoId} iniciado!\n\nQuando o backend estiver pronto, o PDF será baixado automaticamente.`);
        
        // BACKEND (descomente quando estiver pronto):
        /*
        const resp = await fetch(`${API_URL}/inscricoes/${inscricaoId}/certificado`, {
            headers: { Authorization: "Bearer " + token },
        });

        if (!resp.ok) throw new Error();

        const blob = await resp.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificado_${inscricaoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        */

    } catch (error) {
        console.error('Erro ao baixar certificado:', error);
        alert("Erro ao baixar certificado. Tente novamente.");
    }
}

// ===============================================
// FUNÇÕES AUXILIARES
// ===============================================

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
    const p = data.split("-");
    return `${p[2]}/${p[1]}/${p[0]}`;
}

function capitalize(str) {
    if (!str) return "";
    str = str.toLowerCase();
    return str[0].toUpperCase() + str.slice(1);
}

function verDetalhesEvento(id) {
    window.location.href = `detalhes-evento.html?id=${id}`;
}

async function cancelarInscricao(inscricaoId) {
    const confirmar = confirm("Deseja cancelar sua inscrição?");
    if (!confirmar) return;

    await fetch(`${API_URL}/inscricoes/${inscricaoId}/cancelar`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
    });

    carregarEventosInscritos();
}