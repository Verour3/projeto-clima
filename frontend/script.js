const backendUrl = "https://clima-backend-gpfl.onrender.com";

async function pegarClima() {
  const cidadeInput = document.getElementById("cidade");
  const cidade = cidadeInput.value.trim();
  const loading = document.getElementById("loading");
  const pesquisaContainer = document.querySelector(".pesquisa-container");

  if (!cidade) {
    alert("Por favor, insira o nome da cidade.");
    return;
  }

  try {
    pesquisaContainer.style.display = "none";
    loading.style.display = "flex";

    const respostaClima = await fetch(
      `${backendUrl}/clima?cidade=${encodeURIComponent(cidade)}`
    );
    if (!respostaClima.ok) throw new Error("Erro ao buscar clima atual");
    const dadosClima = await respostaClima.json();

    displayClimaAtual(dadosClima);

    const respostaPrevisao = await fetch(
      `${backendUrl}/previsao?cidade=${encodeURIComponent(cidade)}`
    );
    if (!respostaPrevisao.ok) throw new Error("Erro ao buscar previsão");
    const dadosPrevisao = await respostaPrevisao.json();

    displayPrevisao(dadosPrevisao);
  } catch (erro) {
    console.error("Erro ao buscar dados:", erro);
    alert("Erro ao buscar informações do clima. Tente novamente mais tarde.");
  } finally {
    loading.style.display = "none";
    pesquisaContainer.style.display = "flex";
  }
}

function displayClimaAtual(data) {
  const temperatura = document.getElementById("temperatura");
  const climaInfo = document.getElementById("climaInfo");
  const climaIcon = document.getElementById("climaIcon");

  temperatura.innerHTML = "";
  climaInfo.innerHTML = "";
  climaIcon.src = "";

  if (!data || data.cod === "404") {
    climaInfo.innerHTML = `<p>${data?.message || "Cidade não encontrada."}</p>`;
    return;
  }

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
  atualizarFundo(descricao);
}

function displayPrevisao(hourlyData) {
  const previsaoHorario = document.getElementById("previsaoHorario");
  previsaoHorario.innerHTML = "";

  if (!hourlyData || !hourlyData.list) {
    previsaoHorario.innerHTML = "<p>Não foi possível carregar a previsão.</p>";
    return;
  }

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

function atualizarFundo(descricao) {
  const fundo = document.getElementById("background-gif");
  let imagemFundo = "";

  descricao = descricao.toLowerCase();

  if (descricao.includes("chuva") || descricao.includes("chuvoso")) {
    imagemFundo =
      "url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDN4M2EyOWk1MGd2MmF0eDk4aWh2anNxM250dGJsY3p5MHE1cHk4MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/t7Qb8655Z1VfBGr5XB/giphy.gif')";
  } else if (
    descricao.includes("nuvem") ||
    descricao.includes("algumas nuvens") ||
    descricao.includes("nublado")
  ) {
    imagemFundo =
      "url('https://d2j02ha532z66v.cloudfront.net/wp-content/uploads/2023/01/clouds.jpg')";
  } else if (descricao.includes("nuvens dispersas")) {
    imagemFundo =
      "url('https://static.vecteezy.com/ti/fotos-gratis/p1/15126735-nuvens-dispersas-no-ceu-indicando-uma-mudanca-no-tempo-gratis-foto.jpg')";
  } else if (descricao.includes("névoa")) {
    imagemFundo =
      "url('https://www.viewbug.com/media/mediafiles/2018/01/15/77016716_large1300.jpg')";
  } else if (
    descricao.includes("sol") ||
    descricao.includes("céu limpo") ||
    descricao.includes("ensolarado")
  ) {
    imagemFundo =
      "url('https://upload.wikimedia.org/wikipedia/commons/2/26/Sunny_day_in_India.jpg')";
  } else if (descricao.includes("neve")) {
    imagemFundo =
      "url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTM2YXhyNnhrNmY3MDh1ZjJocXMzamlvNndnaXd4a3BxeGYyd2piZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xTcnThWTvBZGrgx2dW/giphy.gif')";
  } else {
    imagemFundo = "";
  }

  fundo.style.backgroundImage = imagemFundo;
}
