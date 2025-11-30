document.addEventListener("DOMContentLoaded", () => {
    const RENDER_BASE_URL = "https://back-end-riseup-liferay-5.onrender.com"; 

    const loginForm = document.getElementById("loginForm");
    const loginInput = document.getElementById("username");
    const senhaInput = document.getElementById("password");
    const feedbackMessage = document.getElementById("feedbackMessage");
    const togglePassword = document.getElementById("togglePassword");

    if (!loginForm) {
        console.error("Erro: Formulário com ID 'loginForm' não encontrado.");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        
        event.preventDefault(); 
        
        feedbackMessage.textContent = "";

        const loginData = {
            login: loginInput.value,
            senha: senhaInput.value
        };

        try {
            const response = await fetch(`${RENDER_BASE_URL}/api/auth/login`, {
                
                method: "POST", 
                
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData) 
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.token);
                window.location.href = "homepage.html"; 

            } else {
                const errorText = await response.text();
                feedbackMessage.textContent = errorText;
                feedbackMessage.style.color = "red";
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
            feedbackMessage.textContent = "Não foi possível conectar ao servidor.";
            feedbackMessage.style.color = "red";
        }
    });

    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            const type = senhaInput.getAttribute("type") === "password" ? "text" : "password";
            senhaInput.setAttribute("type", type);
            
            togglePassword.textContent = type === "password" ? "👁" : "👁";
        });
    }
});