import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AntigravityCanvas, AntigravityStyles } from "@/components/antigravity-background";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "Rakibul Hasan | Full Stack Developer",
  description: "Full Stack Web Developer skilled in HTML, CSS, Tailwind CSS, JavaScript, Python, Django, MySQL and Git. Building responsive frontend interfaces and secure backend systems.",
  keywords: ["Full Stack Developer", "Web Developer", "Python", "Django", "JavaScript", "React", "Next.js", "Tailwind CSS", "Portfolio"],
  authors: [{ name: "Rakibul Hasan" }],
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32" },
      { url: "/logo.svg", sizes: "any" },
    ],
    apple: {
      url: "/logo.png",
      sizes: "180x180",
    },
    other: {
      rel: "apple-touch-icon",
      url: "/logo.png",
    }
  },
  openGraph: {
    title: "MD Rakibul Hasan | Full Stack Developer",
    description: "Full Stack Web Developer skilled in Python, Django, JavaScript, and modern web technologies.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MD Rakibul Hasan | Full Stack Developer",
    description: "Full Stack Web Developer skilled in Python, Django, JavaScript, and modern web technologies.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <AntigravityStyles />
            <AntigravityCanvas particleCount={80} />
            <div className="content-wrapper">
              {children}
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
