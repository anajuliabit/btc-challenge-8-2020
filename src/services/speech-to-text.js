const fs = require("fs");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.STT_API_KEY,
  }),
  serviceUrl: process.env.STT_URL,
});

const params = {
  objectMode: false,
  contentType: "audio/flac",
  model: "pt-BR_BroadbandModel",
};

const recognizeStream = speechToText.recognizeUsingWebSocket(params);

fs.createReadStream(process.cwd() + "/audio_sample.flac").pipe(recognizeStream);
recognizeStream.pipe(fs.createWriteStream("transcription.txt"));
recognizeStream.setEncoding("utf8");

recognizeStream.on("data", function (event) {
  onEvent("Data:", event);
});
recognizeStream.on("error", function (event) {
  onEvent("Error:", event);
});
recognizeStream.on("close", function (event) {
  onEvent("Close:", event);
});

function onEvent(name, event) {
  console.log(name, JSON.stringify(event, null, 2));
}
