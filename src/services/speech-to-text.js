const speech = require("@google-cloud/speech");
const fs = require("fs");

const client = new speech.SpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
});

async function transcribe(filename) {
  const fileName = process.cwd() + "/uploads/" + filename;

  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString("base64");

  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: "FLAC",
    languageCode: "pt-BR",
    audioChannelCount: 2,
    enableAutomaticPunctuation: true,
    model: "default",
  };
  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results.map(
    (result) => result.alternatives[0].transcript
  );
  return transcription;
}

module.exports = {
  transcribe: transcribe,
};
