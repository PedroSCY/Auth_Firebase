"use client";
import useAutenticacao from "@/data/hooks/useAutenticacao";
import Layout from "../../components/template/LayoutInterno";
import CamposCadastro from "@/components/template/CamposCadastro";
import CampoComBotao from "@/components/template/CampoComBotao";
import CampoComSenhaBotao from "@/components/template/CampoComSenhaBotao";

export default function Configuracoes() {
    const { usuario, cadastrarUsuarioAnonimo, mudarNome, mudarSenha, mudarEmail} =
        useAutenticacao();
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

    const conteudo = usuario?.ehAnonimo ? (
        <CamposCadastro cadastrar={cadastrarUsuarioAnonimo} />
    ) : (
        <div className="flex flex-1 gap-8 flex-wrap p-4">
            <MudarNome />
            <div className="w-px h-1/2 bg-zinc-300 self-center"></div>
            <MudarSenha />
            <div className="w-px h-1/2 bg-zinc-300 self-center"></div>
            <MudarEmail />
        </div>
    );

    return (
        <Layout titulo="Configurações" subtitulo="Faça os ajustes da sua conta">
            <div className="m-4 flex flex-wrap gap-8 basis-20">{conteudo}</div>
        </Layout>
    );
}
