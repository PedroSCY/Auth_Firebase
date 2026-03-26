"use client";
import BotaoVoltar from "@/components/template/BotaoVoltar";
import CampoComBotao from "@/components/template/CampoComBotao";
import LayoutExterno from "@/components/template/LayoutExterno";
import useAutenticacao from "@/data/hooks/useAutenticacao";

export default function Registrar() {

    const {validarCodigo2FA} = useAutenticacao()
    return (
        <LayoutExterno titulo="Validando login">
            <CampoComBotao enunciado="Confirme o código" nomeInput="Código" textoBotao="Verificar" acao={validarCodigo2FA}/>
            <BotaoVoltar />
        </LayoutExterno>
    );
}
