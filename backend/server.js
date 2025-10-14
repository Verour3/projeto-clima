const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
console.log("API_KEY carregada:", process.env.API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint para buscar clima atual
app.get("/clima", async (req, res) => {
  const cidade = req.query.cidade;
  if (!cidade) {
    return res.status(400).json({ error: "Cidade não informada" });
  }

  try {
    const apiKey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cidade
    )}&appid=${apiKey}&units=metric&lang=pt_br`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Erro /clima:", error?.response?.data || error.message);
    const status = error?.response?.status || 500;
    res.status(status).json({ error: "Erro ao buscar dados do clima" });
  }
});

// Endpoint para previsão horária
app.get("/previsao", async (req, res) => {
  const cidade = req.query.cidade;
  if (!cidade) {
    return res.status(400).json({ error: "Cidade não informada" });
  }

  try {
    const apiKey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      cidade
    )}&appid=${apiKey}&units=metric&lang=pt_br`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Erro /previsao:", error?.response?.data || error.message);
    const status = error?.response?.status || 500;
    res.status(status).json({ error: "Erro ao buscar previsão" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
