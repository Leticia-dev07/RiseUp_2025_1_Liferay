// ===============================================
// ARQUIVO: js/den.js
// ===============================================

// URL JÁ CONFIGURADA COM SEU BACKEND NO RENDER
const API_URL = "https://back-end-riseup-liferay-5.onrender.com/api/contato/enviar";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contactForm') || document.querySelector('form');

    if (!form) return;

    form.addEventListener('submit', async function(event) {
        
        event.preventDefault(); // Impede o envio padrão do navegador
        resetErrors();          // Limpa mensagens de erro antigas

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

            // Validação de Email
            if (field.id === 'email') {
                if (!isValidEmail(input.value)) {
                    showError(input, field.message);
                    hasError = true;
                }
            } 
            // Validação de Campos Vazios
            else if (input.value.trim() === '') {
                showError(input, field.message);
                hasError = true;
            }
        });

        // --- ENVIO PARA O SERVIDOR ---
        if (!hasError) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const textoOriginal = submitBtn ? submitBtn.textContent : "Enviar";

            // 1. Feedback visual (Botão carregando)
            if(submitBtn) {
                submitBtn.textContent = "Enviando...";
                submitBtn.disabled = true;
            }

            // 2. Monta o Objeto JSON
            const dadosParaEnviar = {
                nome: document.getElementById('nome').value,
                sobrenome: document.getElementById('sobrenome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                pais: document.getElementById('pais').value,
                areaTrabalho: document.getElementById('area').value, // Mapeado: HTML 'area' -> Java 'areaTrabalho'
                motivo: document.getElementById('motivo').value
            };

            try {
                // 3. Conexão real com o Render
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosParaEnviar)
                });

                if (response.ok) {
                    // SUCESSO: Redireciona
                    window.location.href = 'den-conc.html';
                } else {
                    // ERRO DO SERVIDOR (Ex: 400 ou 500)
                    alert("Ocorreu um erro ao enviar. Tente novamente mais tarde.");
                    console.error("Erro no backend:", response.status);
                    
                    if(submitBtn) {
                        submitBtn.textContent = textoOriginal;
                        submitBtn.disabled = false;
                    }
                }
            } catch (erro) {
                // ERRO DE CONEXÃO (Internet ou Servidor Offline)
                console.error("Erro de conexão:", erro);
                alert("Não foi possível conectar ao servidor.");
                
                if(submitBtn) {
                    submitBtn.textContent = textoOriginal;
                    submitBtn.disabled = false;
                }
            }
        }
    });
});

// --- FUNÇÕES DE APOIO ---

function showError(input, message) {
    const formGroup = input.closest('.form-group') || input.parentElement;
    if(formGroup) {
        formGroup.classList.add('error');
        
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            // Estilos inline de fallback caso o CSS falhe
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }
}

function resetErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const msg = group.querySelector('.error-message');
        // Opcional: limpar texto
        // if (msg) msg.textContent = ''; 
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}