import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'; // Prevent static analysis issues
import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import { generateBlogPostFromText, BlogPostContent } from '@/lib/ai';
import { prisma } from '@/lib/db';

async function processAndSaveDocument(file: File) {
  console.log(`[BG_PROCESS_START] Processing document: ${file.name}, Type: ${file.type}, Size: ${file.size}`);
  try {
    const bytes = await file.arrayBuffer();
    console.log(`[BG_PROCESS_ARRAY_BUFFER_DONE] ${file.name}`);
    const buffer = Buffer.from(bytes);
    console.log(`[BG_PROCESS_BUFFER_CONVERT_DONE] ${file.name}`);
    let extractedText = '';

    if (file.type === 'application/pdf') {
      console.log(`[BG_PROCESS_PDF_START_PARSE] ${file.name}`);
      const data = await pdf(buffer);
      extractedText = data.text;
      console.log(`[BG_PROCESS_PDF_END_PARSE] ${file.name}, Text length: ${extractedText.length}`);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log(`[BG_PROCESS_DOCX_START_PARSE] ${file.name}`);
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
      console.log(`[BG_PROCESS_DOCX_END_PARSE] ${file.name}, Text length: ${extractedText.length}`);
    } else {
      console.error(`[BG_PROCESS_ERROR_UNSUPPORTED_TYPE] Unsupported file type: ${file.type} for ${file.name}`);
      return; // Should not happen due to prior validation
    }

    if (extractedText.trim().length === 0) {
        console.warn(`[BG_PROCESS_WARN_EMPTY_TEXT] Extracted text is empty for ${file.name}. Skipping AI generation.`);
        // Optionally, save a placeholder or log an error to DB
        return;
    }
    console.log(`[BG_PROCESS_AI_START_GENERATION] ${file.name}`);
    const generatedContent: BlogPostContent = await generateBlogPostFromText(extractedText, file.name);
    console.log(`[BG_PROCESS_AI_END_GENERATION] ${file.name}, Title: ${generatedContent.title}`);

    console.log(`[BG_PROCESS_DB_START_SAVE] ${file.name}`);
    const newBlogPost = await prisma.blogPost.create({
      data: {
        title: generatedContent.title,
        subtitle: generatedContent.subtitle || undefined,
        body: generatedContent.body,
        coverImageUrl: generatedContent.coverImageUrl || undefined,
      },
    });
    console.log(`[BG_PROCESS_DB_END_SAVE] Blog post saved for ${file.name} with ID: ${newBlogPost.id}`);
    console.log(`[BG_PROCESS_SUCCESS] Successfully processed and saved ${file.name}`);

  } catch (error: any) {
    console.error(`[BG_PROCESS_ERROR] Error during background processing for ${file.name}:`, error.message, error.stack);
    // Log more details, potentially the full error object if helpful
    // Consider updating a status in the DB to reflect failure
  }
}

export async function POST(request: NextRequest) {
  console.log("[API_UPLOAD_POST_RECEIVED_REQUEST]");
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    console.log("[API_UPLOAD_POST_ERROR_NO_FILE]");
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedTypes.includes(file.type)) {
      console.log(`[API_UPLOAD_POST_ERROR_INVALID_TYPE] File: ${file.name}, Type: ${file.type}`);
      return NextResponse.json({ error: 'Invalid file type. Only .docx and .pdf are allowed.' }, { status: 400 });
  }

  console.log(`[API_UPLOAD_POST_FILE_VALIDATED] Received file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes. Starting processing.`);

  // DIAGNOSTIC STEP: Await the processing directly
  // This will make the HTTP request wait, which is bad for UX but good for debugging this issue.
  // If this works on Vercel, it confirms the "fire-and-forget" was the problem.
  try {
    await processAndSaveDocument(file);
    console.log(`[API_UPLOAD_POST_PROCESSING_COMPLETE] Processing finished for ${file.name}`);
    return NextResponse.json({
      message: 'File processed and blog post generated successfully.', // Changed message
      fileName: file.name,
    }, { status: 200 }); // Changed status to 200 OK as it's now synchronous
  } catch (error: any) {
    console.error(`[API_UPLOAD_POST_ERROR_PROCESSING] Unhandled error during processAndSaveDocument for ${file.name}:`, error.message, error.stack);
    return NextResponse.json({
      error: 'An error occurred during file processing.',
      details: error.message
    }, { status: 500 });
  }
}
