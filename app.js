const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/test-array", (req, res) => {
  const arrayDentroDeArray = [
    [
        { "nome": "JOSE" },
        { "nome": "MARIA" },
        { "nome": "SERGIO" }
    ],
    [
        { "nome": "JOSE" },
        { "nome": "MARIA" },
        { "nome": "SERGIO" }
    ]
  ];

  res.json(arrayDentroDeArray);
});

app.post("/api/refatorando", async (req, res) => {
  try {
    const { url, method, requestBody } = req.body;

    if (!url || !method) {
      return res.status(400).json({ error: "url e method são obrigatórios." });
    }

    const validMethods = ["get", "post", "put", "delete"];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ error: "Método inválido." });
    }

    const axiosConfig = {
      method,
      url,
    };

    if (requestBody) {
      axiosConfig.data = requestBody;
    }

    const response = await axios(axiosConfig);

    let resultado = response.data;

    if (Array.isArray(resultado)) {
      resultado = converterArrayParaObjeto(resultado);
    }

    res.json(resultado);
  } catch (error) {
    console.error("Erro ao chamar a API REST:", error);
    res.status(500).json({ error: "Erro ao chamar a API REST" });
  }
});

function converterArrayParaObjeto(array) {
  if (!Array.isArray(array)) {
    throw new Error('O argumento deve ser um array.');
  }

  return array.map(elemento => {
    if (Array.isArray(elemento)) {
      const objeto = {};
      elemento.forEach((valor, indice) => {
        objeto[`prop${indice + 1}`] = valor;
      });
      return objeto;
    } else {
      return elemento;
    }
  });
}

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
