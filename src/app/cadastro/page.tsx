"use client";
import { Text } from "@mantine/core";
import Link from "next/link";
import LayoutExterno from "@/components/template/LayoutExterno";
import CamposCadastro from "@/components/template/CamposCadastro";
import BotaoVoltar from "@/components/template/BotaoVoltar";
import useAutenticacao from "@/data/hooks/useAutenticacao";
export default function Cadastro() {

    const {cadastrar} = useAutenticacao()

    const facaLogin = () => {
        return (
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Já tem uma conta?{" "}
                <Link href={"/"} className="font-bold">
                    Faça login
                </Link>
            </Text>
        );
    };
    return (
        <LayoutExterno titulo="Registre-se aqui" complementoTitulo={facaLogin}>
            <CamposCadastro cadastrar={cadastrar} />
            <BotaoVoltar />
        </LayoutExterno>
    );
}
