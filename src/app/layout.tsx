import type { Metadata } from "next";
import { Anuphan, Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/ui/PageTransition";
import RouteProgressBar from "@/components/ui/RouteProgressBar";
import InitialPreloader from "@/components/ui/InitialPreloader";

const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-anuphan",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "ค่าย Comclick 20 | ระบบรับสมัครพี่ค่ายและคณะทำงาน (ComClick Camp #20)",
  description:
    "เปิดรับสมัครทีมงานพี่ค่าย Comclick ครั้งที่ 20 ค่ายเทคโนโลยีวิชาการ จับมือน้องคลิก สาขาวิชาคอมพิวเตอร์ศึกษา คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น ร่วมสร้างแรงบันดาลใจและก้าวสู่ทศวรรษที่ 2 ไปด้วยกัน",
  keywords: [
    "Comclick",
    "Comclick 20",
    "ค่ายจับมือน้องคลิก",
    "รับสมัครสตาฟ",
    "พี่ค่าย",
    "ศึกษาศาสตร์ มข",
    "คอมพิวเตอร์ศึกษา",
    "ค่ายไอที",
  ],
  authors: [{ name: "ComClick 20 Tech Team" }],
  icons: {
    icon: [
      { url: "/img/logo.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: ["/img/logo.webp"],
    apple: [{ url: "/img/logo.webp" }],
  },
  openGraph: {
    title: "สมัครเป็นพี่ค่าย Comclick 20 (ComClick Camp #20)",
    description: "ค่ายเทคโนโลยีวิชาการ จับมือน้องคลิก ครั้งที่ 20 คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น",
    type: "website",
    locale: "th_TH",
    images: [{ url: "/img/logo.webp", width: 512, height: 512, alt: "ComClick 20 Logo" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${anuphan.variable} ${prompt.variable}`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased flex flex-col min-h-screen selection:bg-cc-coral/30 selection:text-cc-navy font-sans"
      >
        <InitialPreloader />
        <RouteProgressBar />
        <Navbar />
        <main className="flex-grow flex flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
