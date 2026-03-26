"use client";
import useAutenticacao from "@/data/hooks/useAutenticacao";
import Layout from "../../components/template/LayoutInterno";
import CamposCadastro from "@/components/template/CamposCadastro";
import CampoComBotao from "@/components/template/CampoComBotao";
import CampoComSenhaBotao from "@/components/template/CampoComSenhaBotao";
import TelefoneComCodigo from "@/components/template/TelefoneComCodigo";
import SenhaComCodigo from "@/components/template/SenhaComCodigo";

export default function Configuracoes() {
    const {
        usuario,
        cadastrarUsuarioAnonimo,
        mudarNome,
        mudarSenha,
        mudarEmail,
        enviarMudarTelefone,
        validarMudarTelefone,
        enviarCadastro2Fator,
        validarCadastro2Fator
    } = useAutenticacao();
    const MudarNome = () => {
        return (
            <CampoComBotao
                nomeInput="Novo Nome"
                textoBotao="Salvar"
                enunciado="Mudar Nome"
                acao={mudarNome}
            />
        );
    };

    const MudarSenha = () => {
        return (
            <CampoComSenhaBotao
                nomeInput="Nova Senha"
                textoBotao="Salvar"
                enunciado="Mudar Senha"
                acao={mudarSenha}
            />
        );
    };

    const MudarEmail = () => {
        return (
            <CampoComSenhaBotao
                nomeInput="Novo Email"
                textoBotao="Salvar"
                enunciado="Mudar Email"
                acao={mudarEmail}
            />
        );
    };

    const MudarTelefone = () => {
        return (
            <TelefoneComCodigo
                enviarCodigo={enviarMudarTelefone}
                validarCodigo={validarMudarTelefone}
                textoValidar="Validar"
                enunciado="Mudar Telefone"
            />
        );
    };

    const Adicionar2FA = () => {
        return (
            <SenhaComCodigo
                enviarCodigo={enviarCadastro2Fator}
                validarCodigo={validarCadastro2Fator}
                textoValidar="Adicionar"
                enunciado="Adicionar 2FA"
            />
        );
    };

    const conteudo = usuario?.ehAnonimo ? (
        <CamposCadastro cadastrar={cadastrarUsuarioAnonimo} />
    ) : (
        <div className="flex flex-1 gap-8 flex-wrap p-4">
            <MudarNome />
            <MudarSenha />
            <MudarEmail />
            <MudarTelefone />
            <Adicionar2FA/>
        </div>
    );

    return (
        <Layout titulo="Configurações" subtitulo="Faça os ajustes da sua conta">
            <div className="m-4 flex flex-wrap gap-8 basis-20">{conteudo}</div>
        </Layout>
    );
}
