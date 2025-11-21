document.addEventListener("DOMContentLoaded", () => {
    // 🎯 URL do Servidor Render (Definida para clareza)
    const RENDER_BASE_URL = "https://back-end-riseup-liferay-5.onrender.com"; 

    // 1. IDs CORRIGIDOS para bater com seu HTML
    const loginForm = document.getElementById("loginForm");
    const loginInput = document.getElementById("username");
    const senhaInput = document.getElementById("password");
    const feedbackMessage = document.getElementById("feedbackMessage");
    const togglePassword = document.getElementById("togglePassword"); // Bônus: para o olho

    // Se o formulário não for encontrado, pare para evitar erros
    if (!loginForm) {
        console.error("Erro: Formulário com ID 'loginForm' não encontrado.");
        return;
    }

    // 2. Evento de "submit" no formulário
    loginForm.addEventListener("submit", async (event) => {
        
        // Impede o formulário de recarregar a página
        event.preventDefault(); 
        
        // Limpa mensagens de erro antigas
        feedbackMessage.textContent = "";

        // 3. Coleta de dados com os IDs CORRIGIDOS
        const loginData = {
            login: loginInput.value,
            senha: senhaInput.value
        };

        try {
            // 🌟 URL CORRIGIDA AQUI 🌟
            const response = await fetch(`${RENDER_BASE_URL}/api/auth/login`, {
                
                // 4. GARANTE O MÉTODO "POST"
                method: "POST", 
                
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData) 
            });

            if (response.ok) {
                // SUCESSO
                const data = await response.json();
                localStorage.setItem("authToken", data.token);
                // Redireciona para a homepage
                window.location.href = "homepage.html"; 

            } else {
                // FALHA (ex: 401 - Senha errada)
                const errorText = await response.text();
                feedbackMessage.textContent = errorText; // Mostra o erro do back-end
                feedbackMessage.style.color = "red";
            }

        } catch (error) {
            // FALHA DE REDE (ex: back-end desligado ou URL errada)
            console.error("Erro na requisição:", error);
            feedbackMessage.textContent = "Não foi possível conectar ao servidor.";
            feedbackMessage.style.color = "red";
        }
    });

    // 5. Bônus: Script para o olho de mostrar/esconder senha
    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            // Verifica o tipo do input de senha
            const type = senhaInput.getAttribute("type") === "password" ? "text" : "password";
            senhaInput.setAttribute("type", type);
            
            // Muda o ícone do olho
            togglePassword.textContent = type === "password" ? "👁" : "🙈";
        });
    }
});