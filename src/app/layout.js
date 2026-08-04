import { Special_Elite, La_Belle_Aurore } from "next/font/google";
import "./globals.css";

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  weight: "400",
  subsets: ["latin"],
});

const laBelleAurore = La_Belle_Aurore({
  variable: "--font-la-belle-aurore",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Adil Rahman | Developer Showcase",
  description: "Your go-to developer for App, Web & Shopify solutions. Portfolio of v3.0.0, Shopify-Marketing Edition.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${specialElite.variable} ${laBelleAurore.variable}`}>
      <body>{children}</body>
    </html>
  );
}

