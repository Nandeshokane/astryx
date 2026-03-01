import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

export async function POST(request) {
  let parser = null;
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
    const buffer = Buffer.from(bytes);

    // pdf-parse v2 API: pass buffer as `data` option
    parser = new PDFParse({ data: buffer });

    // Get text content
    const textResult = await parser.getText();

    // Get metadata for page count
    const infoResult = await parser.getInfo();

    return NextResponse.json({
      text: textResult.text,
      pageCount: infoResult.total || 1,
      info: infoResult.info || {},
      fileName: file.name,
    });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract text from PDF: " + error.message },
      { status: 500 }
    );
  } finally {
    // Always free memory
    if (parser) {
      try { await parser.destroy(); } catch { }
    }
  }
}
