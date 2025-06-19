
import {genkit, type GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const activePlugins: GenkitPlugin[] = [];
let defaultModel: string | undefined = undefined;
export let isGoogleAIPluginActive = false; // Export a flag

// Плагин googleAI() автоматически ищет ключ API в переменных окружения:
// GOOGLE_API_KEY или GOOGLE_GENERATIVE_AI_API_KEY
const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (googleApiKey) {
  activePlugins.push(googleAI());
  defaultModel = 'googleai/gemini-2.0-flash';
  isGoogleAIPluginActive = true; // Set flag to true
  console.log('Плагин Google AI успешно инициализирован с API-ключом.');
} else {
  isGoogleAIPluginActive = false; // Explicitly set to false
  console.warn(
    'Переменные окружения GOOGLE_API_KEY или GOOGLE_GENERATIVE_AI_API_KEY не установлены. ' +
    'Функции Google AI будут отключены. Рекомендации по продуктам и другие AI-возможности могут не работать. ' +
    'Если вы хотите использовать AI-функции, установите ключ в вашем файле .env (например, GOOGLE_API_KEY="ваш_ключ").'
  );
}

export const ai = genkit({
  plugins: activePlugins,
  ...(defaultModel && { model: defaultModel }), // Устанавливаем модель по умолчанию, только если плагин Google AI активен
  // telemetry: false, // Раскомментируйте, если хотите отключить телеметрию для локальной разработки
  // enableTracing: true, // Раскомментируйте для включения трассировки
});
