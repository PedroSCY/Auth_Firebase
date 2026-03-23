"use client";
import BotaoVoltar from "@/components/template/BotaoVoltar";
import LayoutExterno from "@/components/template/LayoutExterno";
import useAutenticacao from "@/data/hooks/useAutenticacao";
import { useEffect } from "react";

export default function confirmarLoginLink() {

    const {validarLoginSemSenha} = useAutenticacao()

    useEffect(()=>{
        (async function() {
            await validarLoginSemSenha()
        })()
    },[])
    return (
        <LayoutExterno titulo="Validando login">
            <BotaoVoltar />
        </LayoutExterno>
    );
}
