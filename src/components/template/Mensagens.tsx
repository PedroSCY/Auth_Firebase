import useMensagens from "@/data/hooks/useMensagens";
import { notifications } from "@mantine/notifications";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";

export default function Mensagens() {
    const { mensagens, limparListaMensagens } = useMensagens();

    const coloreMensagem = (mensagem: Mensagem) => {
        if (mensagem.tipo === "ERRO") {
            return "red";
        } else if (mensagem.tipo === "AVISO") {
            return "yellow";
        } else if (mensagem.tipo === "SUCESSO") {
            return "green";
        }
    };

    useEffect(() => {
        if (mensagens.length > 0) {
            const mensagensFormatadas = mensagens.map((mensagem) => {
                return {
                    title: `${mensagem.tipo}!`,
                    message: mensagem.texto,
                    withCloseButton: true,
                    autoClose: 10000,
                    color: coloreMensagem(mensagem),
                };
            });
            mensagensFormatadas.forEach((mensagem) => notifications.show(mensagem));
            limparListaMensagens();
        }
    }, [mensagens]);

    return <Notifications position="top-right" />;
}
