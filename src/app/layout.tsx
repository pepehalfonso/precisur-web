import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRECISUR — Agricultura de Precisión Desarrollada en Uruguay",
  description:
    "Tecnología para entender lo que ocurre antes de aplicar. Simulación, meteorología, geografía e ingeniería al servicio de la agricultura de precisión.",
  keywords: [
    "agricultura de precisión",
    "simulación de deriva",
    "drones agrícolas",
    "meteorología",
    "Uruguay",
    "smart spray",
    "agricultura inteligente",
  ],
  openGraph: {
    title: "PRECISUR — Agricultura de Precisión Desarrollada en Uruguay",
    description:
      "Tecnología para entender lo que ocurre antes de aplicar. Simulación, meteorología, geografía e ingeniería al servicio de la agricultura de precisión.",
    type: "website",
    locale: "es_UY",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-precisur-dark-900 text-foreground">
        {children}
      </body>
    </html>
  );
}
