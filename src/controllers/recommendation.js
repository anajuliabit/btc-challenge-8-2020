const NLU = require("../services/natural-language-understanding");
const STT = require("../services/speech-to-text");

const classification = {
  CONSUMO: ["ARGO", "TORO"],
  SEGURANCA: ["DUCATO", "TORO"],
  DESEMPENHO: ["MAREA", "TORO"],
  MANUTENCAO: ["FIORINO", "TORO"],
  CONFORTO: ["CRONOS", "DUCATO"],
  DESIGN: ["CRONOS", "ARGO"],
  ACESSORIOS: ["ARGO", "RENEGADE"],
};

const priority = [
  "SEGURANCA",
  "CONSUMO",
  "DESEMPENHO",
  "MANUTENCAO",
  "CONFORTO",
  "DESIGN",
  "ACESSORIOS",
];

function diff(num1, num2) {
  if (num1 > num2) {
    return num1 - num2;
  } else {
    return num2 - num1;
  }
}

async function callAnalyze(analyzeParams, car) {
  const analyze = await NLU.analyze(analyzeParams);
  if (analyze && analyze.entities && analyze.entities.length) {
    const entities = analyze.entities
      .filter((entitiy) => entitiy.sentiment.label === "negative")
      .map((entitiy) => {
        return {
          entity: entitiy.type,
          sentiment: entitiy.sentiment.score,
          mention: entitiy.text,
        };
      });

    if (entities.length) {
      let sentiment = entities[0].sentiment;
      let betterScore = entities[0].entity;

      for (let index = 1; index < entities.length; index++) {
        if (
          entities[index].sentiment < sentiment &&
          diff(Math.abs(sentiment), Math.abs(entities[index].sentiment)) > 0.1
        ) {
          sentiment = entities[index].sentiment;
          betterScore = entities[index].entity;
        } else if (
          (diff(Math.abs(sentiment), Math.abs(entities[index].sentiment)) <
            0.1 ||
            sentiment === entities[index].sentiment) &&
          priority.indexOf(betterScore) >
            priority.indexOf(entities[index].entity)
        ) {
          sentiment = entities[index].sentiment;
          betterScore = entities[index].entity;
        }
      }

      if (betterScore) {
        if (
          classification[betterScore][0]
            .toUpperCase()
            .trim()
            .replace(/\s/g, "") !== car.toUpperCase().trim().replace(/\s/g, "")
        ) {
          return {
            recomendation: classification[betterScore][0],
            entities,
          };
        }
        return {
          recomendation: classification[betterScore][1],
          entities,
        };
      }
    }
    return { recomendation: "", entities: [] };
  }
  return { recomendation: "", entities: [] };
}

module.exports = {
  async recommend(req, res) {
    let text = req.body && req.body.text;
    if (req.file && req.file.filename) {
      result = await STT.transcribe(req.file.filename);
      text = result[0];
    }
    const response = await callAnalyze(
      {
        text,
        language: "pt-BR",
        features: {
          entities: {
            model: process.env.KNOW_MODEL_ID,
            sentiment: true,
            limit: 10,
          },
        },
      },
      req.body.car
    );
    res.json(response);
  },
};
