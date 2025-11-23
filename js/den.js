// ===============================================
// ARQUIVO: js/contato.js (VALIDAÇÃO E REDIRECIONAMENTO)
// ===============================================

document.addEventListener("DOMContentLoaded", () => {
    // Seleciona o formulário pelo ID (verifique se no HTML é 'contactForm' ou apenas <form>)
    const form = document.getElementById('contactForm') || document.querySelector('form');

    if (!form) return;

    form.addEventListener('submit', function(event) {
        
        // 1. Impede o envio padrão para validar primeiro
        event.preventDefault();

        // 2. Limpa erros antigos
        resetErrors();

        let hasError = false;

        // 3. Lista de campos obrigatórios (IDs devem bater com o HTML)
        const requiredFields = [
            { id: 'nome', message: 'Este campo é obrigatório.' },
            { id: 'sobrenome', message: 'Este campo é obrigatório.' },
            { id: 'email', message: 'Por favor, insira um email válido.' },
            { id: 'telefone', message: 'Este campo é obrigatório.' },
            { id: 'pais', message: 'Este campo é obrigatório.' },
            { id: 'area', message: 'Este campo é obrigatório.' }
        ];

        // 4. Loop de validação
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            
            // Se não achou o input no HTML, pula (evita erro de null)
            if (!input) return;

            if (field.id === 'email') {
                if (!isValidEmail(input.value)) {
                    showError(input, field.message);
                    hasError = true;
                }
            } 
            else if (input.value.trim() === '') {
                showError(input, field.message);
                hasError = true;
            }
        });

        // 5. SE TUDO ESTIVER CERTO -> REDIRECIONA!
        if (!hasError) {
            // Simula um envio rápido (pode adicionar loading se quiser)
            const submitBtn = form.querySelector('button[type="submit"]');
            if(submitBtn) {
                submitBtn.textContent = "Enviando...";
                submitBtn.disabled = true;
            }

            // Pequeno delay para UX (opcional), depois redireciona
            setTimeout(() => {
                window.location.href = 'den-conc.html';
            }, 500);
        }
    });
});

// --- FUNÇÕES AUXILIARES ---

function showError(input, message) {
    // Tenta achar o pai .form-group ou usa o pai direto
    const formGroup = input.closest('.form-group') || input.parentElement;
    if(formGroup) {
        formGroup.classList.add('error');
        
        // Procura o span de erro ou cria um se não existir
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.style.display = 'block';
            errorMessage.style.marginTop = '5px';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }
}

function resetErrors() {
    const errorGroups = document.querySelectorAll('.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const msg = group.querySelector('.error-message');
        if (msg) msg.textContent = '';
    });
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}