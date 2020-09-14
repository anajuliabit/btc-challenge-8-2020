const NLU = require("../services/natural-language-understanding");

const classification = {
  consumo: "DUCATO",
  seguranca: "MAREA",
  desempenho: "RENEGADE",
  manutencao: "FIORINO",
  conforto: "ARGO",
  design: "FIAT 500",
  acessorios: "TORO",
};

module.exports = {
  async text(req, res) {
    const analyzeParams = {
      text: req.body.text,
      language: "pt-BR",
      features: {
        entities: {
          model: process.env.KNOW_MODEL_ID,
          sentiment: true,
          limit: 10,
        },
      },
    };

    const response = await NLU.analyze(analyzeParams);
    let sentiment = 0;
    let classification = "";
    for (const entitiy of response.entities) {
      if (entitiy.sentiment.score < sentiment) {
        sentiment = entitiy.sentiment.score;
        classification = entitiy.type;
      }
    }
    console.log(response);
    res.json({ classification });
  },
};
