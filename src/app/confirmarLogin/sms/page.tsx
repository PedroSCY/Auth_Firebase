"use client";
import BotaoVoltar from "@/components/template/BotaoVoltar";
import CampoComBotao from "@/components/template/CampoComBotao";
import LayoutExterno from "@/components/template/LayoutExterno";

export default function Registrar() {
    return (
        <LayoutExterno titulo="Validando login">
            <CampoComBotao enunciado="Confirme o código" nomeInput="Código" textoBotao="Verificar" />
            <BotaoVoltar />
        </LayoutExterno>
    );
}
