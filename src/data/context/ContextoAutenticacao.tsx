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
import AutenticacaoTelefone from "../auth/AutenticacaoTelefone";
import useRecaptcha from "../hooks/useRecaptcha";

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
    mudarSenha: (novaSenha: string, senhaAtual: string) => Promise<void>;
    mudarEmail: (email: string, senhaAtual: string) => Promise<void>;
    validarMudarTelefone: (telefone: string) => Promise<void>;
    enviarMudarTelefone: (codigo: string) => Promise<void>;
    validarLoginTelefone: (telefone: string) => Promise<void>;
    enviarLoginTelefone: (codigo: string) => Promise<void>;
    enviarCadastro2Fator: (senha: string) => Promise<void>;
    validarCadastro2Fator: (codigo: string) => Promise<void>;
    validarCodigo2FA: (codigo: string) => Promise<void>;
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
        irConfirmarLoginSMS,
        irConfirmarLoginMFA,
    } = useNavegacao();
    const { adicionarLocalStorage, pegarLocalStorage, tirarLocalStorage } = useLocalStorage();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState<boolean>(false);
    const recaptcha = useRecaptcha();
    const CHAVE_LOGIN_LINK = "vaiFazerLogin";
    const CHAVE_MUDAR_TELEFONE = "idVerificacao";
    const CHAVE_2FATOR = "segundoFator";

    function criarMetodoCadastro(
        operacoes: funcaoCadastro,
        navegar?: () => void,
    ) {
        return async function (param: dadosCadastro) {
            const { nome, email, senha } = param;
            try {
                await operacoes(nome, email, senha);
                mensagemSucesso("Usuario cadastrado");
                navegar?.();
            } catch (e: any) {
                mensagemErro(e.message);
            }
        };
    }

    const cadastrar = criarMetodoCadastro(
        AutenticacaoEmail.cadastrar,
        irHomeAplicacao,
    );
    const cadastrarUsuarioAnonimo = criarMetodoCadastro(
        AutenticacaoProvedores.cadastrarUsuarioAnonimo,
    );

    function criarMetodoAtualizacao(
        operacoes: funcaoAtualizacao,
        mensagem: string,
        atualizarUsuario: boolean = false,
    ) {
        return async function (dado: any, senha?: string) {
            try {
                await operacoes(dado, senha);
                mensagemSucesso(mensagem);
                if (atualizarUsuario) {
                    const usuario = AutenticacaoEmail.normalizarUsuario(
                        auth.currentUser,
                    );
                    setUsuario(usuario);
                }
            } catch (e: any) {
                mensagemErro(e.message);
            }
        };
    }

    const mudarNome = criarMetodoAtualizacao(
        AutenticacaoModificacoes.alterarNome,
        "Nome alterado com sucesso!",
        true,
    );

    const mudarSenha = criarMetodoAtualizacao(
        AutenticacaoModificacoes.alterarSenha,
        "Senha alterada com sucesso!",
    );

    const mudarEmail = criarMetodoAtualizacao(
        AutenticacaoModificacoes.alterarEmail,
        "Confirme alteração no novo endereço de Email!",
        true,
    );

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
                if(e.code === "auth/multi-factor-auth-required") {
                    await enviarCodigo2FA(e)
                }
                mensagemErro(e.message);
            } finally {
                desligarCarregamento();
            }
        };
    }

    const login = criarMetodoLoginImediato(async function ({
        email,
        senha,
    }: {
        email: string;
        senha: string;
    }) {
        const u = await AutenticacaoEmail.login(email, senha);
        setUsuario(u);
    });

    const loginGoogle = criarMetodoLoginImediato(
        AutenticacaoProvedores.loginGoogle,
    );
    const loginGitHub = criarMetodoLoginImediato(
        AutenticacaoProvedores.loginGitHub,
    );
    const loginAnonimo = criarMetodoLoginImediato(
        AutenticacaoProvedores.loginAnonimo,
    );

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

    function criarEnvioEValidacao(
        operacoesEnvio: (param: any) => Promise<string>,
        operacoesValidacao: (dadosLocal: string, param?: any) => Promise<void>,
        mensagem: string,
        chave: string,
        redirecionar?: () => void,
    ) {
        const envio = async function (param: any) {
            try {
                const dados = await operacoesEnvio(param);
                mensagemSucesso(mensagem);
                adicionarLocalStorage(chave, dados);
            } catch (e: any) {
                mensagemErro(e.message);
            }
        };

        const validacao = async function (param?: any) {
            try {
                const dado = pegarLocalStorage(chave);
                if (dado) {
                    await operacoesValidacao(dado, param);
                }
                redirecionar?.();
            } catch (e: any) {
                mensagemErro(e.message);
            } finally {
                tirarLocalStorage(chave);
            }
        };

        return [envio, validacao];
    }

    const [enviarMudarTelefone, validarMudarTelefone] = criarEnvioEValidacao(
        async (telefone: string) => {
            return await AutenticacaoTelefone.enviarMudarTelefone(
                { phoneNumber: telefone },
                recaptcha,
            );
        },
        AutenticacaoTelefone.validarMudarTelefone,
        "Verifique o seu telefone!",
        CHAVE_MUDAR_TELEFONE,
    );

    const [enviarLoginSemSenha, validarLoginSemSenha] = criarEnvioEValidacao(
        async (email: string) => {
            await AutenticacaoEmail.enviarLoginSemSenha(email);
            return email;
        },
        async (email: string) => {
            await AutenticacaoEmail.validarLoginSemSenha(email, paginaAtual);
        },
        "Verifique seu email",
        CHAVE_LOGIN_LINK,
        irHomeAplicacao,
    );

    async function enviarLoginTelefone(telefone: string) {
        try {
            window.confirmationResult =
                await AutenticacaoTelefone.enviarLoginTelefone(
                    telefone,
                    recaptcha,
                );
            mensagemSucesso("Verifique seu telefone");
            irConfirmarLoginSMS();
        } catch (e: any) {
            mensagemErro(e.message);
        }
    }

    async function validarLoginTelefone(codigo: string) {
        try {
            if (window.confirmationResult) {
                await AutenticacaoTelefone.validarLoginTelefone(
                    window.confirmationResult,
                    codigo,
                );
                irHomeAplicacao();
            }
        } catch (e: any) {
            mensagemErro(e.message);
        } finally {
            window.confirmationResult = undefined;
        }
    }

     const [enviarCadastro2Fator, validarCadastro2Fator] = criarEnvioEValidacao(
        async (senha: string) => {
            return await AutenticacaoTelefone.enviarCadastro2Fator(senha, recaptcha)
        },
        AutenticacaoTelefone.validarCadastro2Fator,
        "Verifique o seu telefone!",
        CHAVE_2FATOR,
    );

    const [enviarCodigo2FA, validarCodigo2FA] = criarEnvioEValidacao(
        async(e:any)=>{
            const [idVerificacao, resolver] = await AutenticacaoTelefone.enviarCodigo2FA(e,recaptcha)
            window.resolver = resolver
            irConfirmarLoginMFA()
            return idVerificacao
        },
        async (idVerificacao:string, codigo:string)=>{
            await AutenticacaoTelefone.validarCodigo2FA(idVerificacao,codigo, window.resolver)
            window.resolver = undefined;
            irHomeAplicacao()
        },
        "Verifique seu telefone",
        "login2FA",
    )

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
                enviarMudarTelefone,
                validarMudarTelefone,
                enviarLoginTelefone,
                validarLoginTelefone,
                enviarCadastro2Fator,
                validarCadastro2Fator,
                validarCodigo2FA,
            }}
        >
            {props.children}
        </ContextoAutenticacao.Provider>
    );
}

export default ContextoAutenticacao;
