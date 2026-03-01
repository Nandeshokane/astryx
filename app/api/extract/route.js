import { NextResponse } from "next/server";
import { extractText, getMeta } from "unpdf";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // unpdf handles pdfjs-dist worker setup internally
    const { text, totalPages } = await extractText(buffer, { mergePages: true });

    let info = {};
    try {
      const meta = await getMeta(buffer);
      info = meta?.info || {};
    } catch {
      // metadata not available for all PDFs
    }

    return NextResponse.json({
      text,
      pageCount: totalPages,
      info,
      fileName: file.name,
    });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract text from PDF: " + error.message },
      { status: 500 }
    );
  }
}
