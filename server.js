const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

// SUBSTITUA abaixo pela sua URI do MongoDB Atlas:
const uri = 'mongodb+srv://admin:admin123@cluster0.780yk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


app.use(express.static(__dirname));
app.use(express.json());

let db;

// Conectar ao MongoDB Atlas
MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        db = client.db("loginDB"); // nome do banco
        console.log("✅ Conectado ao MongoDB Atlas");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Erro ao conectar ao MongoDB:", err);
    });

// Rota para salvar login no MongoDB
app.post("/login", async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).send("Dados incompletos.");
    }

    try {
        const collection = db.collection("logins"); // nome da coleção
        const novoLogin = {
            usuario,
            senha,
            data: new Date(),
        };

        await collection.insertOne(novoLogin);

        res.status(200).send("Login salvo no MongoDB!");
    } catch (err) {
        console.error("Erro ao salvar no MongoDB:", err);
        res.status(500).send("Erro ao salvar no banco de dados.");
    }
});
