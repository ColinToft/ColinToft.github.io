import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundCanvas from "@/components/Background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Colin Toft",
    description:
        "Computer Science student exploring systems, AI, and visual computing",
    openGraph: {
        title: "Colin Toft",
        description:
            "Computer Science student exploring systems, AI, and visual computing",
        url: "https://colintoft.com",
        siteName: "Colin Toft",
        type: "website",
        images: [
            {
                url: "https://colintoft.com/images/cover.webp",
                width: 1200,
                height: 630,
                alt: "Colin Toft",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Colin Toft",
        description:
            "Computer Science student exploring systems, AI, and visual computing",
        images: ["https://colintoft.com/images/cover.webp"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className={`${inter.className} bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-slate-200 relative`}
            >
                <BackgroundCanvas />
                {children}
            </body>
        </html>
    );
}
