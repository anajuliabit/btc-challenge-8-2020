const speech = require("@google-cloud/speech");
const fs = require("fs");

const client = new speech.SpeechClient({
  credentials: {
    client_email: "admin-763@ibm-desafio-8.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCuIJFnHwgegWOr\nyT8Z6FeTdD/dvflb+5Ww+2LnUKiuO8Jxx27tgu4UNhZoMKXrWqonX8prURNdbbj5\n2Tlnr/yHTxTVHCXaQAja3o9DCyKj/seRBenWu8lXyI5cRgb2H7Q+kXXB8/kK9Ilx\nGetUX9F5mpLS5heLr3ZjeMaNVCDBY422ijkoPC0LlMQ6aO2B3VUOTfOyscOyST1q\naIcv0iXKpMAeaKqzo2SGQ3W4yvcyYxrgeGWQ/iAXzNVvf995zp6gT3JKam+bC91b\nv3YinnTTKNd5EBIF1bVJ2CK3BEKP93tohkatkzYbpp0u7Tw978COzmI3Fz9ktzSu\n0SKgcG3PAgMBAAECggEACfwYGl+vKYCl5H3fvm6SRwRNfTudhubASKvBmh4H7iXD\nGp8i/z+Yw1PuqP7RJNPIGgXmJ404nQzjpIAOSKHQyzl/qlC44vD1EQfeEywaSmkb\nrHc4V3XhL8VyVFw3nflnbocMx5hj2Xr4PqIL2oS8EEsKzEkhZIMlOML+L7B5SF2C\nq0aCnknvmTEz29P6cG8QZU4pbcX671GF7sxUZiO2UojwJgKIaQtwhiXPc6t3Wpp1\nI1+Aw68gTIslbKiqGOfNOJX1KTHKbqYJ/gfC2mjPBPM7IBcQPxtocyZkuTkN6amM\nVZ2nyppGW+TBgBWobTSzLXJufQqcWIGra4cpeFyjsQKBgQDtc3HVKUbBDxUfNNVW\n/8/QGqQw2j3RdNFSR+jTQfR0T0And4swT0MadhT4l4J99ymIDcQJq/AV9XfiNfXk\nG0htJPEBypHzqX6A/TqS7xto75mnqmR1FIF1pDk70WS7u4oIzYTu6qAr0Y9QWwal\nWsoXwRzB4sbrwSTkmlDNQuW4kwKBgQC7usWy03WiRTKYjbGt6edQnAVnBbnKXmhw\nFfJWb0n5iZzRZoMe3aRwpeO4BbMU87XYLp/px1yEOuSwNOaTTyK6PkB7uqM9GxL4\nooVfToLQGESoJ+V+Rsbb4RnwDSYOnWwV4ZRjmNiLKdye7MEWfONrWRjEMnNiAStR\nf0aigt1nVQKBgEY3gU37qsSkZSaZRQ05EIcFmdAoeWdbGBsw0JTISDWsydfh7fMX\nPUyx5nmstBXz5QAqsfH6OkEEGbN3KYOO3dgIuIxDDu3zDUmvmIai1oQtdk6ygIpu\nyemz6ojZ3uP1DViVDd5o23yZt7uXb1uugVyM6qgbG5/TuckwKPzJ74ypAoGACspe\niLvc3BnsIZaratqyABEnwlcy6a3phN/OESfOcbh2OhcRXFnTFOKEJ1S0iXTEtAti\nB7b822DjOjmgM0FuNpRTcok0ztNakM4Oqn7ByCJM9/lrGIoK7iKPMhwfXuGvj8Zq\nmBr1/3HFi6ECLD+7drUlVkmsFisJCWMudTLedQ0CgYBI0EofWS5h352JZO/q2hPc\nz4ajHi0i6m/kyttjSYZeuGMlYgWAG7c6xtVX/AOVU86ispsIscNUOZQJGOAq5icT\nN6rGwlnsN0pv79Aug6dezkZMmQenX0hpt8gFVlEMxYNmzTcyxxG592otPmk6pkws\ntMNhbtbe9rTfKeLCDlgKwg==\n-----END PRIVATE KEY-----\n",
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
