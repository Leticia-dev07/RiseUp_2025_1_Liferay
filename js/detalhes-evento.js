let eventoAtual = null;

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get("id");

    if (!eventoId) {
        mostrarErro("ID do evento não fornecido.");
        return;
    }

    carregarDetalhesEvento(eventoId);
});

async function carregarDetalhesEvento(eventoId) {
    try {
        const response = await fetch(`${API_URL}/eventos/${eventoId}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Sua sessão expirou. Faça login novamente.");
            localStorage.removeItem("authToken");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) throw new Error("Erro ao carregar evento.");

        eventoAtual = await response.json();
        preencherDetalhesEvento(eventoAtual);

        verificarStatusInscricao(eventoId);

    } catch (erro) {
        console.error("Erro ao carregar evento:", erro);
        mostrarErro("Erro ao carregar evento.");
    }
}

async function verificarStatusInscricao(eventoId) {
    try {
        const response = await fetch(`${API_URL}/inscricoes/eventos/${eventoId}/status`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        if (!response.ok) return;

        const status = await response.json();
        atualizarBotaoInscricao(status);

    } catch (erro) {
        console.error("Erro ao verificar inscrição:", erro);
    }
}

async function inscreverEvento() {
    const btn = document.getElementById("inscricaoBtn");
    const msg = document.getElementById("statusMessage");
    btn.disabled = true;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const eventoId = urlParams.get("id");

        const response = await fetch(`${API_URL}/inscricoes/eventos/${eventoId}/inscrever`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || "Erro ao se inscrever.");
        }

        mostrarConfirmacaoInscricao(eventoAtual);

    } catch (erro) {
        msg.textContent = "Erro: " + erro.message;
        console.error("Erro inscrição:", erro);
        btn.disabled = false;
    }
}

function preencherDetalhesEvento(evento) {
    document.getElementById("eventName").textContent = evento.nome;
    document.getElementById("eventDescription").textContent = evento.descricao;
    document.getElementById("eventDate").textContent = formatarData(evento.data);
    document.getElementById("eventTime").textContent = evento.hora?.substring(0, 5) || "--:--";
    document.getElementById("eventLocation").textContent = evento.local;
    document.getElementById("eventCategory").textContent = evento.categoria || "-";

    const vagasElem = document.getElementById("eventVagas");
    if (vagasElem) {
        vagasElem.textContent = 
            evento.vagas != null ? `${evento.vagas} vagas` : "- vagas";
    }
}

function atualizarBotaoInscricao(status) {
    const btn = document.getElementById("inscricaoBtn");
    const msg = document.getElementById("statusMessage");

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    if (status.inscrito) {
        newBtn.querySelector("span").textContent = "Já Inscrito";
        newBtn.disabled = true;
        msg.textContent = "Você já está inscrito neste evento.";
        return;
    }

    if (eventoAtual.vagas <= 0) {
        newBtn.querySelector("span").textContent = "Vagas Esgotadas";
        newBtn.disabled = true;
        msg.textContent = "Vagas esgotadas.";
        return;
    }

    newBtn.querySelector("span").textContent = "Inscrever-se";
    newBtn.disabled = false;
    msg.textContent = "";

    newBtn.addEventListener("click", inscreverEvento);
}

function mostrarConfirmacaoInscricao(evento) {
    localStorage.setItem("inscricaoRealizada", JSON.stringify({
        eventoNome: evento.nome,
        eventoData: formatarData(evento.data),
        eventoHora: evento.hora?.substring(0, 5),
        eventoLocal: evento.local
    }));

    window.location.href = "inscricao-confirmacao.html";
}

function formatarData(data) {
    if (!data) return "--/--/----";
    const p = data.split("-");
    return `${p[2]}/${p[1]}/${p[0]}`;
}

function mostrarErro(msg) {
    document.getElementById("eventName").textContent = "Erro";
    document.getElementById("eventDescription").textContent = msg;
    document.getElementById("inscricaoBtn").style.display = "none";
}
