"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext } from "react";
import { usePathname } from "next/navigation";

interface ContextoNavegacaoProps {
    irLogin: () => void;
    irHomeAplicacao: () => void;
    estaEmLogin: () => boolean;
    paginaAtual: () => string;
    recarregarPagina: () => void;
    estaEmPaginaParaUsuarioNaoLogado: () => boolean;
}

const ContextoNavegacao = createContext<ContextoNavegacaoProps>({} as any);

export function NavegacaoProvider(props: any) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const homeAplicacao = "/home";
    const paginaLogin = "/";

    function irLogin() {
        router.push(paginaLogin);
    }

    function irHomeAplicacao() {
        router.push(homeAplicacao);
    }

    function estaEmLogin() {
        return paginaLogin === pathname;
    }

    function paginaAtual() {
        const params = searchParams.toString();
        if (params) {
            return `${pathname}?${params}`
        } else {
            return pathname;
        }
    }

    function recarregarPagina() {
        router.refresh();
    }

    function estaEmPaginaParaUsuarioNaoLogado() {
        const paginas = [
            "/",
            "esqueciSenha",
            "/confirmarLogin",
            "/confirmarLogin/email",
            "/confirmarLogin/mfa",
            "/confirmarLogin/sms",
            "/cadastro",
        ];
        return paginas.some((pagina) => pagina === paginaAtual());
    }

    return (
        <ContextoNavegacao.Provider
            value={{
                irLogin,
                irHomeAplicacao,
                estaEmLogin,
                paginaAtual,
                recarregarPagina,
                estaEmPaginaParaUsuarioNaoLogado,
            }}
        >
            {props.children}
        </ContextoNavegacao.Provider>
    );
}

export default ContextoNavegacao;
