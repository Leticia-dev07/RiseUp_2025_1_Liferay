document.addEventListener("DOMContentLoaded", () => {
    // Pega os parâmetros da URL (ex: certificado.html?nome=Joao&evento=Java...)
    const params = new URLSearchParams(window.location.search);

    const nome = params.get("nome") || "Aluno Visitante";
    const evento = params.get("evento") || "Evento de Tecnologia";
    const data = params.get("data") || new Date().toLocaleDateString();
    
    // Preenche os campos HTML
    document.getElementById("cert-nome").textContent = nome;
    document.getElementById("cert-evento").textContent = evento;
    document.getElementById("cert-data").textContent = data;

    // Gera um código aleatório só pra parecer real
    document.getElementById("cert-codigo").textContent = "LFR-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Muda o título da página
    document.title = `Certificado - ${nome}`;
});