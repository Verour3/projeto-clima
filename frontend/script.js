function pegarClima() {
  const cidade = document.getElementById("cidade").value;

  if (!cidade) {
    alert("Por favor, insira o nome da cidade.");
    return;
  }

  const climaAtualUrl = `http://localhost:3000/clima?cidade=${encodeURIComponent(
    cidade
  )}`;
  const previsaoHorarioUrl = `http://localhost:3000/previsao?cidade=${encodeURIComponent(
    cidade
  )}`;

  // Clima atual
  fetch(climaAtualUrl)
    .then((response) => response.json())
    .then((data) => {
      displayClimaAtual(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados do clima atual:", error);
      alert("Erro ao buscar dados do clima atual. Por favor, tente novamente.");
    });

  fetch(previsaoHorarioUrl)
    .then((response) => response.json())
    .then((data) => {
      displayPrevisao(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados da previsão do tempo:", error);
      alert(
        "Erro ao buscar dados da previsão do tempo. Por favor, tente novamente."
      );
    });
}

function displayClimaAtual(data) {
  const temperatura = document.getElementById("temperatura");
  const climaInfo = document.getElementById("climaInfo");
  const climaIcon = document.getElementById("climaIcon");

  // Limpar previsões anteriores
  temperatura.innerHTML = "";
  climaInfo.innerHTML = "";
  climaIcon.src = "";

  if (data.cod === "404") {
    climaInfo.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cidadeNome = data.name;
    const temp = Math.round(data.main.temp); // Celsius já está pronto
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

function displayPrevisao(hourlyData) {
  const previsaoHorario = document.getElementById("previsaoHorario");
  previsaoHorario.innerHTML = "";

  const proximas24h = hourlyData.list.slice(0, 8); // 3h por previsão = 8 previsões para 24h

  proximas24h.forEach((item) => {
    const dataHora = new Date(item.dt * 1000);
    const hora = dataHora.getHours();
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
