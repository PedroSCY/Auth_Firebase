"use client";
import { createContext, useEffect, useState } from "react";
import AutenticacaoEmail from "../auth/AutenticacaoEmail";
import useMensagens from "../hooks/useMensagens";
import useNavegacao from "../hooks/useNavegacao";
import Usuario from "@/model/Usuario";
import CookieSessao from "../utils/CookieSessao";
import auth from "@/config/firebase";
import useLocalStorage from "../hooks/useLocalStorage";
import AutenticacaoProvedores from "../auth/AutenticacaoProvedores";
import AutenticacaoModificacoes from "../auth/AutenticacaoModificacoes";

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
    loginGoogle: () => Promise<void>;
    loginGitHub: () => Promise<void>;
    loginAnonimo: () => Promise<void>;
    cadastrarUsuarioAnonimo: (param: dadosCadastro) => Promise<void>;
    mudarNome: (nome: string) => Promise<void>;
    mudarSenha: (novaSenha:string, senhaAtual:string) => Promise<void>;
    mudarEmail: (email:string, senhaAtual:string) => Promise<void>;
}

const ContextoAutenticacao = createContext<ContextoAutenticacaoProps>(
    {} as any,
);

export function AutenticacaoProvider(props: any) {
    const { mensagemSucesso, mensagemErro } = useMensagens();
    const {
        irHomeAplicacao,
        irLogin,
        estaEmPaginaParaUsuarioNaoLogado,
        paginaAtual,
    } = useNavegacao();
    const { adicionarLocalStorage, pegarLocalStorage, tirarLocalStorage } =
        useLocalStorage();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState<boolean>(false);
    const CHAVE_LOGIN_LINK = "vaiFazerLogin";


    function criarMetodoCadastro(operacoes: funcaoCadastro, navegar?: ()=> void){
        return async function(param:dadosCadastro) {
            const { nome, email, senha } = param;
        try {
            await operacoes(nome, email, senha)
            mensagemSucesso("Usuario cadastrado");
            navegar?.()
        } catch (e: any) {
            mensagemErro(e.message);
        }
        }
    }

    const cadastrar = criarMetodoCadastro( AutenticacaoEmail.cadastrar, irHomeAplicacao)
    const cadastrarUsuarioAnonimo = criarMetodoCadastro(AutenticacaoProvedores.cadastrarUsuarioAnonimo)


    function criarMetodoAtualizacao(operacoes: funcaoAtualizacao, mensagem: string, atualizarUsuario:boolean = false) {
        return async function(dado:any, senha?:string) {
        try {
            await operacoes(dado,senha)
            mensagemSucesso(mensagem)
            if(atualizarUsuario){
                const usuario = AutenticacaoEmail.normalizarUsuario(auth.currentUser)
                setUsuario(usuario)
            }
        } catch (e:any) {
            mensagemErro(e.message)
        }
    }
    }

    const mudarNome = criarMetodoAtualizacao(AutenticacaoModificacoes.alterarNome,"Nome alterado com sucesso!", true)

    const mudarSenha = criarMetodoAtualizacao(AutenticacaoModificacoes.alterarSenha,"Senha alterada com sucesso!")

    const mudarEmail = criarMetodoAtualizacao(AutenticacaoModificacoes.alterarEmail,"Confirme alteração no novo endereço de Email!", true)

    function desligarCarregamento() {
        setTimeout(() => setCarregando(false), 1500);
    }

    function criarMetodoLoginImediato(operacoes: funcaoLogin) {
        return async function (param?: any) {
            try {
                setCarregando(true);
                await operacoes(param);
                irHomeAplicacao();
            } catch (e: any) {
                mensagemErro(e.message);
            } finally {
                desligarCarregamento();
            }
        };
    }

    const login = criarMetodoLoginImediato(async function ({ email, senha }: { email: string; senha: string }) {
        const u = await AutenticacaoEmail.login(email, senha);
        setUsuario(u);
    });

    const loginGoogle = criarMetodoLoginImediato(AutenticacaoProvedores.loginGoogle)
    const loginGitHub = criarMetodoLoginImediato(AutenticacaoProvedores.loginGitHub)
    const loginAnonimo = criarMetodoLoginImediato(AutenticacaoProvedores.loginAnonimo)

    async function logout() {
        try {
            setCarregando(true);
            await AutenticacaoEmail.logout();
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
            await AutenticacaoEmail.enviarRecuperacaoSenha(email);
            irLogin();
            setTimeout(() => mensagemSucesso("Email enviado"), 1000);
        } catch (e: any) {
            mensagemErro(e.message);
        }
    }

    async function enviarLoginSemSenha(email: string) {
        try {
            await AutenticacaoEmail.enviarLoginSemSenha(email);
            mensagemSucesso("Verifique seu email");
            adicionarLocalStorage(CHAVE_LOGIN_LINK, email);
        } catch (e: any) {
            mensagemErro(e.message);
        }
    }

    async function validarLoginSemSenha() {
        try {
            const email = pegarLocalStorage(CHAVE_LOGIN_LINK);
            if (email) {
                await AutenticacaoEmail.validarLoginSemSenha(
                    email,
                    paginaAtual,
                );
            }
            irHomeAplicacao();
        } catch (e: any) {
            mensagemErro(e.message);
        } finally {
            tirarLocalStorage(CHAVE_LOGIN_LINK);
        }
    }

        // async function mudarNome(nome:string) {
    //     try {
    //         await AutenticacaoModificacoes.alterarNome(nome)
    //         mensagemSucesso("Nome alterado com sucesso!")
    //         const usuario = AutenticacaoEmail.normalizarUsuario(auth.currentUser)
    //         setUsuario(usuario)
    //     } catch (e:any) {
    //         mensagemErro(e.message)
    //     }
    // }

    // async function mudarSenha(novaSenha:string, senhaAtual:string) {
    //     try {
    //         await AutenticacaoModificacoes.alterarSenha(novaSenha,senhaAtual)
    //         mensagemSucesso("Senha alterada com sucesso!")
    //         const usuario = AutenticacaoEmail.normalizarUsuario(auth.currentUser)
    //         setUsuario(usuario)
    //     } catch (e:any) {
    //         mensagemErro(e.message)
    //     }
    // }

    // async function cadastrar(param: dadosCadastro) {
    //     const { nome, email, senha } = param;
    //     try {
    //         await AutenticacaoEmail.cadastrar(nome, email, senha);
    //         mensagemSucesso("Usuario cadastrado");
    //         irHomeAplicacao();
    //     } catch (e: any) {
    //         mensagemErro(e.message);
    //     }
    // }

    // async function cadastrarUsuarioAnonimo(param: dadosCadastro) {
    //     const { nome, email, senha } = param;
    //     try {
    //         await AutenticacaoProvedores.cadastrarUsuarioAnonimo(nome, email, senha);
    //         mensagemSucesso("Usuario cadastrado");
    //         irHomeAplicacao();
    //     } catch (e: any) {
    //         mensagemErro(e.message);
    //     }
    // }

    // async function login({ email, senha }: { email: string; senha: string }) {
    //     try {
    //         setCarregando(true);
    //         const u = await AutenticacaoEmail.login(email, senha);
    //         setUsuario(u);
    //         irHomeAplicacao();
    //     } catch (e: any) {
    //         mensagemErro(e.message);
    //     } finally {
    //         desligarCarregamento();
    //     }
    // }

    // async function loginGoogle() {
    //     try {
    //         setCarregando(true);
    //         await AutenticacaoProvedores.loginGoogle();
    //         irHomeAplicacao();
    //     } catch (e: any) {
    //         mensagemErro(e.message);
    //     } finally {
    //         desligarCarregamento();
    //     }
    // }

    // async function loginGitHub() {
    //     try {
    //         setCarregando(true);
    //         await AutenticacaoProvedores.loginGitHub();
    //         irHomeAplicacao();
    //     } catch (e: any) {
    //         mensagemErro(e.message);
    //     } finally {
    //         desligarCarregamento();
    //     }
    // }

    useEffect(() => {
        if (temUsuarioLogado() && estaEmPaginaParaUsuarioNaoLogado()) {
            setCarregando(true);
            irHomeAplicacao();
            desligarCarregamento();
        }
        auth.onIdTokenChanged((usuarioAtual) => {
            const u = AutenticacaoEmail.normalizarUsuario(usuarioAtual);
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
                validarLoginSemSenha,
                loginGoogle,
                loginGitHub,
                loginAnonimo,
                cadastrarUsuarioAnonimo,
                mudarNome,
                mudarSenha,
                mudarEmail,
            }}
        >
            {props.children}
        </ContextoAutenticacao.Provider>
    );
}

export default ContextoAutenticacao;
