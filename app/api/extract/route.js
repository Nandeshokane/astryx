import { NextResponse } from "next/server";

// Polyfill DOMMatrix for serverless environments (Vercel)
// pdf-parse uses pdfjs-dist which expects browser globals
if (typeof globalThis.DOMMatrix === "undefined") {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor(init) {
      this.m = new Float64Array(16);
      this.m[0] = 1; this.m[5] = 1; this.m[10] = 1; this.m[15] = 1;
      if (Array.isArray(init)) {
        for (let i = 0; i < init.length && i < 16; i++) this.m[i] = init[i];
      }
    }
    get a() { return this.m[0]; }
    get b() { return this.m[1]; }
    get c() { return this.m[4]; }
    get d() { return this.m[5]; }
    get e() { return this.m[12]; }
    get f() { return this.m[13]; }
    get is2D() { return true; }
    get isIdentity() { return this.m[0] === 1 && this.m[5] === 1 && this.m[10] === 1 && this.m[15] === 1; }
    toString() { return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`; }
    static fromMatrix() { return new DOMMatrix(); }
    static fromFloat32Array(arr) { return new DOMMatrix(Array.from(arr)); }
    static fromFloat64Array(arr) { return new DOMMatrix(Array.from(arr)); }
  };
}

if (typeof globalThis.Path2D === "undefined") {
  globalThis.Path2D = class Path2D { constructor() { } };
}

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
    const buffer = Buffer.from(bytes);

    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);

    return NextResponse.json({
      text: data.text,
      pageCount: data.numpages,
      info: data.info,
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
