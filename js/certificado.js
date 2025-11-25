document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const nome = params.get("nome") || "Aluno Visitante";
    const evento = params.get("evento") || "Evento de Tecnologia";
    const data = params.get("data") || new Date().toLocaleDateString();
    
    document.getElementById("cert-nome").textContent = nome;
    document.getElementById("cert-evento").textContent = evento;
    document.getElementById("cert-data").textContent = data;

    document.getElementById("cert-codigo").textContent = "LFR-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    document.title = `Certificado - ${nome}`;
});