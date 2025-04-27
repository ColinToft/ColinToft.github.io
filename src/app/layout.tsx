import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BackgroundCanvas from "@/components/Background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Colin Toft",
    description:
        "Computer Science student exploring systems, AI, and visual computing",
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
