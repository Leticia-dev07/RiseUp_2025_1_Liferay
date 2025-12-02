document.addEventListener("DOMContentLoaded", () => {
    carregarEventosHome();
    setupCarousels('[data-carousel-id="cursos"]');
});

async function carregarEventosHome() {
  const track = document.querySelector(
    '[data-carousel-id="eventos"] .carousel-track'
  );
  if (!track) return;

    try {
        const response = await fetch(`${API_URL}/eventos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token, 
            },
        });

        if (!response.ok) {
            track.innerHTML = '<p style="padding:20px;">Não foi possível carregar os eventos.</p>';
            return;
        }

        const eventos = await response.json();
        track.innerHTML = "";

    if (eventos.length === 0) {
      track.innerHTML =
        '<p style="padding:20px; color:#666;">Nenhum evento encontrado.</p>';
      return;
    }

        eventos.forEach((evento) => {
            const card = document.createElement("div");
            card.classList.add("card");

            // --- ALTERAÇÃO: Card Clicável ---
            // Define o cursor como mãozinha para indicar clique
            card.style.cursor = "pointer";
            
            // Adiciona o evento de clique em todo o card
            card.onclick = function() {
                window.location.href = `detalhes-evento.html?id=${evento.id}`;
            };
            // --------------------------------

            const img = document.createElement("img");
            img.src = "assets/pictures/liferay-8.png"; 
            img.alt = evento.nome;

            const h3 = document.createElement("h3");
            // Apenas o texto do nome, sem link <a> dentro, pois o card todo já é link
            h3.textContent = evento.nome;

            const pData = document.createElement("p");
            pData.style.fontWeight = "bold";
            pData.style.color = "#00318F";
            pData.style.marginBottom = "5px";
            if (evento.data) {
                const dataObj = new Date(evento.data);
                pData.textContent = dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
            }

            const pDesc = document.createElement("p");
            pDesc.textContent = evento.descricao || "Sem descrição.";

            card.appendChild(img);
            card.appendChild(h3);
            card.appendChild(pData);
            card.appendChild(pDesc);

      track.appendChild(card);
    });

        setupCarousels('[data-carousel-id="eventos"]'); 

    } catch (error) {
        console.error("Erro eventos:", error);
        track.innerHTML = '<p style="padding:20px;">Erro de conexão.</p>';
    }
}

function setupCarousels(selector) {
  const carousel = document.querySelector(selector);
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const prevBtn = carousel.querySelector(".carousel-arrow.prev");
  const nextBtn = carousel.querySelector(".carousel-arrow.next");
  if (!track || !prevBtn || !nextBtn) return;

    let index = 0;
    
    const updatePosition = () => {
        const cards = track.querySelectorAll(".card");
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth + 30;
        const visibleCards = Math.floor(carousel.offsetWidth / cardWidth) || 1;
        const maxIndex = Math.max(0, cards.length - visibleCards);

        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;

    track.style.transform = `translateX(-${index * cardWidth}px)`;

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index >= maxIndex;
        
        if (cards.length <= visibleCards) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    };

    prevBtn.addEventListener('click', () => { index--; updatePosition(); });
    nextBtn.addEventListener('click', () => { index++; updatePosition(); });
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
}