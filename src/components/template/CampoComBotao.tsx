"use client";
import { TextInput, Button, Text, Title } from "@mantine/core";
import { useState } from "react";

interface CampoComBotaoProps {
    acao?: (params: any) => Promise<any>;
    nomeInput: string;
    textoBotao: string;
    enunciado?: string;
}

export default function CampoComBotao(props: CampoComBotaoProps) {
    const [dado, setDado] = useState<string>("");

    async function executaELimpa() {
        await props.acao?.(dado);
        setDado("");
    }

    return (
        <div className="basis-60">
            <Title order={3}>{props.enunciado}</Title>
            <TextInput label={props.nomeInput} value={dado} onChange={(e) => setDado(e.currentTarget.value)} />
            <Button fullWidth mt="sm" color="blue" variant="outline" onClick={executaELimpa}>
                {props.textoBotao}
            </Button>
        </div>
    );
}
