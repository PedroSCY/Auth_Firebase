"use client";
import { createContext, useState } from "react";

interface ContextoMensagemProps {
    mensagens: Mensagem[];
    mensagemErro: (texto: string) => void;
    mensagemAviso: (texto: string) => void;
    mensagemSucesso: (texto: string) => void;
    limparListaMensagens: () => void;
}

const ContextoMensagem = createContext<ContextoMensagemProps>({} as any);

export function MensagemProvider(props: any) {
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);

    function mensagemErro(texto: string) {
        setMensagens([...mensagens, { tipo: "ERRO", texto }]);
    }

    function mensagemAviso(texto: string) {
        setMensagens([...mensagens, { tipo: "AVISO", texto }]);
    }

    function mensagemSucesso(texto: string) {
        setMensagens([...mensagens, { tipo: "SUCESSO", texto }]);
    }

    function limparListaMensagens() {
        setMensagens([]);
    }

    return (
        <ContextoMensagem.Provider
            value={{
                mensagens,
                limparListaMensagens,
                mensagemErro,
                mensagemAviso,
                mensagemSucesso,
            }}
        >
            {props.children}
        </ContextoMensagem.Provider>
    );
}

export default ContextoMensagem;
