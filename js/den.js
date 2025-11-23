// ===============================================
// ARQUIVO: js/den.js (VERSÃO DE DIAGNÓSTICO)
// ===============================================

const BASE_URL = "https://back-end-riseup-liferay-5.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 JS Iniciado. Tentando carregar perfil...");
    carregarNomeUsuario();

    // Lógica do formulário (se existir na página)
    const form = document.getElementById('contactForm') || document.querySelector('form');
    if (form) configurarFormulario(form);
});

async function carregarNomeUsuario() {
    const elementoNome = document.getElementById('nome-usuario');
    if (!elementoNome) {
        console.warn("⚠️ Elemento <span id='nome-usuario'> não encontrado no HTML.");
        return;
    }

    // 1. TENTA ACHAR O TOKEN COM VÁRIOS NOMES COMUNS
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('jwt') || 
                  localStorage.getItem('accessToken') ||
                  localStorage.getItem('access_token');

    if (!token) {
        console.error("❌ ERRO: Nenhum token encontrado no LocalStorage. O usuário fez login?");
        elementoNome.innerText = "Visitante (Sem Token)";
        return;
    }

    console.log("✅ Token encontrado (primeiros 10 chars):", token.substring(0, 10) + "...");

    try {
        // 2. CHAMA A API
        console.log("📡 Chamando /api/perfis/me...");
        const response = await fetch(`${BASE_URL}/api/perfis/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Status da resposta:", response.status);

        if (response.ok) {
            const usuario = await response.json();
            console.log("📦 Dados recebidos do Backend:", usuario);

            // 3. TENTA ENCONTRAR O CAMPO CERTO (Nome ou Username?)
            const nomeExibicao = usuario.nome || usuario.username || usuario.email || "Usuário";
            
            console.log("📝 Atualizando HTML para:", nomeExibicao);
            elementoNome.innerText = nomeExibicao;
        } else {
            console.error("❌ Erro na API:", response.status, response.statusText);
            
            if (response.status === 403 || response.status === 401) {
                elementoNome.innerText = "Sessão Expirada";
                // Opcional: localStorage.clear(); window.location.href = '/login.html';
            } else {
                elementoNome.innerText = "Erro ao carregar";
            }
        }
    } catch (erro) {
        console.error("❌ Erro CRÍTICO de conexão:", erro);
        elementoNome.innerText = "Offline";
    }
}

// --- CONFIGURAÇÃO DO FORMULÁRIO (MANTIDA IGUAL) ---
function configurarFormulario(form) {
    const API_URL_CONTATO = `${BASE_URL}/api/contato/enviar`;

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        resetErrors();
        let hasError = false;

        // Validação Simples
        const requiredFields = ['nome', 'sobrenome', 'email', 'telefone', 'pais', 'area'];
        requiredFields.forEach(id => {
            const input = document.getElementById(id);
            if (input && input.value.trim() === '') {
                showError(input, 'Campo obrigatório.');
                hasError = true;
            }
        });

        if (!hasError) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if(submitBtn) { submitBtn.textContent = "Enviando..."; submitBtn.disabled = true; }

            const dados = {
                nome: document.getElementById('nome').value,
                sobrenome: document.getElementById('sobrenome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                pais: document.getElementById('pais').value,
                areaTrabalho: document.getElementById('area').value, 
                motivo: document.getElementById('motivo').value
            };

            try {
                const res = await fetch(API_URL_CONTATO, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados)
                });

                if (res.ok) window.location.href = 'den-conc.html';
                else alert("Erro ao enviar. Tente novamente.");
            } catch (e) {
                console.error(e);
                alert("Erro de conexão.");
            } finally {
                if(submitBtn) { submitBtn.textContent = "Enviar"; submitBtn.disabled = false; }
            }
        }
    });
}

function showError(input, msg) {
    const group = input.parentElement;
    group.classList.add('error');
}
function resetErrors() {
    document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
}