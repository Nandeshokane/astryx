// instrumentation.js
// Runs before any server-side code in Next.js
// Polyfills browser globals needed by pdf-parse/pdfjs-dist in serverless environments

export async function register() {
    if (typeof globalThis.DOMMatrix === "undefined") {
        globalThis.DOMMatrix = class DOMMatrix {
            constructor(init) {
                this.m = new Float64Array(16);
                this.m[0] = 1;
                this.m[5] = 1;
                this.m[10] = 1;
                this.m[15] = 1;
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
            get isIdentity() {
                return this.m[0] === 1 && this.m[5] === 1 && this.m[10] === 1 && this.m[15] === 1;
            }
            toString() {
                return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
            }
            static fromMatrix() { return new DOMMatrix(); }
            static fromFloat32Array(arr) { return new DOMMatrix(Array.from(arr)); }
            static fromFloat64Array(arr) { return new DOMMatrix(Array.from(arr)); }
        };
    }

    if (typeof globalThis.Path2D === "undefined") {
        globalThis.Path2D = class Path2D {
            constructor() { }
            addPath() { }
            closePath() { }
            moveTo() { }
            lineTo() { }
            bezierCurveTo() { }
            quadraticCurveTo() { }
            arc() { }
            arcTo() { }
            ellipse() { }
            rect() { }
        };
    }

    if (typeof globalThis.ImageData === "undefined") {
        globalThis.ImageData = class ImageData {
            constructor(w, h) {
                this.width = w;
                this.height = h;
                this.data = new Uint8ClampedArray(w * h * 4);
            }
        };
    }
}
