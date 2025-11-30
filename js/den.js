const BASE_URL = "https://back-end-riseup-liferay-5.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    
    carregarNomeUsuario();

    const form = document.getElementById('contactForm') || document.querySelector('form');
    if (form) {
        configurarFormulario(form);
    }
});

async function carregarNomeUsuario() {
    const elementoNome = document.getElementById('nome-usuario');
    if (!elementoNome) return; 

    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('jwt'); 

    if (!token) {
        elementoNome.innerText = "Visitante";
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
            
            const nomeExibicao = usuario.nomeCompleto || usuario.username || "Usuário"; 
            
            elementoNome.innerText = nomeExibicao; 
        } else {
            console.warn("Sessão inválida. Status:", response.status);
            elementoNome.innerText = "Faça Login";
        }
    } catch (erro) {
        console.error("Erro ao buscar perfil:", erro);
        elementoNome.innerText = "Erro";
    }
}

function configurarFormulario(form) {
    const API_URL_CONTATO = `${BASE_URL}/api/contato/enviar`;

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        resetErrors();

        let hasError = false;

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
        
        if (hasError) return;

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

        const token = localStorage.getItem('authToken');
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(API_URL_CONTATO, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                window.location.href = 'den-conc.html';
            } else {
                alert(`Erro ao enviar. Status: ${response.status}. Tente novamente.`);
            }
        } catch (erro) {
            console.error("Erro de conexão:", erro);
            alert("Erro de conexão.");
        } finally {
            if(submitBtn) {
                submitBtn.textContent = textoOriginal;
                submitBtn.disabled = false;
            }
        }
    });
}

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