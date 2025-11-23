// ===============================================
// ARQUIVO: js/den.js (VERSÃO FINAL)
// ===============================================

// URL DO SEU BACKEND NO RENDER
const BASE_URL = "https://back-end-riseup-liferay-5.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Carrega o nome do usuário assim que a página abre
    carregarNomeUsuario();

    // 2. Configura o formulário (se existir nesta página)
    const form = document.getElementById('contactForm') || document.querySelector('form');
    if (form) {
        configurarFormulario(form);
    }
});

// --- FUNÇÃO: CARREGAR PERFIL DO USUÁRIO ---
async function carregarNomeUsuario() {
    const elementoNome = document.getElementById('nome-usuario');
    if (!elementoNome) return; // Se não tiver header, ignora

    // Tenta pegar o token (Verifique se no seu login você salva como 'token', 'jwt' ou 'accessToken')
    const token = localStorage.getItem('token') || localStorage.getItem('jwt'); 

    if (!token) {
        elementoNome.innerText = "Visitante"; // Ou redirecione para login
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/perfis/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const usuario = await response.json();
            // Pega o nome, ou username, ou email (o que tiver disponível)
            elementoNome.innerText = usuario.nome || usuario.username || "Usuário"; 
        } else {
            // Token expirado ou inválido
            console.warn("Sessão inválida.");
            elementoNome.innerText = "Faça Login";
        }
    } catch (erro) {
        console.error("Erro ao buscar perfil:", erro);
        elementoNome.innerText = "Erro";
    }
}

// --- FUNÇÃO: ENVIAR FORMULÁRIO ---
function configurarFormulario(form) {
    const API_URL_CONTATO = `${BASE_URL}/api/contato/enviar`;

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        resetErrors();

        let hasError = false;

        // Validação básica
        const requiredFields = [
            { id: 'nome', msg: 'Este campo é obrigatório.' },
            { id: 'sobrenome', msg: 'Este campo é obrigatório.' },
            { id: 'email', msg: 'Insira um email válido.' },
            { id: 'telefone', msg: 'Obrigatório.' },
            { id: 'pais', msg: 'Obrigatório.' },
            { id: 'area', msg: 'Obrigatório.' }
        ];

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input) return;

            if (field.id === 'email' && !isValidEmail(input.value)) {
                showError(input, field.msg);
                hasError = true;
            } else if (input.value.trim() === '') {
                showError(input, field.msg);
                hasError = true;
            }
        });

        if (!hasError) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const textoOriginal = submitBtn ? submitBtn.textContent : "Enviar";

            if(submitBtn) {
                submitBtn.textContent = "Enviando...";
                submitBtn.disabled = true;
            }

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
                const response = await fetch(API_URL_CONTATO, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados)
                });

                if (response.ok) {
                    window.location.href = 'den-conc.html';
                } else {
                    alert("Erro ao enviar. Tente novamente.");
                    if(submitBtn) {
                        submitBtn.textContent = textoOriginal;
                        submitBtn.disabled = false;
                    }
                }
            } catch (erro) {
                console.error(erro);
                alert("Erro de conexão.");
                if(submitBtn) {
                    submitBtn.textContent = textoOriginal;
                    submitBtn.disabled = false;
                }
            }
        }
    });
}

// --- AUXILIARES ---
function showError(input, message) {
    const formGroup = input.closest('.form-group') || input.parentElement;
    if(formGroup) {
        formGroup.classList.add('error');
        let errorMsg = formGroup.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            formGroup.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }
}

function resetErrors() {
    document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}