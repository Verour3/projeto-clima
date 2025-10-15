import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());

const API_KEY = process.env.API_KEY;

// Endpoint de clima atual
app.get("/clima", async (req, res) => {
  const cidade = req.query.cidade;
  if (!cidade)
    return res.status(400).json({ error: "Por favor, informe uma cidade" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cidade
      )}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Erro /clima:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erro ao buscar dados do clima" });
  }
});

// Endpoint de previsão
app.get("/previsao", async (req, res) => {
  const cidade = req.query.cidade;
  if (!cidade)
    return res.status(400).json({ error: "Por favor, informe uma cidade" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        cidade
      )}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Erro /previsao:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erro ao buscar previsão" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
