document.addEventListener('DOMContentLoaded', function() {
    const inscricaoData = JSON.parse(localStorage.getItem('inscricaoRealizada') || '{}');
    
    if (inscricaoData.eventoNome) {
        exibirDetalhesInscricao(inscricaoData);
    } else {
        window.location.href = 'homepage.html';
    }
});

function exibirDetalhesInscricao(dados) {
    const detailsDiv = document.getElementById('inscricaoDetails');
    
    let html = `
        <p><strong>📅 Evento:</strong> ${dados.eventoNome}</p>
        <p><strong>📆 Data:</strong> ${dados.eventoData}</p>
        <p><strong>⏰ Horário:</strong> ${dados.eventoHora}</p>
    `;
    
    if (dados.eventoLocal) {
        html += `<p><strong>📍 Local:</strong> ${dados.eventoLocal}</p>`;
    }
    
    detailsDiv.innerHTML = html;
}

function voltarEventos() {
    localStorage.removeItem('inscricaoRealizada');
    window.location.href = 'homepage.html';
}

function verMinhasInscricoes() {
    localStorage.removeItem('inscricaoRealizada');
    window.location.href = 'perfil.html';
}