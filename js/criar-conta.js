document.addEventListener("DOMContentLoaded", () => {
    
    const registerForm = document.getElementById("register-form");
    const messageDiv = document.getElementById("message");
    const submitButton = document.getElementById("submit-button");
    
    const RENDER_BASE_URL = "https://back-end-riseup-liferay-5.onrender.com";

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        messageDiv.textContent = "";
        messageDiv.className = "";
        submitButton.disabled = true; 
        submitButton.textContent = "Criando conta...";

        const nomeUsuario = document.getElementById("nomeUsuario").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const nomeCompleto = document.getElementById("nomeCompleto").value;
        const titulo = document.getElementById("titulo").value;
        const sobreMim = document.getElementById("sobreMim").value;
        const habilidadesString = document.getElementById("habilidades").value; 
        
        
        const registerDto = {
            nomeUsuario: nomeUsuario,
            email: email,
            senha: senha,
            nomeCompleto: nomeCompleto,
            titulo: titulo,
            sobreMim: sobreMim,
            habilidades: habilidadesString.split(',').map(s => s.trim()).filter(s => s.length > 0) 
        };

        try {
            const response = await fetch(`${RENDER_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerDto)
            });

            if (response.ok) {
                const loginData = await response.json(); 
                
                localStorage.setItem("authToken", loginData.token);
                
                messageDiv.textContent = "Conta criada com sucesso! Redirecionando...";
                messageDiv.className = "success";
                
                setTimeout(() => {
                    window.location.href = "homepage.html"; 
                }, 2000);

            } else {
                const responseData = await response.text();
                let errorMessage = "Ocorreu um erro desconhecido no servidor.";
                
                try {
                    const errorJson = JSON.parse(responseData);
                    errorMessage = errorJson.erro || errorMessage;
                } catch (e) {
                    errorMessage = responseData; 
                }

                messageDiv.textContent = errorMessage;
                messageDiv.className = "error";
            }
        } catch (error) {
            console.error("Erro de rede:", error);
            messageDiv.textContent = "Erro de conexão. Verifique se o servidor está rodando.";
            messageDiv.className = "error";
        } finally {
             submitButton.disabled = false;
             submitButton.textContent = "Criar Conta";
        }
    });
});