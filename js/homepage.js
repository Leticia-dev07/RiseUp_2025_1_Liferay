// ===============================================
// ARQUIVO: js/homepage.js (CORRIGIDO)
// ===============================================

// OBS: As variáveis 'API_URL' e 'token' já vêm do arquivo global.js.
// Não declaramos elas aqui para evitar o erro "Identifier 'token' has already been declared".

document.addEventListener("DOMContentLoaded", () => {
  carregarEventosHome();
  setupCarousels('[data-carousel-id="cursos"]'); // Cursos (estático)
});

// =====================
// CARREGAR EVENTOS (Do Banco)
// =====================
async function carregarEventosHome() {
  const track = document.querySelector(
    '[data-carousel-id="eventos"] .carousel-track'
  );
  if (!track) return;

  try {
    // 🌟 MUDANÇA: Usamos a variável global 'API_URL' (que aponta para o Render)
    const response = await fetch(`${API_URL}/eventos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 🌟 MUDANÇA: Usamos a variável global 'token'
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      // Se falhar (ex: 401), o global.js já trata o redirect,
      // aqui só limpamos o carrossel.
      track.innerHTML =
        '<p style="padding:20px;">Não foi possível carregar os eventos.</p>';
      return;
    }

    const eventos = await response.json();
    track.innerHTML = ""; // Limpa o loading

    if (eventos.length === 0) {
      track.innerHTML =
        '<p style="padding:20px; color:#666;">Nenhum evento encontrado.</p>';
      return;
    }

    eventos.forEach((evento) => {
      // Cria o Card
      const card = document.createElement("div");
      card.classList.add("card");

      // Imagem (usa uma padrão se não tiver)
      const img = document.createElement("img");
      img.src = "assets/pictures/liferay-devcon.jpg";
      img.alt = evento.nome;

      // Título
      const h3 = document.createElement("h3");
      const link = document.createElement("a");
      link.href = `detalhes-evento.html?id=${evento.id}`;
      link.textContent = evento.nome;
      h3.appendChild(link);

      // Data
      const pData = document.createElement("p");
      pData.style.fontWeight = "bold";
      pData.style.color = "#00318F";
      pData.style.marginBottom = "5px";
      if (evento.data) {
        const dataObj = new Date(evento.data);
        pData.textContent = dataObj.toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        });
      }

      // Descrição
      const pDesc = document.createElement("p");
      pDesc.textContent = evento.descricao || "Sem descrição.";

      // Monta o Card
      card.appendChild(img);
      card.appendChild(h3);
      card.appendChild(pData);
      card.appendChild(pDesc);

      track.appendChild(card);
    });

    // Ativa a funcionalidade de girar o carrossel
    setupCarousels('[data-carousel-id="eventos"]');
  } catch (error) {
    console.error("Erro eventos:", error);
    track.innerHTML = '<p style="padding:20px;">Erro de conexão.</p>';
  }
}

// =====================
// LÓGICA DO CARROSSEL
// =====================
function setupCarousels(selector) {
  const carousel = document.querySelector(selector);
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const prevBtn = carousel.querySelector(".carousel-arrow.prev");
  const nextBtn = carousel.querySelector(".carousel-arrow.next");
  if (!track || !prevBtn || !nextBtn) return;

  let index = 0;

  // Atualiza posição
  const updatePosition = () => {
    const cards = track.querySelectorAll(".card");
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 30; // largura + gap
    const visibleCards = Math.floor(carousel.offsetWidth / cardWidth) || 1;
    const maxIndex = Math.max(0, cards.length - visibleCards);

    // Limites
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;

    track.style.transform = `translateX(-${index * cardWidth}px)`;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex;

    if (cards.length <= visibleCards) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
    }
  };

  
  prevBtn.addEventListener("click", () => {
    index--;
    updatePosition();
  });
  nextBtn.addEventListener("click", () => {
    index++;
    updatePosition();
  });

  // Atualiza ao carregar e redimensionar
  updatePosition();
  window.addEventListener("resize", updatePosition);
}
