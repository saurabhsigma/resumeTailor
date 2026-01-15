import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ResumeTailor - AI Powered Resume & Portfolio Builder",
  description: "Create professional resumes and portfolios in minutes.",
};

// Ensure critical env vars are present
if (typeof window === 'undefined') {
  const criticalEnvs = ['MONGODB_URI', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  const missing = criticalEnvs.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing critical environment variables:', missing.join(', '));
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
