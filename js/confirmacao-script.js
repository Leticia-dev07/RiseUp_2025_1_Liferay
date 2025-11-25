document.addEventListener('DOMContentLoaded', function() {
    const eventoData = JSON.parse(localStorage.getItem('eventoRecemCriado') || '{}');
    
    if (eventoData.nome) {
        exibirDetalhesEvento(eventoData);
    }
});

function exibirDetalhesEvento(dados) {
    const detailsDiv = document.getElementById('eventDetails');
    
    let html = `
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Data:</strong> ${formatarData(dados.data)}</p>
        <p><strong>Hora:</strong> ${dados.hora}</p>
    `;
    
    if (dados.local) {
        html += `<p><strong>Local:</strong> ${dados.local}</p>`;
    }
    
    if (dados.categoria) {
        html += `<p><strong>Categoria:</strong> ${capitalize(dados.categoria)}</p>`;
    }
    
    if (dados.vagas) {
        html += `<p><strong>Vagas:</strong> ${dados.vagas}</p>`;
    }
    
    detailsDiv.innerHTML = html;
}

function formatarData(data) {
    if (!data) return '';
    const partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function voltarInicio() {
    localStorage.removeItem('eventoRecemCriado');
    window.location.href = 'homepage.html';
}

function criarOutro() {
    localStorage.removeItem('eventoRecemCriado');
    window.location.href = 'criar-evento.html';
}