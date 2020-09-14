const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const { NotFoundException } = require("../utils/exceptions");
require("dotenv").config();

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2020-08-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.NLU_API_KEY,
  }),
  serviceUrl: process.env.NLU_URL,
});

const analyze = async (analyzeParams) => {
  try {
    const results = await naturalLanguageUnderstanding.analyze(analyzeParams);
    if (results.err) {
      console.log(results.err);
      throw new NotFoundException(results.err);
    }
    return results.result;
  } catch ({ err }) {
    console.log(err);
  }
};

module.exports = {
  analyze: analyze,
};
