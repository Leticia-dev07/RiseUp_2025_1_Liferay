// ===============================================
// ARQUIVO: perfil.js
// ===============================================

// As constantes API_URL, SERVER_URL e token são carregadas pelo global.js
// NÃO É MAIS NECESSÁRIO DECLARÁ-LAS AQUI.

// ID do usuário (NECESSÁRIO PARA A ABA DE EVENTOS)
// TODO: Substituir por um ID dinâmico ou endpoint /me/inscricoes
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

// Dados mocados para fallback
const initialSkills = ["React", "Next.js", "JavaScript", "Python"];

// ===============================================
// INICIALIZAÇÃO DA PÁGINA
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('usuarioId');

    initializeTabs();

    if (usuarioId) {
        // Modo de visualização pública
        carregarPerfilPublico(usuarioId);
        
        // Esconde elementos de edição
        const saveBtn = document.getElementById('save-profile-btn');
        if (saveBtn) saveBtn.style.display = 'none';
        
        const editIcon = document.querySelector('.edit-icon');
        if (editIcon) editIcon.style.display = 'none';
        
        const addSkillForm = document.querySelector('.add-skill-form');
        if (addSkillForm) addSkillForm.style.display = 'none';
        
    } else {
        // Modo de edição (meu perfil)
        carregarMeuPerfilParaEdicao();
        
        // Ativa os botões de edição
        
        // NOTA: Você não tem um botão "Salvar" no seu HTML.
        // Se você adicionar um <button id="save-profile-btn">...</button>
        // este código irá funcionar:
        const saveBtn = document.getElementById('save-profile-btn'); 
        if (saveBtn) {
            saveBtn.addEventListener('click', salvarMeuPerfil);
        }
        
        const fileUpload = document.getElementById('file-upload');
        if (fileUpload) {
            fileUpload.addEventListener('change', uploadMinhaFoto);
        }
        
        const addSkillBtn = document.getElementById('add-skill-btn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', adicionarSkillDaCaixa);
        }
        
        const skillInput = document.getElementById('skill-input');
        if (skillInput) {
            skillInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarSkillDaCaixa();
                }
            });
        }
        
        // Event listener para deletar skill (só no modo edição)
        const skillsList = document.getElementById('skills-list');
        if (skillsList) {
            skillsList.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-skill-btn') || 
                    e.target.parentElement.classList.contains('delete-skill-btn')) {
                    const skillItem = e.target.closest('.skill-item');
                    if (skillItem) {
                        skillItem.classList.add('fade-out');
                        setTimeout(() => skillItem.remove(), 250);
                    }
                }
            });
        }
    }
});

// ===============================================
// LÓGICA DAS ABAS
// ===============================================
function initializeTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            tabBtns.forEach((b) => b.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            btn.classList.add("active");
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add("active");
            }

            // Carrega eventos SÓ QUANDO a aba é clicada pela primeira vez
            if (targetTab === "eventos") {
                const eventosList = document.getElementById("eventos-list");
                if (eventosList && eventosList.children.length === 0 && eventosList.style.display === 'none') {
                    carregarEventosInscritos();
                }
            }
        });
    });
}

// ===============================================
// FUNÇÕES DE PERFIL (CARREGAR E PREENCHER)
// ===============================================
async function carregarMeuPerfilParaEdicao() {
    try {
        // `token` e `API_URL` vêm do global.js
        const response = await fetch(`${API_URL}/perfis/me`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) throw new Error('Falha ao carregar seu perfil para edição');

        const perfil = await response.json();
        preencherDadosPerfil(perfil, true); // true = modoEdicao

    } catch (error) {
        console.error('Erro ao carregar seu perfil (perfil.js):', error);
        // Fallback se a API falhar (mostra dados mocados)
        preencherDadosPerfil({
            nomeCompleto: "Meu Nome (Falha na API)",
            titulo: "Meu Título (Falha na API)",
            sobreMim: "Não foi possível carregar o 'sobre mim'.",
            habilidades: initialSkills
        }, true);
    }
}

async function carregarPerfilPublico(usuarioId) {
    try {
        const response = await fetch(`${API_URL}/perfis/usuario/${usuarioId}`, {
            headers: { 'Authorization': 'Bearer ' + token } // Token ainda é necessário
        });
        if (!response.ok) throw new Error('Falha ao carregar perfil do usuário');

        const perfil = await response.json();
        preencherDadosPerfil(perfil, false); // false = modoEdicao

    } catch (error) {
        console.error('Erro ao carregar perfil público:', error);
        alert('Não foi possível carregar o perfil deste usuário.');
    }
}

function preencherDadosPerfil(perfil, modoEdicao) {
    const imgPreview = document.getElementById('main-profile-pic');
    if (imgPreview && perfil.fotoPerfilUrl) {
        imgPreview.src = SERVER_URL + perfil.fotoPerfilUrl;
    }

    if (modoEdicao) {
        // Preenche os <input> e <textarea>
        const nomeInput = document.getElementById('profile-nome');
        const tituloInput = document.getElementById('profile-titulo');
        const sobreTextarea = document.getElementById('profile-sobre');
        
        if (nomeInput) nomeInput.value = perfil.nomeCompleto || '';
        if (tituloInput) tituloInput.value = perfil.titulo || '';
        if (sobreTextarea) sobreTextarea.value = perfil.sobreMim || '';
        
        renderizarSkills(perfil.habilidades || [], true); // Renderiza com 'X' de deletar
    } else {
        // Modo visualização: Substitui <input> por texto
        const nomeInput = document.getElementById('profile-nome');
        const tituloInput = document.getElementById('profile-titulo');
        const sobreTextarea = document.getElementById('profile-sobre');
        
        if (nomeInput) {
            nomeInput.replaceWith(criarElementoTexto('h1', perfil.nomeCompleto || 'Usuário', 'profile-nome-texto'));
        }
        if (tituloInput) {
            tituloInput.replaceWith(criarElementoTexto('h3', perfil.titulo || 'Colaborador', 'profile-titulo-texto'));
        }
        if (sobreTextarea) {
            sobreTextarea.replaceWith(criarElementoTexto('p', perfil.sobreMim || 'Sem descrição.', 'profile-sobre-texto'));
        }
        
        renderizarSkills(perfil.habilidades || [], false); // Renderiza sem 'X'
    }
}

function criarElementoTexto(tag, texto, id) {
    const el = document.createElement(tag);
    el.id = id;
    el.textContent = texto;
    if (tag === 'h1') el.classList.add('profile-nome-texto');
    if (tag === 'h3') el.classList.add('profile-titulo-texto');
    return el;
}

// ===============================================
// FUNÇÕES DE PERFIL (SALVAR E UPLOAD)
// ===============================================
async function salvarMeuPerfil(event) {
    event.preventDefault(); 
    const btnSalvar = event.target; 
    
    btnSalvar.disabled = true;
    btnSalvar.textContent = 'Salvando...';

    const dadosAtualizados = {
        nomeCompleto: document.getElementById('profile-nome')?.value || '',
        titulo: document.getElementById('profile-titulo')?.value || '',
        sobreMim: document.getElementById('profile-sobre')?.value || '',
        habilidades: getSkillsDaLista(), 
    };

    try {
        const response = await fetch(`${API_URL}/perfis/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(dadosAtualizados)
        });
        if (!response.ok) throw new Error('Falha ao salvar. Tente novamente.');
        alert('Perfil salvo com sucesso!');
        
        // Atualiza o header (se a função global existir)
        if (typeof carregarDadosUsuario === 'function') {
            carregarDadosUsuario();
        }
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        alert(error.message);
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = 'Salvar Alterações';
    }
}

async function uploadMinhaFoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const btnLabel = document.querySelector('.edit-icon');
    if (btnLabel) {
        btnLabel.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; 
    }

    try {
        const response = await fetch(`${API_URL}/perfis/foto`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });
        if (!response.ok) throw new Error((await response.json()).erro || 'Falha no upload.');

        const resultado = await response.json();
        
        // 1. Atualiza a foto principal da página
        const imgPreview = document.getElementById('main-profile-pic');
        if (imgPreview) {
            imgPreview.src = SERVER_URL + resultado.novaUrl + '?t=' + new Date().getTime();
        }
        
        // 2. SINCRONIZA: Chama a função do global.js para atualizar o header
        if (typeof carregarDadosUsuario === 'function') {
            carregarDadosUsuario();
        }
    } catch (error) {
        console.error('Erro no upload da foto:', error);
        alert(error.message);
    } finally {
        if (btnLabel) {
            btnLabel.innerHTML = '<i class="fas fa-camera"></i>';
        }
    }
}

// ===============================================
// FUNÇÕES DE HABILIDADES (SKILLS)
// ===============================================
function adicionarSkillDaCaixa() {
    const input = document.getElementById('skill-input');
    if (!input) return;
    
    const skillName = input.value.trim();
    if (skillName) {
        const skillElement = createSkillElement(skillName, true); 
        const skillsList = document.getElementById('skills-list');
        if (skillsList) {
            skillElement.classList.add('fade-in');
            skillsList.appendChild(skillElement);
        }
        input.value = '';
    }
}

function createSkillElement(skillName, editavel) {
    const skillKey = skillName.toLowerCase();
    const iconHTML = skillIcons[skillKey] || '<i class="fas fa-code" style="color:#00318f;"></i>';

    const skillItem = document.createElement("div");
    skillItem.classList.add("skill-item");
    
    const deleteButtonHTML = editavel 
        ? '<button class="delete-skill-btn" title="Remover"><i class="fas fa-times"></i></button>' 
        : '';

    skillItem.innerHTML = `
        <div class="skill-pill">
            ${iconHTML}
            <span>${skillName}</span>
            ${deleteButtonHTML}
        </div>
    `;
    return skillItem;
}

function renderizarSkills(habilidadesArray, editavel) {
    const list = document.getElementById('skills-list');
    if (!list) return;
    
    list.innerHTML = ''; 

    let skillsParaRenderizar = [];

    if (Array.isArray(habilidadesArray)) {
        skillsParaRenderizar = habilidadesArray.filter(s => s && s.trim() !== '');
    } else if (typeof habilidadesArray === 'string' && habilidadesArray) {
        skillsParaRenderizar = habilidadesArray.split(',').filter(s => s.trim() !== '');
    }

    skillsParaRenderizar.forEach(skillName => {
        const skillElement = createSkillElement(skillName.trim(), editavel);
        list.appendChild(skillElement);
    });
}

function getSkillsDaLista() {
    const skillsList = document.querySelectorAll('#skills-list .skill-pill span');
    const skillsArray = Array.from(skillsList).map(span => span.textContent.trim());
    return skillsArray;
}

// ===============================================
// FUNÇÕES DE EVENTOS (ABA "MINHAS INSCRIÇÕES")
// ===============================================
async function carregarEventosInscritos() {
    const loadingEl = document.getElementById("eventos-loading");
    const listEl = document.getElementById("eventos-list");
    const emptyEl = document.getElementById("eventos-empty");

    if (!loadingEl || !listEl || !emptyEl) return;

    loadingEl.style.display = "flex";
    listEl.style.display = "none";
    emptyEl.style.display = "none";

    try {
        const response = await fetch(`${API_URL}/usuarios/${USUARIO_ID}/inscricoes`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar eventos");
        }

        const inscricoes = await response.json();
        loadingEl.style.display = "none";

        if (inscricoes.length === 0) {
            emptyEl.style.display = "block";
        } else {
            listEl.style.display = "flex";
            renderizarEventos(inscricoes);
        }
    } catch (erro) {
        console.error("Erro ao carregar eventos:", erro);
        loadingEl.style.display = "none";
        emptyEl.style.display = "block";

        const emptyTitle = emptyEl.querySelector("h3");
        const emptyText = emptyEl.querySelector("p");
        if (emptyTitle) emptyTitle.textContent = "Erro ao carregar eventos";
        if (emptyText) emptyText.textContent = "Não foi possível carregar seus eventos. Tente novamente mais tarde.";
    }
}

function renderizarEventos(inscricoes) {
    const listEl = document.getElementById("eventos-list");
    if (!listEl) return;
    
    listEl.innerHTML = "";

    inscricoes.forEach((inscricao) => {
        const evento = inscricao.evento;
        const card = criarCardEvento(evento, inscricao);
        listEl.appendChild(card);
    });
}

function criarCardEvento(evento, inscricao) {
    const card = document.createElement("div");
    card.className = "evento-card";

    const iconeCategoria = getIconeCategoria(evento.categoria);
    const statusClass = inscricao.status.toLowerCase();
    const statusTexto = inscricao.status === "CONFIRMADA" ? "Confirmado" : inscricao.status;

    card.innerHTML = `
        <span class="evento-status ${statusClass}">${statusTexto}</span>
        <div class="evento-icon"><i class="${iconeCategoria}"></i></div>
        <div class="evento-content">
            <h3>${evento.nome}</h3>
            <div class="evento-meta">
                <div class="evento-meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatarData(evento.data)}</span>
                </div>
                <div class="evento-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${evento.hora.substring(0, 5)}</span>
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
            <div class="evento-actions">
                <button class="btn-evento btn-detalhes" onclick="verDetalhesEvento(${evento.id})">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                ${inscricao.status === "CONFIRMADA" ? `
                    <button class="btn-evento btn-cancelar-inscricao" onclick="cancelarInscricao(${inscricao.id}, ${evento.id})">
                        <i class="fas fa-times-circle"></i> Cancelar Inscrição
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    return card;
}

// ===============================================
// FUNÇÕES UTILITÁRIAS (Eventos)
// ===============================================

function getIconeCategoria(categoria) {
    const icones = {
        workshop: "fas fa-laptop-code",
        palestra: "fas fa-microphone-alt",
        hackathon: "fas fa-trophy",
        networking: "fas fa-users",
        treinamento: "fas fa-chalkboard-teacher",
        mentoria: "fas fa-user-tie",
        outro: "fas fa-calendar-day",
    };
    return icones[categoria.toLowerCase()] || "fas fa-calendar-day";
}

function formatarData(data) {
    if (!data) return "";
    const partes = data.split("-"); // Espera AAAA-MM-DD
    if (partes.length < 3) return data; 
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function verDetalhesEvento(eventoId) {
    window.location.href = `detalhes-evento.html?id=${eventoId}`;
}

async function cancelarInscricao(inscricaoId, eventoId) {
    const confirmar = confirm("Tem certeza que deseja cancelar sua inscrição neste evento?");
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_URL}/inscricoes/${inscricaoId}/cancelar`, {
            method: "PUT",
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.ok) {
            alert("Inscrição cancelada com sucesso!");
            carregarEventosInscritos(); // Recarrega a lista
        } else {
            alert("Erro ao cancelar inscrição. Tente novamente.");
        }
    } catch (erro) {
        console.error("Erro ao cancelar inscrição:", erro);
        alert("Erro de conexão. Tente novamente.");
    }
}