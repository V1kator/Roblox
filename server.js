const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static(__dirname)); // Servir arquivos da pasta atual
app.use(express.json()); // Permitir JSON no body da requisição

app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    const novoLogin = {
        usuario,
        senha,
        data: new Date().toISOString(),
    };

    const arquivo = path.join(__dirname, "usuarios.json");

    fs.readFile(arquivo, "utf8", (err, data) => {
        let usuarios = [];

        if (!err && data) {
            try {
                usuarios = JSON.parse(data);
            } catch (e) {
                console.error("Erro ao fazer parse:", e);
            }
        }

        usuarios.push(novoLogin);

        fs.writeFile(arquivo, JSON.stringify(usuarios, null, 2), (err) => {
            if (err) {
                console.error("Erro ao salvar:", err);
                return res.status(500).send("Erro ao salvar.");
            }

            res.status(200).send("Salvo com sucesso.");
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
