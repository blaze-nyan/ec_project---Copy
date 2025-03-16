import axios from "axios";

const GEMINI_API_KEY = "AIzaSyCiFJuQCeejO5u2an5vc3TBfmpWqXaHUpM";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, data } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }
    console.log(data);

    const formattedPrompt = `
${prompt}

IMPORTANT FORMATTING INSTRUCTIONS:
1. Do not use any asterisks (*) or stars in your response
2. Use clear section headings without any asterisks or stars
3. Format numbers clearly and use proper currency symbols
4. Organize insights in a numbered list without asterisks
5. Separate sections with line breaks for readability
`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: formattedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let generatedText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    generatedText = generatedText.replace(/\*/g, "");

    return res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    console.error("Error details:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Failed to generate content with Gemini",
      details: error.response?.data || error.message,
    });
  }
}
