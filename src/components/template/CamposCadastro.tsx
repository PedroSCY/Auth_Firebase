"use client";
import useMensagens from "@/data/hooks/useMensagens";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { useState } from "react";

interface CadastroProps {
    cadastrar?: (param: dadosCadastro) => Promise<void>;
}

export default function InformacoesCadastro(props: CadastroProps) {
    const [email, setEmail] = useState<string>("");
    const [nome, setNome] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [confirmacaoSenha, setConfirmacaoSenha] = useState<string>("");
    const { mensagemErro } = useMensagens();

    async function verificaECadastra() {
        if (nome && email && senha && senha === confirmacaoSenha) {
            await props.cadastrar?.({ nome, email, senha });
        } else if (senha !== confirmacaoSenha) {
            mensagemErro("Senhas incompatíveis");
            setSenha("");
            setConfirmacaoSenha("");
        }
    }

    return (
        <div>
            <TextInput label="Nome" required value={nome} onChange={(e) => setNome(e.currentTarget.value)} />
            <TextInput label="Email" required mt="md" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
            <PasswordInput
                label="Senha"
                required
                mt="md"
                value={senha}
                onChange={(e) => setSenha(e.currentTarget.value)}
            />
            <PasswordInput
                label="Confirme sua senha"
                required
                mt="md"
                value={confirmacaoSenha}
                onChange={(e) => setConfirmacaoSenha(e.currentTarget.value)}
            />
            <Button fullWidth mt="xl" color="blue" variant="outline" onClick={async () => await verificaECadastra()}>
                Cadastrar
            </Button>
        </div>
    );
}
