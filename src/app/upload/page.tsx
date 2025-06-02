import { UploadForm } from "@/components/upload-form";

export default function UploadPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10 m-auto">
      <div className="flex max-w-[980px] flex-col items-start gap-4 m-auto">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl !text-blue-50">
          Upload Document
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground !text-blue-50">
          Select a .docx or .pdf file to generate a blog post.
        </p>
        <UploadForm />
      </div>
    </section>
  );
}
