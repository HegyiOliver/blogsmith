import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import { generateBlogPostFromText, BlogPostContent } from '@/lib/ai';
import { prisma } from '@/lib/db';

async function processAndSaveDocument(file: File) {
  try {
    console.log(`Background processing started for: ${file.name}`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let extractedText = '';

    if (file.type === 'application/pdf') {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      // This case should ideally be caught before calling this background function
      console.error(`Unsupported file type in background processing: ${file.type}`);
      return;
    }

    console.log(`Extracted text length for ${file.name}: ${extractedText.length} characters`);

    const generatedContent: BlogPostContent = await generateBlogPostFromText(extractedText, file.name);

    const newBlogPost = await prisma.blogPost.create({
      data: {
        title: generatedContent.title,
        subtitle: generatedContent.subtitle || undefined, // Ensure optional fields are handled
        body: generatedContent.body,
        coverImageUrl: generatedContent.coverImageUrl || undefined,
      },
    });

    console.log(`Blog post saved to database for ${file.name} with ID: ${newBlogPost.id}`);
  } catch (error: any) {
    console.error(`Error during background processing for ${file.name}:`, error.message);
    // Here you might want to log this error to a more persistent monitoring system
    // or update a status in the database if you had a more advanced setup.
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  // Basic validation before starting background processing
  const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only .docx and .pdf are allowed.' }, { status: 400 });
  }

  console.log(`Received file for background processing: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

  // Start processing in the background, do not await
  processAndSaveDocument(file).catch(error => {
    // Catch unhandled promise rejections from the async function itself
    // (though errors inside should be caught by its own try/catch)
    console.error(`Unhandled error in processAndSaveDocument for ${file.name}:`, error);
  });

  return NextResponse.json({
    message: 'File upload received. Processing started in the background.',
    fileName: file.name,
  }, { status: 202 }); // 202 Accepted indicates the request is accepted for processing
}
