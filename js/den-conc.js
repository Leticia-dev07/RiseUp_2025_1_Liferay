const API_BASE_URL = typeof API_URL !== 'undefined' ? API_URL : "https://back-end-riseup-liferay-5.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        resetErrors();

        let hasError = false;

        const nome = document.getElementById('nome').value.trim();
        const sobrenome = document.getElementById('sobrenome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const pais = document.getElementById('pais').value;
        const area = document.getElementById('area').value.trim();

        const requiredFields = [
            { id: 'nome', val: nome, message: 'Este campo é obrigatório.' },
            { id: 'sobrenome', val: sobrenome, message: 'Este campo é obrigatório.' },
            { id: 'email', val: email, message: 'Por favor, insira um email válido.' },
            { id: 'telefone', val: telefone, message: 'Este campo é obrigatório.' },
            { id: 'pais', val: pais, message: 'Este campo é obrigatório.' },
            { id: 'area', val: area, message: 'Este campo é obrigatório.' }
        ];

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            
            if (field.id === 'email') {
                if (!isValidEmail(field.val)) {
                    showError(input, field.message);
                    hasError = true;
                }
            } else if (field.val === '') {
                showError(input, field.message);
                hasError = true;
            }
        });

        if (hasError) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";

        const dadosMensagem = {
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            telefone: telefone,
            pais: pais,
            mensagem: area
        };

        try {
            const response = await fetch(`${API_BASE_URL}/contato/enviar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosMensagem)
            });

            if (response.ok) {
                alert("Mensagem enviada com sucesso!");
                window.location.href = 'ajuda.html';
            } else {
                const erro = await response.json().catch(() => ({}));
                alert("Erro ao enviar: " + (erro.message || "Tente novamente mais tarde."));
            }

        } catch (error) {
            console.error("Erro de rede:", error);
            alert("Erro de conexão com o servidor.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});

function showError(input, message) {
    const formGroup = input.closest('.form-group') || input.parentElement;
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

function resetErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const msg = group.querySelector('.error-message');
        if(msg) msg.textContent = '';
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}