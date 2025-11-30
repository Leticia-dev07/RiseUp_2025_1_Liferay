const token = localStorage.getItem("authToken");
if (!token) {
    alert("Você precisa estar logado para criar um evento.");
    window.location.href = "login.html";
}

const RENDER_BASE_URL = "https://back-end-riseup-liferay-5.onrender.com"; 

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
      const resposta = await fetch(`${RENDER_BASE_URL}/api/eventos/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(formData),
      });

      
      if (resposta.ok) {
        const eventoSalvo = await resposta.json(); 

        localStorage.setItem('eventoRecemCriado', JSON.stringify(eventoSalvo));

        window.location.href = "confirmacao.html";

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

document.addEventListener("DOMContentLoaded", function () {
  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("data").setAttribute("min", hoje);
});