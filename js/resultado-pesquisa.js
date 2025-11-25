const API_URL = "https://back-end-riseup-liferay-5.onrender.com/api"; 
const SERVER_URL = "https://back-end-riseup-liferay-5.onrender.com"; 

document.addEventListener("DOMContentLoaded", () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    
    if (searchTerm) {
        document.getElementById('search-term-display').textContent = searchTerm;
        executeSearch(searchTerm);
    } else {
        document.getElementById('search-term-display').textContent = '...';
        document.getElementById('no-results').style.display = 'block';
    }

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = searchTerm || '';
});

async function executeSearch(query) {
    const loadingSpinner = document.getElementById('loading-spinner');
    const profilesContainer = document.getElementById('profiles-results');
    const eventsContainer = document.getElementById('events-results');
    const noResultsMessage = document.getElementById('no-results');

    profilesContainer.style.display = 'none';
    eventsContainer.style.display = 'none';
    noResultsMessage.style.display = 'none';
    loadingSpinner.style.display = 'block';

    try {
        const SEARCH_API_URL = `${API_URL}/search?q=${encodeURIComponent(query)}`;
        const token = localStorage.getItem("authToken");

        const response = await fetch(SEARCH_API_URL, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Sua sessão expirou. Faça login novamente.");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error('Falha ao buscar resultados.');
        }

        const results = await response.json(); 

        renderResults(results.profiles || [], results.events || []);

    } catch (error) {
        console.error("Erro na busca:", error);
        alert("Ocorreu um erro ao realizar a busca.");
        noResultsMessage.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function renderResults(profiles, events) {
    const profilesList = document.getElementById('profiles-list');
    const eventsList = document.getElementById('events-list');
    const profilesContainer = document.getElementById('profiles-results');
    const eventsContainer = document.getElementById('events-results');

    profilesList.innerHTML = '';
    eventsList.innerHTML = '';

    if (profiles.length > 0) {
        profiles.forEach(profile => {
            profilesList.innerHTML += createProfileCardHTML(profile);
        });
        document.getElementById('profile-count').textContent = profiles.length;
        profilesContainer.style.display = 'block';
    }

    if (events.length > 0) {
        events.forEach(event => {
            eventsList.innerHTML += createEventCardHTML(event);
        });
        document.getElementById('event-count').textContent = events.length;
        eventsContainer.style.display = 'block';
    }

    if (profiles.length === 0 && events.length === 0) {
        document.getElementById('no-results').style.display = 'block';
    }
}

function createProfileCardHTML(profile) {
    return `
        <a href="perfil.html?id=${profile.id}" class="profile-card">
            <h3>${profile.nome || 'Nome Indisponível'}</h3>
            <p>${profile.titulo || 'Colaborador Liferay'}</p>
            <p style="margin-top: 10px; font-size: 13px;">
                Habilidades: ${(profile.habilidades || []).slice(0, 3).join(', ') || 'Nenhuma registrada'}
            </p>
        </a>
    `;
}

function createEventCardHTML(event) {
    const dataFormatada = new Date(event.data).toLocaleDateString('pt-BR');
    
    return `
        <a href="detalhes-evento.html?id=${event.id}" class="event-card">
            <h3>${event.nome}</h3>
            <p><strong><i class="fas fa-calendar-alt"></i> Data:</strong> ${dataFormatada}</p>
            <p><strong><i class="fas fa-map-marker-alt"></i> Local:</strong> ${event.local || 'Online'}</p>
            <p style="margin-top: 10px; font-size: 14px;">
                ${event.descricao.substring(0, 100)}...
            </p>
        </a>
    `;
}