"use client";
import { TextInput, Button, Title } from "@mantine/core";
import { useState } from "react";

interface CampoComSenhaBotaoProps {
    acao: (dado: string, senha: string) => Promise<any>;
    nomeInput: string;
    textoBotao: string;
    enunciado?: string;
}

export default function CampoComSenhaBotao(props: CampoComSenhaBotaoProps) {
    const [dado, setDado] = useState<string>("");
    const [senha, setSenha] = useState<string>("");

    async function executaELimpa() {
        await props.acao(dado, senha);
        setDado("");
        setSenha("");
    }

    return (
        <div className="basis-60">
            <Title order={3}>{props.enunciado}</Title>
            <TextInput label="Senha Atual" value={senha} onChange={(e) => setSenha(e.currentTarget.value)} />
            <TextInput label={props.nomeInput} value={dado} onChange={(e) => setDado(e.currentTarget.value)} />
            <Button fullWidth mt="sm" color="blue" variant="outline" onClick={executaELimpa}>
                {props.textoBotao}
            </Button>
        </div>
    );
}
