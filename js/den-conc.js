// --- SCRIPT DE VALIDAÇÃO ---

// Seleciona o formulário
const form = document.getElementById('contactForm');

// Adiciona um "ouvinte" para o evento de "submit" (envio)
form.addEventListener('submit', function(event) {
    
    // 1. Impede que o formulário seja enviado da forma tradicional
    event.preventDefault();

    // 2. Limpa todos os erros antigos antes de validar de novo
    resetErrors();

    let hasError = false;

    // 3. Define quais campos são obrigatórios
    const requiredFields = [
        { id: 'nome', message: 'Este campo é obrigatório.' },
        { id: 'sobrenome', message: 'Este campo é obrigatório.' },
        { id: 'email', message: 'Por favor, insira um email válido.' },
        { id: 'telefone', message: 'Este campo é obrigatório.' },
        { id: 'pais', message: 'Este campo é obrigatório.' },
        { id: 'area', message: 'Este campo é obrigatório.' }
    ];

    // 4. Loop para verificar cada campo obrigatório
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        
        // Validação especial para email
        if (field.id === 'email') {
            if (!isValidEmail(input.value)) {
                showError(input, field.message);
                hasError = true;
            }
        } 
        // Validação para outros campos (se estão vazios)
        else if (input.value.trim() === '') {
            showError(input, field.message);
            hasError = true;
        }
    });

    // 5. Se não houver erros, redireciona para a página de confirmação
    if (!hasError) {
        window.location.href = 'ajuda.html';
    }
});

// Função para mostrar o erro (adiciona classes CSS)
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.textContent = message;
}

// Função para limpar todos os erros
function resetErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
    });
}

// Função simples para checar se o email tem um formato válido
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}