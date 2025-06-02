import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export interface BlogPostContent {
  title: string;
  subtitle: string;
  body: string;
  coverImageUrl?: string; // This will be populated by a new mechanism
}

// Interface for the AI's structured response including keywords
interface AiGeneratedContent extends Omit<BlogPostContent, 'coverImageUrl'> {
  imageSearchKeywords: string[];
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
Additionally, provide an array of 3-5 relevant keywords that can be used to search for a suitable cover image on the internet.
The tone should be informative yet entertaining.
The output must be a JSON object with the following structure: {"title": "string", "subtitle": "string", "body": "string (markdown format)", "imageSearchKeywords": ["string", "string", ...]}.

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
    
    // Parse the JSON response which now includes imageSearchKeywords
    const parsedContent = JSON.parse(textContentString) as AiGeneratedContent;
    console.log(`Google Gemini API text generation successful for ${fileName || 'uploaded document'}.`);
    console.log(`Suggested image search keywords: ${parsedContent.imageSearchKeywords.join(', ')}`);

    let coverImageUrl: string | undefined = undefined;

    if (parsedContent.imageSearchKeywords && parsedContent.imageSearchKeywords.length > 0) {
      console.log(`Attempting to find an image URL with Gemini using keywords: ${parsedContent.imageSearchKeywords.join(', ')} for title: "${parsedContent.title}"`);
      
      // Use the same model for the second call
      const imageSearchPrompt = `You are an AI assistant helping to find a relevant cover image for a blog post.
Blog Post Title: "${parsedContent.title}"
Suggested Keywords: ${parsedContent.imageSearchKeywords.join(', ')}

Your task is to find a single, publicly accessible, direct image URL (http or https) that is highly relevant to the blog post title and keywords.
The image should be suitable for a blog cover. Prioritize high-quality, visually appealing images.
Return ONLY a JSON object with the following structure: {"imageUrl": "string_url_or_null"}.
If you cannot find a suitable and directly linkable image, return {"imageUrl": null}.
Do not provide any other text, explanation, or formatting. Just the JSON object.`;

      try {
        // Re-using the same model instance 'model' configured earlier
        const imageSearchResult = await model.generateContent(imageSearchPrompt); // Still expecting JSON
        const imageSearchResponse = imageSearchResult.response;
        const imageUrlString = imageSearchResponse.text();

        if (imageUrlString) {
          const parsedImageResponse = JSON.parse(imageUrlString) as { imageUrl: string | null };
          if (parsedImageResponse.imageUrl && (parsedImageResponse.imageUrl.startsWith('http://') || parsedImageResponse.imageUrl.startsWith('https://'))) {
            coverImageUrl = parsedImageResponse.imageUrl;
            console.log(`Successfully found image URL with Gemini: ${coverImageUrl}`);
          } else if (parsedImageResponse.imageUrl === null) {
            console.warn("Gemini search indicated no suitable image URL found (returned null).");
          } else {
            console.warn("Gemini image search did not return a valid URL or null. Received:", imageUrlString);
          }
        } else {
          console.warn("Gemini image search returned no content.");
        }
      } catch (imageSearchError) {
        console.error("Error during Gemini image URL search:", imageSearchError);
        console.warn("Proceeding without a Gemini-found cover image due to search error.");
      }
    } else {
      console.warn("No image search keywords provided by the initial AI generation. Skipping image URL search.");
    }

    return {
      title: parsedContent.title,
      subtitle: parsedContent.subtitle,
      body: parsedContent.body,
      coverImageUrl: coverImageUrl,
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
  // const imageKeywords = (fileName || "abstract").split('.')[0].replace(/\s+/g, '+');
  // const placeholderImageUrl = `https://source.unsplash.com/featured/1024x768/?${imageKeywords},${randomId}`;
  // Or use picsum: `https://picsum.photos/seed/${randomId}/1024/768`
  // console.log(`Using placeholder image URL: ${placeholderImageUrl}`);
  // No longer using Unsplash/Picsum for placeholders if main generation fails.
  // The main function will return undefined for coverImageUrl if Gemini image gen fails.

  console.log(`No dynamic placeholder image will be used for this simulated post.`);


  return {
    title: placeholderTitle,
    subtitle: placeholderSubtitle,
    body: placeholderBody,
    coverImageUrl: undefined, // No placeholder image if AI fails and this function is called
  };
}
