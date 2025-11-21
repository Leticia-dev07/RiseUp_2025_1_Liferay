// =====================
// 1. VERIFICAÇÃO DE SEGURANÇA (ROTA PROTEGIDA)
// =====================
const token = localStorage.getItem("authToken");
if (!token) {
    alert("Você precisa estar logado para criar um evento.");
    window.location.href = "login.html";
}

// 🎯 URL BASE DO SERVIDOR RENDER
const RENDER_BASE_URL = "https://back-end-riseup-liferay-5.onrender.com"; 

// =====================
// FUNÇÕES HELPERS
// =====================
function voltarPagina() {
  window.history.back();
}

function converterDataParaISO(dataString) {
  if (!dataString) return null;
  const partes = dataString.split("/");
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return dataString;
}

// =====================
// LISTENER DO FORMULÁRIO (CORRIGIDO)
// =====================
document
  .getElementById("eventoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const dataInput = document.getElementById("data").value;
    const horaInput = document.getElementById("hora").value;

    const formData = {
      nome: document.getElementById("nomeEvento").value,
      descricao: document.getElementById("descricao").value,
      data: converterDataParaISO(dataInput),
      hora: horaInput ? horaInput + ":00" : null,
      local: document.getElementById("local").value,
      categoria: document.getElementById("categoria").value,
      vagas: document.getElementById("vagas").value
        ? parseInt(document.getElementById("vagas").value)
        : null,
    };

    console.log("Dados enviados (JSON):", formData);

    try {
      // 🌟 URL CORRIGIDA AQUI 🌟
      const resposta = await fetch(`${RENDER_BASE_URL}/api/eventos/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(formData),
      });

      
      if (resposta.ok) { // Status 200-299
        // 1. Precisamos ler o evento que o backend acabou de salvar
        const eventoSalvo = await resposta.json(); 

        // 2. Salve o evento no localStorage para a página de confirmação
        localStorage.setItem('eventoRecemCriado', JSON.stringify(eventoSalvo));

        // 3. Agora sim, redirecione
        window.location.href = "confirmacao.html";
        // --- FIM DA MUDANÇA ---

      } else if (resposta.status === 401 || resposta.status === 403) {
        alert("Sua sessão expirou. Faça login novamente.");
        localStorage.removeItem("authToken");
        window.location.href = "login.html";

      } else {
        const erroDetalhado = await resposta
          .json()
          .catch(() => ({ message: resposta.statusText }));
        console.error("Erro do servidor:", erroDetalhado);
        throw new Error(
          "Falha ao criar evento. Detalhes: " + (erroDetalhado.message || "Erro desconhecido")
        );
      }

    } catch (erro) {
      console.error("Erro na requisição:", erro);
      alert(
        "Ocorreu um erro ao criar o evento. Verifique o console do navegador para mais detalhes."
      );
    }
  });

// =====================
// CONFIGURAÇÃO DA DATA MÍNIMA
// =====================
document.addEventListener("DOMContentLoaded", function () {
  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("data").setAttribute("min", hoje);
});