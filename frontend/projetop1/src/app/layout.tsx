import Menu from "./components/Menu";
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Menu />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
