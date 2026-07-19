import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "ABC Tiles & Ceramics | Luxury Ceramic & Natural Stones",
  description: "Explore premium glazed vitrified tiles, imported Italian marble, black galaxy granite, luxury sanitaryware, and smart calculators for architectural projects.",
  keywords: "Ceramic tiles, Vitrified tiles, Granite, Marble, Sanitaryware, Wall Tiles, Floor Tiles, Faucets, Tile Calculator, Room Visualizer",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <AppProvider>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <FloatingActions />
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
