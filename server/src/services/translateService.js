import { v2 as translateV2 } from "@google-cloud/translate";

const { Translate } = translateV2;

let translateClient;

function getTranslateClient() {
  if (!translateClient) {
    const options = {};
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      options.key = process.env.GOOGLE_TRANSLATE_API_KEY;
    }
    translateClient = new Translate(options);
  }
  return translateClient;
}

export async function translateToEnglish(text) {
  if (!text || !text.trim()) {
    const error = new Error("Text is required for translation");
    error.statusCode = 400;
    throw error;
  }

  if (!process.env.GOOGLE_TRANSLATE_API_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const error = new Error("Translation API credentials are not configured on the server");
    error.statusCode = 503;
    throw error;
  }

  const [translation] = await getTranslateClient().translate(text, "en");
  return Array.isArray(translation) ? translation.join(" ") : translation;
}
