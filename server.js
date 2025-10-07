import express from "express";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ler JSON no corpo das requisições
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(__dirname));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1 },
});

// Rota para salvar login
app.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const db = client.db("meuBanco"); // nome do DB
    const collection = db.collection("usuarios"); // nome da coleção
    await collection.insertOne({ usuario, senha, criadoEm: new Date() });
    res.status(200).send("Login salvo com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar login:", err);
    res.status(500).send("Erro ao salvar login.");
  }
});

// Servir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Conectar no MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
  }
}
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
