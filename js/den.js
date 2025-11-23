// ===============================================
// ARQUIVO: js/den.js
// ===============================================

// URL BASE DO SEU BACKEND
const BASE_URL = "https://back-end-riseup-liferay-5.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CARREGAR NOME DO USUÁRIO (Executa em todas as páginas que usam este JS)
    carregarNomeUsuario();

    // 2. LÓGICA DO FORMULÁRIO (Só executa se existir o formulário na tela)
    const form = document.getElementById('contactForm') || document.querySelector('form');
    
    // Se achou o formulário, ativa a lógica de envio
    if (form) {
        configurarFormulario(form);
    }
});

// --- FUNÇÃO PARA CARREGAR O PERFIL ---
async function carregarNomeUsuario() {
    const elementoNome = document.getElementById('nome-usuario');
    
    // Se não tiver o elemento no HTML (ex: página sem header), para por aqui
    if (!elementoNome) return;

    // Tenta pegar o token salvo no localStorage (verifique se você salvou como 'token', 'jwt' ou 'accessToken')
    const token = localStorage.getItem('token'); 

    if (!token) {
        elementoNome.innerText = "Visitante";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/perfis/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Envia o token para liberar o acesso
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const usuario = await response.json();
            // Ajuste aqui se o seu JSON retornar { username: "..." } em vez de { nome: "..." }
            elementoNome.innerText = usuario.nome || usuario.username || "Usuário"; 
        } else {
            console.warn("Token inválido ou expirado.");
            elementoNome.innerText = "Usuário";
        }
    } catch (erro) {
        console.error("Erro ao buscar nome do usuário:", erro);
    }
}

// --- LÓGICA DO ENVIO DO FORMULÁRIO ---
function configurarFormulario(form) {
    const API_URL_CONTATO = `${BASE_URL}/api/contato/enviar`;

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        resetErrors();

        let hasError = false;

        // --- VALIDAÇÃO ---
        const requiredFields = [
            { id: 'nome', message: 'Este campo é obrigatório.' },
            { id: 'sobrenome', message: 'Este campo é obrigatório.' },
            { id: 'email', message: 'Por favor, insira um email válido.' },
            { id: 'telefone', message: 'Este campo é obrigatório.' },
            { id: 'pais', message: 'Este campo é obrigatório.' },
            { id: 'area', message: 'Este campo é obrigatório.' }
        ];

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input) return;

            if (field.id === 'email') {
                if (!isValidEmail(input.value)) {
                    showError(input, field.message);
                    hasError = true;
                }
            } else if (input.value.trim() === '') {
                showError(input, field.message);
                hasError = true;
            }
        });

        // --- ENVIO ---
        if (!hasError) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const textoOriginal = submitBtn ? submitBtn.textContent : "Enviar";

            if(submitBtn) {
                submitBtn.textContent = "Enviando...";
                submitBtn.disabled = true;
            }

            const dadosParaEnviar = {
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
                    body: JSON.stringify(dadosParaEnviar)
                });

                if (response.ok) {
                    window.location.href = 'den-conc.html';
                } else {
                    alert("Ocorreu um erro ao enviar. Tente novamente mais tarde.");
                    console.error("Erro no backend:", response.status);
                    if(submitBtn) {
                        submitBtn.textContent = textoOriginal;
                        submitBtn.disabled = false;
                    }
                }
            } catch (erro) {
                console.error("Erro de conexão:", erro);
                alert("Não foi possível conectar ao servidor.");
                if(submitBtn) {
                    submitBtn.textContent = textoOriginal;
                    submitBtn.disabled = false;
                }
            }
        }
    });
}

// --- FUNÇÕES AUXILIARES ---
function showError(input, message) {
    const formGroup = input.closest('.form-group') || input.parentElement;
    if(formGroup) {
        formGroup.classList.add('error');
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }
}

function resetErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => group.classList.remove('error'));
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}