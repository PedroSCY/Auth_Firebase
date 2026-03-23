import "./globals.css";
import { Inter } from "next/font/google";
import { AutenticacaoProvider } from "@/data/context/ContextoAutenticacao";
import { NavegacaoProvider } from "@/data/context/ContextoNavegacao";
import { MensagemProvider } from "@/data/context/ContextoMensagens";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Autenticação Firebase",
    description: "Uma aplicação que usa autenticação do Firebase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} h-screen flex flex-col justify-center 
            bg-gradient-to-r from-zinc-100 to-zinc-200`}
            >
                <NavegacaoProvider>
                    <MensagemProvider>
                        <AutenticacaoProvider>
                            <div id="recaptcha"></div>
                            {children}
                        </AutenticacaoProvider>
                    </MensagemProvider>
                </NavegacaoProvider>
            </body>
        </html>
    );
}
