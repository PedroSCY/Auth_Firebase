"use client";
import { createContext, useEffect, useState } from "react";
import Autenticacao from "../auth/autenticacao";
import useMensagens from "../hooks/useMensagens";
import useNavegacao from "../hooks/useNavegacao";
import Usuario from "@/model/Usuario";
import CookieSessao from "../utils/CookieSessao";
import auth from "@/config/firebase";
import useLocalStorage from "../hooks/useLocalStorage";

interface ContextoAutenticacaoProps {
    usuario: Usuario | null;
    carregando: boolean;
    cadastrar: (param: dadosCadastro) => Promise<void>;
    login: ({
        email,
        senha,
    }: {
        email: string;
        senha: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    temUsuarioLogado: () => boolean;
    enviarRecuperacaoSenha: (email: string) => Promise<void>;
    enviarLoginSemSenha: (email: string) => Promise<void>;
    validarLoginSemSenha: () => Promise<void>;
}

const ContextoAutenticacao = createContext<ContextoAutenticacaoProps>(
    {} as any,
);

export function AutenticacaoProvider(props: any) {
    const { mensagemSucesso, mensagemErro } = useMensagens();
    const { irHomeAplicacao, irLogin, estaEmPaginaParaUsuarioNaoLogado, paginaAtual } = useNavegacao();
    const { adicionarLocalStorage, pegarLocalStorage, tirarLocalStorage } = useLocalStorage();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState<boolean>(false);
    const CHAVE_LOGIN_LINK = "vaiFazerLogin"

    async function cadastrar(param: dadosCadastro) {
        const { nome, email, senha } = param;
        try {
            await Autenticacao.cadastrar(nome, email, senha);
            mensagemSucesso("Usuario cadastrado");
            irHomeAplicacao();
        } catch (e: any) {
            mensagemErro(e.message);
        }
    }

    function desligarCarregamento() {
        setTimeout(() => setCarregando(false), 1500);
    }

    async function login({ email, senha }: { email: string; senha: string }) {
        try {
            setCarregando(true);
            const u = await Autenticacao.login(email, senha);
            setUsuario(u);
            irHomeAplicacao();
        } catch (e: any) {
            mensagemErro(e.message);
        } finally {
            desligarCarregamento();
        }
    }

    async function logout() {
        try {
            setCarregando(true);
            await Autenticacao.logout();
            setUsuario(null);
            irLogin();
        } catch (e: any) {
            mensagemErro(e.message);
        } finally {
            desligarCarregamento();
        }
    }

    function temUsuarioLogado() {
        return !!CookieSessao.pegar();
    }

    async function enviarRecuperacaoSenha(email: string) {
        try {
            await Autenticacao.enviarRecuperacaoSenha(email);
            irLogin();
            setTimeout(() => mensagemSucesso("Email enviado"), 1000);
        } catch (e: any) {
            mensagemErro(e.message);
        }
    }

    async function enviarLoginSemSenha(email: string) {
        try {
            await Autenticacao.enviarLoginSemSenha(email);
            mensagemSucesso("Verifique seu email");
            adicionarLocalStorage(CHAVE_LOGIN_LINK, email);
        } catch (e: any) {
            mensagemErro(e.message);
        }
    }

    async function validarLoginSemSenha() {
        try {
            const email = pegarLocalStorage(CHAVE_LOGIN_LINK)
            if(email){
               await Autenticacao.validarLoginSemSenha(email, paginaAtual)
            }
            irHomeAplicacao()
        } catch (e: any) {
            mensagemErro(e.message);
        }finally{
            tirarLocalStorage(CHAVE_LOGIN_LINK)
        }
    }
    useEffect(() => {
        if (temUsuarioLogado() && estaEmPaginaParaUsuarioNaoLogado()) {
            setCarregando(true);
            irHomeAplicacao();
            desligarCarregamento();
        }
        auth.onIdTokenChanged((usuarioAtual) => {
            const u = Autenticacao.normalizarUsuario(usuarioAtual);
            setUsuario(u);
            CookieSessao.gerenciar(u);
        });
    }, []);

    return (
        <ContextoAutenticacao.Provider
            value={{
                carregando,
                usuario,
                temUsuarioLogado,
                cadastrar,
                login,
                logout,
                enviarRecuperacaoSenha,
                enviarLoginSemSenha,
                validarLoginSemSenha
            }}
        >
            {props.children}
        </ContextoAutenticacao.Provider>
    );
}

export default ContextoAutenticacao;
