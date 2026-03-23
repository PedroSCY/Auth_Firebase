"use client";
import LayoutExterno from "@/components/template/LayoutExterno";
import BotaoVoltar from "@/components/template/BotaoVoltar";
import CampoComBotao from "@/components/template/CampoComBotao";
import useAutenticacao from "@/data/hooks/useAutenticacao";

export default function EsqueciSenha() {
    const {enviarRecuperacaoSenha} =useAutenticacao()
    return (
        <LayoutExterno titulo="Digite o seu email">
            <CampoComBotao nomeInput="Email" textoBotao="Enviar email" acao={enviarRecuperacaoSenha}></CampoComBotao>
            <BotaoVoltar />
        </LayoutExterno>
    );
}
