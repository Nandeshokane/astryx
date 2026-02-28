import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata = {
  title: "Astryx — Legal Documents to Plain English",
  description:
    "Upload any legal document and get a clear, plain English summary with red-flag detection and interactive Q&A. Know before you sign.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
