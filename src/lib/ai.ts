import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export interface BlogPostContent {
  title: string;
  subtitle: string;
  body: string;
  coverImageUrl?: string;
}

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Will be undefined if not set in .env.local
// });

const MODEL_NAME = "gemini-1.5-flash-latest"; // Or "gemini-pro" / "gemini-1.0-pro"

/**
 * Generates blog post content from extracted text using Google Gemini API (or simulates if API key is missing).
 * @param extractedText The text extracted from the uploaded document.
 * @param fileName Optional: The name of the uploaded file, for context.
 * @returns A promise that resolves to the generated BlogPostContent.
 */
export async function generateBlogPostFromText(
  extractedText: string,
  fileName?: string
): Promise<BlogPostContent> {
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!googleApiKey) {
    console.warn("GOOGLE_API_KEY not found. Using placeholder AI response.");
    return generatePlaceholderBlogPost(extractedText, fileName);
  }

  console.log(`Using Google Gemini API to generate blog post for ${fileName || 'uploaded document'}...`);

  const genAI = new GoogleGenerativeAI(googleApiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json", // Request JSON output
      temperature: 0.7,
    }
  });

  const prompt = `You are an expert blog post writer. Your task is to generate a blog post based on the provided text.
The blog post should have a compelling title, an engaging subtitle, and a well-structured body.
The tone should be informative yet entertaining.
The output must be a JSON object with the following structure: {"title": "string", "subtitle": "string", "body": "string (markdown format)"}.
Do NOT include an "imagePrompt" field in the JSON.

Here is the text extracted from the document titled "${fileName || 'document'}":
---
${extractedText}
---
Generate the blog post JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textContentString = response.text();

    if (!textContentString) {
      throw new Error("Google Gemini API returned no content.");
    }
    
    const parsedTextContent = JSON.parse(textContentString) as {title: string, subtitle: string, body: string};
    console.log(`Google Gemini API text generation successful for ${fileName || 'uploaded document'}.`);

    // Image generation with DALL-E is disabled when using Gemini.
    // We can explore Gemini's image capabilities (e.g., Imagen) later if needed.
    let coverImageUrl: string | undefined = undefined; 
    console.warn("Image generation with DALL-E is currently disabled as we are using Google Gemini for text. A placeholder image will be used if the placeholder function is called, or no image if generation is successful.");


    return {
      title: parsedTextContent.title,
      subtitle: parsedTextContent.subtitle,
      body: parsedTextContent.body,
      coverImageUrl: coverImageUrl, // No image from Gemini text model directly
    };

  } catch (error) {
    console.error("Error in Google Gemini AI processing pipeline:", error);
    console.warn("Falling back to placeholder AI response due to API error.");
    return generatePlaceholderBlogPost(extractedText, fileName, `AI API Error: ${(error as Error).message}`);
  }
}

/**
 * Generates a placeholder blog post.
 */
function generatePlaceholderBlogPost(
  extractedText: string,
  fileName?: string,
  errorContext?: string
): BlogPostContent {
  console.log(`AI Service: Simulating blog post generation for ${fileName || 'uploaded document'}${errorContext ? ` (Error: ${errorContext})` : ''}...`);
  
  const randomId = Math.random().toString(36).substring(7);
  const placeholderTitle = `Amazing Insights from ${fileName || 'Your Document'} (Placeholder ${randomId})`;
  const placeholderSubtitle = `A deep dive into the key points of ${fileName || 'the uploaded content'}. (Placeholder Subtitle)`;
  
  let placeholderBody = `This is a **placeholder** blog post exploring the content found in *${fileName || 'your document'}*.\n\n`;
  if (errorContext) {
    placeholderBody += `_Note: Switched to placeholder due to: ${errorContext}_\n\n`;
  }
  placeholderBody += `The document covers several important topics. Here's a simulated summary:\n\n`;
  
  const sentences = extractedText.split('. ').slice(0, 3);
  sentences.forEach((sentence, index) => {
    if (sentence.trim()) {
      placeholderBody += `*   **Key Point ${index + 1}:** "${sentence.trim()}."\n`;
    }
  });
   if (sentences.length === 0 && extractedText.length > 0) {
    placeholderBody += `*   The document contains text, but our simple placeholder couldn't easily break it down. A real LLM would handle this better!\n`;
  } else if (extractedText.length === 0) {
     placeholderBody += `*   The document appears to be empty or text extraction failed.\n`;
  }
  placeholderBody += `\nFurther analysis by a sophisticated AI model (like OpenAI's GPT series) would yield a much richer and more engaging blog post. This is just a simulation.`;

  // Simulate a placeholder image URL using a dynamic service
  const imageKeywords = (fileName || "abstract").split('.')[0].replace(/\s+/g, '+');
  const placeholderImageUrl = `https://source.unsplash.com/featured/1024x768/?${imageKeywords},${randomId}`;
  // Or use picsum: `https://picsum.photos/seed/${randomId}/1024/768`

  console.log(`Using placeholder image URL: ${placeholderImageUrl}`);

  return {
    title: placeholderTitle,
    subtitle: placeholderSubtitle,
    body: placeholderBody,
    coverImageUrl: placeholderImageUrl,
  };
}
