"use client"

import { AutenticacaoProvider } from "@/data/context/ContextoAutenticacao"
import { MensagemProvider } from "@/data/context/ContextoMensagens"
import { NavegacaoProvider } from "@/data/context/ContextoNavegacao"
import { Suspense } from "react"


export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <NavegacaoProvider>
                <MensagemProvider>
                    <AutenticacaoProvider>
                        <div id="recaptcha"></div>
                        {children}
                    </AutenticacaoProvider>
                </MensagemProvider>
            </NavegacaoProvider>
        </Suspense>
    )
}