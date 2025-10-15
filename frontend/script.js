const backendUrl = "https://clima-backend-gpfl.onrender.com";

// buscar clima e previsão
async function pegarClima() {
  const cidade = document.getElementById("cidade").value.trim();

  if (!cidade) {
    alert("Por favor, insira o nome da cidade.");
    return;
  }

  try {
    // Requisição do clima atual
    const respostaClima = await fetch(`${backendUrl}/clima?cidade=${encodeURIComponent(cidade)}`);
    const dadosClima = await respostaClima.json();

    displayClimaAtual(dadosClima);

    // Requisição da previsão
    const respostaPrevisao = await fetch(`${backendUrl}/previsao?cidade=${encodeURIComponent(cidade)}`);
    const dadosPrevisao = await respostaPrevisao.json();

    displayPrevisao(dadosPrevisao);
  } catch (erro) {
    console.error("Erro ao buscar dados:", erro);
    alert("Erro ao buscar informações do clima. Tente novamente mais tarde.");
  }
}

// Exibe o clima atual
function displayClimaAtual(data) {
  const temperatura = document.getElementById("temperatura");
  const climaInfo = document.getElementById("climaInfo");
  const climaIcon = document.getElementById("climaIcon");

  temperatura.innerHTML = "";
  climaInfo.innerHTML = "";
  climaIcon.src = "";

  if (data.cod === "404") {
    climaInfo.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cidadeNome = data.name;
    const temp = Math.round(data.main.temp);
    const descricao = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    temperatura.innerHTML = `<p>${temp}°C</p>`;
    climaInfo.innerHTML = `<p>${cidadeNome}</p><p>${descricao}</p>`;
    climaIcon.src = iconUrl;
    climaIcon.alt = descricao;
    climaIcon.style.display = "block";
  }
}

// Exibe a previsão por horário (próximas 24h)
function displayPrevisao(hourlyData) {
  const previsaoHorario = document.getElementById("previsaoHorario");
  previsaoHorario.innerHTML = "";

  const proximas24h = hourlyData.list.slice(0, 8);

  proximas24h.forEach((item) => {
    const dataHora = new Date(item.dt * 1000);
    const hora = dataHora.getHours().toString().padStart(2, "0");
    const temp = Math.round(item.main.temp);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const horarioItemHtml = `
      <div class="horario-item">
        <span>${hora}:00</span>
        <img src="${iconUrl}" alt="${item.weather[0].description}">
        <span>${temp}°C</span>
      </div>
    `;
    previsaoHorario.innerHTML += horarioItemHtml;
  });
}
